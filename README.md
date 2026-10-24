# holyjs-2026-autumn

Доклад «ML своими руками на JS» для HolyJS 2026 Autumn в неоновом пиксель-арте:
колода как игра с уровнями, HUD, аркадными сплэшами и своими компонентами. Язык слайдов и заметок русский,
тема тёмная (`colorSchema: dark`).

Автор: Троицкий Роман. Сайт: https://dreamshaded.github.io/holyjs-2026-autumn/ — деплой на GitHub Pages
через Actions на каждый push в `main` (`.github/workflows/deploy.yml`, сборка с `--base /holyjs-2026-autumn/
--router-mode hash`).

## Запуск

Из корня монорепозитория:

```bash
pnpm dev holyjs-2026-autumn
```

Или внутри папки доклада (скрипт идёт через общий лаунчер `../scripts/slidev-dev.mjs`):

```bash
cd holyjs-2026-autumn
pnpm install
pnpm dev        # http://localhost:3030
pnpm build      # прод-сборка в dist/
pnpm export     # PDF/PNG
```

Доклад работает офлайн: шрифты, иконки и картинки лежат в репозитории (шрифты ставятся из npm-пакетов
`@fontsource*`), внешних запросов при показе нет, включая favicon.

## Проверки

Инструменты лежат в `scripts/`, браузером служит системный chromium (`/usr/bin/chromium`, другой путь
задаётся переменной `CHROME_PATH`). Dev-сервер должен быть запущен.

`compare-source` и `compare-text` писались, чтобы сверять редизайн с прежней версией доклада на теме Сбера.
Прежней версии больше нет (она в истории git этого репозитория), поэтому сравнивать можно с любой другой
копией колоды, например с чекаутом старого коммита.

| Что проверяет | Команда | Код выхода 0 означает |
| --- | --- | --- |
| Исходники против оригинала: число и порядок слайдов, `hide`, `clicks`, шаги `v-click`/`v-clicks`/`v-mark`, заметки спикера символ в символ | `node scripts/compare-source.mjs <другая-копия> .` | всё совпадает |
| Видимый текст слайдов в финальном состоянии кликов | `node scripts/compare-text.mjs --orig http://localhost:3131 --new http://localhost:3030` | ни одна фраза оригинала не пропала |
| Канвас 980x551, шрифт не меньше 16px, внешние запросы, ошибки JS, по каждому слайду и каждому клику | `pnpm run audit -- --base http://localhost:3030` | нарушений нет |

Нюансы:

- Вторая колода для `compare-text` поднимается отдельно: `pnpm exec slidev --port 3131 --open false` в её папке.
- `pnpm audit` без `run` вызывает встроенную команду pnpm, поэтому запускать надо `pnpm run audit -- ...` или `node scripts/audit.mjs ...`.
- Полный `audit` идёт около 5 минут на колоду. Для одного акта: `--slides 10-15` или `--level 3`. Скриншоты состояний: `--shots <dir>`.
- `node scripts/diff-audit.mjs a.json b.json` сравнивает два JSON-отчёта `audit --json`.
- Аудит читает `window.__slidev__`, которое Slidev создаёт только в dev-режиме. Чтобы прогнать его по собранному `dist/`
  (проверка, что в сборке нет внешних запросов), нужен локальный статический сервер (`pnpm exec vite preview --port 3150`)
  и шим, который достаёт тот же объект из `#app.__vue_app__._context.provides['$$slidev-context']` и кладёт его в
  `window.__slidev__` через `context.addInitScript`. Сам `scripts/` для этого не менялся.

## Устройство

```
holyjs-2026-autumn/
├── slides.md            — headmatter колоды, титул и подключение актов
├── pages/               — акты 1–8, один файл на акт
├── layouts/             — layout'ы колоды
├── components/          — пиксельные компоненты (панели, HUD, графики, сцены)
├── styles/index.css     — токены дизайн-системы, шрифты, глобальные стили
├── global-top.vue, global-bottom.vue — HUD и оверлеи на всех слайдах
├── scripts/             — audit, compare-source, compare-text, diff-audit
├── Speech.md, speaker-notes.md, glossary.* — речь, заметки, глоссарий
```

Спека, план и контрольные скриншоты редизайна лежат в монорепозитории speech-and-reports:
`specs/001-holyjs-pixel-redesign.md`, `plans/001-holyjs-pixel-redesign/`.

## Шрифты и лицензии

Все шрифты подключены локально из npm-пакетов `@fontsource*` и распространяются по SIL Open Font License 1.1 (OFL):

- Handjet Variable (`@fontsource-variable/handjet`): заголовки, HUD, подписи, сплэши.
- Press Start 2P (`@fontsource/press-start-2p`): короткие латинские строки (титул, `LEVEL N`, `SCORE`).
- JetBrains Mono (`@fontsource/jetbrains-mono`): основной текст и код.

Иконки: `@iconify-json/tabler`, `@iconify-json/logos`, `@iconify-json/simple-icons`. Пиксельная графика
нарисована для этого доклада. Код референса Sdju/speech не использовался.

## Правила, которые держит эта колода

- Минимальный шрифт `1rem` (16px) в любой разметке, пиксельный шрифт только для заголовков, HUD и лейблов.
- Контент помещается в канвас 980x551 на каждом клике.
- Заметки спикера на каждом слайде.
