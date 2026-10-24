#!/usr/bin/env node
// Сравнение исходников двух колод Slidev: порядок и число слайдов, hide, clicks,
// число шагов по директивам и текст заметок спикера. Оформление не сравнивается.
import { parseArgs } from 'node:util'
import { loadDeck, label, stepSignature } from './lib/slidev-source.mjs'

const HELP = `Использование:
  node scripts/compare-source.mjs <origDir> <newDir>

Сравнивает исходники двух колод (slides.md с раскрытием src:), включая скрытые слайды:
  1. число и порядок слайдов
  2. hide / disabled
  3. clicks из фронтматтера
  4. сигнатура шагов: v-click, v-click.hide, v-clicks, v-after, v-mark, <v-click(s)>,
     значения v-click="n" / v-mark="n", диапазоны подсветки кода {a|b|c}
  5. текст заметок спикера (после trim, символ в символ)
Разбиение слайда на несколько (например, длинный код): у второй и следующих частей во
фронтматтере continued: true. Такая группа сравнивается с одним слайдом оригинала так:
  - у каждой части явный clicks: N, и он равен числу маркеров [click] в её заметке;
  - заметки частей, склеенные через "\n[click] ", символ в символ равны заметке оригинала
    (маркер [click] на границе частей = переход на следующий слайд, в заметке части его нет);
  - hide у всех частей как у оригинала. Сигнатура шагов для группы не сравнивается.
Не сравниваются: layout, variant, transition, level, leftWidth и прочие ключи оформления.

Флаги:
  --help    эта справка

Код выхода: 0 расхождений нет, 1 есть расхождения, 2 ошибка запуска (нет файла, плохой src).
`

function fmt(v) {
  return JSON.stringify(v)
}

function firstDiff(a, b) {
  const n = Math.min(a.length, b.length)
  let i = 0
  while (i < n && a[i] === b[i]) i++
  const ctx = (s) => JSON.stringify(s.slice(Math.max(0, i - 25), i + 40))
  return `первое различие на символе ${i}: оригинал ${ctx(a)} / копия ${ctx(b)}`
}

const countClickMarks = (note) => (note.match(/\[click\]/g) ?? []).length

// Слайд оригинала, разбитый в редизайне на несколько частей
function compareSplit(a, parts, add) {
  for (const b of parts) {
    if (a.hidden !== b.hidden) add(b, `hide: оригинал ${a.hidden}, часть ${b.hidden}`)
    const nb = b.note?.trim() ?? ''
    const cb = b.frontmatter.clicks
    if (!Number.isInteger(cb)) add(b, `часть разбитого слайда без явного clicks: N`)
    else if (cb !== countClickMarks(nb)) {
      add(b, `clicks: ${cb}, а маркеров [click] в заметке части ${countClickMarks(nb)}`)
    }
  }
  const na = a.note?.trim() ?? ''
  const joined = parts.map((b) => b.note?.trim() ?? '').join('\n[click] ')
  if (na !== joined) {
    add(parts[0], `заметки частей, склеенные через [click], не равны заметке оригинала; ${firstDiff(na, joined)}`)
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { help: { type: 'boolean', short: 'h' } },
  })
  if (values.help) return console.log(HELP)
  if (positionals.length !== 2) {
    console.error(HELP)
    process.exit(2)
  }
  const [origDir, newDir] = positionals
  let A, B
  try {
    ;[A, B] = await Promise.all([loadDeck(origDir), loadDeck(newDir)])
  } catch (e) {
    console.error(`Ошибка разбора колоды: ${e.message}`)
    process.exit(2)
  }

  const problems = []
  const add = (s, what) => problems.push(`${label(s)}: ${what}`)

  // склеиваем части разбитых слайдов (continued: true) в группы
  const groups = []
  for (const s of B) {
    if (s.frontmatter.continued === true && groups.length) groups[groups.length - 1].push(s)
    else groups.push([s])
  }
  const splitCount = groups.filter((g) => g.length > 1).length

  if (A.length !== groups.length) {
    problems.push(`ЧИСЛО СЛАЙДОВ: оригинал ${A.length}, копия ${groups.length} (с учётом continued)`)
  }
  const n = Math.min(A.length, groups.length)
  for (let i = 0; i < n; i++) {
    const a = A[i], g = groups[i]
    if (g.length > 1) {
      compareSplit(a, g, add)
      continue
    }
    const b = g[0]
    if (a.hidden !== b.hidden) add(b, `hide: оригинал ${a.hidden}, копия ${b.hidden}`)
    const ca = a.frontmatter.clicks ?? null, cb = b.frontmatter.clicks ?? null
    if (ca !== cb) add(b, `clicks: оригинал ${fmt(ca)}, копия ${fmt(cb)}`)
    const sa = stepSignature(a.content, a.frontmatter), sb = stepSignature(b.content, b.frontmatter)
    for (const k of Object.keys(sa)) {
      if (fmt(sa[k]) !== fmt(sb[k])) add(b, `шаги «${k}»: оригинал ${fmt(sa[k])}, копия ${fmt(sb[k])}`)
    }
    const na = a.note?.trim() ?? null, nb = b.note?.trim() ?? null
    if (na !== nb) {
      if (na === null || nb === null) add(b, `заметка: оригинал ${na === null ? 'нет' : 'есть'}, копия ${nb === null ? 'нет' : 'есть'}`)
      else add(b, `заметка отличается (${na.length} vs ${nb.length} симв.); ${firstDiff(na, nb)}`)
    }
  }

  const hiddenCount = A.filter((s) => s.hidden).length
  if (problems.length) {
    console.log(`РАСХОЖДЕНИЙ: ${problems.length}`)
    for (const p of problems) console.log(` - ${p}`)
    process.exit(1)
  }
  console.log(
    `OK: ${A.length} слайдов (из них скрытых ${hiddenCount}, показываемых ${A.length - hiddenCount}); ` +
      `hide, clicks, шаги и заметки совпадают` +
      (splitCount ? `; разбитых на части слайдов: ${splitCount}` : ''),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
