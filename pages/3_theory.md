---
layout: interjection
level: 3
variant: 2
transition: slide-up
---

<TextBig>
  Теория
</TextBig>

<!--
с данными разобрались, а чтоб перейти к обучению - придётся немного разобраться с фундаментальными понятиями
-->

---
layout: two-cols
level: 3
variant: 11
leftWidth: 46%
---

::header::
## Что такое нейросеть

::default::

<div class="stack">

<div class="neuron-wrap" v-click.hide="3">
  <NeuronSprite :step="$clicks" />
</div>

<figure class="spidey" v-click="3">
  <div class="spidey-frame">
    <img src="/images/slides/spider-man-web.webp" alt="Человек-паук летит на паутине между небоскрёбами ночного города">
    <WebOverlay />
  </div>
  <figcaption>«Великий Человек-паук» (Ultimate Spider-Man), Marvel, 2012</figcaption>
</figure>

</div>

::right::

<div class="skills">
  <div class="skill ok" v-click="1"><div class="bcol"><div class="badge"><tabler-adjustments-horizontal /></div><i class="wire" /></div><div class="txt"><span class="tag">FUNC</span><span>Функция с десятками тысяч чисел-весов, которые обучение подгоняет под примеры</span></div></div>
  <div class="skill" v-click="2"><div class="bcol"><div class="badge"><tabler-brain /></div><i class="wire" /></div><div class="txt"><span class="tag">NEURON</span><span><b>Нейрон</b> — как нервная клетка: складывает входы с весами и «срабатывает» выше порога</span></div></div>
  <div class="skill" v-click="3"><div class="bcol"><div class="badge"><tabler-topology-star-3 /></div><i class="wire" /></div><div class="txt"><span class="tag">NET</span><span><b>Сеть</b> — нейроны слоями: выход одних — вход для следующих</span></div></div>
</div>

<style scoped>
.stack {
  display: grid;
  margin-top: 0.75rem;
}
.stack > * {
  grid-area: 1 / 1;
}
.neuron-wrap {
  width: 400px;
}

/* Человек-паук: «сеть» буквально — кадр в пиксельной рамке, поверх бегут нити паутины */
.spidey {
  width: 400px;
  margin: 0;
}
.spidey-frame {
  position: relative;
  line-height: 0;
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent),
    0 0 1.5rem -0.2rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
}
.spidey img {
  width: 100%;
  display: block;
}
.spidey figcaption {
  margin-top: 0.8rem;
  text-wrap: balance;
  font-size: 1rem;
  line-height: 1.4;
  color: var(--dd-sub);
}

/* дерево навыков: три узла открываются по кликам, провод между ними «заряжается» */
.skills {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.25rem;
}
.skill {
  position: relative;
  display: grid;
  grid-template-columns: 3.25rem 1fr;
  gap: 1rem;
  align-items: start;
  --sk: var(--lvl-accent);
}
.skill.ok {
  --sk: var(--color-green);
}
.bcol {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* провод к следующему узлу: тянется через зазор; горит, когда следующий узел открыт */
.wire {
  flex: 1;
  width: 6px;
  margin: 3px 0 calc(-1.25rem - 3px);
  background: repeating-linear-gradient(180deg, #4a4070 0 6px, transparent 6px 12px);
}
.skill:last-child .wire {
  display: none;
}
.skill:has(+ .skill:not(.slidev-vclick-hidden)) .wire {
  background: repeating-linear-gradient(180deg, var(--sk) 0 6px, transparent 6px 12px);
  filter: drop-shadow(0 0 4px var(--sk));
}
.badge {
  width: 3.25rem;
  height: 3.25rem;
  display: grid;
  place-items: center;
  font-size: 1.9rem;
  color: var(--sk);
  background: color-mix(in srgb, var(--sk) 14%, #0b0718);
  box-shadow:
    0 -3px 0 0 var(--sk),
    0 3px 0 0 var(--sk),
    -3px 0 0 0 var(--sk),
    3px 0 0 0 var(--sk),
    0 0 1.1rem -0.1rem color-mix(in srgb, var(--sk) 55%, transparent);
  filter: drop-shadow(0 0 0.3rem color-mix(in srgb, var(--sk) 40%, transparent));
}
.txt {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  line-height: 1.45;
}
.tag {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.3;
  color: var(--sk);
  text-shadow: 2px 2px 0 #07040f;
}
.skill b {
  color: var(--color-cyan);
}

@media screen and (prefers-reduced-motion: no-preference) {
  /* узел открывается вспышкой, иконка подпрыгивает */
  .skill:not(.slidev-vclick-hidden) .badge {
    animation: sk-unlock 0.6s steps(4, end) both;
  }
  .skill:not(.slidev-vclick-hidden) .tag {
    animation: sk-blink 0.6s steps(2, end) 0.1s 3 both;
  }
  .skill:has(+ .skill:not(.slidev-vclick-hidden)) .wire {
    animation: sk-wire 0.8s steps(4, end) infinite;
  }
}
@keyframes sk-unlock {
  0% {
    transform: scale(0.4);
    background: var(--sk);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes sk-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
/* «ток» бежит по проводу вниз */
@keyframes sk-wire {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 12px;
  }
}
</style>

<!--
Прежде чем учить сеть, договоримся, что это такое.
[click] Нейросеть — это просто функция с огромным количеством ручек-регуляторов. Каждая ручка — число, его называют весом. Во время обучения ручки понемногу подкручиваются, пока функция не начнёт давать правильные ответы на примерах. Правила мы не пишем: показываем тысячи примеров, а сеть подбирает веса сама.
[click] Откуда слово «нейро». Ещё в сороковых был описан искусственный нейрон по образу нервной клетки. Слева он и есть: несколько входов, у каждого свой вес, нейрон их складывает и, если сумма выше порога, срабатывает. Похоже на клетку мозга, которая копит сигналы от соседей и в какой-то момент выстреливает. Сходство на этом и заканчивается: дальше чистая математика.
[click] А «сеть» — потому что таких нейронов много и они соединены слоями: выход одних служит входом для следующих. Сколько слоёв и как они устроены, решаем мы. Какие у них веса, решает обучение.
-->

---
layout: two-cols
level: 3
variant: 12
leftWidth: 46%
---

::header::
## Как считает один нейрон

::default::

<div class="calc-stage">

<NeuronCalc :step="$clicks">
<div class="demo" v-click="5">
  <div class="row"><div class="px" /><div class="px on" /><div class="px" /><span>Σ = 2</span><b class="accent">горит</b></div>
  <div class="row"><div class="px on" /><div class="px on" /><div class="px on" /><span>Σ = 0</span><b class="sub">молчит</b></div>
  <div class="row"><div class="px on" /><div class="px" /><div class="px on" /><span>Σ = −2</span><b class="bad">против</b></div>
</div>
</NeuronCalc>

</div>

::right::

<div class="keys">
  <div class="key-row" v-click="1"><div class="sym">x</div><span><b>Входы</b>: пиксели картинки или выходы прошлого слоя</span></div>
  <div class="key-row" v-click="2"><div class="sym">w</div><span><b>Вес</b> каждого входа: голос «за», «против» или «всё равно»</span></div>
  <div class="key-row" v-click="3"><div class="sym">Σ</div><span><b>Сумма</b>: каждый вход умножаем на его вес и складываем</span></div>
  <div class="key-row ok" v-click="4"><div class="sym">y</div><span><b>Выход</b>: сумма после порога, уходит следующим нейронам</span></div>
</div>

<style scoped>
.calc-stage {
  margin-top: 0.4rem;
}

/* табло раундов: три примера из заметок, активная строка — та, что сейчас крутит автомат */
.demo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.demo .sub {
  margin: 0;
}
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem 0.2rem 1.6rem;
  font-size: 1.125rem;
  background: rgba(14, 8, 32, 0.7);
  box-shadow: inset 3px 0 0 0 #3a3160;
}
/* номер раунда */
.row::before {
  position: absolute;
  left: 0.5rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.125rem;
  color: #6a5f96;
}
.row:nth-child(1)::before {
  content: "1";
}
.row:nth-child(2)::before {
  content: "2";
}
.row:nth-child(3)::before {
  content: "3";
}
.px {
  width: 26px;
  height: 26px;
  background: #160e2e;
  box-shadow: inset 0 0 0 3px #3a3160;
}
.px.on {
  background: #f2ecff;
  box-shadow: inset -3px -3px 0 0 #b9b0d6;
}
.row span {
  margin-left: 0.9rem;
  width: 6rem;
  font-family: var(--pa-font-body);
}
.row b {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.375rem;
  letter-spacing: 0.04em;
}
/* подсветка строки синхронна с раундом автомата: класс r0/r1/r2 ставит NeuronCalc */
.calc-run.r0 .row:nth-child(1),
.calc-run.r1 .row:nth-child(2),
.calc-run.r2 .row:nth-child(3) {
  background: color-mix(in srgb, var(--lvl-accent) 16%, #0e0820);
  box-shadow: inset 3px 0 0 0 var(--lvl-accent);
}
.calc-run.r0 .row:nth-child(1)::before,
.calc-run.r1 .row:nth-child(2)::before,
.calc-run.r2 .row:nth-child(3)::before {
  color: var(--lvl-accent);
}

/* клавиши калькулятора: по клику клавиша «нажимается» и остаётся подсвеченной */
.keys {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 0.4rem;
}
.key-row {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 1rem;
  align-items: center;
  --k: var(--color-cyan);
}
.key-row.ok {
  --k: var(--color-green);
}
.sym {
  width: 3.5rem;
  height: 3.25rem;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1;
  color: #07040f;
  background: var(--k);
  box-shadow:
    inset 4px 4px 0 0 rgba(255, 255, 255, 0.45),
    inset -4px -4px 0 0 rgba(0, 0, 0, 0.25),
    0 6px 0 0 color-mix(in srgb, var(--k) 45%, #07040f),
    0 6px 0 3px #07040f,
    0 0 1.2rem -0.1rem color-mix(in srgb, var(--k) 55%, transparent);
  margin-bottom: 6px;
}
.key-row b {
  color: var(--k);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .key-row:not(.slidev-vclick-hidden) .sym {
    animation: key-press 0.5s steps(1, end) both;
  }
}
@keyframes key-press {
  0%,
  40% {
    transform: translateY(6px);
    box-shadow:
      inset 4px 4px 0 0 rgba(255, 255, 255, 0.45),
      inset -4px -4px 0 0 rgba(0, 0, 0, 0.25),
      0 0 0 3px #07040f;
  }
}
</style>

<!--
Разберём, что считает один нейрон.
[click] x — входы. Числа, которые нейрон получает. У первого слоя это пиксели картинки, а у следующих слоёв — выходы предыдущих нейронов.
[click] w — веса, по одному на каждый вход. Вес говорит, насколько вход важен и куда тянет. Большой положительный — голос «за», отрицательный — голос «против», около нуля — этот вход нейрону безразличен. Веса и есть те самые ручки, их подбирает обучение.
[click] Σ — сумма. Каждый вход умножаем на его вес и всё складываем. Получается одно число: насколько входы голосуют за то, что ищет нейрон.
[click] y — выход. Сумма проходит через порог, и результат уходит дальше: следующим нейронам или в ответ сети.
[click] Пример. Нейрон ищет светлую точку на тёмном фоне: у середины вес плюс два, у соседей минус один. Минус — это «здесь должно быть темно». Одна светлая точка посередине — сумма два, горит. Сплошная светлая заливка — плюсы и минусы гасят друг друга, ноль, молчит: без отрицательных весов нейрон не отличил бы точку от просто светлого пятна. Светлые края при тёмной середине — минус два, голос против. Такой набор весов мы называем трафарет
-->

---
layout: two-cols
level: 3
variant: 13
leftWidth: 48%
clicks: 4
---

::header::
## Свёртка

::default::

<ConvStencil :step="$clicks" />

::right::

<div class="scan">
  <div class="hint" v-click="1">Один и тот же фильтр ищет один и тот же узор (край буквы, линию рамки) в любом месте картинки</div>
  <ConvReadout :step="$clicks" />
  <div class="stencil" v-click="4"><StencilSheet /><div class="st-txt"><div class="ico"><tabler-scissors /></div>Можно представить, как трафарет</div></div>
</div>

<style scoped>
.scan {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.25rem;
}
/* подсказка-реплика сканера: хвостик указывает на трафарет слева */
.hint {
  position: relative;
  padding: 0.7rem 1rem;
  line-height: 1.45;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent);
}
.hint::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 1.1rem;
  width: 12px;
  height: 12px;
  background: var(--lvl-accent);
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
}
/* «трафарет»: лист с прорезью + подпись */
.stencil {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.6rem 0.9rem;
  background: linear-gradient(180deg, rgba(157, 255, 62, 0.1), rgba(16, 10, 34, 0.9) 70%);
  box-shadow:
    0 -3px 0 0 var(--color-green),
    0 3px 0 0 var(--color-green),
    -3px 0 0 0 var(--color-green),
    3px 0 0 0 var(--color-green),
    0 0 1.4rem -0.2rem rgba(157, 255, 62, 0.45);
}
.st-txt {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.75rem;
  line-height: 1.1;
  color: var(--pa-text);
}
.st-txt .ico {
  font-size: 1.75rem;
  color: var(--color-green);
  filter: drop-shadow(0 0 0.35rem rgba(157, 255, 62, 0.5));
}
@media screen and (prefers-reduced-motion: no-preference) {
  .stencil:not(.slidev-vclick-hidden) .ico {
    animation: snip 0.25s steps(1, end) 4 both;
  }
}
@keyframes snip {
  0% {
    transform: rotate(-12deg);
  }
  50% {
    transform: rotate(12deg);
  }
}
</style>

<!--
Главный кирпичик сети — свёртка. Это трафарет-фильтр три на три пикселя: он ползёт по картинке, умножает соседние пиксели на свои веса — и складывает. Получается одно число: насколько это место похоже на то, что ищет фильтр. Слева такой фильтр-трафарет — горизонтальная палочка, рядом буквы «Т» и «Г».
[click] Прикладываем трафарет к верху «Т» — совпало, нашёл палочку.
[click] Тот же трафарет прикладываем к «Г» в другом углу — тоже нашёл. Одни и те же девять чисел работают по всей картинке.
[click] А на пустом месте фильтр молчит.
[click] Важная оговорка: палочку я нарисовал для примера. Сами мы трафареты не рисуем. Мы задаём их размер, а всю дальнейшую работу выполняет библиотека.
-->

---
layout: simple-slide
level: 3
variant: 16
---

## Нейросеть как домик из трафаретов

<div class="tower">
  <div class="shaft">
    <i v-for="k in 4" :key="k" class="ledge" :style="{ bottom: `${(k - 1) * 108 + 8}px` }" />
    <HouseHero :step="$clicks" :lift="108" :base="12" />
  </div>
  <div class="house">
    <div class="roof" :class="{ on: $clicks >= 3 }"><i class="beacon" /></div>
    <div class="lot l3">
      <div class="floor" v-click="3">
        <span class="lvl">3</span>
        <span class="pic spaced">Сохранить</span>
        <span>видит ещё крупнее: «буквы стоят слишком далеко друг от друга», «строки разъехались»</span>
      </div>
    </div>
    <div class="lot l2">
      <div class="floor" v-click="2">
        <span class="lvl">2</span>
        <span class="pic">Т Г ▭</span>
        <span>трафареты к ответам первого этажа: «где палочки стоят рядом?» → буквы и линии рамки</span>
      </div>
    </div>
    <div class="lot l1">
      <div class="floor" v-click="1">
        <span class="lvl">1</span>
        <span class="pic">| — ⌐ ⌙</span>
        <span>много маленьких трафаретов 3×3: палочка, уголок, край буквы</span>
      </div>
    </div>
    <div class="ground" />
  </div>
</div>

<style scoped>
/* домик-платформер: этажи достраиваются снизу вверх, герой поднимается на готовый этаж */
.tower {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 0.75rem;
  margin-top: 0.1rem;
}
.shaft {
  position: relative;
  /* лестница-шахта сбоку от дома */
  background:
    repeating-linear-gradient(180deg, transparent 0 14px, #3a3160 14px 18px) center / 60% 100% no-repeat;
  box-shadow: inset 4px 0 0 0 #3a3160, inset -4px 0 0 0 #3a3160;
}
.ledge {
  position: absolute;
  left: -4px;
  right: -4px;
  height: 4px;
  background: color-mix(in srgb, var(--lvl-accent) 60%, #3a3160);
}
.house {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.roof {
  position: relative;
  height: 32px;
  margin: 0 2.5rem -8px;
  background: #2a2148;
  clip-path: polygon(0 100%, 4% 75%, 8% 50%, 12% 25%, 88% 25%, 92% 50%, 96% 75%, 100% 100%);
  opacity: 0.35;
  transition: opacity 0.3s steps(3, end);
}
.roof.on {
  opacity: 1;
  background: repeating-linear-gradient(90deg, color-mix(in srgb, var(--lvl-accent) 70%, #07040f) 0 12px, color-mix(in srgb, var(--lvl-accent) 45%, #07040f) 12px 16px);
}
/* маяк на крыше: «нашёл своё где-нибудь на картинке?» */
.beacon {
  position: absolute;
  left: 50%;
  top: 0;
  width: 16px;
  height: 8px;
  margin-left: -8px;
  background: #4a4070;
}
.roof.on .beacon {
  background: var(--pa-lime);
}
/* «участок» этажа: пунктир стройплощадки, пока этаж не построен */
.lot {
  height: 100px;
  box-shadow: inset 0 0 0 2px rgba(106, 95, 150, 0.35);
  background: repeating-linear-gradient(135deg, transparent 0 10px, rgba(106, 95, 150, 0.12) 10px 14px);
}
.l2 {
  margin: 0 1.25rem;
}
.l3 {
  margin: 0 2.5rem;
}
.floor {
  height: 100%;
  display: grid;
  grid-template-columns: 2.75rem 12.5rem 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0 0.9rem;
  line-height: 1.4;
  background:
    linear-gradient(180deg, rgba(16, 10, 34, 0.92), rgba(16, 10, 34, 0.92)),
    #100a22;
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 color-mix(in srgb, var(--lvl-accent) 50%, #07040f),
    -3px 0 0 0 color-mix(in srgb, var(--lvl-accent) 70%, #07040f),
    3px 0 0 0 color-mix(in srgb, var(--lvl-accent) 70%, #07040f),
    inset 0 6px 0 0 rgba(255, 255, 255, 0.04);
}
/* табличка этажа, как в лифте */
.lvl {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  font-family: var(--pa-font-display);
  font-size: 1.25rem;
  color: #07040f;
  background: var(--color-cyan);
  box-shadow: inset -4px -4px 0 0 rgba(0, 0, 0, 0.25), 0 0 1rem -0.1rem color-mix(in srgb, var(--color-cyan) 60%, transparent);
}
/* окно этажа: что видит этаж */
.pic {
  display: grid;
  place-items: center;
  height: 4.25rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-green);
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px rgba(157, 255, 62, 0.55);
  background: #050a08;
  box-shadow: inset 0 0 0 3px #3a3160, inset 0 0 18px rgba(157, 255, 62, 0.15);
}
.pic.spaced {
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  white-space: nowrap;
}
.ground {
  height: 12px;
  margin-top: -4px;
  background: repeating-linear-gradient(90deg, #3a3160 0 16px, #2a2148 16px 32px);
  box-shadow: 0 -4px 0 0 color-mix(in srgb, var(--color-green) 60%, #07040f);
}
@media screen and (prefers-reduced-motion: no-preference) {
  /* этаж «собирается»: падает сверху ступеньками и загорается окно */
  .floor:not(.slidev-vclick-hidden) {
    animation: floor-drop 0.45s steps(4, end) both;
  }
  .floor:not(.slidev-vclick-hidden) .pic {
    animation: win-on 0.9s steps(1, end) 0.4s both;
  }
  .roof.on .beacon {
    animation: beacon 1s steps(1, end) infinite;
  }
}
@keyframes floor-drop {
  from {
    transform: translateY(-24px);
  }
}
@keyframes win-on {
  0%,
  30% {
    color: #2a2148;
    text-shadow: none;
  }
  31%,
  50% {
    color: var(--color-green);
  }
  51%,
  65% {
    color: #2a2148;
    text-shadow: none;
  }
}
@keyframes beacon {
  0%,
  50% {
    box-shadow: 0 0 14px 4px rgba(157, 255, 62, 0.8);
  }
  51%,
  100% {
    box-shadow: none;
  }
}
</style>

<!--
Одна свёртка видит девять пикселей. а у нас компоненты побольше, так? Чтобы покрыть большие площади, свёртки складываем этажами, как домик.
[click] Первый этаж — маленькие трафареты: палочки, уголки, края букв.
[click] Второй этаж прикладывает свои трафареты к ответам первого: «где палочки стоят рядом?». Так складываются буквы и линии рамки.
[click] Третий видит ещё крупнее: «буквы слишком далеко друг от друга» — это letter-spacing, «строки разъехались» — line-height. Между этажами сжимаем ответы вдвое: из каждого квадратика оставляем самый сильный сигнал. и трафарет на следующем этаже он накрывает вдвое большую площадь исходной картинки — как будто отходим от картины на шаг. К третьему этажу один трафарет видит уже половину окошка. А в самом конце каждый трафарет отвечает на один вопрос: нашёл я своё где-нибудь на картинке или нет. В TensorFlow.js это готовые слои conv2d, maxPooling2d и globalAveragePooling2d — как это выглядит целиком, покажу в коде через слайд.
-->

---
layout: simple-slide
level: 3
variant: 20
# скрыт ради тайминга, вернуть — убрать hide
hide: true
---

## Альтернативы

<div class="select">
  <div class="fighter" v-click="1">
    <div class="portrait"><tabler-school /></div>
    <div class="plate"><b>Трансформер (ViT)</b>: нанять профессора, чтобы он проверил сложение в столбик</div>
  </div>
  <div class="fighter" v-click="2">
    <div class="portrait"><tabler-telescope /></div>
    <div class="plate"><b>Показать весь скриншот целиком</b>: искать опечатку, глядя на страницу с другого конца комнаты</div>
  </div>
  <div class="fighter" v-click="3">
    <div class="portrait"><tabler-eyeglass /></div>
    <div class="plate"><b>Готовая сеть MobileNet</b>: очки, в которых учились узнавать котов и машины, не замечает тонкие детали</div>
  </div>
</div>

<style scoped>
/* экран выбора бойца: три претендента, каждого вычёркивает штамп */
.select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 0.75rem;
}
.fighter {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.portrait {
  position: relative;
  height: 8.5rem;
  display: grid;
  place-items: center;
  font-size: 4.5rem;
  color: #8e86a8;
  background:
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0 3px, transparent 3px 6px),
    #120b26;
  box-shadow:
    0 -3px 0 0 var(--pa-red),
    0 3px 0 0 var(--pa-red),
    -3px 0 0 0 var(--pa-red),
    3px 0 0 0 var(--pa-red);
}
/* штамп «отказ» поверх портрета */
.portrait::after {
  content: "✗";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 6rem;
  color: var(--pa-red);
  text-shadow: 4px 4px 0 #07040f;
  opacity: 0.85;
}
.plate {
  line-height: 1.45;
}
.plate b {
  color: var(--pa-red);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .fighter:not(.slidev-vclick-hidden) .portrait::after {
    animation: stamp 0.4s steps(3, end) 0.3s both;
  }
}
@keyframes stamp {
  from {
    transform: scale(2);
    opacity: 0;
  }
}
</style>

<!--
Почему именно маленькая свёрточная сеть? Мы смотрели и на другие варианты.
[click] Трансформер, ViT — модная архитектура, на которой работают большие модели. Но для нашей задачи это как нанять профессора проверять сложение в столбик. Без огромного предобучения на тысячах примеров он проигрывает свёрточной сети, а в браузере и в Node он заметно тяжелее.
[click] Можно было бы показывать сети весь скриншот целиком. Но тогда ей пришлось бы ещё и самой искать, где ошибка. Это как искать опечатку, глядя на страницу с другого конца комнаты. Мы же уже знаем область отличий из сравнения скриншотов, поэтому показываем только её.
[click] И есть готовые сети, например MobileNet. Её учили узнавать котов и машины, а картинку нужно сжимать до 224 на 224. При сжатии как раз пропадают тонкие штрихи и расстояния между буквами. Это как очки, в которых видно кота, но не видно шрифт.
-->

---
layout: simple-slide
level: 3
variant: 26
---

## Своя уверенность для каждого свойства

<div class="pair">
  <figure class="screen">
    <img src="/images/slides/washer-broken.jpg" alt="Разбитая стиральная машина брошена на землю, корпус вскрыт">
    <ConfidenceBars kind="shared" />
  </figure>
  <figure class="screen ok" v-click="1">
    <img src="/images/slides/dashboard-lights.jpg" alt="Приборная панель автомобиля: одновременно горят лампы check engine и аккумулятора">
    <ConfidenceBars kind="split" />
  </figure>
</div>

<p class="credits">Фото: JIP, CC BY-SA 4.0; Shixart1985, CC BY 2.0 — Wikimedia Commons</p>

<style scoped>
/* два «экрана»: общая стирка против приборной панели; под каждым — как делится уверенность */
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 0.2rem;
}
.screen {
  --sf: #6a5f96;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: #0b0718;
  box-shadow:
    0 -3px 0 0 var(--sf),
    0 3px 0 0 var(--sf),
    -3px 0 0 0 var(--sf),
    3px 0 0 0 var(--sf),
    8px 8px 0 0 rgba(0, 0, 0, 0.45);
}
.screen.ok {
  --sf: var(--color-green);
  box-shadow:
    0 -3px 0 0 var(--sf),
    0 3px 0 0 var(--sf),
    -3px 0 0 0 var(--sf),
    3px 0 0 0 var(--sf),
    8px 8px 0 0 rgba(0, 0, 0, 0.45),
    0 0 1.5rem -0.2rem rgba(157, 255, 62, 0.45);
}
.screen img {
  width: 100%;
  height: 232px;
  object-fit: cover;
  display: block;
}
/* стирку «гасим»: всё в одну серую кашу */
.screen:not(.ok) img {
  filter: saturate(0.35) brightness(0.85);
}
.credits {
  margin-top: 1.1rem;
  font-size: 1rem;
  color: var(--dd-sub);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .screen.ok:not(.slidev-vclick-hidden) img {
    animation: power-on 0.5s steps(4, end) both;
  }
}
@keyframes power-on {
  0% {
    clip-path: inset(49% 0 49% 0);
    filter: brightness(3);
  }
  50% {
    clip-path: inset(20% 0 20% 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
    filter: none;
  }
}
</style>

<!--
Теперь про то, как сеть отвечает. Можно сделать ответ как одну общую стирку: закинуть в машинку всё сразу — цветное, белое, чёрное. Уверенность делится на всех, и на выходе серая каша: всего понемногу, ничего чётко. Сеть обязана раздать сто процентов между вариантами, и если сломались два свойства, каждому достанется по половинке.
[click] А нам надо чётко и точечно, как на приборной панели. У каждой лампы свой датчик: check engine горит про двигатель, аккумулятор — про аккумулятор, и они друг другу не мешают. Могут гореть обе сразу, и обе по делу. Так и у нашей сети: пять отдельных лампочек, по одной на свойство, каждая светится от нуля до единицы сама по себе. Яркость — это уверенность, а «сломалось» — значит, лампочка ярче порога, у нас это 0.5. Порог, выше которого засчитываем уверенность достойной триггера — наша договорённость, а не часть сети.
-->

---
layout: simple-slide
level: 3
variant: 20
---

<div class="rig">
<div class="term">
<div class="term-bar" aria-hidden="true"><i /><i /><i /><span>model.ts</span><b>tfjs</b></div>

```ts {all|2-6|9-13|15-17|all}
function buildModel(tf) {
  const conv = (filters) => tf.layers.conv2d({
    filters, kernelSize: 3, padding: 'same', activation: 'relu',
  });
  
  const shrink = () => tf.layers.maxPooling2d({ poolSize: 2 });
  
  return tf.sequential({ layers: [
    tf.layers.inputLayer({ inputShape: [64, 64, 7] }),
    
    conv(16), conv(16), shrink(), // этаж 1: палочки, уголки
    conv(32), conv(32), shrink(), // этаж 2: буквы, рамки
    conv(64), conv(96), // этаж 3: строки разъехались
    
    tf.layers.globalAveragePooling2d({}), // нашёл где-нибудь?
    tf.layers.dense({ units: 64, activation: 'relu' }),
    tf.layers.dense({ units: 5, activation: 'sigmoid' }), // 5 лампочек
  ] });
}
```

</div>
<ModelStack :step="$clicks" />
</div>

<style scoped>
/* код на «мониторе» с CRT-рамкой, справа мини-карта домика, синхронная с подсветкой */
.rig {
  display: flex;
  align-items: stretch;
  gap: 0.9rem;
  width: 100%;
  margin-top: -0.4rem;
}
.term {
  position: relative;
  flex: none;
  background: #0b0718;
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent),
    10px 10px 0 0 rgba(0, 0, 0, 0.5),
    0 0 1.6rem -0.2rem color-mix(in srgb, var(--lvl-accent) 45%, transparent);
}
/* сканлайны и виньетка экрана */
.term::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.45) 100%);
}
.term-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.1rem 0.75rem;
  background: color-mix(in srgb, var(--lvl-accent) 20%, #07040f);
  border-bottom: 3px solid var(--lvl-accent);
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.25;
  color: var(--pa-text);
}
.term-bar i {
  width: 6px;
  height: 6px;
  background: var(--lvl-accent);
}
.term-bar span {
  margin-left: 0.5rem;
}
.term-bar b {
  margin-left: auto;
  color: var(--lvl-accent);
}
.term :deep(.slidev-code-wrapper) {
  margin: 0;
}
.term :deep(pre.slidev-code) {
  --slidev-code-line-height: 1.3;
  line-height: 1.3;
  padding: 0.55rem 1rem 0.6rem;
  box-shadow: none;
  border: 0;
  background: transparent !important;
}
.term :deep(pre.slidev-code)::before,
.term :deep(pre.slidev-code)::after {
  display: none;
}
.rig > :last-child {
  flex: 1;
  min-width: 0;
}
</style>

<!--
Всё, что мы только что разобрали, в коде помещается в одну функцию. Это настоящая архитектура нашей сети, ровно в таком виде она и работает.
[click] Вот трафарет: слой conv2d с kernelSize: 3. filters — сколько разных трафаретов на этаже. Числа внутри трафаретов мы не пишем, их подберёт обучение. Рядом shrink — maxPooling, то самое «отойти от картины на шаг»: ответы сжимаются вдвое, и следующий этаж видит площадь побольше.
[click] А вот этажи домика. На вход окно 64 на 64, в нём семь слоёв цвета: картинка «как надо», «как стало» и маска отличий. На каждом этаже два слоя трафаретов: на первом по шестнадцать, на втором по тридцать два, на третьем шестьдесят четыре и девяносто шесть. Чем выше этаж, тем крупнее узоры и тем больше их видов — всего двести пятьдесят шесть трафаретов.
[click] И выход. globalAveragePooling отвечает каждому трафарету на вопрос «нашёл я своё где-нибудь на картинке или нет». Потом небольшой слой собирает ответы вместе, а последний даёт пять лампочек с sigmoid — те самые со слайда про уверенность.
[click] Всё вместе — около ста тысяч чисел-весов и меньше двадцати строк кода. Осталось понять, как сеть учится зажигать нужные лампочки.
-->

---
layout: two-cols
level: 3
variant: 12
leftWidth: 50%
clicks: 3
---

::header::
## Как сеть учится

::default::

<div class="quest">
  <span class="loop" :class="{ run: $clicks >= 2 }" aria-hidden="true"><i /></span>
  <div class="step" v-click="1"><span class="ico-i"><tabler-flame /></span><div>Как игра «горячо — холодно»: сеть отвечает, мы говорим, насколько она ошиблась. Это число: <b>loss</b></div></div>
  <div class="step" v-click="2"><span class="ico-i"><tabler-tool /></span><div>После каждой подсказки сеть чуть-чуть подкручивает свои числа. Так тысячи раз</div></div>
  <div class="step ok" v-click="3"><span class="ico-i"><tabler-book /></span><div>Один проход по всем примерам: одна <b>эпоха</b>, как прочитать весь учебник</div></div>
</div>

::right::

<div class="rig-box">

<LineChart
  :series="[{ points: [0.95, 0.62, 0.45, 0.36, 0.3, 0.27, 0.25, 0.24], color: '#62ecff', label: 'loss', show: $clicks >= 1 }]"
  :width="400"
  :height="300"
/>

<TrainRig :step="$clicks" />

</div>

<style scoped>
/* Обход дефекта LineChart: у прорисовки steps(1, end) длиной 10 мс из-за погрешности
   float часть пикселей остаётся с opacity 0 после завершения анимации (дыра в линии).
   Линейная функция даёт в конце ту же единицу. Сам компонент общий, правится в задаче 04. */
:deep(.chart .lc-px),
:deep(.chart .lc-dot),
:deep(.chart .lc-lbl) {
  animation-timing-function: linear !important;
}
/* график и обвязка TrainRig: шарик позиционируется от левого верхнего угла графика */
.rig-box {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
/* цикл обучения: три шага по кругу, по петле слева бежит «ход» — так тысячи раз */
.quest {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding-left: 1.75rem;
  margin-top: 0.2rem;
}
.loop {
  position: absolute;
  left: 0;
  top: 1.4rem;
  bottom: 1.4rem;
  width: 1.4rem;
  border: 3px dashed #4a4070;
  border-right: 0;
}
/* стрелка петли — обратно к первому шагу */
.loop::before {
  content: "";
  position: absolute;
  right: -8px;
  top: -9px;
  border: 7px solid transparent;
  border-left-color: #4a4070;
}
.loop.run {
  border-color: var(--lvl-accent);
}
.loop.run::before {
  border-left-color: var(--lvl-accent);
}
.loop i {
  position: absolute;
  left: -8px;
  bottom: -8px;
  width: 12px;
  height: 12px;
  background: var(--pa-yellow);
  opacity: 0;
}
.step {
  display: grid;
  grid-template-columns: 2.75rem 1fr;
  gap: 0.9rem;
  align-items: start;
  line-height: 1.45;
  --s: var(--color-cyan);
}
.step.ok {
  --s: var(--color-green);
}
.ico-i {
  width: 2.75rem;
  height: 2.75rem;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  color: var(--s);
  background: color-mix(in srgb, var(--s) 14%, #0b0718);
  box-shadow:
    0 -3px 0 0 var(--s),
    0 3px 0 0 var(--s),
    -3px 0 0 0 var(--s),
    3px 0 0 0 var(--s);
}
.step b {
  color: var(--s);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .loop.run i {
    animation: loop-run 1.8s steps(12, end) infinite;
  }
  .step:not(.slidev-vclick-hidden) .ico-i {
    animation: step-pop 0.4s steps(3, end) both;
  }
}
/* «ход» поднимается по петле обратно к первому шагу (маленький элемент, анимация bottom дешёвая) */
@keyframes loop-run {
  0% {
    opacity: 1;
    bottom: -8px;
  }
  100% {
    opacity: 1;
    bottom: calc(100% - 4px);
  }
}
@keyframes step-pop {
  0% {
    transform: scale(0.5);
  }
  60% {
    transform: scale(1.15);
  }
}
</style>

<!--
Как сеть вообще учится?
[click] Как в игре «горячо — холодно». Сеть отвечает, а функция потерь сверяет ответ с правильным — его мы знаем заранее, потому что сами сломали свойство, — и выдаёт одно число: насколько сеть ошиблась. Это число называется loss. У нас функция потерь — binaryCrossentropy: она штрафует каждую лампочку отдельно, «эта не должна была гореть», «эта должна гореть ярче». В TensorFlow.js она готовая: loss: 'binaryCrossentropy'. Чем «холоднее», тем оно больше. Справа видно: в начале loss большой, сеть отвечает почти наугад.
[click] После каждой подсказки сеть чуть-чуть подкручивает свои ручки-числа, чтобы в следующий раз было «теплее». Не сразу, а понемногу. И так тысячи раз. Кривая loss ползёт вниз. В какую сторону крутить каждое число, TensorFlow.js считает сам. У нас это один вызов model.trainOnBatch на каждую пачку из шестнадцати примеров.
[click] Один раз пройти по всем примерам называется эпохой. Это как прочитать весь учебник от корки до корки. Обычно нужно несколько эпох: с первого прочтения учебник не запоминается. Цикл по эпохам — обычный for в нашем коде, перед каждой эпохой примеры перемешиваем.
-->
