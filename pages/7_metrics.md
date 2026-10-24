---
layout: interjection
level: 7
variant: 7
transition: slide-up
---

<TextBig>
  Метрики
</TextBig>

<!--
Что такое попадание, top-1, мы уже знаем. Осталось два подвоха: как считать попадания, когда у компонента много окошек, и как мерить, что сеть не пропускает поломки и не придумывает лишних.
-->

---
layout: simple-slide
level: 7
variant: 30
---

## Top-1: по парам или по окошкам?

<div class="vote">
  <div class="rule pairs" v-click="1"><b>По парам</b>: каждый сломанный компонент голосует один раз. <b>По окошкам</b>: голосует каждое окошко</div>
  <div class="rule school" v-click="2"><div class="ico"><tabler-users-group /></div>Как выбирать старосту голосами классов или голосами всех учеников: если в одном классе 40 человек, а в другом 5, результаты будут разными</div>
  <A7Ballot class="ballot" :step="$clicks" />
  <div class="vuet" v-click="3">
    <p>Ранний прогон на Vuetify: большая карточка дала <b class="cyan">92 %</b> всех окошек</p>
    <div class="bar"><span class="lbl">по окошкам</span><span class="fill" style="--p: 78">78 %</span></div>
    <div class="bar"><span class="lbl">по парам</span><span class="fill pair" style="--p: 53">53 %</span></div>
  </div>
</div>

<style scoped>
/* Избирательный участок: слева компоненты и две урны (A7Ballot), справа правила голосования,
   снизу табло результатов. Сцена меняется по тем же шагам, что и текст. */
.vote {
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-template-rows: auto 1fr auto;
  column-gap: 1.5rem;
  row-gap: 0.75rem;
  margin-top: 0.25rem;
}
.ballot {
  grid-column: 1;
  grid-row: 1 / 3;
}
.rule {
  grid-column: 2;
  position: relative;
  font-size: 1rem;
  line-height: 1.4;
  padding: 0.6rem 0.9rem 0.65rem;
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
/* цвета совпадают с урнами и полосами табло: пары — лайм, окошки — циан */
.rule b {
  color: var(--pa-lime);
}
.rule b:nth-of-type(2) {
  color: var(--pa-cyan);
}
/* табличка правил прикреплена «проводом» к урнам слева */
.rule.pairs {
  grid-row: 1;
}
.rule.pairs::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: 1.1rem;
  width: 1.5rem;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--lvl-accent) 0 6px, transparent 6px 9px);
}
.rule.school {
  grid-row: 2;
  align-self: start;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.75rem;
  align-items: start;
}
.rule.school .ico {
  font-size: 2.25rem;
  line-height: 1;
  color: var(--color-cyan);
  filter: drop-shadow(0 0 0.35rem rgba(62, 240, 255, 0.5));
}

/* табло результатов: полосы из клеток, длина пропорциональна проценту */
.vuet {
  grid-column: 1 / -1;
  grid-row: 3;
  padding: 0.5rem 0.9rem 0.6rem;
  background: rgba(7, 4, 15, 0.88);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent);
}
.vuet p {
  margin: 0;
  font-size: 1rem;
}
.bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.35rem;
}
/* подпись фиксированной ширины и не сжимается — полоски начинаются с одной вертикали */
.bar .lbl {
  flex: none;
  width: 8.5rem;
  font-size: 1rem;
}
.fill {
  display: block;
  flex: none;
  box-sizing: border-box;
  width: calc(var(--p) * 7px);
  padding: 0.1rem 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.5;
  color: #07040f;
  /* первые 5.5rem сплошные — под число, дальше полоса бьётся на клетки */
  background:
    linear-gradient(var(--pa-cyan) 0 0) left / 5.5rem 100% no-repeat,
    repeating-linear-gradient(90deg, transparent 0 18px, rgba(7, 4, 15, 0.85) 18px 21px),
    var(--pa-cyan);
  transform-origin: left center;
}
.fill.pair {
  background:
    linear-gradient(var(--pa-lime) 0 0) left / 5.5rem 100% no-repeat,
    repeating-linear-gradient(90deg, transparent 0 18px, rgba(7, 4, 15, 0.85) 18px 21px),
    var(--pa-lime);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .vuet:not(.slidev-vclick-hidden) .fill {
    animation: a7-fill 0.5s steps(6, end) both;
  }
  .vuet:not(.slidev-vclick-hidden) .fill.pair {
    animation-delay: 0.12s;
  }
}
@keyframes a7-fill {
  from {
    transform: scaleX(0.05);
  }
  to {
    transform: none;
  }
}
</style>

<!--
Первый подвох. Сеть отвечает по каждому окошку, а нас интересует компонент целиком. Поэтому top-1 можно посчитать двумя способами.
[click] По парам: каждый сломанный компонент голосует один раз, сколько бы у него ни было окошек. По окошкам: голосует каждое окошко отдельно.
[click] Это как выбирать старосту голосами классов или голосами всех учеников школы. Если в одном классе 40 человек, а в другом 5, большой класс перетянет голосование учеников, а при голосовании классами у обоих по одному голосу.
[click] Так и вышло в раннем отдельном эксперименте: тогда мы учили сеть прямо на компонентах Vuetify, а на контрольной оставили маленькую кнопку и большую карточку. Это не та сеть, что давала 47 и 81. Большая карточка режется на десятки окошек и дала 92 процента всех окошек. Карточку сеть угадывала хорошо, кнопку плохо. По окошкам вышло 78 процентов, а по парам — 53. Оба числа честные, но отвечают на разные вопросы: «сколько окошек угадано» и «сколько компонентов угадано». Пользователя интересует компонент, поэтому главная — по парам. Все проценты в докладе посчитаны именно так.
-->

---
layout: simple-slide
level: 7
variant: 20
---

## Что поймала наша сеть: precision

<div class="fishing" :class="{ haul: $clicks >= 2, judged: $clicks >= 3 }">
<p class="sub" v-click="1">Нашу нейросеть можно мерить как рыбацкую: в озере рыба (настоящие поломки) и всякий мусор</p>
<div class="screen">
  <A7Pond scene="haul" :show-swimmers="$clicks >= 1" :show-line="$clicks >= 2" />
  <div class="net" v-click="2">
    <span v-for="i in 7" :key="'f' + i" class="fish"><A7Fish /></span><span v-for="i in 3" :key="'b' + i" class="boot"><A7Boot /></span>
  </div>
</div>
<div class="verdict" v-click="3"><b>Precision</b>: сколько в улове рыбы, а не старых ботинок. Вытащили 10 штук, рыб 7: precision = <span class="gnum">0.7</span></div>
<A7Meter class="meter" :cells="['fish', 'fish', 'fish', 'fish', 'fish', 'fish', 'fish', 'boot', 'boot', 'boot']" :on="$clicks >= 3" />
</div>

<style scoped>
/* Аркадная рыбалка: слева экран с озером, лодкой и сетью, справа реплика ведущего,
   итог precision и счётчик из 10 клеток — по клетке на каждую вещь в улове.
   Знаменатель precision — весь улов, поэтому на шаге итога рамкой выделяется сеть. */
.fishing {
  display: grid;
  grid-template-columns: 460px 1fr;
  grid-template-rows: auto auto 1fr;
  column-gap: 1.5rem;
  row-gap: 0.9rem;
  margin-top: 0.25rem;
}
.screen {
  grid-column: 1;
  grid-row: 1 / 4;
  position: relative;
  width: 460px;
  height: 372px;
  box-shadow:
    0 -4px 0 0 var(--pa-line),
    0 4px 0 0 var(--pa-line),
    -4px 0 0 0 var(--pa-line),
    4px 0 0 0 var(--pa-line);
}
.sub {
  grid-column: 2;
  grid-row: 1;
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  padding: 0.6rem 0.9rem;
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--pa-cyan),
    0 3px 0 0 var(--pa-cyan),
    -3px 0 0 0 var(--pa-cyan),
    3px 0 0 0 var(--pa-cyan);
}
.verdict {
  grid-column: 2;
  grid-row: 2;
  font-size: 1rem;
  line-height: 1.4;
  padding: 0.6rem 0.9rem;
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 18px rgba(157, 255, 62, 0.25);
}
.verdict b {
  color: var(--pa-lime);
}
.verdict .gnum {
  font-size: 2.4rem;
  vertical-align: middle;
}
.meter {
  grid-column: 2;
  grid-row: 3;
  align-self: start;
}

/* сеть с уловом: висит на леске над водой, ячейки — сетка из пунктира */
.net {
  position: absolute;
  left: 206px;
  top: 22px;
  width: 248px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
  row-gap: 6px;
  padding: 10px 4px 12px;
  background:
    repeating-linear-gradient(45deg, transparent 0 9px, rgba(242, 236, 255, 0.28) 9px 11px),
    repeating-linear-gradient(-45deg, transparent 0 9px, rgba(242, 236, 255, 0.28) 9px 11px),
    rgba(7, 4, 15, 0.55);
  box-shadow:
    0 -3px 0 0 #e8d0a0,
    0 3px 0 0 #e8d0a0,
    -3px 0 0 0 #e8d0a0,
    3px 0 0 0 #e8d0a0;
}
.net span {
  display: grid;
  place-items: center;
  width: 44px;
  height: 34px;
}
/* итог: знаменатель — весь улов, сеть в лаймовой рамке; ботинки помечены как мусор */
.judged .net {
  box-shadow:
    0 -4px 0 0 var(--pa-lime),
    0 4px 0 0 var(--pa-lime),
    -4px 0 0 0 var(--pa-lime),
    4px 0 0 0 var(--pa-lime),
    0 0 22px rgba(157, 255, 62, 0.55);
}
.judged .net .boot {
  background: rgba(255, 77, 109, 0.3);
  box-shadow: inset 0 0 0 2px #ff4d6d;
}
.judged .net .fish {
  background: rgba(157, 255, 62, 0.16);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .net:not(.slidev-vclick-hidden) {
    animation: a7-haul 0.5s steps(5, end) both;
  }
  .judged .net .boot {
    animation: a7-junk 0.7s steps(2, end) infinite;
  }
}
@keyframes a7-haul {
  from {
    transform: translateY(150px);
  }
  to {
    transform: none;
  }
}
@keyframes a7-junk {
  50% {
    transform: translateX(3px);
    background: rgba(255, 77, 109, 0.55);
  }
}
</style>

<!--
Теперь две самые важные метрики после top-1: precision и recall. Их часто путают, поэтому — рыбалка.
[click] Наша нейросеть — тоже сеть, и мерить её можно как рыбацкую. Есть озеро, в нём рыба — это настоящие поломки — и всякий мусор. Рыбак закидывает сеть.
[click] Вытащили улов: десять штук. Семь рыб и три старых ботинка.
[click] Precision отвечает на вопрос: сколько в улове рыбы, а не ботинок? Семь из десяти, precision 0.7. Каждая третья находка — мусор. Для нас это значит: сеть сказала «сломался цвет», а цвет не ломался.
-->

---
layout: simple-slide
level: 7
variant: 20
---

## Что поймала наша сеть: recall

<div class="fishing" :class="{ judged: $clicks >= 2 }">
<div class="screen">
  <A7Pond scene="sunk" :show-line="$clicks >= 1" />
  <div class="lake" v-click="1">
    <div class="net">
      <span v-for="i in 8" :key="'in' + i"><A7Fish /></span>
    </div>
    <span class="free"><A7Fish :flip="true" /></span><span class="free two"><A7Fish /></span>
  </div>
</div>
<div class="verdict" v-click="2"><b>Recall</b>: сколько рыбы из озера поймали. Рыб было 10, в сеть попало 8: recall = <span class="gnum">0.8</span></div>
<A7Meter class="meter" :cells="['fish', 'fish', 'fish', 'fish', 'fish', 'fish', 'fish', 'fish', 'gone', 'gone']" :on="$clicks >= 2" />
</div>

<style scoped>
/* Та же рыбалка, но сеть под водой. Считаем не улов, а озеро: 10 рыб, 8 в сети, 2 уплывают.
   Знаменатель recall — вся рыба озера, поэтому на шаге итога рамкой выделяется озеро целиком,
   а в счётчике две клетки остаются пустыми — это ушедшая рыба. */
.fishing {
  display: grid;
  grid-template-columns: 460px 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 1.5rem;
  row-gap: 0.9rem;
  margin-top: 0.25rem;
}
.screen {
  grid-column: 1;
  grid-row: 1 / 3;
  position: relative;
  width: 460px;
  height: 372px;
  box-shadow:
    0 -4px 0 0 var(--pa-line),
    0 4px 0 0 var(--pa-line),
    -4px 0 0 0 var(--pa-line),
    4px 0 0 0 var(--pa-line);
}
.verdict {
  grid-column: 2;
  grid-row: 1;
  font-size: 1rem;
  line-height: 1.4;
  padding: 0.6rem 0.9rem;
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 18px rgba(157, 255, 62, 0.25);
}
.verdict b {
  color: var(--pa-lime);
}
.verdict .gnum {
  font-size: 2.4rem;
  vertical-align: middle;
}
.meter {
  grid-column: 2;
  grid-row: 2;
  align-self: start;
}

/* озеро — вся вода экрана; сеть опущена в воду на леске */
.lake {
  position: absolute;
  left: 0;
  top: 124px;
  width: 460px;
  height: 248px;
}
.net {
  position: absolute;
  left: 110px;
  top: 28px;
  width: 260px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  align-items: center;
  row-gap: 10px;
  padding: 14px 6px;
  background:
    repeating-linear-gradient(45deg, transparent 0 9px, rgba(242, 236, 255, 0.22) 9px 11px),
    repeating-linear-gradient(-45deg, transparent 0 9px, rgba(242, 236, 255, 0.22) 9px 11px);
  box-shadow:
    0 -3px 0 0 #e8d0a0,
    0 3px 0 0 #e8d0a0,
    -3px 0 0 0 #e8d0a0,
    3px 0 0 0 #e8d0a0;
}
.net span {
  display: grid;
  place-items: center;
  width: 52px;
  height: 34px;
}
.free {
  position: absolute;
  left: 18px;
  top: 34px;
  display: grid;
  place-items: center;
  width: 52px;
  height: 34px;
}
.free.two {
  left: 386px;
  top: 192px;
}
/* итог: знаменатель — всё озеро; ушедшие рыбы — красные промахи */
.judged .lake {
  box-shadow:
    inset 0 0 0 4px var(--pa-lime),
    inset 0 0 22px rgba(157, 255, 62, 0.45);
}
.judged .free {
  background: rgba(255, 77, 109, 0.35);
  box-shadow: inset 0 0 0 2px #ff4d6d;
}
.judged .net span {
  background: rgba(157, 255, 62, 0.16);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .lake:not(.slidev-vclick-hidden) .net {
    animation: a7-sink 0.5s steps(5, end) both;
  }
  .lake:not(.slidev-vclick-hidden) .free {
    animation: a7-away 1.2s steps(3, end) infinite alternate;
  }
  .lake:not(.slidev-vclick-hidden) .free.two {
    animation-name: a7-away-r;
  }
  .judged .free {
    animation: a7-escape 0.7s steps(2, end) infinite;
  }
}
@keyframes a7-sink {
  from {
    transform: translateY(-90px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes a7-away {
  to {
    transform: translateX(-12px);
  }
}
@keyframes a7-away-r {
  to {
    transform: translateX(12px);
  }
}
@keyframes a7-escape {
  50% {
    background: rgba(255, 77, 109, 0.6);
  }
}
</style>

<!--
Вторая метрика смотрит с другой стороны.
[click] Теперь считаем не улов, а озеро. Рыб в озере было десять. В сеть попало восемь, а две ушли — вот они, снаружи.
[click] Recall отвечает на вопрос: сколько рыбы из озера мы поймали? Восемь из десяти, recall 0.8. Каждая пятая поломка осталась незамеченной: цвет сломался, а сеть промолчала. Смотреть надо на оба числа сразу. Порог 0.5 у лампочек работает как размер ячейки: крупная ячейка почти не тащит мусор, но и рыбы ловит мало, а мелкая выгребет всю рыбу вместе с мусором. Как спам-фильтр: низкий precision — письмо заказчика уехало в спам, низкий recall — спам лезет во входящие.
-->

---
layout: simple-slide
level: 7
variant: 20
---

## Precision и recall по свойствам

<div class="stats">
  <div class="legend">
    <span class="lg-prop">свойство</span>
    <span class="lg"><i class="sw prc" />в улове рыба, а не мусор</span>
    <span class="lg"><i class="sw rcl" />поймано рыбы из озера</span>
  </div>
  <div class="roster">
    <div class="fighter" :class="{ hot: $clicks === 1 }">
      <A7Portrait name="border" />
      <div class="name">рамка <span class="nw">(<code>border</code>)</span></div>
      <div class="vals"><span>0.95</span><span>0.94</span></div>
      <div class="bars"><A7StatBar :value="0.95" kind="prc" :fx="$clicks === 1 ? 'perfect' : 'none'" /><A7StatBar :value="0.94" kind="rcl" :fx="$clicks === 1 ? 'perfect' : 'none'" /></div>
      <div class="read ok" v-click="1"><code>border</code>ловит почти идеально</div>
    </div>
    <div class="fighter">
      <A7Portrait name="lineHeight" />
      <div class="name">межстрочный <span class="nw">(<code>line-height</code>)</span></div>
      <div class="vals"><span>0.93</span><span>0.86</span></div>
      <div class="bars"><A7StatBar :value="0.93" kind="prc" /><A7StatBar :value="0.86" kind="rcl" /></div>
    </div>
    <div class="fighter">
      <A7Portrait name="color" />
      <div class="name">цвет <span class="nw">(<code>color</code>)</span></div>
      <div class="vals"><span>0.91</span><span>0.82</span></div>
      <div class="bars"><A7StatBar :value="0.91" kind="prc" /><A7StatBar :value="0.82" kind="rcl" /></div>
    </div>
    <div class="fighter" :class="{ hot: $clicks === 2 }">
      <A7Portrait name="fontWeight" />
      <div class="name">жирность <span class="nw">(<code>font-weight</code>)</span></div>
      <div class="vals"><span>0.88</span><span class="lo">0.75</span></div>
      <div class="bars"><A7StatBar :value="0.88" kind="prc" /><A7StatBar :value="0.75" kind="rcl" :fx="$clicks === 2 ? 'leak' : 'none'" /></div>
      <div class="read no" v-click="2"><code>font-weight</code>чаще всех уходит из сети</div>
    </div>
    <div class="fighter" :class="{ hot: $clicks === 3 }">
      <A7Portrait name="letterSpacing" />
      <div class="name">межбуквенный <span class="nw">(<code>letter-spacing</code>)</span></div>
      <div class="vals"><span class="lo">0.70</span><span>0.84</span></div>
      <div class="bars"><A7StatBar :value="0.70" kind="prc" :fx="$clicks === 3 ? 'junk' : 'none'" /><A7StatBar :value="0.84" kind="rcl" /></div>
      <div class="read no" v-click="3"><code>letter-spacing</code>больше всех мусора в улове</div>
    </div>
  </div>
</div>

<style scoped>
/* Экран выбора бойца: каждое свойство — боец со своим «рыбаком» и двумя статами.
   Левый столбик — precision (весь улов: лайм — рыба, красное — мусор),
   правый — recall (вся рыба озера: лайм — поймано, пунктир — ушло).
   Курсор P1 переходит к бойцу, о котором идёт речь, а его комментарий появляется под ним. */
.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.legend {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  font-size: 1rem;
  color: var(--pa-text-dim);
}
.lg-prop {
  font-family: var(--pa-font-pixel);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-cyan);
}
.lg {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
/* образцы столбиков: тот же рисунок, что у статов, только лёжа */
.sw {
  display: inline-block;
  width: 44px;
  height: 14px;
}
.sw.prc {
  background: linear-gradient(90deg, #9dff3e 0 70%, #ff4d6d 70%);
}
.sw.rcl {
  background: linear-gradient(90deg, #9dff3e 0 75%, transparent 75%);
  outline: 2px dashed #ff4d6d;
  outline-offset: -2px;
}
.roster {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}
.fighter {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.25rem 0.55rem;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.name {
  min-height: 2.8em;
  font-size: 1rem;
  line-height: 1.4;
  text-align: center;
}
/* имя свойства в скобках не переносится: «(letter-spacing)» целиком на второй строке */
.name .nw {
  white-space: nowrap;
}
.name code,
.read code {
  padding: 0 0.15rem;
  font-size: 1rem !important;
  white-space: nowrap;
}
.vals {
  display: flex;
  gap: 1rem;
  font-family: var(--pa-font-pixel);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1;
}
.vals span {
  width: 40px;
  text-align: center;
}
.vals .lo {
  color: var(--pa-red);
}
.bars {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}
/* курсор игрока: рамка мигает, сверху табличка P1 */
.fighter.hot {
  background: rgba(30, 22, 60, 0.95);
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 18px rgba(157, 255, 62, 0.4);
}
.fighter.hot .name {
  color: var(--pa-lime);
}
.fighter.hot::before {
  content: "P1";
  position: absolute;
  top: -0.9rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.15rem 0.35rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-lime);
}
/* комментарий ведущего под бойцом */
.read {
  width: 100%;
  margin-top: 0.3rem;
  padding: 0.35rem 0.45rem;
  font-size: 1rem;
  line-height: 1.3;
  text-align: center;
  background: #07040f;
  box-shadow: inset 0 0 0 2px var(--pa-lime);
}
.read.no {
  box-shadow: inset 0 0 0 2px var(--pa-red);
}
.read code {
  display: block;
  margin: 0 auto 0.15rem;
  width: fit-content;
  font-size: 1rem !important;
  font-weight: 700;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .fighter.hot::before {
    animation: a7-p1 0.6s steps(2, end) infinite;
  }
}
@keyframes a7-p1 {
  50% {
    transform: translate(-50%, -3px);
  }
}
</style>

<!--
У нас на каждое свойство свой «рыбак», поэтому и числа у каждого свои. Слева precision, справа recall. Здесь, в отличие от попаданий, считаем по окошкам при пороге 0.5 и усредняем по пяти кучкам: нас интересует, какие свойства сеть путает между собой.
[click] Рамку сеть ловит почти идеально в обе стороны: 0.95 и 0.94. Рамка меняет картинку резко и однозначно.
[click] Жирность чаще всех уходит из сети: recall 0.75. На некоторых поломках жирности сеть молчит или называет другое свойство. Помните кнопки с 500 и 600? Вот поэтому.
[click] А letter-spacing наоборот. Рыбу он упускает редко, зато мусора в улове больше всех: его называют там, где сломалось что-то другое. Когда буквы немного сдвигаются от любой причины, сети хочется сказать «межбуквенный интервал».
-->

---
layout: simple-slide
level: 7
variant: 16
---

## Что в итоге

<div class="clear">
  <div class="tally">
    <div class="row ok" v-click="1">
      <div class="ico"><tabler-circle-check /></div>
      <div class="txt"><b>Задача решена</b>: тест называет, что сломалось
      <div class="log res-log">color (0.94), font-weight (0.71)</div></div>
    </div>
    <div class="row" v-click="2">
      <div class="ico"><tabler-brain /></div>
      <div class="txt"><b>Сеть работает</b>: ~90 % попаданий, 2.6 мс на окошко, обучение за пару часов на ноутбуке. Всё на JavaScript</div>
    </div>
    <div class="row" v-click="3">
      <div class="ico"><tabler-sparkles /></div>
      <div class="txt"><b>Это кроличья нора</b>: безумно интересно и очень глубоко. Ныряйте!</div>
    </div>
  </div>
  <A7Finale class="finale" :step="$clicks" />
</div>

<style scoped>
/* Экран «уровень пройден»: слева итоговый подсчёт по строкам, справа три звезды рейтинга
   (по звезде на шаг) и кроличья нора, в которую на последнем шаге ныряет кролик. */
.clear {
  display: grid;
  grid-template-columns: 1fr 240px;
  column-gap: 2rem;
  align-items: start;
  margin-top: 0.25rem;
}
.tally {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding-top: 0.5rem;
}
/* строка подсчёта: медаль слева, текст, пунктир-«дорожка» снизу как в таблице очков */
.row {
  display: grid;
  grid-template-columns: 3rem 1fr;
  column-gap: 0.9rem;
  align-items: start;
  padding: 0.6rem 0.9rem 0.7rem 0.6rem;
  font-size: 1rem;
  line-height: 1.45;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.row.ok {
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 18px rgba(157, 255, 62, 0.25);
}
.row b {
  color: var(--pa-yellow);
}
.row.ok b {
  color: var(--pa-lime);
}
.row .ico {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  font-size: 2.25rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-yellow);
  box-shadow: inset -4px -4px 0 0 rgba(0, 0, 0, 0.25);
}
.row.ok .ico {
  background: var(--pa-lime);
}
.res-log {
  margin-top: 0.5rem;
  padding: 0.4rem 0.7rem;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .row:not(.slidev-vclick-hidden) {
    animation: a7-row 0.3s steps(3, end) both;
  }
}
@keyframes a7-row {
  from {
    transform: translateX(-24px);
  }
  to {
    transform: none;
  }
}
</style>

<!--
Давайте вернёмся к тому, с чего начали.
[click] Задача решена. Скриншотный тест больше не говорит «картинки не совпали». Он говорит: сломались цвет и жирность, и вот насколько сеть в этом уверена. Это читает и человек, и AI-агент, и оба знают, что чинить.
[click] И сеть правда работает: около девяноста процентов попаданий на story, которых она не видела на тренировке, две с половиной миллисекунды на окошко, а всё обучение — пара часов на обычном ноутбуке. Ни строчки Python, всё на JavaScript, который мы и так знаем.
[click] Но главное, что я хочу, чтобы вы унесли: это безумно интересно. Машинное обучение — глубокая кроличья нора. Сегодня мы прошли по самому краю: свёртки, эпохи, кучки, метрики. А дальше ещё больше: другие архитектуры, свои свойства, настоящие макеты из Figma вместо синтетики. Не бойтесь, ныряйте глубже — порог входа для фронтендера гораздо ниже, чем кажется.
-->
