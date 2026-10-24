#!/usr/bin/env node
// Сравнение видимого текста слайдов: каждая фраза оригинала должна встречаться в редизайне.
import { parseArgs } from 'node:util'
import { launch, listSlides, openState, parseSlideRange } from './lib/slidev-browser.mjs'

const HELP = `Использование:
  node scripts/compare-text.mjs --orig <url> --new <url> [--slides a-b] [--all-clicks] [--dump]

Для каждого показываемого слайда открывает финальное состояние кликов в обеих колодах,
собирает видимый текст слоя слайда (без HUD и глобальных слоёв), режет оригинал на фразы по
блочным элементам и проверяет, что каждая фраза оригинала входит в текст редизайна.

Правила сравнения:
  - текст берётся из textContent видимых узлов (display != none, visibility visible), поэтому
    CSS text-transform (капс в заголовках) не считается изменением текста;
  - пробелы и переносы при сравнении отбрасываются целиком, регистр СОХРАНЯЕТСЯ;
  - последний блок оригинала, равный номеру слайда (номер страницы из layout), игнорируется;
  - порядок фраз и их дублирование не проверяются; лишний текст в редизайне допустим (HUD и т. п.);
  - содержимое svg <title>/<desc>, script, style и template не учитывается;
  - текст из псевдоэлементов и атрибутов (alt, aria-label) не сравнивается.

Опции:
  --orig <url>     адрес dev-сервера оригинала (обязательно)
  --new <url>      адрес dev-сервера редизайна (обязательно)
  --slides <r>     только слайды с номерами показа оригинала: 5, 3-7, 1,4,9-12
  Слайд редизайна с continued: true считается продолжением предыдущего: текст частей
  объединяется и сравнивается с одним слайдом оригинала.
  --all-clicks     собирать текст как объединение по всем состояниям кликов, а не только финальное
  --settle <ms>    пауза после открытия состояния, по умолчанию 700
  --dump           печатать собранные фразы каждого слайда (для отладки)
  --help           эта справка

Окружение: CHROME_PATH задаёт браузер (по умолчанию /usr/bin/chromium).

Код выхода: 0 все фразы на месте, 1 есть пропавший текст или слайд не открылся, 2 ошибка запуска.
`

// ---------- код, выполняемый в странице ----------
function extractInPage({ no }) {
  const page = document.querySelector(`#slideshow > .slidev-page-${no}`)
  if (!page) return { error: `в DOM нет .slidev-page-${no}` }
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'script', 'style', 'title', 'desc', 'metadata', 'defs'])
  const blocks = []
  let cur = ''
  const flush = () => {
    const t = cur.replace(/\s+/g, ' ').trim()
    if (t) blocks.push(t)
    cur = ''
  }
  const walk = (n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      cur += n.nodeValue
      return
    }
    if (n.nodeType !== Node.ELEMENT_NODE || SKIP.has(n.tagName)) return
    const cs = getComputedStyle(n)
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') return
    if (n.tagName === 'BR') return flush()
    const inline = cs.display.startsWith('inline') && !(n instanceof SVGGraphicsElement && n.tagName === 'text')
    const isSvgBlock = n instanceof SVGElement && (n.tagName === 'text' || n.tagName === 'svg')
    const brk = !inline || isSvgBlock
    if (brk) flush()
    for (const c of n.childNodes) walk(c)
    if (brk) flush()
  }
  walk(page)
  flush()
  return { blocks }
}

const strip = (s) => s.replace(/\s+/g, '')

async function collect(page, base, no, allClicks, settle) {
  const first = await openState(page, base, no, allClicks ? 0 : 'last', settle)
  const states = allClicks ? Array.from({ length: first.total + 1 }, (_, i) => i) : [first.clicks]
  const seen = new Set()
  const blocks = []
  for (const k of states) {
    if (allClicks && k !== 0) await openState(page, base, no, k, settle)
    const r = await page.evaluate(extractInPage, { no })
    if (r.error) throw new Error(r.error)
    for (const b of r.blocks) if (!seen.has(b)) { seen.add(b); blocks.push(b) }
  }
  return blocks
}

function usageError(msg) {
  console.error(`Ошибка: ${msg}\n\nСправка: node scripts/compare-text.mjs --help`)
  process.exit(2)
}

async function main() {
  let values
  try {
    ;({ values } = parseArgs({
      options: {
        orig: { type: 'string' }, new: { type: 'string' }, slides: { type: 'string' }, settle: { type: 'string' },
        'all-clicks': { type: 'boolean' }, dump: { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
      },
    }))
  } catch (e) {
    usageError(e.message)
  }
  if (values.help) return console.log(HELP)
  if (!values.orig || !values.new) usageError('нужны --orig <url> и --new <url>')
  let origBase, newBase
  try {
    origBase = new URL(values.orig).href
    newBase = new URL(values.new).href
  } catch { usageError('--orig/--new должны быть URL') }
  let range = null
  try { if (values.slides) range = parseSlideRange(values.slides) } catch (e) { usageError(e.message) }
  const settle = values.settle === undefined ? 700 : Number(values.settle)
  if (!Number.isFinite(settle) || settle < 0) usageError('--settle ожидает неотрицательное число')

  const A = await launch()
  const B = await launch()
  let exitCode = 0
  try {
    const [sa, sbRaw] = await Promise.all([listSlides(A.page, origBase), listSlides(B.page, newBase)])
    // части разбитого слайда (continued: true) сравниваются с одним слайдом оригинала вместе
    const groups = []
    for (const s of sbRaw) {
      if (s.frontmatter?.continued === true && groups.length) groups[groups.length - 1].push(s)
      else groups.push([s])
    }
    const sb = groups.map((g) => g[0])
    if (sa.length !== sb.length) {
      console.log(`ЧИСЛО ПОКАЗЫВАЕМЫХ СЛАЙДОВ: оригинал ${sa.length}, редизайн ${sb.length} (с учётом continued)`)
      exitCode = 1
    }
    const n = Math.min(sa.length, sb.length)
    let checked = 0, phrases = 0, missingTotal = 0
    for (let i = 0; i < n; i++) {
      const no = sa[i].no
      if (range && !range.has(no)) continue
      const title = sa[i].title ?? '(без заголовка)'
      let ba, bb
      try {
        ba = await collect(A.page, origBase, no, values['all-clicks'], settle)
        bb = []
        for (const part of groups[i]) bb.push(...(await collect(B.page, newBase, part.no, values['all-clicks'], settle)))
      } catch (e) {
        console.log(`\n[слайд ${no} «${title}»] не удалось собрать текст: ${String(e.message).split('\n')[0]}`)
        exitCode = 1
        continue
      }
      checked++
      const hay = strip(bb.join(''))
      // номер страницы, который рисует layout оригинала, - не текст слайда
      if (ba.length && ba[ba.length - 1] === String(no)) ba.pop()
      const missing = ba.filter((p) => !hay.includes(strip(p)))
      phrases += ba.length
      missingTotal += missing.length
      if (values.dump) {
        console.log(`\n[слайд ${no} «${title}»] фраз в оригинале ${ba.length}, в редизайне ${bb.length}`)
        ba.forEach((p) => console.log(`  orig | ${p}`))
        bb.forEach((p) => console.log(`  new  | ${p}`))
      }
      if (missing.length) {
        exitCode = 1
        console.log(`\n[слайд ${no} «${title}»] пропало фраз: ${missing.length} из ${ba.length}`)
        for (const p of missing) console.log(`  ПРОПАЛО: ${p.length > 160 ? p.slice(0, 160) + '…' : p}`)
        if (sb[i].title !== sa[i].title) console.log(`  (заголовок в редизайне: «${sb[i].title ?? '(без заголовка)'}»)`)
      }
    }
    console.log(
      `\n=== ИТОГ ===\nСлайдов сравнено: ${checked}; фраз оригинала: ${phrases}; пропало: ${missingTotal}` +
        (values['all-clicks'] ? ' (объединение по всем кликам)' : ' (финальное состояние кликов)'),
    )
  } finally {
    await Promise.all([A.browser.close(), B.browser.close()])
  }
  if (exitCode) process.exitCode = exitCode
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
