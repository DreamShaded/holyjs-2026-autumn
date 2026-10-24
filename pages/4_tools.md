---
layout: interjection
level: 4
variant: 3
transition: slide-up
---

<TextBig>
  Инструменты
</TextBig>

<!--
Всё это — на JavaScript. Ни строчки Python. Давайте посмотрим, из чего собран проект.
-->

---
layout: simple-slide
level: 4
variant: 12
---

## Кто что делает

<div class="equip" :class="`gear-${$clicks}`">
  <div class="slot s-tsx" v-click="1" data-slot="BELT">
    <div class="ico"><logos-typescript-icon /> <logos-esbuild /> <logos-vitest /></div>
    <b>tsx/esbuild, vitest</b>
  </div>
  <div class="slot s-vue" v-click="1" data-slot="PACK">
    <div class="ico"><logos-vue /> <logos-vuetifyjs /> <logos-storybook-icon /></div>
    <b>Vue 3 и Storybook</b>; Vuetify — чужие компоненты для проверки
  </div>
  <div class="slot s-pw" v-click="2" data-slot="HANDS">
    <div class="ico"><logos-playwright /> <logos-chrome /></div>
    <b>Playwright + Chromium</b>: руки и глаза
  </div>
  <div class="slot s-pm r" v-click="3" data-slot="LENS">
    <div class="ico"><tabler-zoom-scan /></div>
    <b>pixelmatch + pngjs</b>: игра «найди отличия», кладёт две фотографии одна на другую и обводит, где не совпало
  </div>
  <div class="slot s-tf r legend" v-click="4" data-slot="BRAIN">
    <div class="ico"><logos-tensorflow /></div>
    <b>TensorFlow.js</b>, мозг: сама сеть, её обучение и применение
  </div>
  <div class="slot s-zod r" v-click="5" data-slot="SHIELD">
    <div class="ico"><logos-zod /></div>
    <b>zod</b> проверяет документы на входе и выходе: файл модели, находки, список примеров
  </div>
  <div class="stage" aria-hidden="true">
    <div class="aura"></div>
    <A4Hero :gear="$clicks" :px="7" />
    <div class="pedestal"></div>
    <div class="meter">
      <i v-for="n in 6" :key="n" :class="{ lit: n <= [0, 2, 3, 4, 5, 6][Math.min($clicks, 5)] }" />
    </div>
  </div>
</div>

<style scoped>
/* Экран экипировки RPG: в центре герой-разработчик, по бокам слоты снаряжения.
   Каждый инструмент — предмет в своём слоте (пояс, рюкзак, перчатки, лупа, корона-«мозг», щит),
   на своём шаге он появляется в слоте и тут же надевается на героя. Текст и шаги прежние. */
.equip {
  --hero-w: 200px;
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr var(--hero-w) 1fr;
  grid-template-rows: auto auto auto;
  column-gap: 1.25rem;
  row-gap: 0.75rem;
  align-items: stretch;
  margin-top: -0.2rem;
}
/* раскладка: левая колонка — рюкзак, перчатки, пояс; правая — мозг, лупа, щит */
.s-vue { grid-column: 1; grid-row: 1; }
.s-pw { grid-column: 1; grid-row: 2; }
.s-tsx { grid-column: 1; grid-row: 3; }
.s-tf { grid-column: 3; grid-row: 1; }
.s-pm { grid-column: 3; grid-row: 2; }
.s-zod { grid-column: 3; grid-row: 3; }

/* ---------- слот предмета ---------- */
.slot {
  position: relative;
  padding: 0.5rem 0.75rem 0.55rem;
  font-size: 1rem;
  line-height: 1.3;
  color: var(--pa-text-dim);
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 #3a3160,
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
}
.slot b {
  color: var(--lvl-accent);
  font-weight: 700;
}
/* ярлык слота (декоративный, только латиница) */
.slot::after {
  content: attr(data-slot);
  position: absolute;
  top: 0.55rem;
  right: 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #4b4080;
}
.slot.r::after { right: 0.6rem; }
/* провод от слота к герою */
.slot::before {
  content: "";
  position: absolute;
  top: 1.35rem;
  width: 1.25rem;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--lvl-accent) 0 6px, transparent 6px 9px);
  left: calc(100% + 3px);
}
.slot.r::before { left: auto; right: calc(100% + 3px); }

/* ячейки инвентаря с иконками */
.slot .ico {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
  font-size: 1.5rem;
  line-height: 1;
}
.slot .ico > * {
  box-sizing: content-box;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.3rem;
  background: #0a0618;
  box-shadow:
    inset 0 0 0 2px #241c42,
    inset 3px 3px 0 0 #07040f;
}
.slot .ico > :deep(svg),
.slot .ico > svg {
  display: block;
}
/* легендарный предмет: TensorFlow.js — «мозг» */
.slot.legend {
  background: linear-gradient(180deg, rgba(255, 159, 62, 0.16), rgba(16, 10, 34, 0.92) 70%);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent),
    0 0 1.2rem -0.2rem color-mix(in srgb, var(--lvl-accent) 70%, transparent);
}
.slot.legend::after { color: var(--lvl-accent); }
.slot.legend .ico > * {
  box-shadow:
    inset 0 0 0 2px var(--lvl-accent),
    inset 3px 3px 0 0 #07040f;
}
/* предмет «падает» в слот */
.slot:not(.slidev-vclick-hidden) {
  animation: slot-drop 0.4s steps(4, end);
}
@keyframes slot-drop {
  0% { opacity: 0; transform: translateY(-12px); }
  60% { opacity: 1; transform: translateY(2px); }
  100% { opacity: 1; transform: none; }
}

/* ---------- центр: герой на постаменте ---------- */
.stage {
  grid-column: 2;
  grid-row: 1 / span 3;
  align-self: stretch;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.aura {
  position: absolute;
  inset: 8% 0 18%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--lvl-accent) 22%, transparent), transparent);
  opacity: 0.25;
  transition: opacity 0.4s steps(4);
}
.gear-4 .aura,
.gear-5 .aura { opacity: 1; }
.stage :deep(.a4-hero) {
  position: relative;
  z-index: 1;
}
.pedestal {
  width: 184px;
  height: 18px;
  margin-top: -3px;
  background:
    repeating-linear-gradient(90deg, #3a3160 0 12px, #2c2450 12px 24px) 0 0 / 100% 6px no-repeat,
    #1a1336;
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 #07040f;
}
/* счётчик экипировки: 6 клеток, по одной на инструмент */
.meter {
  display: flex;
  gap: 4px;
  margin-top: 0.9rem;
}
.meter i {
  width: 18px;
  height: 18px;
  background: #1a1336;
  box-shadow: inset 0 0 0 3px #3a3160;
}
.meter i.lit {
  background: var(--lvl-accent);
  box-shadow: inset 0 0 0 3px #07040f, 0 0 8px color-mix(in srgb, var(--lvl-accent) 70%, transparent);
}
.gear-4 .meter i.lit:nth-child(5),
.gear-5 .meter i.lit:nth-child(5) {
  background: var(--pa-yellow);
}

@media (prefers-reduced-motion: reduce) {
  .slot:not(.slidev-vclick-hidden) { animation: none; }
}
</style>

<!--
Состав команды.
[click] Обвязка привычная: TypeScript запускаем через tsx на esbuild, тесты на vitest. Наша витрина компонентов — Vue 3 и Storybook. А Vuetify мы не используем в своих компонентах: это чужая дизайн-система, на ней проверяем, как сеть справится с незнакомой вёрсткой.
[click] Playwright с Chromium — руки и глаза проекта: открывает страницы, делает скриншоты, а ещё, как увидим дальше, даёт доступ к видеокарте.
[click] pixelmatch и pngjs играют в «найди отличия»: кладут две фотографии одну на другую и обводят, где не совпало. Это та самая красная маска.
[click] TensorFlow.js — мозг. Сама сеть, её обучение и применение. Да, нейросети можно учить прямо в JavaScript.
[click] А zod — строгий вахтёр. Он проверяет все документы на входе и выходе: файл модели, находки, список примеров. Если файл модели битый, мы узнаем об этом сразу, а не через полчаса странных ошибок.
-->

---
layout: simple-slide
level: 4
variant: 12
---

## Инфраструктура


<div class="race" :class="`lap-${$clicks}`">
  <div class="lane no l-node" v-click="1">
    <span class="badge">медленно</span>
    <div class="track">
      <div class="car"><A4Kart color="#5fa04e" fx="smoke" :px="5"><div class="big-ico"><logos-nodejs-icon /></div></A4Kart></div>
    </div>
    <div class="title">JS в Node</div>
    <div class="num bad">116 с</div>
  </div>
  <div class="lane no l-wasm" v-click="2">
    <span class="badge">не учится</span>
    <div class="track">
      <div class="wall" aria-hidden="true"></div>
      <div class="car"><A4Kart color="#654ff0" :px="5"><div class="big-ico"><logos-webassembly /></div></A4Kart></div>
    </div>
    <div class="title">WebAssembly</div>
    <div class="num bad">только ответы</div>
  </div>
  <div class="lane ok l-gpu" v-click="3">
    <span class="badge">выбрал</span>
    <div class="track">
      <div class="car"><A4Kart color="#ff9f3e" fx="flame" :px="5"><div class="big-ico"><logos-chrome /></div></A4Kart></div>
      <div class="confetti" aria-hidden="true"><i v-for="n in 10" :key="n" :style="{ '--i': n }"></i></div>
    </div>
    <div class="title">Headless Chromium</div>
    <div class="num accent">&lt; 4 с</div>
  </div>
</div>

<style scoped>
/* Гонка движков: три дорожки, на каждой карт с логотипом-пилотом, справа табло со временем.
   Node ползёт и чадит, WebAssembly разгоняется и упирается в стену (обучения нет),
   Chromium на видеокарте пролетает трассу и финиширует под клетчатым флагом. */
.race {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: -0.1rem;
}
.lane {
  --tone: var(--pa-red);
  position: relative;
  display: grid;
  grid-template-columns: 15.5rem 1fr 9.5rem;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "badge track num"
    "title track num";
  column-gap: 0.9rem;
  min-height: 7.4rem;
  padding: 0.5rem 0.6rem 0.5rem 0.9rem;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 #3a3160,
    0 3px 0 0 #3a3160,
    -3px 0 0 0 var(--tone),
    3px 0 0 0 #3a3160;
}
.lane.ok {
  --tone: var(--pa-lime);
  background: linear-gradient(90deg, rgba(157, 255, 62, 0.12), rgba(16, 10, 34, 0.92) 45%);
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 1.4rem -0.2rem rgba(157, 255, 62, 0.5);
}
.lane:not(.slidev-vclick-hidden) {
  animation: lane-in 0.35s steps(4, end);
}
@keyframes lane-in {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: none; }
}

/* ---------- подписи дорожки ---------- */
.badge {
  grid-area: badge;
  justify-self: start;
  font-family: var(--pa-font-pixel);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.1;
  padding: 0.05rem 0.5rem;
  color: #07040f;
  background: var(--tone);
}
.title {
  grid-area: title;
  margin-top: 0.3rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--pa-text);
}

/* ---------- трасса ---------- */
.track {
  grid-area: track;
  position: relative;
  align-self: stretch;
  margin: 0.15rem 0;
  overflow: hidden;
  background:
    /* старт: белые блоки */
    repeating-linear-gradient(180deg, #f2ecff 0 6px, transparent 6px 12px) 10px 6px / 6px calc(100% - 12px) no-repeat,
    /* финиш: клетка 2×N */
    repeating-conic-gradient(#f2ecff 0 25%, #07040f 0 50%) right 0 top 6px / 12px 12px,
    /* разметка по центру */
    repeating-linear-gradient(90deg, #4b4080 0 14px, transparent 14px 26px) 0 50% / 100% 3px no-repeat,
    #0c0820;
  background-repeat: no-repeat, repeat-y, no-repeat, no-repeat;
  background-size: 6px calc(100% - 12px), 12px 12px, 100% 3px, auto;
  box-shadow:
    inset 0 6px 0 0 #241c42,
    inset 0 -6px 0 0 #241c42;
}
/* бортики трассы: красно-белый «поребрик» */
.track::before,
.track::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: repeating-linear-gradient(90deg, var(--tone) 0 12px, #f2ecff 12px 24px);
  opacity: 0.55;
}
.track::before { top: 0; }
.track::after { bottom: 0; }

.car {
  position: absolute;
  left: 20px;
  bottom: 10px;
  z-index: 2;
}
.big-ico {
  font-size: 2.125rem;
  line-height: 1;
}
.big-ico > :deep(svg),
.big-ico > svg {
  display: block;
}

/* Node: ползёт по пикселю, до финиша не доедет */
.l-node:not(.slidev-vclick-hidden) .car {
  animation: crawl 14s steps(28, end) forwards;
}
@keyframes crawl {
  from { left: 20px; }
  to { left: 34%; }
}
/* WebAssembly: рывок до стены и тряска на месте */
.wall {
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 64%;
  width: 18px;
  z-index: 1;
  background: repeating-linear-gradient(180deg, var(--pa-red) 0 9px, var(--pa-yellow) 9px 18px);
  box-shadow: 0 0 0 3px #07040f, 0 0 12px rgba(255, 77, 109, 0.6);
}
.l-wasm .car {
  left: calc(64% - 104px);
}
.l-wasm:not(.slidev-vclick-hidden) .car {
  animation:
    dash-wall 0.5s steps(5, end),
    bump 0.24s steps(2, end) 0.5s 4;
}
@keyframes dash-wall {
  from { left: 20px; }
  to { left: calc(64% - 104px); }
}
@keyframes bump {
  50% { transform: translateX(-4px); }
}
/* Chromium: пролетает трассу за доли секунды и встаёт на финише */
.l-gpu .car {
  left: calc(100% - 118px);
}
.l-gpu:not(.slidev-vclick-hidden) .car {
  animation: zoom 0.55s steps(6, end);
}
@keyframes zoom {
  from { left: 20px; }
  to { left: calc(100% - 118px); }
}
/* салют на финише */
.confetti {
  position: absolute;
  right: 40px;
  top: 50%;
  z-index: 3;
}
.confetti i {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--pa-lime);
  opacity: 0;
}
.confetti i:nth-child(3n) { background: var(--pa-yellow); }
.confetti i:nth-child(3n + 1) { background: var(--pa-cyan); }
.l-gpu:not(.slidev-vclick-hidden) .confetti i {
  animation: pop 1.1s steps(5, end) 0.55s 2;
}
@keyframes pop {
  0% { opacity: 1; transform: translate(0, 0); }
  100% {
    opacity: 0;
    transform: translate(calc((var(--i) - 5.5) * 7px), calc((var(--i) - 5.5) * (var(--i) - 5.5) * 1px - 34px));
  }
}

/* ---------- табло времени ---------- */
.num {
  grid-area: num;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.1rem 0.4rem 0.4rem;
  position: relative;
  font-family: var(--pa-font-pixel);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 0.95;
  color: var(--tone);
  text-shadow: 0 0 0.6rem color-mix(in srgb, var(--tone) 60%, transparent);
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1.5px) 0 0 / 5px 5px,
    #07040f;
  box-shadow: inset 0 0 0 3px #241c42;
}
.num::before {
  content: "TIME";
  position: absolute;
  top: 0.35rem;
  left: 0;
  right: 0;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  color: #4b4080;
  text-shadow: none;
}
.l-wasm .num { font-size: 1.75rem; }
.l-wasm .num::before { content: "N/A"; }
.l-gpu .num::before { content: "1ST"; color: var(--pa-lime); }
.l-gpu .num {
  font-size: 2.75rem;
  box-shadow: inset 0 0 0 3px #2f5a12, 0 0 1rem -0.3rem rgba(157, 255, 62, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .lane:not(.slidev-vclick-hidden),
  .lane:not(.slidev-vclick-hidden) .car,
  .confetti i { animation: none !important; }
  .l-node .car { left: 34%; }
}
</style>

<!--
Где учить сеть — отдельная история. Чтобы сравнить варианты, я взял игрушечную тренировку: маленькая свёрточная сеть, 512 картинок 32 на 32, две эпохи — и засекал, сколько она идёт.
[click] Первая попытка — обычный JavaScript в Node. Работает, но медленно: эта игрушечная тренировка шла 116 секунд. Быстрый нативный вариант tfjs-node на моей машине просто не собрался.
[click] Вторая — wasm-бэкенд TensorFlow.js. Быстрый, но умеет только отвечать: обратного прохода свёртки, нужного для обучения, в нём просто не написали. Сам WebAssembly тут ни при чём. Это как калькулятор, который считает, но не умеет исправлять свои ошибки.
[click] И тогда я пошёл в браузер. Headless Chromium, а в нём WebGL — это доступ к видеокарте прямо из JavaScript. Та же тренировка заняла 3,2 секунды вместо ста шестнадцати.
-->

---
layout: simple-slide
level: 4
variant: 12
---

## Инфраструктура

<div class="route" :class="`hop-${$clicks}`">
  <div class="pipe">
    <div class="tile t-node" v-click="1">
      <A4Station kind="node" :on="$clicks >= 1" :live="$clicks === 1"><div class="big-ico"><logos-nodejs-icon /></div></A4Station>
      <div class="plate">
        <div class="title">Node</div>
        <div class="cap">поднимает браузер</div>
      </div>
    </div>
    <div class="arrow a1" v-click="2"><tabler-arrow-right /></div>
    <div class="tile ok t-gpu" v-click="2">
      <A4Station kind="forge" tone="var(--pa-lime)" :on="$clicks >= 2" :live="$clicks === 2"><div class="big-ico"><logos-chrome /></div></A4Station>
      <div class="plate">
        <div class="title">Браузер</div>
        <div class="cap">учит сеть на видеокарте</div>
      </div>
    </div>
    <div class="arrow a2" v-click="3"><tabler-arrow-right /></div>
    <div class="tile t-vault" v-click="3">
      <A4Station kind="vault" tone="var(--pa-cyan)" :on="$clicks >= 3" :live="$clicks === 3"><div class="big-ico cyan"><tabler-package /></div></A4Station>
      <div class="plate">
        <div class="title">Веса</div>
        <div class="cap">возвращаются в Node и ложатся в файлы</div>
      </div>
    </div>
    <div class="rail" aria-hidden="true">
      <div class="packet"><i></i></div>
    </div>
  </div>

<div v-click="4" class="speed">
  <span class="gnum">2.6 мс</span>
  <span class="sub">применение в Node: на кусочек картинки вместо</span>
  <span class="bad big">61 мс</span>
  <div class="bars" aria-hidden="true">
    <div class="bar fast"><i></i></div>
    <div class="bar slow"><i></i></div>
  </div>
</div>
</div>

<style scoped>
/* Трасса данных между тремя станциями: пульт Node → кузня-видеокарта в браузере → сундук весов.
   По рельсу под станциями едет пакет: на шаге браузера он «раскаляется», у сундука становится весами.
   Внизу табло скорости применения: короткая лаймовая полоса против длинной красной. */
.route {
  width: 100%;
  margin-top: -0.4rem;
}
.pipe {
  --gap-w: 4.5rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr var(--gap-w) 1fr var(--gap-w) 1fr;
  grid-template-rows: auto;
  align-items: start;
}
/* у станции своя рамка: глобальный вид .tile (карточка) здесь снимаем */
.pipe .tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0;
  text-align: center;
  background: none;
  box-shadow: none;
}
.pipe .tile::before {
  display: none;
}
.t-node { grid-column: 1; }
.t-gpu { grid-column: 3; }
.t-vault { grid-column: 5; }
.tile:not(.slidev-vclick-hidden) :deep(.a4-station) {
  animation: st-drop 0.4s steps(4, end);
}
@keyframes st-drop {
  0% { transform: translateY(-14px); opacity: 0; }
  100% { transform: none; opacity: 1; }
}
.big-ico {
  font-size: 3.25rem;
  line-height: 1;
}
.big-ico > :deep(svg),
.big-ico > svg {
  display: block;
}
.big-ico.cyan {
  color: var(--pa-cyan);
  filter: drop-shadow(0 0 0.4rem rgba(62, 240, 255, 0.6));
}

/* табличка станции под рельсом */
.plate {
  margin-top: 40px;
  width: 100%;
  padding: 0.4rem 0.5rem 0.45rem;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 #3a3160,
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
}
.title {
  font-family: var(--pa-font-pixel);
  font-size: 1.625rem;
  font-weight: 600;
  line-height: 1.05;
  color: var(--lvl-accent);
}
.t-gpu .title { color: var(--pa-lime); }
.t-vault .title { color: var(--pa-cyan); }
.cap {
  font-size: 1rem;
  line-height: 1.3;
  color: var(--pa-text-dim);
}

/* рельс под станциями: пакет едет от станции к станции по шагам */
.rail {
  position: absolute;
  left: 0;
  right: 0;
  top: 150px;
  height: 14px;
  z-index: 0;
  background:
    repeating-linear-gradient(90deg, #3a3160 0 10px, #241c42 10px 20px) 0 3px / 100% 8px no-repeat,
    #07040f;
  box-shadow: 0 -3px 0 0 #6d6496, 0 3px 0 0 #07040f;
}
.hop-2 .rail,
.hop-3 .rail {
  animation: rail-run 0.5s steps(4, end) infinite;
}
@keyframes rail-run {
  to { background-position: 20px 3px, 0 0; }
}
.packet {
  position: absolute;
  top: -22px;
  left: calc(16.66% - 15px);
  width: 30px;
  height: 22px;
  transition: left 0.8s steps(8, end);
}
.packet i {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 12px, rgba(7, 4, 15, 0.6) 12px 18px, transparent 18px),
    var(--pa-cyan);
  box-shadow: 0 0 0 3px #07040f, 0 0 10px rgba(62, 240, 255, 0.6);
  opacity: 0;
  transition: opacity 0.2s steps(2), background-color 0.3s steps(3);
}
.hop-1 .packet i,
.hop-2 .packet i,
.hop-3 .packet i,
.hop-4 .packet i { opacity: 1; }
.hop-2 .packet { left: calc(50% - 15px); }
.hop-2 .packet i {
  background-color: var(--pa-lime);
  box-shadow: 0 0 0 3px #07040f, 0 0 12px rgba(157, 255, 62, 0.8);
  animation: hot 0.5s steps(2, end) 0.8s infinite;
}
@keyframes hot {
  50% { filter: brightness(1.6); }
}
.hop-3 .packet,
.hop-4 .packet { left: calc(83.33% - 15px); }
.hop-3 .packet i,
.hop-4 .packet i {
  background:
    linear-gradient(transparent 9px, #07040f 9px 12px, transparent 12px),
    linear-gradient(90deg, transparent 12px, #07040f 12px 15px, transparent 15px),
    var(--pa-orange);
  box-shadow: 0 0 0 3px #07040f, 0 0 10px rgba(255, 159, 62, 0.7);
}

/* стрелки-семафоры на рельсе между станциями */
.arrow {
  grid-row: 1;
  align-self: start;
  justify-self: center;
  margin-top: 128px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 1.75rem;
  font-size: 1.5rem;
  color: #07040f;
  background: var(--lvl-accent);
  box-shadow: 0 0 0 3px #07040f, 0 0 0.75rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
}
.a1 { grid-column: 2; }
.a2 { grid-column: 4; background: var(--pa-cyan); box-shadow: 0 0 0 3px #07040f, 0 0 0.75rem rgba(62, 240, 255, 0.6); }

/* ---------- табло скорости ---------- */
.speed {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "fast sub slow"
    "fast bars slow";
  align-items: center;
  column-gap: 1.1rem;
  row-gap: 0.35rem;
  margin-top: 1.5rem;
  padding: 0.55rem 1rem 0.6rem;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.045) 1px, transparent 1.5px) 0 0 / 5px 5px,
    #07040f;
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
}
.speed .gnum {
  grid-area: fast;
  font-size: 4rem;
  line-height: 1;
}
.sub {
  grid-area: sub;
  font-size: 1rem;
  line-height: 1.3;
  color: var(--pa-text-dim);
}
.big {
  grid-area: slow;
  font-family: var(--pa-font-pixel);
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1;
  color: var(--pa-red);
  text-shadow: 0 0 0.6rem rgba(255, 77, 109, 0.5);
}
.bars {
  grid-area: bars;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.bar {
  height: 10px;
  background: #1a1336;
}
.bar i {
  display: block;
  height: 100%;
}
/* 2.6 из 61: полоса применения в wasm ≈ 4% длины красной */
.bar.fast i {
  width: 4.3%;
  min-width: 8px;
  background: var(--pa-lime);
  box-shadow: 0 0 8px rgba(157, 255, 62, 0.8);
}
.bar.slow i {
  width: 100%;
  background: repeating-linear-gradient(90deg, var(--pa-red) 0 10px, #b8324b 10px 12px);
}
.speed:not(.slidev-vclick-hidden) .bar.slow i {
  animation: fill 1.2s steps(12, end);
}
.speed:not(.slidev-vclick-hidden) .bar.fast i {
  animation: fill 0.1s steps(1, end);
}
@keyframes fill {
  from { width: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tile:not(.slidev-vclick-hidden) :deep(.a4-station),
  .rail,
  .packet i,
  .bar i { animation: none !important; }
  .packet { transition: none; }
}
</style>

<!--
Как это устроено.
[click] Node запускает браузер через Playwright и подключает в страницу TensorFlow.js и наш бандл. Примеры браузер сам забирает обычным fetch с локального сервера.
[click] Внутри браузера TensorFlow.js учит сеть на видеокарте через WebGL. Настоящее обучение занимает около двух часов на ноутбуке. Но это делается один раз.
[click] Готовые веса браузер отдаёт через model.save со своим обработчиком, а Node пишет их в model.json и weights.bin. Браузер здесь просто ускоритель.
[click] А применять уже обученную сеть можно без браузера: в Node подключаем wasm-бэкенд, tf.setBackend('wasm'). Учиться он не умеет, но для ответов это и не нужно. Одно окошко 64 на 64 он обрабатывает за 2,6 миллисекунды, а обычный JavaScript — за 61, и ответы совпадают до последнего знака. У сломанного компонента обычно несколько окошек, так что проверка одного компонента укладывается в десятки миллисекунд. Итого: учим один раз в браузере, применяем в каждом тесте в Node.
-->
