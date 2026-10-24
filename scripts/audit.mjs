#!/usr/bin/env node
// Браузерный аудит слайдов Slidev: выход за канвас, переполнение, кегль, внешняя сеть.
import { parseArgs } from 'node:util'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { launch, listSlides, openState, parseSlideRange } from './lib/slidev-browser.mjs'

const HELP = `Использование:
  node scripts/audit.mjs --base <url> [--level N] [--slides a-b] [--shots dir] [опции]

Для каждого показываемого слайда и каждого состояния кликов (от clicksStart до clicksTotal) проверяет:
  out-of-canvas  видимый элемент выходит за канвас Slidev (980x551 в координатах канваса)
                 больше чем на --tolerance px. Исключение: элемент или предок с data-bleed.
                 Видимость: display, visibility, суммарная opacity > 0, ненулевой размер;
                 прямоугольник обрезается предками с overflow != visible.
  overflow       у элемента с overflow hidden/auto/scroll/clip scrollHeight > clientHeight + 1
                 (или то же по ширине): содержимое не влезает в контейнер.
  font-size      видимый текстовый узел с эффективным font-size < --min-font (16px) в координатах
                 канваса (учитываются zoom, transform: scale и масштаб SVG viewBox).
  network        запрос за прогон на хост, отличный от хоста --base (data:, blob:, about: допустимы).
  js-error       необработанное исключение на странице.
Проверяются текущий слайд и глобальные слои (global-top/bottom и т. п.) внутри канваса.
Не проверяются: псевдоэлементы (::before/::after), контраст, canvas/WebGL-содержимое.

Опции:
  --base <url>        адрес запущенного dev-сервера колоды, например http://localhost:3082 (обязательно)
  --level N           только слайды с level: N во фронтматтере. Если ключа level нет ни у одного
                      слайда или фильтр ничего не выбрал: предупреждение и код выхода 2
  --slides <range>    только слайды с номерами показа: 5, 3-7, 1,4,9-12
  --shots <dir>       сохранять PNG канваса каждого состояния как <слайд>-<клик>.png
  --json <file>       записать полный отчёт в JSON (для scripts/diff-audit.mjs)
  --min-font <px>     минимальный кегль, по умолчанию 16
  --tolerance <px>    допуск выхода за канвас, по умолчанию 1
  --settle <ms>       пауза после открытия состояния (анимации, переходы), по умолчанию 700
  --viewport <WxH>    размер окна браузера, по умолчанию 980x551
  --no-global         не проверять глобальные слои, только сам слайд
  --verbose           печатать также состояния без нарушений
  --help              эта справка

Окружение: CHROME_PATH задаёт браузер (по умолчанию /usr/bin/chromium).

Код выхода: 0 нарушений нет, 1 есть нарушения или ошибка открытия слайда, 2 ошибка запуска или пустая выборка.
`

// ---------- код, выполняемый в странице ----------
function inspectInPage(arg) {
  const { no, minFont, tol, includeGlobal } = arg
  const boundary = document.getElementById('slide-content')
  const show = document.getElementById('slideshow')
  const cfg = window.__slidev__.configs
  const cr = boundary.getBoundingClientRect()
  // размеры канваса в его собственных координатах (до transform), масштаб показа - из рамки
  const CW = boundary.offsetWidth || cfg.canvasWidth || 980
  const CH = boundary.offsetHeight
  const scale = cr.width / CW
  const canvas = { width: CW, height: CH, scale: Math.round(scale * 1000) / 1000 }

  const roots = []
  const page = show.querySelector(`:scope > .slidev-page-${no}`)
  if (!page) return { error: `в DOM нет .slidev-page-${no}`, canvas }
  roots.push({ el: page, name: 'слайд' })
  if (includeGlobal) {
    for (const parent of [show, boundary]) {
      for (const ch of parent.children) {
        if (ch === show || ch.classList.contains('slidev-page')) continue
        roots.push({ el: ch, name: 'глобальный слой' })
      }
    }
  }

  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'TITLE', 'META', 'LINK', 'BR', 'WBR',
    'defs', 'clipPath', 'mask', 'linearGradient', 'radialGradient', 'pattern', 'marker', 'symbol',
    'filter', 'desc', 'metadata', 'title', 'style', 'script', 'stop', 'animate', 'animateTransform', 'set'])
  const csCache = new Map()
  const cs = (e) => {
    let v = csCache.get(e)
    if (!v) csCache.set(e, (v = getComputedStyle(e)))
    return v
  }
  const clipsOverflow = (v) => v !== 'visible'

  // Видимый прямоугольник элемента (в экранных px) или null, если не виден.
  const visCache = new Map()
  function visibleRect(el) {
    if (visCache.has(el)) return visCache.get(el)
    let res = null
    const s = cs(el)
    if (s.display !== 'none' && s.display !== 'contents' && s.visibility === 'visible') {
      const r0 = el.getBoundingClientRect()
      if (r0.width > 0 && r0.height > 0) {
        let op = 1
        let l = r0.left, t = r0.top, r = r0.right, b = r0.bottom
        for (let a = el; a && a !== boundary; a = a.parentElement) {
          const as = cs(a)
          op *= parseFloat(as.opacity)
          if (a !== el && as.display === 'none') { op = 0; break }
          if (a !== el && (clipsOverflow(as.overflowX) || clipsOverflow(as.overflowY)) && as.position !== 'fixed') {
            const ar = a.getBoundingClientRect()
            if (clipsOverflow(as.overflowX)) { l = Math.max(l, ar.left); r = Math.min(r, ar.right) }
            if (clipsOverflow(as.overflowY)) { t = Math.max(t, ar.top); b = Math.min(b, ar.bottom) }
          }
        }
        if (op > 0.01 && r > l && b > t) res = { l, t, r, b }
      }
    }
    visCache.set(el, res)
    return res
  }

  const desc = (el) => {
    const tag = el.tagName.toLowerCase()
    const cls = [...el.classList].filter((c) => !c.startsWith('slidev-vclick')).slice(0, 3).map((c) => '.' + c).join('')
    return `${tag}${el.id ? '#' + el.id : ''}${cls}`
  }
  const snippet = (el, n = 40) => {
    const t = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    return t ? `«${t.length > n ? t.slice(0, n) + '…' : t}»` : ''
  }
  const toCanvas = (v) => ({
    l: (v.l - cr.left) / scale, t: (v.t - cr.top) / scale, r: (v.r - cr.left) / scale, b: (v.b - cr.top) / scale,
  })
  const rnd = (x) => Math.round(x * 10) / 10

  // эффективный множитель масштаба элемента относительно канваса (zoom, transform: scale, SVG viewBox)
  function effectiveScale(el) {
    if (el instanceof SVGElement && typeof el.getScreenCTM === 'function') {
      // экранная матрица уже включает viewBox и все внешние transform, включая масштаб канваса
      const ctm = el.getScreenCTM()
      if (ctm) return Math.sqrt(Math.abs(ctm.a * ctm.d - ctm.b * ctm.c)) / scale
    }
    let m = 1
    for (let a = el; a && a !== show && a !== boundary; a = a.parentElement) {
      const s = cs(a)
      const z = parseFloat(s.zoom)
      if (z && z !== 1) m *= z
      if (s.transform && s.transform !== 'none') {
        const mx = new DOMMatrixReadOnly(s.transform)
        m *= Math.sqrt(Math.abs(mx.a * mx.d - mx.b * mx.c)) || 1
      }
    }
    return m
  }

  const out = []
  const REPORT = new Map() // el -> Set(kind)
  const seen = (el, kind) => {
    for (let a = el.parentElement; a; a = a.parentElement) if (REPORT.get(a)?.has(kind)) return true
    return false
  }
  const mark = (el, kind) => {
    if (!REPORT.has(el)) REPORT.set(el, new Set())
    REPORT.get(el).add(kind)
  }

  let elementsChecked = 0, textNodes = 0
  for (const { el: root, name } of roots) {
    const all = [root, ...root.querySelectorAll('*')]
    for (const el of all) {
      if (SKIP.has(el.tagName)) continue
      const vr = visibleRect(el)
      if (!vr) continue
      elementsChecked++
      const bleed = el.closest('[data-bleed]')

      // 1. выход за канвас
      if (!bleed && !seen(el, 'out-of-canvas')) {
        const c = toCanvas(vr)
        const dl = -c.l, dt = -c.t, dr = c.r - CW, db = c.b - CH
        if (Math.max(dl, dt, dr, db) > tol) {
          mark(el, 'out-of-canvas')
          const sides = []
          if (dl > tol) sides.push(`слева на ${rnd(dl)}px`)
          if (dt > tol) sides.push(`сверху на ${rnd(dt)}px`)
          if (dr > tol) sides.push(`справа на ${rnd(dr)}px`)
          if (db > tol) sides.push(`снизу на ${rnd(db)}px`)
          out.push({
            kind: 'out-of-canvas', where: name, target: `${desc(el)} ${snippet(el)}`.trim(),
            detail: `выходит ${sides.join(', ')}; рамка [${rnd(c.l)}, ${rnd(c.t)}, ${rnd(c.r)}, ${rnd(c.b)}]`,
          })
        }
      }

      // 2. переполнение контейнера
      if (el !== boundary && el.clientHeight > 0 && el.clientWidth > 0) {
        const s = cs(el)
        const clip = (v) => v === 'hidden' || v === 'auto' || v === 'scroll' || v === 'clip'
        const ovY = clip(s.overflowY) && el.scrollHeight > el.clientHeight + 1
        const ovX = clip(s.overflowX) && el.scrollWidth > el.clientWidth + 1
        if ((ovY || ovX) && !seen(el, 'overflow')) {
          mark(el, 'overflow')
          const parts = []
          if (ovY) parts.push(`высота содержимого ${el.scrollHeight}px > ${el.clientHeight}px`)
          if (ovX) parts.push(`ширина содержимого ${el.scrollWidth}px > ${el.clientWidth}px`)
          out.push({
            kind: 'overflow', where: name, target: `${desc(el)} ${snippet(el)}`.trim(),
            detail: `${parts.join(', ')} (overflow: ${s.overflowX}/${s.overflowY})`,
          })
        }
      }
    }

    // 3. кегль текстовых узлов
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const doneEl = new Set()
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const text = n.nodeValue
      if (!text || !text.trim()) continue
      const p = n.parentElement
      if (!p || SKIP.has(p.tagName) || doneEl.has(p)) continue
      if (!visibleRect(p)) {
        // inline-родитель без своего бокса: проверим по прямоугольникам самого текста
        const rg = document.createRange()
        rg.selectNodeContents(n)
        const rects = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
        const s = cs(p)
        if (!rects.length || s.visibility !== 'visible' || s.display === 'none') continue
        let op = 1
        for (let a = p; a && a !== boundary; a = a.parentElement) op *= parseFloat(cs(a).opacity)
        if (op <= 0.01) continue
      }
      textNodes++
      const fs = parseFloat(cs(p).fontSize) * effectiveScale(p)
      if (fs < minFont - 0.01) {
        doneEl.add(p)
        out.push({
          kind: 'font-size', where: name, target: `${desc(p)} ${snippet(p)}`.trim(),
          detail: `${rnd(fs)}px < ${minFont}px`,
        })
      }
    }
  }
  return { canvas, out, elementsChecked, textNodes }
}

// ---------- запуск ----------
function parseViewport(s) {
  const m = String(s).match(/^(\d+)x(\d+)$/)
  if (!m) throw new Error(`--viewport ожидает WxH, получено "${s}"`)
  return { width: +m[1], height: +m[2] }
}

function usageError(msg) {
  console.error(`Ошибка: ${msg}\n\nСправка: node scripts/audit.mjs --help`)
  process.exit(2)
}

async function main() {
  let values
  try {
    ;({ values } = parseArgs({
      options: {
        base: { type: 'string' }, level: { type: 'string' }, slides: { type: 'string' }, shots: { type: 'string' },
        json: { type: 'string' }, 'min-font': { type: 'string' }, tolerance: { type: 'string' },
        settle: { type: 'string' }, viewport: { type: 'string' }, 'no-global': { type: 'boolean' },
        verbose: { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
      },
    }))
  } catch (e) {
    usageError(e.message)
  }
  if (values.help) return console.log(HELP)
  if (!values.base) usageError('нужен --base <url>')
  let base
  try { base = new URL(values.base) } catch { usageError(`--base не URL: ${values.base}`) }
  const num = (name, def) => {
    if (values[name] === undefined) return def
    const v = Number(values[name])
    if (!Number.isFinite(v) || v < 0) usageError(`--${name} ожидает неотрицательное число`)
    return v
  }
  const minFont = num('min-font', 16), tol = num('tolerance', 1), settle = num('settle', 700)
  let range = null
  try { if (values.slides) range = parseSlideRange(values.slides) } catch (e) { usageError(e.message) }
  let viewport
  try { viewport = parseViewport(values.viewport ?? '980x551') } catch (e) { usageError(e.message) }
  const level = values.level === undefined ? null : Number(values.level)
  if (level !== null && !Number.isInteger(level)) usageError('--level ожидает целое число')

  const { browser, page } = await launch({ viewport })
  const violations = []
  const states = []
  let ctx = { slide: 0, click: 0, title: '' }
  const push = (v) => violations.push({ slide: ctx.slide, click: ctx.click, title: ctx.title, ...v })
  // внешние запросы: один раз на URL, с указанием, где замечены впервые
  const netSeen = new Set()
  const addNet = (url, detail) => {
    if (netSeen.has(url)) return
    netSeen.add(url)
    push({ kind: 'network', where: 'сеть', target: url.slice(0, 200), detail: `${detail}; впервые на слайде ${ctx.slide || '(список)'}, клик ${ctx.click}` })
  }

  page.on('request', (req) => {
    const u = req.url()
    if (/^(data|blob|about):/.test(u)) return
    let host
    try { host = new URL(u).host } catch { return }
    if (host !== base.host) addNet(u, `хост ${host} ≠ ${base.host}`)
  })
  page.on('websocket', (ws) => {
    try {
      const host = new URL(ws.url()).host
      if (host !== base.host) addNet(ws.url(), `websocket на ${host}`)
    } catch { /* ignore */ }
  })
  page.on('pageerror', (e) => push({ kind: 'js-error', where: 'страница', target: String(e.message).slice(0, 200), detail: '' }))

  let exitCode = 0
  try {
    const all = await listSlides(page, base.href)
    const hasLevel = all.some((s) => s.level !== null && s.level !== undefined)
    let selected = all
    if (range) selected = selected.filter((s) => range.has(s.no))
    if (level !== null) {
      if (!hasLevel) {
        console.error(`ПРЕДУПРЕЖДЕНИЕ: ни у одного слайда нет ключа level во фронтматтере; фильтр --level ${level} ничего не выберет`)
      }
      selected = selected.filter((s) => s.level === level)
    }
    if (!selected.length) {
      console.error(
        `Нечего проверять: выбрано 0 слайдов из ${all.length} (` +
          [range && `--slides ${values.slides}`, level !== null && `--level ${level}`].filter(Boolean).join(', ') + ')',
      )
      process.exitCode = 2
      return
    }
    if (values.shots) await mkdir(values.shots, { recursive: true })

    console.error(`Аудит ${base.origin}: слайдов ${selected.length} из ${all.length} показываемых`)
    let canvasInfo = null
    for (const s of selected) {
      ctx = { slide: s.no, click: 0, title: s.title ?? '' }
      let first
      try {
        first = await openState(page, base.href, s.no, 0, settle)
      } catch (e) {
        ctx.click = 0
        push({ kind: 'error', where: 'открытие', target: `слайд ${s.no}`, detail: String(e.message).split('\n')[0] })
        continue
      }
      const start = first.clicks
      const total = first.total
      for (let k = start; k <= total; k++) {
        ctx.click = k
        const before = violations.length
        try {
          if (k !== start) await openState(page, base.href, s.no, k, settle)
          const st = await page.evaluate(() => ({ clicks: window.__slidev__.nav.clicks, page: window.__slidev__.nav.currentPage }))
          if (st.clicks !== k || st.page !== s.no) {
            push({ kind: 'error', where: 'навигация', target: `слайд ${s.no}`, detail: `ожидали клик ${k}, получили слайд ${st.page} клик ${st.clicks}` })
            continue
          }
          const r = await page.evaluate(inspectInPage, { no: s.no, minFont, tol, includeGlobal: !values['no-global'] })
          if (r.error) {
            push({ kind: 'error', where: 'DOM', target: `слайд ${s.no}`, detail: r.error })
            continue
          }
          canvasInfo = r.canvas
          for (const v of r.out) push(v)
          states.push({ slide: s.no, click: k, total, elements: r.elementsChecked, textNodes: r.textNodes })
          if (values.shots) {
            await page.locator('#slide-content').screenshot({ path: path.join(values.shots, `${s.no}-${k}.png`) })
          }
        } catch (e) {
          push({ kind: 'error', where: 'аудит', target: `слайд ${s.no} клик ${k}`, detail: String(e.message).split('\n')[0] })
        }
        const mine = violations.slice(before).filter((v) => v.kind !== 'network')
        if (mine.length || values.verbose) {
          console.log(`\n[слайд ${s.no} «${s.title ?? '(без заголовка)'}», клик ${k}/${total}] ${mine.length ? mine.length + ' наруш.' : 'ок'}`)
          for (const v of mine) console.log(`  ${v.kind.toUpperCase().padEnd(13)} ${v.target}${v.detail ? '\n  ' + ' '.repeat(13) + v.detail : ''}`)
        }
      }
    }

    const nets = violations.filter((v) => v.kind === 'network')
    if (nets.length) {
      console.log('\n[сеть] запросы не на хост базы')
      for (const v of nets) console.log(`  NETWORK       ${v.target}\n               ${v.detail}`)
    }
    const byKind = {}
    for (const v of violations) byKind[v.kind] = (byKind[v.kind] ?? 0) + 1
    const slidesWithIssues = new Set(violations.filter((v) => v.kind !== 'network').map((v) => v.slide)).size
    console.log(
      `\n=== ИТОГ ===\nСлайдов проверено: ${selected.length}; состояний кликов: ${states.length}` +
        (canvasInfo ? `; канвас ${canvasInfo.width}x${canvasInfo.height}, масштаб ${canvasInfo.scale}` : '') +
        `\nНарушений: ${violations.length}` +
        (violations.length ? ` в ${slidesWithIssues} слайдах (${Object.entries(byKind).map(([k, n]) => `${k}: ${n}`).join(', ')})` : ''),
    )
    if (violations.length) exitCode = 1

    if (values.json) {
      await writeFile(
        values.json,
        JSON.stringify({ base: base.origin, viewport, minFont, tolerance: tol, canvas: canvasInfo, slides: selected.length, states, violations }, null, 2) + '\n',
      )
    }
  } finally {
    await browser.close()
  }
  if (exitCode) process.exitCode = exitCode
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
