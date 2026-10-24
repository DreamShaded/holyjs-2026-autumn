---
layout: interjection
level: 5
variant: 4
transition: slide-up
---

<TextBig>
  Как обучали модель
</TextBig>

<T5Montage />

<!--
Инструменты есть, теория есть. Теперь самое интересное: как мы учили модель и на чём спотыкались.
-->

---
layout: simple-slide
level: 5
variant: 16
clicks: 4
---

## Что видит сеть

<div class="what" :data-step="$clicks">
  <div class="scope">
    <WindowsOverlay :step="$clicks" />
  </div>
  <T5Lens class="lens" :step="$clicks" />
  <div class="cards col">
    <div class="card" v-click="1">Сеть не смотрит на весь компонент</div>
    <div class="card" v-click="2">Вокруг каждого отличия вырезаем окошко 64×64 пикселя</div>
    <div class="card" v-click="3">Соседние окошки перекрываются на 16 пикселей</div>
    <div class="card ok" v-click="4">Каждое окошко голосует, ответы окошек одного отличия усредняем</div>
  </div>
</div>

<style scoped>
/* Сцена «прицел тренажёра»: карточка в окне сканера, справа лупа с вырезанным окошком,
   снизу дорожка из четырёх шагов: узлы загораются по кликам, полоса пути заполняется. */
.what {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 1rem;
  row-gap: 0.9rem;
  margin-top: -0.4rem;
}
.scope {
  position: relative;
}
.lens {
  align-self: stretch;
}
/* дорожка шагов: бывшая сетка карточек, теперь узлы на общей линии пути */
.col {
  grid-column: 1 / -1;
  position: relative;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding-top: 1.1rem;
}
.col::before {
  content: "";
  position: absolute;
  top: 0.3rem;
  left: 0.5rem;
  right: 0.5rem;
  height: 6px;
  background: repeating-linear-gradient(90deg, #3a3160 0 8px, transparent 8px 12px);
}
.col::after {
  content: "";
  position: absolute;
  top: 0.3rem;
  left: 0.5rem;
  height: 6px;
  width: 0;
  background: var(--lvl-accent);
  box-shadow: 0 0 0.6rem color-mix(in srgb, var(--lvl-accent) 70%, transparent);
  transition: width 0.45s steps(6, end);
}
.what[data-step="1"] .col::after { width: calc(12.5% - 0.5rem); }
.what[data-step="2"] .col::after { width: calc(37.5% - 0.25rem); }
.what[data-step="3"] .col::after { width: calc(62.5%); }
.what[data-step="4"] .col::after { width: calc(100% - 1rem); background: linear-gradient(90deg, var(--lvl-accent) 80%, var(--pa-lime)); }
.col .card {
  font-size: 1rem;
  padding: 0.6rem 0.7rem;
}
/* узел шага на линии пути */
.col .card::before {
  content: "";
  position: absolute;
  top: calc(-0.8rem - 9px);
  left: calc(50% - 9px);
  width: 18px;
  height: 18px;
  background: #241c40;
  box-shadow: 0 0 0 3px #07040f;
}
.col .card:not(.slidev-vclick-hidden)::before {
  background: var(--lvl-accent);
  box-shadow: 0 0 0 3px #07040f, 0 0 0.6rem var(--lvl-accent);
}
.col .card.ok:not(.slidev-vclick-hidden)::before {
  background: var(--pa-lime);
  box-shadow: 0 0 0 3px #07040f, 0 0 0.6rem var(--pa-lime);
}
.col .card:not(.slidev-vclick-hidden) {
  animation: step-in 0.35s steps(4, end);
}
@keyframes step-in {
  from { transform: translateY(-8px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .what *, .what *::after { animation: none !important; transition: none !important; }
}
</style>

<!--
Теперь посмотрим, что из снимков попадает в сеть. Это настоящая карточка из витрины, у которой сломали межбуквенный интервал.
[click] Сеть не смотрит на компонент целиком. Красная рамка — область отличий: pixelmatch даёт маску отличающихся пикселей, а рамку вокруг пятна мы находим своим кодом, обходом в ширину.
[click] Вокруг отличий вырезаем окошки 64 на 64 пикселя. Это как лупа: видно ровно нужное место, в настоящем размере, без растягивания. Почему 64: при обычном тексте сюда влезают две-три строки и несколько букв — как раз чтобы увидеть и межбуквенный, и межстрочный интервал. А настоящий размер важен: стоит сжать, и тонкие расстояния между буквами пропадут.
[click] Соседние окошки перекрываются на 16 пикселей — вот зелёная полоска, — чтобы буква на границе целиком попала хотя бы в одно.
[click] Внутри каждого окошка работают те самые трафареты три на три — этаж за этажом, как в домике. Каждое окошко отвечает отдельно, а ответы окошек одной области усредняем. Одно окошко может ошибиться, а среднее надёжнее.
-->

---
layout: two-cols
level: 5
variant: 12
leftWidth: 42%
clicks: 3
---

::header::
## Тензор

::default::

<T5TensorStack class="cube" :step="$clicks">
  <template #w>64</template>
  <template #h>64</template>
  <template #d>7</template>
</T5TensorStack>

::right::

<p class="def">Тензор: многомерная таблица чисел, с ними работает TensorFlow.js</p>

<table class="chan">
  <thead><tr><th>Канал</th><th>Что в нём</th></tr></thead>
  <tbody>
    <tr :class="{ hot: $clicks === 1 }"><td><i class="sw r" /><i class="sw g" /><i class="sw b" />1–3</td><td>R, G, B эталона («как надо»)</td></tr>
    <tr :class="{ hot: $clicks === 2 }"><td><i class="sw r" /><i class="sw g" /><i class="sw b" />4–6</td><td>R, G, B рендера («как стало»)</td></tr>
    <tr :class="{ hot: $clicks === 3 }"><td><i class="sw m" />7</td><td>маска диффа: отличается ли этот пиксель</td></tr>
  </tbody>
</table>

<div class="vec" aria-hidden="true">
  <span class="vec-lbl">1 PX</span>
  <span class="vec-arr">→</span>
  <span class="vec-cells">
    <i v-for="(t, i) in ['r', 'g', 'b', 'r', 'g', 'b', 'm']" :key="i" :class="[t, { on: ($clicks === 1 && i < 3) || ($clicks === 2 && i >= 3 && i < 6) || ($clicks === 3 && i === 6) }]" :style="{ '--h': [0.94, 0.9, 0.92, 0.94, 0.9, 0.92, 1][i] }" />
  </span>
  <span class="vec-lbl">÷255 → 0..1</span>
</div>

<style scoped>
/* Сцена «стопка плёнок»: семь пиксельных слоёв окошка лежат стопкой, по кликам нужные
   каналы выезжают из стопки, а строка таблицы-«селектора каналов» загорается тем же цветом. */
.cube {
  margin-top: 0.75rem;
}
.def {
  margin: 0.2rem 0 0;
  padding-left: 0.9rem;
  box-shadow: inset 4px 0 0 0 var(--lvl-accent);
}
.chan {
  margin-top: 1.1rem;
}
.chan td:first-child {
  white-space: nowrap;
}
/* пиксельные образцы каналов */
.sw {
  display: inline-block;
  width: 10px;
  height: 16px;
  margin-right: 3px;
  vertical-align: -2px;
  box-shadow: 0 0 0 2px #07040f;
}
.sw.r { background: #ff4d6d; }
.sw.g { background: #9dff3e; }
.sw.b { background: #5d8dff; }
.sw.m { background: repeating-linear-gradient(180deg, #f2ecff 0 4px, #0b0718 4px 8px); }
.sw:last-of-type { margin-right: 0.6rem; }
.chan tr {
  transition: background 0.3s steps(3, end);
}
.chan tr.hot td {
  color: var(--color-green);
  background: rgba(157, 255, 62, 0.1);
}
.chan tr.hot td:first-child {
  box-shadow: inset 4px 0 0 0 var(--color-green);
}
.chan tr.hot .sw {
  animation: sw-blink 0.5s steps(1, end) 3;
}
@keyframes sw-blink { 50% { opacity: 0.2; } }
/* один пиксель окошка = 7 чисел: столбик на каждый канал */
.vec {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin-top: 1.4rem;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-text-dim);
}
.vec-arr { color: var(--lvl-accent); }
.vec-cells {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 56px;
  padding: 4px;
  background: #0b0718;
  box-shadow: 0 0 0 3px var(--pa-line);
}
.vec-cells i {
  width: 18px;
  height: calc(var(--h) * 48px);
  opacity: 0.35;
  transition: opacity 0.3s steps(2, end);
}
.vec-cells i.r { background: #ff4d6d; }
.vec-cells i.g { background: #9dff3e; }
.vec-cells i.b { background: #5d8dff; }
.vec-cells i.m { background: #f2ecff; }
.vec-cells i.on {
  opacity: 1;
  box-shadow: 0 0 8px currentColor;
  animation: vec-up 0.35s steps(4, end);
}
@keyframes vec-up { from { height: 0; } }
</style>

<!--
Что внутри одного окошка? Сеть видит три прозрачные плёнки стопкой: «как надо», «как стало» и маску отличий от pixelmatch. Для TensorFlow.js это тензор — многомерная таблица чисел: 64 на 64 пикселя и 7 чисел на каждый пиксель.
[click] Первые три — цвет пикселя на эталоне.
[click] Следующие три — цвет на рендере.
[click] И седьмое — маска: отличается пиксель или нет. В коде каждое число делим на 255, чтобы получилось от нуля до единицы. Однажды мы поделили на 255 и правильные ответы: единица стала 0.0039, loss — почти нулевым и похожим на успех, а сеть угадывала наугад. С тех пор метки проверяем отдельно.
-->

---
layout: simple-slide
level: 5
variant: 30
---

## Угадал с первой попытки?

<div class="cards col">
  <div class="card rule" v-click="1">Главная оценка, <b>top-1</b>: правда ли самая яркая лампочка указывает на сломанное свойство</div>
</div>

<div class="row" :data-step="$clicks">
  <div class="cell lane" v-click="1">
    <div class="shelf">
      <Lamps :values="[0.12, 0.91, 0.2, 0.08, 0.05]" :show-values="false" />
      <div class="lock" aria-hidden="true"><span>TOP-1</span></div>
      <div class="guess" aria-hidden="true"><span>?</span></div>
    </div>
    <div class="verdict accent">сломан font-weight → ✓</div>
  </div>
  <div class="cell odds" v-click="2">
    <div class="pips" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <span class="gnum">20 %</span>
    <span class="sub">если тыкать наугад</span>
  </div>
</div>

<style scoped>
/* Сцена «тир»: лампы стоят на полке как мишени. Клик 1 — прицел top-1 захватывает самую
   яркую лампу (font-weight) и засчитывает попадание. Клик 2 — «наугад»: жёлтый курсор
   прыгает по пяти лампам случайно и попадает в нужную один раз из пяти, отсюда 20 %. */
.col {
  grid-template-columns: 1fr;
}
.rule {
  padding-left: 3.6rem;
}
/* мишень слева от правила */
.rule::before {
  content: "";
  position: absolute;
  left: 1rem;
  top: calc(50% - 14px);
  width: 28px;
  height: 28px;
  background:
    radial-gradient(circle, var(--pa-yellow) 0 3px, transparent 3.5px),
    radial-gradient(circle, transparent 0 6px, var(--lvl-accent) 6.5px 9px, transparent 9.5px),
    radial-gradient(circle, transparent 0 12px, var(--lvl-accent) 12.5px 14px, transparent 14.5px);
}
.row {
  position: relative;
  margin-top: 1.5rem;
}
.cell {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
/* полка тира: доска с опорами под лампами; крупнее, чтобы мишени держали сцену */
.shelf {
  zoom: 1.25;
  align-self: flex-start;
  position: relative;
  padding: 0.9rem 0.9rem 0.6rem;
  background:
    linear-gradient(#3a3160, #3a3160) 0 100% / 100% 8px no-repeat,
    repeating-linear-gradient(90deg, rgba(255, 62, 207, 0.08) 0 2px, transparent 2px 14px),
    rgba(11, 7, 24, 0.82);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line),
    0 3px 0 0 #07040f;
}
/* прицел top-1: прилетает на лампу 2 (центр столбца: 0.9rem + 57.6px + 132.8px) */
.lock {
  --x: calc(0.9rem + 57.6px + 132.8px);
  position: absolute;
  left: calc(var(--x) - 46px);
  top: calc(0.9rem - 14px);
  width: 92px;
  height: 92px;
  background:
    linear-gradient(var(--pa-lime), var(--pa-lime)) top left / 22px 4px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) top left / 4px 22px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) top right / 22px 4px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) top right / 4px 22px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) bottom left / 22px 4px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) bottom left / 4px 22px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) bottom right / 22px 4px no-repeat,
    linear-gradient(var(--pa-lime), var(--pa-lime)) bottom right / 4px 22px no-repeat;
  filter: drop-shadow(0 0 6px rgba(157, 255, 62, 0.8));
  animation: lock-in 0.6s steps(6, end) 0.25s both;
}
.lock span {
  position: absolute;
  left: 50%;
  top: -1.55rem;
  transform: translateX(-50%);
  padding: 0.1rem 0.3rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-lime);
  white-space: nowrap;
}
/* прицел «въезжает» с первой лампы и сжимается до захвата */
@keyframes lock-in {
  0% { transform: translateX(-132.8px) scale(1.3); opacity: 0; }
  40% { transform: translateX(-60px) scale(1.2); opacity: 1; }
  80% { transform: scale(1.15); }
  100% { transform: none; opacity: 1; }
}
/* курсор «наугад»: прыгает по лампам, виден только после клика 2 */
.guess {
  position: absolute;
  left: calc(0.9rem + 57.6px - 40px);
  top: calc(0.9rem - 8px);
  width: 80px;
  height: 80px;
  opacity: 0;
  border: 4px dashed var(--pa-yellow);
  filter: drop-shadow(0 0 5px rgba(255, 225, 62, 0.7));
}
.guess span {
  position: absolute;
  right: -4px;
  bottom: -4px;
  padding: 0.15rem 0.3rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-yellow);
}
.row[data-step="2"] .guess {
  opacity: 1;
  animation: guess-hop 5s steps(1, end) infinite;
}
/* случайный порядок лампы: 3, 0, 4, 1 (попал), 2, 4, 0, 3, 2, 0 */
@keyframes guess-hop {
  0% { transform: translateX(calc(3 * 132.8px)); }
  10% { transform: translateX(0); }
  20% { transform: translateX(calc(4 * 132.8px)); }
  30% { transform: translateX(132.8px); border-color: var(--pa-lime); }
  40% { transform: translateX(calc(2 * 132.8px)); border-color: var(--pa-yellow); }
  50% { transform: translateX(calc(4 * 132.8px)); }
  60% { transform: translateX(0); }
  70% { transform: translateX(calc(3 * 132.8px)); }
  80% { transform: translateX(calc(2 * 132.8px)); }
  90% { transform: translateX(0); }
}
.verdict {
  font-size: 1.2rem;
  font-weight: 700;
}
.lane .verdict {
  align-self: flex-start;
  margin-top: 0.4rem;
  margin-left: calc(1.25 * (0.9rem + 57.6px + 132.8px) - 7.5rem);
  padding: 0.1rem 0.6rem;
  color: var(--pa-lime);
  box-shadow: inset 0 -3px 0 0 var(--pa-lime);
}
/* шансы: одна клетка из пяти; стоят справа от вердикта, под полкой */
.odds {
  position: absolute;
  right: 0;
  bottom: -0.6rem;
  flex-direction: row;
  align-items: center;
  gap: 1.1rem;
}
.odds .sub {
  width: 7.5rem;
  line-height: 1.25;
}
.pips {
  display: flex;
  gap: 6px;
}
.pips i {
  width: 18px;
  height: 18px;
  background: #241c40;
  box-shadow: 0 0 0 2px #3a3160;
}
.pips i:nth-child(2) {
  background: var(--pa-yellow);
  box-shadow: 0 0 0 2px var(--pa-yellow), 0 0 8px rgba(255, 225, 62, 0.8);
}
.cell .gnum {
  font-size: 4.5rem;
}
@media (prefers-reduced-motion: reduce) {
  .lock, .row[data-step="2"] .guess { animation: none; }
}
</style>

<!--
Прежде чем считать проценты, договоримся, что именно считаем.
[click] Главная оценка — top-1, или попадание. Вопрос простой: правда ли самая яркая лампочка указывает на то свойство, которое мы сломали? Здесь сломали жирность, и ярче всех горит жирность — засчитываем попадание. Как тест с выбором одного ответа: засчитывается, только если самый уверенный ответ правильный.
[click] Для масштаба: лампочек пять, поэтому если тыкать наугад, получится 20 процентов. Запомните эту планку: дальше все проценты в докладе — доля попаданий. Как именно считать голоса, когда у компонента много окошек, — ещё вернёмся. Считает это npm run eval.
-->

---
layout: two-cols
level: 5
variant: 12
leftWidth: 50%
clicks: 2
---

::header::
## Зубрёжка и контрольная

::default::

<div class="talk">
  <div class="say no" v-click="1"><div class="face"><tabler-notes /></div><div class="line">Главная опасность: зубрёжка. Ученик выучил ответы к задачам из учебника и не решит такую же задачу с другими числами. Это переобучение</div></div>
  <div class="say ok" v-click="2"><div class="face"><tabler-eye-off /></div><div class="line">Защита: часть задач прячем и не показываем на тренировке. Оцениваем сеть только на них, как контрольную</div></div>
</div>

::right::

<LineChart
  :series="[
    { points: [0.95, 0.62, 0.45, 0.36, 0.3, 0.27, 0.25, 0.24], color: '#62ecff', label: 'учебник' },
    { points: [0.97, 0.68, 0.52, 0.47, 0.5, 0.56, 0.63, 0.7], color: '#ff6b6b', label: 'контрольная', show: $clicks >= 2 },
  ]"
  :marker="{ x: 3, label: 'зубрёжка →', show: $clicks >= 2 }"
  :width="400"
  :height="300"
/>

<SplitStrip :step="$clicks" />

<style scoped>
/* Обход дефекта LineChart: у прорисовки steps(1, end) длиной 10 мс из-за погрешности
   float часть пикселей остаётся с opacity 0 после завершения анимации (дыра в линии).
   Линейная функция даёт в конце ту же единицу. Сам компонент общий, правится в задаче 04. */
:deep(.chart .lc-px),
:deep(.chart .lc-dot),
:deep(.chart .lc-lbl) {
  animation-timing-function: linear !important;
}
/* диалоговые окна RPG: портрет-иконка и реплика, мигающий маркер «дальше» */
.talk {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.2rem;
}
.say {
  --t: var(--pa-red);
  position: relative;
  display: grid;
  grid-template-columns: 3.25rem 1fr;
  gap: 0.9rem;
  padding: 0.75rem 1rem 0.9rem 0.75rem;
  background: rgba(14, 8, 32, 0.92);
  box-shadow:
    0 -3px 0 0 var(--t),
    0 3px 0 0 var(--t),
    -3px 0 0 0 var(--t),
    3px 0 0 0 var(--t),
    inset 0 0 0 3px #07040f,
    inset 0 0 0 5px color-mix(in srgb, var(--t) 35%, transparent);
}
.say.ok {
  --t: var(--color-green);
}
.face {
  width: 3.25rem;
  height: 3.25rem;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: var(--t);
  background: color-mix(in srgb, var(--t) 16%, #07040f);
  box-shadow: inset 0 0 0 3px var(--t);
  filter: drop-shadow(0 0 0.35rem color-mix(in srgb, var(--t) 45%, transparent));
}
.line {
  line-height: 1.45;
}
/* маркер «дальше» в правом нижнем углу окна */
.say::after {
  content: "";
  position: absolute;
  right: 0.6rem;
  bottom: 0.35rem;
  border: 6px solid transparent;
  border-top-color: var(--t);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .say:not(.slidev-vclick-hidden) {
    animation: say-open 0.35s steps(3, end) both;
  }
  .say:not(.slidev-vclick-hidden)::after {
    animation: say-next 0.8s steps(1, end) infinite;
  }
}
@keyframes say-open {
  from {
    clip-path: inset(0 0 100% 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes say-next {
  50% {
    opacity: 0;
  }
}
/* мелкие подписи графика убраны: на сцене не читаются, линии объясняет речь */
:deep(.lc-lbl),
:deep(.lc-mk-lbl),
:deep(.lc-end) {
  display: none;
}
</style>

<!--
Но прежде чем гнаться за процентами — главная опасность.
[click] У обучения есть главная опасность — зубрёжка. Представьте ученика, который выучил наизусть ответы ко всем задачам в учебнике. На уроке он отличник. А дайте ему ту же задачу с другими числами — и он не решит. У сетей это называется переобучение: сеть запоминает конкретные картинки вместо общего правила. Правильный термин — именно переобучение, по-английски overfitting. Но дальше я буду говорить «зубрёжка»: образ ученика-зубрилы понятнее, а суть та же.
[click] Защита простая: часть задач прячем и ни разу не показываем на тренировке. А оцениваем сеть только на них, как на контрольной с новыми задачами. Смотрите на график: на учебнике ошибка всё падает, а на контрольной в какой-то момент начинает расти. Вот с этой точки сеть зубрит.
-->


---
layout: two-cols
level: 5
variant: 20
leftWidth: 46%
clicks: 5
---

::header::
## Проверки

::default::

<div class="cards col runlog">
  <div class="card no" data-tag="ROUND 1" v-click="1">Сначала проверяли сеть на одной story и получили 100 %. Слишком хорошо, чтобы быть правдой</div>
  <div class="card" data-tag="K-FOLD ×5" v-click="2">Делим story на пять кучек. Пять раз учим на четырёх и проверяем на пятой, каждый раз на другой. Это <b>k-fold</b></div>
  <div class="card ok" data-tag="RESULT" v-click="5">В среднем 80 ± 16 %: разброс между кучками от 62 до 100 %</div>
</div>

::right::

<div class="arena">
  <KFold :step="$clicks >= 2 ? $clicks * 2 - 3 : 0" :scores="[0.9, 0.82, 0.64, 1, 0.62]" />
  <T5ScoreLine
    class="scores"
    :scores="[0.9, 0.82, 0.64, 1, 0.62]"
    :count="$clicks >= 2 ? Math.min(5, $clicks * 2 - 3) : 0"
    :single="$clicks === 1"
    :mean="$clicks >= 5"
  />
</div>

<style scoped>
/* Сцена «турнир из пяти раундов»: слева журнал попыток на общей линии, справа раунды k-fold,
   под ними шкала попаданий. Результат каждого раунда падает точкой на шкалу вместе с рядом
   KFold, на итоге шкала показывает среднее, полосу ± и разброс от худшей кучки до лучшей. */
.col {
  grid-template-columns: 1fr;
}
.runlog {
  position: relative;
  gap: 1.5rem;
  padding-left: 1.6rem;
  margin-top: 0.4rem;
}
/* линия журнала */
.runlog::before {
  content: "";
  position: absolute;
  left: 0.35rem;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 4px;
  background: repeating-linear-gradient(180deg, #3a3160 0 8px, transparent 8px 12px);
}
.runlog .card {
  padding-top: 0.95rem;
}
/* ярлык попытки на рамке: декоративный, из data-tag */
.runlog .card::before {
  content: attr(data-tag);
  position: absolute;
  top: -0.85rem;
  left: 0.7rem;
  padding: 0.1rem 0.4rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1;
  letter-spacing: 0.06em;
  color: #07040f;
  background: var(--lvl-accent);
}
.runlog .card.no::before { background: var(--pa-red); }
.runlog .card.ok::before { background: var(--pa-lime); }
/* узел на линии журнала */
.runlog .card::after {
  content: "";
  position: absolute;
  left: calc(-1.6rem + 0.35rem - 5px);
  top: 1rem;
  width: 14px;
  height: 14px;
  background: var(--lvl-accent);
  box-shadow: 0 0 0 3px #07040f;
}
.runlog .card.no::after { background: var(--pa-red); }
.runlog .card.ok::after { background: var(--pa-lime); box-shadow: 0 0 0 3px #07040f, 0 0 10px var(--pa-lime); }
.runlog .card:not(.slidev-vclick-hidden) {
  animation: log-in 0.35s steps(4, end);
}
@keyframes log-in {
  from { transform: translateX(-12px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.arena {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
@media (prefers-reduced-motion: reduce) {
  .runlog .card { animation: none !important; }
}
</style>

<!--
Теперь про то, как не обмануть себя. Итак, контрольная — задачи, которые прячем от сети на тренировке.
[click] Сначала контрольной у нас была одна story, и сеть угадала на ней сто процентов. Радость длилась недолго: слишком хорошо, чтобы быть правдой. Одна story — это одна задача на контрольной. Повезло с задачей — и вот пятёрка.
[click] Поэтому сделали по-честному. Делим story на пять кучек. Story у нас тогда было всего 12, так что в кучке две-три story. Учим сеть на четырёх кучках, а пятую прячем для контрольной. Справа: книжки — учебник, колба — контрольная.
[click] Потом учим заново, уже с другой спрятанной кучкой.
[click] И так пять раз, пока каждая кучка не побывает контрольной. Это называется k-fold. Получается пять проверочных сетей, у каждой своя контрольная. Кучки собираем без случайности, по хешу имени story: запустишь ещё раз — получишь те же кучки.
[click] Итог: в среднем восемьдесят процентов попаданий, а не сто, плюс-минус шестнадцать. Разброс между кучками — от 62 до 100. Кажется, что-то слабовато. И этот разброс — та самая зубрёжка: на одних кучках сеть узнаёт знакомое, на других теряется. Дальше — три попытки её вылечить.
-->

---
layout: two-cols
level: 5
variant: 13
leftWidth: 46%
clicks: 2
---

::header::
## Когда остановить тренировку

<T5TryTag :n="1" />

::default::

<div class="cards col coach">
  <div class="card">После каждой эпохи пишем контрольную. Результат три эпохи подряд не стал лучше: стоп, берём лучшую версию. Это <b>ранняя остановка</b></div>
  <div class="card no" v-click="1">В трёх кучках из пяти лучший loss был после первой эпохи, хотя попаданий становилось больше</div>
  <div class="card" v-click="2">loss сильно наказывает за «уверенные ошибки», а попаданию важно только, правильный ли самый яркий ответ</div>
</div>

::right::

<div class="monitor" :data-step="$clicks">
  <div class="legend" aria-hidden="true">
    <span class="lg loss"><i />loss</span>
    <span class="lg hits"><i />попадания</span>
  </div>
  <div class="mon-screen">
    <LineChart
      :series="[
        { points: [0.25, 0.36, 0.3, 0.33, 0.38], color: '#ff6b6b', label: 'loss', show: $clicks >= 1 },
        { points: [0.61, 0.66, 0.7, 0.74, 0.73], color: '#56ff71', label: 'попадания', show: $clicks >= 1 },
      ]"
      :marker="{ x: 0, label: '', show: $clicks >= 1 }"
      :width="400"
      :height="300"
    />
    <div class="patience" aria-hidden="true"><span>PATIENCE 3</span></div>
    <div class="best-ring" aria-hidden="true" />
  </div>
  <div class="judge" aria-hidden="true">
    <div class="jrow loss">
      <i class="best">★</i><i class="bad">1</i><i class="bad">2</i><i class="bad">3</i><i class="halt">STOP</i>
    </div>
    <div class="jrow hits">
      <i class="off">·</i><i class="up">▲</i><i class="up">▲</i><i class="best">★</i><i class="off">·</i>
    </div>
  </div>
</div>

<style scoped>
/* Сцена «монитор тренера»: справа экран обучения, слева реплики тренера пузырями.
   Под графиком табло судей по эпохам. Клик 1 — судья LOSS: лучший loss на эпохе 1,
   три эпохи без улучшения (терпение) и свисток STOP, хотя линия попаданий растёт.
   Клик 2 — судья HITS: попадания растут до эпохи 4, лучшая версия там обведена ярким кольцом.
   Подписи линий вынесены в легенду над экраном: на самом графике они мешали. */
.col {
  grid-template-columns: 1fr;
}
.coach {
  gap: 0.75rem;
}
/* реплики тренера: пузырь с хвостиком в сторону монитора */
.coach .card {
  padding: 0.6rem 0.85rem;
  font-size: 1.0625rem;
  line-height: 1.38;
}
.coach .card::before {
  content: "";
  position: absolute;
  right: -16px;
  top: 1rem;
  width: 12px;
  height: 12px;
  background: var(--pa-frame);
  box-shadow: 4px 4px 0 0 var(--pa-frame);
}
.monitor {
  position: relative;
  margin-top: -0.3rem;
}
.mon-screen {
  position: relative;
  width: 400px;
  height: 300px;
  padding: 0;
  background: rgba(11, 7, 24, 0.78);
  box-shadow:
    0 0 0 3px #07040f,
    0 0 0 6px var(--pa-line);
}
/* Обход ошибки LineChart: у пикселей с некоторыми задержками анимация steps(1, end) завершается
   с прогрессом 0.9999… и остаётся в первом кадре (opacity 0), в линии появляется дыра.
   Линейная прорисовка за 10 мс выглядит так же, но доходит до 1. */
.mon-screen :deep(.lc-series:not(.lc-off) .lc-px),
.mon-screen :deep(.lc-series:not(.lc-off) .lc-dot),
.mon-screen :deep(.lc-series:not(.lc-off) .lc-lbl) {
  animation: t5-px 0.01s linear var(--d) both;
}
@keyframes t5-px {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* окно терпения: эпохи 2–4 без улучшения loss (x = 20 + 90·i) */
.patience {
  position: absolute;
  left: 65px;
  top: 14px;
  width: 270px;
  height: 242px;
  opacity: 0;
  background: repeating-linear-gradient(45deg, rgba(255, 77, 109, 0.16) 0 6px, transparent 6px 12px);
  box-shadow: inset 0 0 0 2px rgba(255, 77, 109, 0.6);
  transition: opacity 0.3s steps(3, end);
}
.patience span {
  position: absolute;
  top: 4px;
  right: 6px;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-red);
}
.monitor[data-step="1"] .patience { opacity: 1; }
/* подписи линий — легенда над экраном, в зазоре под заголовком; на графике их нет */
.mon-screen :deep(.lc-lbl) {
  display: none;
}
.legend {
  position: absolute;
  left: 0;
  top: -1.9rem;
  display: flex;
  gap: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s steps(3, end);
}
.monitor:not([data-step="0"]) .legend { opacity: 1; }
.lg {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.375rem;
  line-height: 1;
}
.lg i {
  width: 26px;
  height: 6px;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}
.lg.loss { color: var(--pa-red); }
.lg.hits { color: var(--pa-lime); }
/* лучшая версия по попаданиям: яркий кружок вокруг точки эпохи 4,
   центр x = 20 + 90·3 = 290, y(0.74) = 20 + 0.26·236 ≈ 81 */
.best-ring {
  position: absolute;
  left: calc(290px - 15px);
  top: calc(81px - 15px);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  opacity: 0;
  box-shadow:
    0 0 0 4px var(--pa-yellow),
    0 0 18px 8px rgba(255, 225, 62, 0.6);
}
.monitor[data-step="2"] .best-ring {
  opacity: 1;
  animation: ring-in 0.5s steps(5, end), ring-pulse 1.2s steps(2, end) 0.5s infinite;
}
@keyframes ring-in { from { transform: scale(2.2); opacity: 0; } }
@keyframes ring-pulse { 50% { transform: scale(1.15); } }
/* табло судей: клетки строго под эпохами графика */
.judge {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 0.75rem;
}
.jrow {
  position: relative;
  height: 30px;
  width: 400px;
  opacity: 0;
  transition: opacity 0.3s steps(3, end);
}
.monitor:not([data-step="0"]) .jrow.loss,
.monitor[data-step="2"] .jrow.hits { opacity: 1; }
.monitor[data-step="2"] .jrow.loss { opacity: 0.45; }
.jrow i {
  position: absolute;
  top: 0;
  width: 34px;
  height: 30px;
  margin-left: -17px;
  display: grid;
  place-items: center;
  font-style: normal;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  background: #241c40;
  color: var(--pa-text-dim);
}
.jrow i:nth-of-type(1) { left: 20px; }
.jrow i:nth-of-type(2) { left: 110px; }
.jrow i:nth-of-type(3) { left: 200px; }
.jrow i:nth-of-type(4) { left: 290px; }
.jrow i:nth-of-type(5) { left: 380px; }
.jrow i.bad { color: #07040f; background: var(--pa-red); }
.jrow i.up { color: #07040f; background: var(--pa-lime); }
.loss i.best { color: #07040f; background: #ff6b6b; }
.hits i.best { color: #07040f; background: var(--pa-lime); box-shadow: 0 0 10px var(--pa-lime); }
.jrow i.off { opacity: 0.5; }
/* свисток: после третьей эпохи без улучшения обучение останавливается, эпоха 5 не наступает */
.loss i.halt {
  width: 64px;
  margin-left: -32px;
  color: var(--pa-text);
  background: var(--pa-red);
  box-shadow: 0 0 10px rgba(255, 77, 109, 0.7);
}
.monitor[data-step="1"] .loss i {
  animation: j-in 0.3s steps(3, end) both;
}
.monitor[data-step="1"] .loss i:nth-of-type(2) { animation-delay: 0.1s; }
.monitor[data-step="1"] .loss i:nth-of-type(3) { animation-delay: 0.2s; }
.monitor[data-step="1"] .loss i:nth-of-type(4) { animation-delay: 0.3s; }
.monitor[data-step="1"] .loss i:nth-of-type(5) { animation-delay: 0.4s; }
@keyframes j-in { from { transform: scale(0.4); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .monitor * { animation: none !important; transition: none !important; }
}
/* подпись оси «эпоха» убрана: мелко, номера эпох остаются */
:deep(.lc-end) {
  display: none;
}
</style>

<!--
Попытка первая: вовремя остановиться. Сколько учить? После каждой эпохи сеть пишет контрольную на отложенной кучке. Если результат контрольной три эпохи подряд не стал лучше, останавливаемся и берём лучшую версию. Это ранняя остановка, а тройка — терпение, patience. Написали её сами, лучшую версию запоминаем через model.getWeights.
Но по какому числу решать, что стало лучше: по loss или по попаданиям?
[click] Сначала решали по loss. И в трёх кучках из пяти лучший loss был уже после первой эпохи: сеть останавливалась почти сразу. Помните правило «ошибка на контрольной растёт — сеть зубрит»? Здесь оно обманывает: красная линия испортилась, а попаданий, зелёная линия, всё больше.
[click] Почему? Loss сильно наказывает за уверенные ошибки, а попаданию важно одно: правильный ли самый яркий ответ. Сеть может отвечать правильно всё чаще, но в оставшихся ошибках становиться самоувереннее, и loss растёт. Учится сеть всё равно по loss: он меняется плавно и подсказывает, куда крутить веса. А решать, когда остановиться, надо по попаданиям. Переключили остановку на попадания — и стало 85 и 89 процентов в двух повторах. Разница между повторами — шум перезапуска, около 4 пунктов: начальные числа в сети каждый раз случайные, поэтому разницу меньше 4 пунктов считаем «не отличить».
-->

---
layout: simple-slide
level: 5
variant: 13
hide: true
---

## Когда остановить тренировку

<div class="cards two">
  <div class="card ok" v-click="1">
    Стали останавливаться по попаданиям — по тому же, по чему судим сеть
    <div class="nums"><span class="gnum">~80 %</span> → <span class="gnum">85 %</span> и <span class="gnum">89 %</span></div>
  </div>
  <div class="card" v-click="2">
    <div class="ico"><tabler-ball-basketball /></div>
    Одна и та же сеть, одинаковые настройки, два раза: 85 и 89 %. Шум перезапуска — 4 пункта, как два броска мяча одной рукой
  </div>
</div>

<T5Throws class="court" :step="$clicks" />

<p v-click="3" class="noise">Разницу меньше 4 пунктов считаем <span v-mark.circle.orange="3">«не отличить»</span></p>

<style scoped>
/* Сцена «два броска»: под репликами шкала попаданий как площадка. Клик 1 — старый флажок ~80
   и метки 85 и 89, клик 2 — два броска одной рукой ложатся в разные места, клик 3 — полоса
   шума шириной 4 пункта: всё, что внутри неё, «не отличить». */
.two {
  grid-template-columns: 1fr 1fr;
}
.two .card {
  padding: 0.7rem 1rem;
}
.nums {
  margin-top: 0.6rem;
  font-size: 1.6rem;
}
.nums .gnum {
  font-size: 2.6rem;
}
.court {
  margin-top: 0.6rem;
}
.noise {
  margin-top: 0.4rem;
  font-size: 1.5rem;
}
</style>

<!--
[click] Тогда стали останавливаться по той же оценке, по которой потом судим сеть. Было около 80 процентов, как на k-fold, стало 85 и 89 в двух повторах. Правило простое: чем меряешь результат, тем и решай, когда остановиться. В коде это один флаг: --stop-metric top1pair, то есть остановка по попаданиям.
[click] А откуда два числа? Это отдельный урок про измерения. Мы обучили одну и ту же сеть с одинаковыми настройками дважды и получили 85 и 89. Начальные числа в сети каждый раз случайные. Поэтому даже простой перезапуск даёт другое число — это шум перезапуска, у нас примерно 4 пункта. Как два броска мяча одной рукой: рука та же, а мяч падает в разные места.
[click] Поэтому разницу меньше 4 пунктов считаем «не отличить». Наш прирост как раз на границе шума. Но в обоих повторах он одного знака, вверх, поэтому мы ему верим.
-->

---
layout: two-cols
level: 5
variant: 30
leftWidth: 50%
clicks: 4
hide: true
---

::header::
## Какая сеть идёт в тесты

::default::

<KFold :step="$clicks >= 3 ? 6 : $clicks >= 1 ? 5 : 0" :values="['6 эп.', '9 эп.', '10 эп.', '4 эп.', '6 эп.']" final final-value="6 эп. → в тесты" />

::right::

<div class="cards col pick">
  <div class="card" v-click="1">У каждой проверочной сети своя лучшая эпоха</div>
  <div class="card" v-click="2">
    Берём середину, а не среднее
    <div class="median">
      <span data-f="F4" style="--s: 3">4</span><span data-f="F1" style="--s: -1">6</span><span class="mid" data-f="F5" style="--s: 2">6</span><span data-f="F2" style="--s: -2">9</span><span data-f="F3" style="--s: -2">10</span>
    </div>
  </div>
  <div class="card ok" v-click="3">Итоговая сеть учится на всех пяти кучках ровно 6 эпох: контрольной у неё нет</div>
</div>

<p v-click="4" class="sub">Пять проверочных дают честные проценты. Работает итоговая</p>

<style scoped>
/* Сцена «отбор в основной состав»: слева раунды k-fold со своей лучшей эпохой, справа отбор.
   Клик 2 — плитки эпох приезжают в порядке раундов (6, 9, 10, 4, 6) и сортируются на глазах,
   середина поднимается и загорается: это и есть медиана. Клик 3 — итоговый ряд KFold. */
.col {
  grid-template-columns: 1fr;
  gap: 0.7rem;
}
.median {
  display: flex;
  gap: 8px;
  margin-top: 0.6rem;
  padding-bottom: 1.4rem;
}
.median span {
  position: relative;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-display);
  font-size: 1.125rem;
  font-weight: 400;
  background: #241c40;
  box-shadow: 0 0 0 3px var(--pa-line);
}
/* номер раунда под плиткой: декоративный, из data-f */
.median span::after {
  content: attr(data-f);
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text-dim);
}
.median .mid {
  color: #07040f;
  background: var(--color-green);
  box-shadow: 0 0 0 3px var(--color-green), 0 0 12px var(--color-green);
}
/* сортировка: плитка стартует со своего места в порядке раундов и едет на место по порядку */
.pick .card:not(.slidev-vclick-hidden) .median span {
  animation: med-sort 0.9s steps(6, end) both;
}
.pick .card:not(.slidev-vclick-hidden) .median .mid {
  animation: med-sort 0.9s steps(6, end) both, med-lift 0.3s steps(3, end) 0.9s both;
}
@keyframes med-sort {
  0%, 25% { transform: translateX(calc(var(--s) * 56px)); }
  100% { transform: none; }
}
@keyframes med-lift {
  from { transform: none; }
  to { transform: translateY(-6px); }
}
@media (prefers-reduced-motion: reduce) {
  .pick .card .median span { animation: none !important; }
}
</style>

<!--
У нас пять проверочных сетей, и у каждой своя ранняя остановка. Отсюда вопрос: а какая сеть пойдёт работать в тесты? Ни одна из пяти: каждая видела только четыре кучки из пяти. Их работа — дать честную оценку.
[click] Каждая проверочная остановилась на своей лучшей эпохе. Вот числа из нашего финального прогона, на всех данных, о которых я расскажу дальше: 6, 9, 10, 4 и 6. Кучки разные, поэтому и эпохи разные — это нормально.
[click] Выстроим их по порядку: 4, 6, 6, 9, 10. В середине стоит 6. Почему середина, а не среднее? Если бы одна кучка оказалась странной и выдала тридцать эпох, среднее уехало бы далеко, а середина почти не сдвинется. Одна странная кучка не решает за всех.
[click] И теперь итоговая сеть, нижний ряд. Она учится на всех пяти кучках сразу — видит все примеры, ничего не прячет. Но раз контрольной нет, сама понять, когда остановиться, она не может. Поэтому мы говорим ей: учись ровно 6 эпох, как подсказали пять проверочных.
[click] Итого: пять проверочных сетей нужны только для честных процентов — все цифры доклада это их оценки. А в тесты отправляется итоговая. Весь прогон — около двух часов на ноутбуке с RTX 4070. Схема готова, но сама сеть пока зубрит: разброс между кучками большой. Чем это лечить?
-->
---
layout: simple-slide
level: 5
variant: 13
---

## Против зубрёжки

<T5TryTag :n="2" />

<div class="cards two">
  <div class="card item" v-click="1"><T5Regularizer kind="dropout" /><div class="txt"><div class="ico"><tabler-plug-connected-x /></div><b>dropout</b>: на тренировке случайно «выключать» часть сети, чтобы она не опиралась на одни и те же числа</div></div>
  <div class="card item" v-click="1"><T5Regularizer kind="l2" /><div class="txt"><div class="ico"><tabler-scale /></div><b>L2</b>: штрафовать слишком большие числа</div></div>
</div>

<div v-click="2" class="minus">
  <span class="bad gnum-bad">81 %</span>
  <span>было 85–89 %</span>
  <div class="meter" aria-hidden="true">
    <div class="m-track">
      <div class="m-was"></div>
      <div class="m-now" />
      <i v-for="t in [70, 75, 80, 85, 90, 95]" :key="t" class="m-tick" :style="{ left: `${(t - 70) * 4}%` }" />
    </div>
  </div>
</div>

<p v-click="3" class="lesson">Проблема в том, <span v-mark.underline.green="3">на чём сеть учится</span></p>

<style scoped>
/* Сцена «пауэрапы»: два приёма подобраны как бонусы, у каждого живая мини-схема
   (dropout гасит случайные нейроны, L2 прижимает большие веса к границе).
   Клик 2 — дебафф: шкала попаданий падает из коридора 85–89 до 81. */
.two {
  grid-template-columns: 1.4fr 1fr;
}
.item {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding-top: 1.4rem;
  padding-bottom: 1.4rem;
}
.item :deep(.t5-reg) {
  zoom: 1.3;
}
/* пауэрап «подбирается»: падает в слот и мигает рамкой */
.item:not(.slidev-vclick-hidden) {
  animation: pick 0.5s steps(5, end);
}
@keyframes pick {
  0% { transform: translateY(-16px); opacity: 0; }
  60% { transform: translateY(3px); opacity: 1; }
  100% { transform: none; }
}
.txt .ico {
  float: right;
}
.minus {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-top: 2.2rem;
  font-size: 1.5rem;
}
.gnum-bad {
  font-size: 4rem;
  font-weight: 800;
}
/* шкала попаданий 70–95 %: коридор прежних повторов и падение до 81 */
.meter {
  width: 25rem;
  flex-shrink: 0;
  align-self: center;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-left: 0.6rem;
  padding-bottom: 1.2rem;
}
.m-track {
  position: relative;
  width: 18rem;
  height: 22px;
  background: repeating-linear-gradient(90deg, #241c40 0 10px, #0b0718 10px 13px);
  box-shadow: 0 0 0 3px #3a3160, 0 0 0 6px #07040f;
}
.m-was {
  position: absolute;
  left: calc((85 - 70) * 4%);
  width: calc(4 * 4%);
  top: -10px;
  bottom: -10px;
  background: repeating-linear-gradient(45deg, rgba(157, 255, 62, 0.35) 0 4px, transparent 4px 8px);
  box-shadow: inset 0 0 0 2px var(--pa-lime);
}
.m-now {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: calc((81 - 70) * 4%);
  background: repeating-linear-gradient(90deg, var(--pa-red) 0 10px, transparent 10px 13px);
  filter: drop-shadow(0 0 4px rgba(255, 77, 109, 0.8));
}
/* при показе шкала стоит в коридоре и ступеньками проваливается до 81 */
.minus:not(.slidev-vclick-hidden) .m-now {
  animation: m-drop 0.9s steps(6, end) 0.15s both;
}
@keyframes m-drop {
  from { width: calc((87 - 70) * 4%); background-color: transparent; }
}
.m-tick {
  position: absolute;
  top: 100%;
  width: 3px;
  height: 8px;
  margin-left: -1px;
  background: #6d6496;
}
@keyframes tag-blink { 50% { opacity: 0.2; } }
.lesson {
  font-size: 1.6rem;
  margin-top: 1.4rem;
}
@media (prefers-reduced-motion: reduce) {
  .item, .m-now { animation: none !important; }
}
</style>

<!--
Попытка вторая. Разброс между кучками всё ещё большой. Даже после новой остановки одна кучка даёт почти сто, а другая — под семьдесят. Сеть запоминает вид конкретных компонентов. Мы попробовали специальные приёмы против зубрёжки.
[click] Dropout: на тренировке случайно выключаем часть сети, чтобы она не опиралась на одни и те же числа. Как если бы на тренировке по футболу случайным игрокам завязывали глаза — команда учится не зависеть от одного звёздного игрока. И L2: штрафуем сеть за слишком большие числа, чтобы она не цеплялась за отдельные детали. Оба приёма в TensorFlow.js готовые — tf.layers.dropout и tf.regularizers.l2, — у нас они включаются флагами --dropout и --l2.
[click] Результат — стало хуже: 81 процент, ниже обоих повторов 85 и 89. Это больше шума перезапуска, так что это не случайность.
[click] Вывод важный: проблема не в том, как сеть учится, а в том, на чём она учится. Лечить надо не сеть, а данные. Об этом следующий слайд.
-->

---
layout: simple-slide
level: 5
variant: 26
---

## Нейросети как дети

<T5TryTag :n="3" win />

<p class="motto" v-click="1">Меньше строгости, больше разнообразия</p>

<div class="growth">
  <div class="tile no" v-click="2">
    <div class="hero"><span class="gnum">12</span><span class="unit">story</span><T5Bot class="kid" :cell="3" /></div>
    Зубрёжка была оттого, что задачек мало
    <T5StoryGrid class="sg" mode="few" />
  </div>
  <div class="arrow" v-click="3"><tabler-arrow-right /></div>
  <div class="tile ok" v-click="3">
    <span class="lvl" aria-hidden="true">LEVEL UP!</span>
    <div class="hero"><span class="gnum">54</span><span class="unit">story</span><T5Bot class="kid big" :cell="5" pose="cheer" /></div>
    18 состояний и у каждого ещё два варианта со своим шрифтом, фоном и размером текста
    <T5StoryGrid class="sg" mode="many" />
    <div class="variants">
      <span style="font-family: Inter, sans-serif">Aa</span>
      <span style="font-family: Roboto, Arial, sans-serif">Aa</span>
      <span style="font-family: Lora, Georgia, serif">Aa</span>
      <span class="light">Aa</span>
      <span class="small">Aa</span>
    </div>
  </div>
</div>

<style scoped>
/* Сцена «персонаж растёт»: тот же робот-сеть слева маленький над 12 story, справа вырос
   над 54. Сетки мини-карточек показывают, откуда рост: цвет — компонент, 6 × 2 состояния
   слева; справа 18 состояний и под каждым два варианта окружения (светлый фон, другой шрифт). */
.motto {
  font-size: 1.6rem;
  color: var(--color-cyan);
  margin: 0;
}
.motto::before {
  content: "TIP ▸ ";
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  color: var(--pa-yellow);
}
.growth {
  display: grid;
  grid-template-columns: 1fr auto 1.55fr;
  gap: 1rem;
  align-items: stretch;
  margin-top: 0.8rem;
}
.growth .tile {
  min-height: 290px;
  padding: 1.1rem 1.2rem;
}
.growth .hero {
  align-items: flex-end;
}
.kid {
  margin-left: auto;
  align-self: flex-end;
}
.growth .arrow {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  font-size: 2.4rem;
  color: var(--color-cyan);
}
.tile .lvl {
  z-index: 2;
  position: absolute;
  top: -0.9rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-yellow);
  box-shadow: 0 0 0 3px #07040f, 0 0 12px rgba(255, 225, 62, 0.8);
  white-space: nowrap;
}
.tile:not(.slidev-vclick-hidden) .lvl {
  animation: lv-in 0.4s steps(4, end) 0.2s both;
}
@keyframes lv-in {
  from { transform: translate(-50%, -12px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
@keyframes lv-blink { 50% { opacity: 0.2; } }
/* рост: персонаж справа «вырастает» при показе */
.tile.ok:not(.slidev-vclick-hidden) .big {
  animation: grow 0.6s steps(4, end);
  transform-origin: 50% 100%;
}
@keyframes grow {
  from { transform: scale(0.6); }
  to { transform: none; }
}
.sg {
  margin-top: auto;
}
/* сетки story собираются клетками только в момент показа плитки */
.tile.slidev-vclick-hidden :deep(.sg-cells i) {
  animation: none;
}
.unit {
  font-size: 1.4rem;
  font-weight: 700;
}
.variants {
  display: flex;
  gap: 0.6rem;
}
.variants span {
  font-size: 1.8rem;
  padding: 0.2rem 0.7rem;
  border-radius: 0;
  border: 0;
  box-shadow: 0 0 0 3px var(--dd-card-border);
  background: rgba(255, 255, 255, 0.04);
}
.variants .light {
  background: #f1f1f1;
  color: #222;
}
.variants .small {
  font-size: 1.3rem;
  align-self: flex-end;
}
@media (prefers-reduced-motion: reduce) {
  .tile .lvl, .big { animation: none !important; }
}
</style>

<!--
Попытка третья — данные. Нейросети в этом смысле — как дети.
[click] Им нужно меньше строгости и больше разнообразия. Ребёнок, который видел только одну собаку, решит, что все собаки — таксы.
[click] Зубрёжка у нас была оттого, что задачек мало: всего 12 story — шесть компонентов, у каждого по два состояния. Сеть просто запоминала их внешний вид.
[click] Мы сделали 54. Сначала добавили каждому компоненту ещё одно состояние, получилось 18. А потом к каждому состоянию — ещё два варианта, в каждом своя комбинация: шрифт Inter, Roboto или Lora, светлый или тёмный фон вокруг компонента, текст 16 или 18 пикселей. 18 исходных плюс 36 вариантов — 54. Сами компоненты не перекрашиваются, меняется окружение. Компоненты те же самые, а картинки разные. Так сеть учится смотреть на суть — на то, что поменялось, — а не на конкретный шрифт. Технически это просто дополнительные story в Storybook. И важно: все варианты одной story всегда лежат в одной кучке k-fold. Иначе сеть узнавала бы на контрольной ту же вёрстку в другом шрифте.
-->

---
layout: simple-slide
level: 5
variant: 26
---

## Нейросети как дети

<div class="three">
  <div class="srow" v-click="1">
    <div class="t-ico"><tabler-equal /></div>
    <span class="gnum">90 %</span>
    <div class="bar" aria-hidden="true">
      <div class="ghost" style="left: 75%; width: 6.67%" />
      <div class="pin" style="left: 83.33%" />
    </div>
    <div class="txt">Среднее почти не поменялось</div>
  </div>
  <div class="srow" v-click="2">
    <div class="t-ico"><tabler-arrows-minimize /></div>
    <span class="gnum div">÷3</span>
    <div class="bar" aria-hidden="true">
      <div class="ghost wide" style="left: 46.67%; width: 53.33%" />
      <div class="band squeeze" style="left: 71.67%; width: 16.67%" />
    </div>
    <div class="txt">Разброс между кучками сжался втрое: было 68–100, стало 83–93</div>
  </div>
  <div class="srow ok" v-click="3">
    <div class="t-ico"><logos-vuetifyjs /></div>
    <span class="gnum">47 → 81 %</span>
    <div class="bar" aria-hidden="true">
      <div class="fill grow" style="width: 68.33%" />
      <div class="pin was" style="left: 11.67%" />
    </div>
    <div class="txt">Сеть стала лучше понимать чужие компоненты Vuetify, которых никогда не видела</div>
  </div>
</div>

<style scoped>
/* Сцена «экран характеристик после прокачки»: три стата открываются по кликам, у каждого
   своя шкала 40–100 %. Среднее: прежний коридор 85–89 и новое 90 почти рядом. Разброс:
   широкая красная полоса 68–100 сжимается в лаймовую 83–93. Vuetify: шкала растёт с 47 до 81. */
.three {
  --gn-w: 11.75rem;
  --bar-w: 16rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 0.6rem;
  padding: 1rem 1.2rem 2.6rem;
  background: rgba(11, 7, 24, 0.82);
  box-shadow:
    0 -4px 0 0 var(--pa-line),
    0 4px 0 0 var(--pa-line),
    -4px 0 0 0 var(--pa-line),
    4px 0 0 0 var(--pa-line);
}
.srow {
  display: grid;
  grid-template-columns: 2.4rem var(--gn-w) var(--bar-w) 1fr;
  align-items: center;
  column-gap: 1.1rem;
  min-height: 84px;
}
.srow + .srow {
  padding-top: 1.1rem;
  box-shadow: 0 -2px 0 0 #241c40;
}
.srow .t-ico {
  font-size: 2.2rem;
  line-height: 1;
  color: var(--lvl-accent);
}
.srow.ok .t-ico { color: var(--pa-lime); }
.srow .gnum {
  font-size: 3rem;
  white-space: nowrap;
}
/* у Handjet знак «÷» похож на «+»: этот стат набираем моноширинным, где деление читается однозначно */
.srow .gnum.div {
  font-family: var(--pa-font-body);
  font-weight: 800;
  font-size: 2.6rem;
}
.txt {
  font-size: 1rem;
  line-height: 1.35;
}
.srow.ok .txt { color: var(--pa-text); }
/* шкала стата 40–100 */
.bar {
  position: relative;
  height: 24px;
  background: repeating-linear-gradient(90deg, #241c40 0 10px, #0b0718 10px 13px);
  box-shadow: 0 0 0 3px #3a3160, 0 0 0 6px #07040f;
}
.ghost {
  position: absolute;
  top: -6px;
  bottom: -6px;
  background: repeating-linear-gradient(45deg, rgba(185, 176, 214, 0.35) 0 4px, transparent 4px 8px);
  box-shadow: inset 0 0 0 2px #6d6496;
}
.ghost.wide {
  background: repeating-linear-gradient(45deg, rgba(255, 77, 109, 0.35) 0 4px, transparent 4px 8px);
  box-shadow: inset 0 0 0 2px var(--pa-red);
}
.pin {
  position: absolute;
  top: -10px;
  bottom: -10px;
  width: 6px;
  margin-left: -3px;
  background: var(--lvl-accent);
  box-shadow: 0 0 10px var(--lvl-accent);
}
.pin.was {
  background: #6d6496;
  box-shadow: none;
}
.band {
  position: absolute;
  top: -6px;
  bottom: -6px;
  background: var(--pa-lime);
  box-shadow: 0 0 12px var(--pa-lime);
}
.fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: repeating-linear-gradient(90deg, var(--pa-lime) 0 10px, transparent 10px 13px);
  filter: drop-shadow(0 0 4px rgba(157, 255, 62, 0.8));
}
/* при показе: разброс сжимается из прежней ширины, шкала Vuetify растёт с 47 */
.srow:not(.slidev-vclick-hidden) .squeeze {
  animation: squeeze 0.9s steps(6, end) 0.15s both;
}
@keyframes squeeze {
  from { left: 46.67%; width: 53.33%; background: var(--pa-red); }
}
.srow:not(.slidev-vclick-hidden) .grow {
  animation: grow-bar 0.9s steps(8, end) 0.15s both;
}
@keyframes grow-bar {
  from { width: 11.67%; }
}
.srow:not(.slidev-vclick-hidden) .pin:not(.was) {
  animation: pin-in 0.4s steps(4, end) both;
}
@keyframes pin-in {
  from { transform: translateY(-14px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .srow * { animation: none !important; }
}
</style>

<!--
Что это дало?
[click] Среднее почти не поменялось: было 85–89, стало 90. На первый взгляд ничего не произошло.
[click] Но разброс между кучками сжался втрое. Раньше одна неудачная кучка давала под семьдесят, теперь все кучки от 83 до 93. Сеть стала не умнее, а стабильнее — и это ровно то, чего ждёшь от данных.
[click] А самое приятное — чужие компоненты. Мы взяли Vuetify, которого сеть никогда не видела. Раньше она угадывала там 47 процентов компонентов, теперь 81. Разнообразие научило сеть узнавать поломку в незнакомой вёрстке.
-->

---
layout: simple-slide
level: 5
variant: 11
---

## Распознаём несколько отличий

<div class="blank" :data-step="$clicks">
  <div class="sheet" v-click="1">
    <div class="sh-head" aria-hidden="true"><span>ANSWER SHEET</span><span class="sh-grade" :class="{ two: $clicks >= 2 }">✓ ×{{ $clicks >= 2 ? 2 : 1 }}</span></div>
    <div class="t-ico"><tabler-clipboard-list /></div>
    Выход сети с самого начала разрешал несколько галочек, но сеть всегда ставила одну: в каждом примере ломали ровно одно свойство
    <div class="ticks">
      <span class="t">☑ color</span>
      <span :class="{ t: $clicks >= 2 }">{{ $clicks >= 2 ? '☑' : '☐' }} font-weight</span>
      <span>☐ letter-spacing</span><span>☐ line-height</span><span>☐ border</span>
    </div>
  </div>
  <div class="tile ok" v-click="2">
    <div class="t-ico"><tabler-checks /></div>
    <span class="gnum">0 → 59 %</span>
    Добавили половину примеров с двумя поломками: сеть называет ровно оба свойства, а на обычных хуже не стала
    <div class="dbl" aria-hidden="true">
      <div class="dbl-bar"><i /></div>
    </div>
  </div>
</div>

<style scoped>
/* Сцена «бланк ответов»: слева лист теста, где сеть отмечает свойства. Клик 1 — всегда одна
   галочка, хотя клеток пять. Клик 2 — штамп второй галочки на font-weight и справа шкала
   двойных попаданий, которая набирается от нуля до 59 %. */
.blank {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.2rem;
  margin-top: 0.6rem;
}
.blank .tile,
.blank .sheet {
  min-height: 330px;
}
/* лист бланка: бумажный лист теста с линовкой, тёмные чернила */
.sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0 1.4rem 1.2rem;
  color: #1a1236;
  background:
    repeating-linear-gradient(180deg, transparent 0 27px, rgba(58, 49, 96, 0.14) 27px 29px) 0 3rem / 100% 100% no-repeat,
    #ece6f7;
  box-shadow:
    0 -4px 0 0 #07040f,
    0 4px 0 0 #07040f,
    -4px 0 0 0 #07040f,
    4px 0 0 0 #07040f,
    8px 8px 0 0 rgba(255, 77, 109, 0.55);
}
.sh-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 -1.4rem 0.2rem;
  padding: 0.35rem 1.4rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  letter-spacing: 0.08em;
  color: #ece6f7;
  background: #3a3160;
}
.sh-grade {
  padding: 0.1rem 0.4rem;
  color: #fff;
  background: var(--pa-red);
}
.sheet .t-ico {
  position: absolute;
  right: 1rem;
  top: 2.6rem;
  font-size: 2.2rem;
  line-height: 1;
  color: #c4183c;
}
.ticks {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: auto;
  font-family: "JetBrains Mono", Consolas, monospace;
}
.ticks span {
  align-self: flex-start;
  font-size: 1.1rem;
  line-height: 1.3;
  padding: 0.1rem 0.6rem;
  color: #4a4170;
  box-shadow: inset 3px 0 0 0 #b9b0d6;
}
.ticks .t {
  color: #0f5a12;
  font-weight: 700;
  background: rgba(46, 160, 40, 0.18);
  box-shadow: inset 3px 0 0 0 #2ea028;
}
.sh-grade.two {
  background: #2ea028;
  animation: stamp 0.45s steps(4, end);
}
/* вторая галочка ставится «штампом» в момент клика 2 */
.blank[data-step="2"] .ticks span:nth-child(2) {
  animation: stamp 0.45s steps(4, end);
}
@keyframes stamp {
  0% { transform: scale(1.6) rotate(-6deg); opacity: 0; }
  60% { transform: scale(0.94); opacity: 1; }
  100% { transform: none; }
}
.blank .gnum {
  font-size: 3.6rem;
  margin: 0.4rem 0;
}
/* шкала двойных попаданий 0 → 59 % */
.dbl {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}
.dbl-bar {
  position: relative;
  flex: 1;
  height: 22px;
  background: repeating-linear-gradient(90deg, #241c40 0 10px, #0b0718 10px 13px);
  box-shadow: 0 0 0 3px #3a3160, 0 0 0 6px #07040f;
}
.dbl-bar i {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 59%;
  background: repeating-linear-gradient(90deg, var(--pa-lime) 0 10px, transparent 10px 13px);
  filter: drop-shadow(0 0 4px rgba(157, 255, 62, 0.8));
}
.tile:not(.slidev-vclick-hidden) .dbl-bar i {
  animation: dbl-grow 0.9s steps(8, end) 0.2s both;
}
@keyframes dbl-grow { from { width: 0; } }
@media (prefers-reduced-motion: reduce) {
  .ticks span, .dbl-bar i { animation: none !important; }
}
</style>

<!--
Теперь вспомним лампочки.
[click] Выход сети с самого начала был бланком, где можно отметить несколько вариантов. Но сеть всегда ставила одну галочку. Почему? В обучении в каждом примере было сломано ровно одно свойство. Ученик, решавший только такие тесты, вторую галочку не поставит, даже если правила разрешают.
[click] Лечится это опять данными. В половину примеров добавили вторую поломку — в генераторе это флаг --multi-share 0.5. И сеть научилась: в 59 процентах двойных поломок называет ровно оба свойства, а было ноль. На обычных примерах хуже не стала. Архитектура давала возможность с самого начала, но умение пришло только из данных.
-->
