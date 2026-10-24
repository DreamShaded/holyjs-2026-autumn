#!/usr/bin/env node
// Сравнение двух JSON-отчётов audit.mjs (--json): что появилось и что исчезло.
import { readFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'

const HELP = `Использование:
  node scripts/diff-audit.mjs <baseline.json> <current.json>

Сравнивает списки нарушений двух отчётов audit.mjs --json по подписи
(вид | слайд | клик | элемент и фрагмент текста; числовые детали в подпись не входят,
сетевые нарушения сравниваются по URL). Печатает нарушения, которые есть только в одном из отчётов.

Код выхода: 0 списки совпадают, 1 различаются, 2 ошибка запуска.
`

const sig = (v) => (v.kind === 'network' ? `network|${v.target}` : `${v.kind}|${v.slide}|${v.click}|${v.target}`)

async function main() {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { help: { type: 'boolean', short: 'h' } } })
  if (values.help) return console.log(HELP)
  if (positionals.length !== 2) {
    console.error(HELP)
    process.exit(2)
  }
  const [a, b] = await Promise.all(positionals.map(async (p) => JSON.parse(await readFile(p, 'utf8'))))
  const sa = new Map(a.violations.map((v) => [sig(v), v]))
  const sb = new Map(b.violations.map((v) => [sig(v), v]))
  const onlyA = [...sa.keys()].filter((k) => !sb.has(k))
  const onlyB = [...sb.keys()].filter((k) => !sa.has(k))
  console.log(`baseline: ${sa.size}, current: ${sb.size}, общих: ${sa.size - onlyA.length}`)
  for (const k of onlyA) console.log(`  ИСПРАВЛЕНО (только в baseline): ${k}`)
  for (const k of onlyB) console.log(`  НОВОЕ (только в current): ${k}`)
  if (onlyA.length || onlyB.length) process.exitCode = 1
  else console.log('списки нарушений совпадают')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(2)
})
