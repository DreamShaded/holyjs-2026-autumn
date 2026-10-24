---
layout: interjection
level: 6
variant: 8
transition: slide-up
---

<TextBig>
  Модель как артефакт
</TextBig>

<!--
Сеть обучена. А что это вообще такое физически? Давайте откроем папку с моделью.
-->

---
layout: simple-slide
level: 6
variant: 26
---

## Как устроена сеть и почему она маленькая

<div class="hoard" :class="`st-${$clicks}`">
  <div class="tower" v-click="1">
    <span class="blk w16" style="--i:0"><i class="ghost g32" /><b class="lbl">16</b></span><span class="blk w16" style="--i:1"><i class="ghost g32" /><b class="lbl">16</b></span><span class="op">÷2</span>
    <span class="blk w32" style="--i:2"><i class="ghost g64" /><b class="lbl">32</b></span><span class="blk w32" style="--i:3"><i class="ghost g64" /><b class="lbl">32</b></span><span class="op">÷2</span>
    <span class="blk w64" style="--i:4"><i class="ghost g128" /><b class="lbl">64</b></span><span class="blk w96" style="--i:5"><i class="ghost g128" /><b class="lbl">96</b></span>
    <span class="op arr">→</span><span class="q">нашёл?</span>
    <span class="op arr">→</span><span class="blk dense" style="--i:6"><b class="lbl">64</b></span>
    <span class="op arr">→</span><span class="bulbs"><A6Icon v-for="n in 5" :key="n" kind="bulb" :px="3" :style="{ '--b': n }" /></span>
  </div>
  <div class="vaultrow">
    <div class="counter" v-click="2"><div class="head"><A6Icon class="bag" kind="bag" :px="5" /><span class="odo"><span style="--d:0">9</span><span style="--d:1">7</span> <span style="--d:2">6</span><span style="--d:3">5</span><span style="--d:4">3</span></span></div>числа подкручиваются при обучении. Для нейросети это мало</div>
    <div class="plan" v-click="3">Изначально планировали шире (32-…-128), но мы искали минимальную модель, дающую интересные цифры</div>
  </div>
</div>

<style scoped>
/* Сцена «клад»: башенка сети — стопки монет-весов на полке хранилища.
   Высота стопки растёт с числом трафаретов этажа, «нашёл?» — блок-вопрос,
   плотный слой — изумрудная стопка, выход — пять пиксельных ламп. */
.hoard {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 0.4rem;
}
.tower {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  height: 212px;
  padding: 0 0.75rem 14px;
}
/* полка хранилища под башенкой */
.tower::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14px;
  z-index: -2;
  background:
    repeating-linear-gradient(90deg, transparent 0 22px, rgba(0, 0, 0, 0.35) 22px 24px),
    linear-gradient(#ffd23e 0 3px, #8a5a12 3px 6px, #3a2a14 6px);
  box-shadow: 0 -2px 0 0 rgba(255, 210, 62, 0.25);
}
.blk {
  position: relative;
  display: grid;
  place-items: center;
  width: 62px;
  flex-shrink: 0;
  /* стопка монет: ребро монеты 6px + тень 2px, блик слева, тёмный край справа */
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.28) 0 6px, transparent 6px calc(100% - 6px), rgba(0, 0, 0, 0.3) calc(100% - 6px)),
    repeating-linear-gradient(to top, #ffd23e 0 6px, #a8740a 6px 8px);
  box-shadow:
    0 -3px 0 0 #fff0a0,
    -3px 0 0 0 #4a2e00,
    3px 0 0 0 #4a2e00,
    0 0 0.9rem -0.2rem rgba(255, 210, 62, 0.55);
  transform-origin: 50% 100%;
}
.w16 { height: 56px; }
.w32 { height: 84px; }
.w64 { height: 124px; }
.w96 { height: 156px; }
.dense {
  height: 56px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0 6px, transparent 6px calc(100% - 6px), rgba(0, 0, 0, 0.3) calc(100% - 6px)),
    repeating-linear-gradient(to top, #9dff3e 0 6px, #3f8a12 6px 8px);
  box-shadow:
    0 -3px 0 0 #e2ffc4,
    -3px 0 0 0 #173a05,
    3px 0 0 0 #173a05,
    0 0 0.9rem -0.2rem rgba(157, 255, 62, 0.6);
}
.lbl {
  position: relative;
  z-index: 1;
  font-family: var(--pa-font-pixel);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.15rem 0.3rem 0.2rem;
  color: #fff8de;
  background: rgba(20, 10, 2, 0.88);
  box-shadow: 0 0 0 2px #4a2e00;
}
/* призрак первоначального плана: стопки шире и выше, пунктир */
.ghost {
  position: absolute;
  left: -4px;
  right: -4px;
  bottom: 0;
  z-index: -1;
  border: 3px dashed var(--pa-red);
  background: repeating-linear-gradient(135deg, rgba(255, 77, 109, 0.12) 0 6px, transparent 6px 12px);
  opacity: 0;
}
.g32 { height: 84px; }
.g64 { height: 124px; }
.g128 { height: 196px; }
.st-3 .ghost { opacity: 0.9; }
.op {
  align-self: center;
  font-family: var(--pa-font-pixel);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--pa-cyan);
  text-shadow: 0 0 0.5rem rgba(62, 240, 255, 0.6);
  margin-top: 40px;
}
.op.arr { color: var(--lvl-accent); text-shadow: 0 0 0.5rem rgba(255, 210, 62, 0.6); }
/* блок-вопрос из платформера */
.q {
  align-self: center;
  margin-top: 40px;
  font-family: var(--pa-font-pixel);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.55rem 0.55rem 0.6rem;
  color: #2a1600;
  background:
    linear-gradient(#6b3c00, #6b3c00) 3px 3px / 3px 3px no-repeat,
    linear-gradient(#6b3c00, #6b3c00) calc(100% - 3px) 3px / 3px 3px no-repeat,
    linear-gradient(#6b3c00, #6b3c00) 3px calc(100% - 3px) / 3px 3px no-repeat,
    linear-gradient(#6b3c00, #6b3c00) calc(100% - 3px) calc(100% - 3px) / 3px 3px no-repeat,
    linear-gradient(#ffd23e, #ffb020);
  box-shadow:
    0 -3px 0 0 #fff0a0,
    0 3px 0 0 #6b3c00,
    -3px 0 0 0 #6b3c00,
    3px 0 0 0 #6b3c00,
    0 0 1rem -0.2rem rgba(255, 210, 62, 0.7);
}
.bulbs {
  align-self: center;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  filter: drop-shadow(0 0 6px rgba(255, 226, 120, 0.75));
}

.vaultrow {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.25rem;
  align-items: stretch;
}
/* счётчик хранилища: мешок + табло из отдельных ячеек-цифр */
.counter {
  position: relative;
  padding: 0.75rem 1rem 0.8rem;
  line-height: 1.4;
  background: rgba(20, 12, 2, 0.88);
  box-shadow:
    0 -3px 0 0 #8a5a12,
    0 3px 0 0 #8a5a12,
    -3px 0 0 0 #8a5a12,
    3px 0 0 0 #8a5a12,
    0 0 1.2rem -0.4rem rgba(255, 210, 62, 0.5);
}
.head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.5rem;
}
.odo {
  display: flex;
  gap: 4px;
  font-family: var(--pa-font-display);
  font-size: 1.75rem;
  line-height: 1;
  color: var(--lvl-accent);
  text-shadow: 0 0 0.5rem rgba(255, 210, 62, 0.7);
}
.odo > span:nth-child(3) {
  margin-left: 0.6rem;
}
.odo > span {
  display: inline-block;
  min-width: 1.9rem;
  padding: 0.35rem 0.2rem 0.3rem;
  text-align: center;
  background: #07040f;
  box-shadow: inset 0 -3px 0 rgba(255, 210, 62, 0.25), 0 0 0 2px #4a2e00;
}
/* чертёж изначального плана: синька в клетку, пунктирный край, штамп-крест */
.plan {
  position: relative;
  padding: 0.85rem 1.1rem 0.85rem 1.1rem;
  line-height: 1.45;
  color: #e6fbff;
  background:
    linear-gradient(rgba(62, 240, 255, 0.09) 1px, transparent 1px) 0 0 / 16px 16px,
    linear-gradient(90deg, rgba(62, 240, 255, 0.09) 1px, transparent 1px) 0 0 / 16px 16px,
    #0a2140;
  outline: 3px dashed rgba(255, 77, 109, 0.85);
  outline-offset: -3px;
}
.plan::after {
  content: "";
  position: absolute;
  right: -10px;
  top: -12px;
  width: 30px;
  height: 30px;
  background:
    linear-gradient(45deg, transparent 0 40%, var(--pa-red) 40% 60%, transparent 60%),
    linear-gradient(-45deg, transparent 0 40%, var(--pa-red) 40% 60%, transparent 60%);
  filter: drop-shadow(0 0 4px rgba(255, 77, 109, 0.8));
}

@media screen and (prefers-reduced-motion: no-preference) {
  .tower:not(.slidev-vclick-hidden) .blk {
    animation: a6-rise 0.28s steps(4, end) both;
    animation-delay: calc(var(--i) * 45ms);
  }
  .tower:not(.slidev-vclick-hidden) .blk::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.35);
    opacity: 0;
    animation: a6-shine 3.6s steps(1, end) infinite;
    animation-delay: calc(0.8s + var(--i) * 0.16s);
  }
  .tower:not(.slidev-vclick-hidden) .q {
    animation: a6-bump 3.6s steps(1, end) infinite 1.8s;
  }
  .tower:not(.slidev-vclick-hidden) .bulbs > * {
    animation: a6-flick 3.6s steps(1, end) infinite;
    animation-delay: calc(2.1s + var(--b) * 0.09s);
  }
  .tower:not(.slidev-vclick-hidden) .arr {
    animation: a6-nudge 1.2s steps(2, jump-none) infinite;
  }
  .counter:not(.slidev-vclick-hidden) .odo > span:nth-child(3) {
  margin-left: 0.6rem;
}
.odo > span {
    animation: a6-drop 0.3s steps(3, end) both;
    animation-delay: calc(var(--d) * 60ms);
  }
  .st-3 .ghost {
    animation: a6-ghost 0.5s steps(5, end) both;
  }
}
@keyframes a6-rise {
  from { transform: scaleY(0.15); }
  to { transform: scaleY(1); }
}
@keyframes a6-shine {
  0% { opacity: 0.55; }
  6% { opacity: 0; }
}
@keyframes a6-bump {
  0% { transform: translateY(-6px); }
  5% { transform: translateY(0); }
}
@keyframes a6-flick {
  0% { opacity: 0.35; }
  4% { opacity: 1; }
}
@keyframes a6-nudge {
  from { transform: translateX(0); }
  to { transform: translateX(3px); }
}
@keyframes a6-drop {
  from { transform: translateY(-0.9rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes a6-ghost {
  0% { opacity: 0; }
  20% { opacity: 0.9; }
  40% { opacity: 0.2; }
  60% { opacity: 0.9; }
  80% { opacity: 0.4; }
  100% { opacity: 0.9; }
}
</style>

<!--
Как устроена наша сеть.
[click] Это та самая башенка из кода: этажи трафаретов, между ними сжимаем ответы, чтобы видеть площадь побольше, потом «нашёл или нет», маленький слой из 64 ячеек и пять лампочек.
[click] Всего при обучении подкручивается 97 653 числа. Звучит много, но для нейросети это очень мало: у больших моделей их миллиарды. Весь файл с весами меньше половины мегабайта.
[click] Изначально мы планировали сеть шире, от 32 до 128 трафаретов на этаже. Но такая широкая сеть роняла браузер, когда видеокарты нет и всё рисуется программно. А главное, цель была найти минимальную модель, которая уже даёт интересные цифры. Чем меньше сеть, тем быстрее она в тестах и тем проще её понять.
-->

---
layout: two-cols
level: 6
variant: 26
leftWidth: 55%
---

::header::
## Как выглядит модель

::default::

<div class="inv" :class="`cur-${[0, 1, 2, 3, 4, 3][Math.min($clicks, 5)]}`">
  <div class="item r-scroll" v-click="1"><div class="slot"><A6Icon kind="scroll" /></div><div class="txt"><code>model.json</code>: инструкция по сборке: какие этажи и в каком порядке</div></div>
  <div class="item r-bag" v-click="2"><div class="slot"><A6Icon kind="bag" /></div><div class="txt"><code>weights.bin</code>: сами детали: все 97 653 подкрученных числа</div></div>
  <div class="item r-pass" v-click="3"><div class="slot"><A6Icon kind="passport" /></div><div class="txt"><code>meta.json</code>: паспорт: какая лампочка какое свойство означает, какого размера окошко, сколько эпох училась</div></div>
  <div class="item r-cv" v-click="4"><div class="slot"><A6Icon kind="report" /></div><div class="txt"><code>cv.json</code>: табель с оценками по пяти кучкам, рядом сами пять проверочных сетей (<code>folds/0..4/</code>)</div></div>
</div>

::right::

<div class="tip" :class="{ open: $clicks >= 3, sealed: $clicks >= 5 }">
<pre class="log meta" v-click="3">{
  <span class="k">"registryVersion"</span>: <span v-mark.box.orange="5">"3445fa09…"</span>,
  <span class="k">"outputOrder"</span>: [
    <span class="v">"color"</span>, <span class="v">"font-weight"</span>,
    <span class="v">"letter-spacing"</span>,
    <span class="v">"line-height"</span>, <span class="v">"border"</span>
  ],
  <span class="k">"windowSize"</span>: <span class="n">64</span>,
  <span class="k">"epochs"</span>: <span class="n">6</span>,
  <span class="k">"stopMetric"</span>: <span class="v">"top1pair"</span>
}</pre>
<A6Icon class="seal" kind="seal" :px="5" />
</div>

<p v-click="5" class="sub">В паспорте есть отпечаток списка свойств (<code>registryVersion</code>). Если список поменяли, а сеть старая, это видно сразу</p>

<style scoped>
/* Сцена «лут»: файлы модели — предметы в ячейках инвентаря, справа — карточка
   характеристик выбранного предмета (паспорт meta.json), на последнем шаге её
   скрепляет сургучная печать-отпечаток. Курсор инвентаря идёт за шагами. */
.inv {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.item {
  --rar: var(--pa-cyan);
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  background: rgba(14, 8, 30, 0.86);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.r-scroll { --rar: var(--pa-cyan); }
.r-bag { --rar: var(--pa-yellow); }
.r-pass { --rar: var(--pa-magenta); }
.r-cv { --rar: var(--pa-lime); }
.slot {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--rar) 22%, transparent), transparent 70%),
    #07040f;
  box-shadow:
    inset 0 0 0 3px color-mix(in srgb, var(--rar) 75%, #07040f),
    0 0 0.8rem -0.3rem var(--rar);
}
.txt {
  font-size: 1rem;
  line-height: 1.42;
  min-width: 0;
}
.txt code {
  font-size: 1rem;
  color: var(--rar);
}
/* курсор инвентаря: выбранный предмет */
.cur-1 .item:nth-child(1),
.cur-2 .item:nth-child(2),
.cur-3 .item:nth-child(3),
.cur-4 .item:nth-child(4) {
  box-shadow:
    0 -3px 0 0 var(--rar),
    0 3px 0 0 var(--rar),
    -3px 0 0 0 var(--rar),
    3px 0 0 0 var(--rar),
    0 0 1.1rem -0.2rem var(--rar);
}
.cur-1 .item:nth-child(1)::before,
.cur-2 .item:nth-child(2)::before,
.cur-3 .item:nth-child(3)::before,
.cur-4 .item:nth-child(4)::before {
  content: "";
  position: absolute;
  left: -20px;
  top: 24px;
  border: 8px solid transparent;
  border-left: 10px solid var(--rar);
  filter: drop-shadow(0 0 4px var(--rar));
}
/* луч от паспорта к карточке справа */
.cur-3 .item:nth-child(3)::after {
  content: "";
  position: absolute;
  right: -1.4rem;
  top: 50%;
  width: 1.4rem;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--pa-magenta) 0 6px, transparent 6px 9px);
}

/* карточка предмета: паспорт модели */
.tip {
  position: relative;
  margin-top: 0.7rem;
  opacity: 0;
}
.tip.open { opacity: 1; }
.tip::before {
  content: "meta.json";
  position: absolute;
  z-index: 2;
  right: 0.9rem;
  top: -0.95rem;
  padding: 0.2rem 0.5rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #2a0a24;
  background: var(--pa-magenta);
  box-shadow: 0 0 0.8rem -0.2rem var(--pa-magenta);
}
.tip pre.log.meta {
  margin: 0;
  line-height: 1.36 !important;
  padding: 0.85rem 1rem 0.75rem;
  color: #f2ecff;
  text-shadow: none;
  background:
    linear-gradient(rgba(255, 62, 207, 0.06) 1px, transparent 1px) 0 0 / 100% 4px,
    rgba(18, 6, 26, 0.94);
  box-shadow:
    0 -3px 0 0 var(--pa-magenta),
    0 3px 0 0 var(--pa-magenta),
    -3px 0 0 0 var(--pa-magenta),
    3px 0 0 0 var(--pa-magenta),
    0 0 1.4rem -0.3rem rgba(255, 62, 207, 0.6);
}
.k { color: var(--lvl-accent); }
.v { color: #9ff7ff; }
.n { color: var(--pa-lime); }
.seal {
  position: absolute;
  right: 0.7rem;
  bottom: 0.6rem;
  opacity: 0;
  filter: drop-shadow(0 0 6px rgba(255, 77, 109, 0.8));
}
.tip.sealed .seal { opacity: 1; }
.sub {
  margin-top: 0.9rem;
  padding: 0.35rem 0.6rem;
  line-height: 1.45;
  background: rgba(7, 4, 15, 0.82);
}

@media screen and (prefers-reduced-motion: no-preference) {
  .item:not(.slidev-vclick-hidden) .slot :deep(svg) {
    animation: a6-loot 0.42s steps(6, end) both;
  }
  .tip.open pre.log.meta {
    animation: a6-unroll 0.45s steps(9, end) both;
  }
  .tip.sealed .seal {
    animation: a6-stamp 0.36s steps(4, end) both;
  }
}
@keyframes a6-loot {
  0% { transform: translateY(-22px) scale(0.6); opacity: 0; }
  50% { transform: translateY(0) scale(1.15); opacity: 1; }
  75% { transform: translateY(-4px) scale(1); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes a6-unroll {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(-2rem -2rem -2rem -2rem); }
}
@keyframes a6-stamp {
  from { transform: scale(2.4) rotate(-20deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
}
</style>

<!--
А так модель выглядит на диске: папка с файлами, как конструктор LEGO в коробке.
[click] model.json — инструкция по сборке: какие этажи и в каком порядке. Это стандартный формат TensorFlow.js, его читает tf.loadLayersModel.
[click] weights.bin — сами детали: все 97 653 числа подряд.
[click] meta.json — паспорт: какая лампочка какое свойство означает, размер окошка, сколько эпох училась и с какими настройками. Его пишем сами и проверяем zod-схемой. Справа настоящий паспорт нашей модели.
[click] cv.json — оценки по пяти кучкам, а рядом сами пять проверочных сетей, чтобы любую цифру из доклада можно было перепроверить.
[click] И любимая деталь — отпечаток списка свойств, sha1 от их имён. Если добавили свойство, а модель старая, лампочки поехали бы. Отпечаток не совпадёт, и это видно сразу, а не через неделю странных ответов.
-->
