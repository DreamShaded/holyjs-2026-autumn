---
layout: interjection
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
variant: 30
---

## Top-1: по парам или по окошкам?

<div class="cards two">
  <div class="card" v-click="1"><b>По парам</b>: каждый сломанный компонент голосует один раз. <b>По окошкам</b>: голосует каждое окошко</div>
  <div class="card" v-click="2"><div class="ico"><tabler-users-group /></div>Как выбирать старосту голосами классов или голосами всех учеников: если в одном классе 40 человек, а в другом 5, результаты будут разными</div>
</div>

<div class="vuet" v-click="3">
  <p>Ранний прогон на Vuetify: большая карточка дала <b class="cyan">92 %</b> всех окошек</p>
  <div class="bar"><span class="lbl">по окошкам</span><span class="fill" style="--p: 78">78 %</span></div>
  <div class="bar"><span class="lbl">по парам</span><span class="fill pair" style="--p: 53">53 %</span></div>
</div>

<style scoped>
.two {
  grid-template-columns: 1fr 1.2fr;
}
.vuet {
  margin-top: 1rem;
}
.bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.4rem;
}
/* подпись фиксированной ширины и не сжимается — полоски начинаются с одной вертикали */
.bar .lbl {
  flex: none;
  width: 8.5rem;
}
.fill {
  display: block;
  flex: none;
  box-sizing: border-box;
  width: calc(var(--p) * 5px);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
  background: rgba(98, 236, 255, 0.35);
}
.fill.pair {
  background: rgba(86, 255, 113, 0.35);
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
variant: 20
---

## Что поймала наша сеть: precision

<p class="sub" v-click="1">Нашу нейросеть можно мерить как рыбацкую: в озере рыба (настоящие поломки) и всякий мусор</p>

<div class="catch">
  <div class="net" v-click="2">
    <span v-for="i in 7" :key="'f' + i"><tabler-fish /></span><span v-for="i in 3" :key="'b' + i" class="boot"><tabler-shoe /></span>
  </div>
  <div class="card ok" v-click="3"><b>Precision</b>: сколько в улове рыбы, а не старых ботинок. Вытащили 10 штук, рыб 7: precision = <span class="gnum">0.7</span></div>
</div>

<style scoped>
.catch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  align-items: center;
  margin-top: 1rem;
}
.net {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.4rem;
  padding: 1rem;
  border: 2px dashed var(--color-cyan);
  border-radius: 50%;
  font-size: 2.6rem;
  line-height: 1;
  text-align: center;
  color: var(--color-green);
}
.boot {
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.35);
  color: var(--dd-red);
}
.catch .gnum {
  font-size: 2.4rem;
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
variant: 20
---

## Что поймала наша сеть: recall

<div class="catch">
  <div class="lake" v-click="1">
    <div class="net">
      <span v-for="i in 8" :key="'in' + i"><tabler-fish /></span>
    </div>
    <span class="free"><tabler-fish /></span><span class="free two"><tabler-fish /></span>
  </div>
  <div class="card ok" v-click="2"><b>Recall</b>: сколько рыбы из озера поймали. Рыб было 10, в сеть попало 8: recall = <span class="gnum">0.8</span></div>
</div>

<style scoped>
.catch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  align-items: center;
  margin-top: 1rem;
}
.lake {
  position: relative;
  padding: 1.6rem;
  border-radius: 40%;
  background: rgba(11, 130, 255, 0.18);
}
.net {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.3rem;
  padding: 0.8rem;
  border: 2px dashed var(--color-cyan);
  border-radius: 50%;
  font-size: 2.4rem;
  line-height: 1;
  text-align: center;
  color: var(--color-green);
}
.free {
  line-height: 1;
  color: var(--color-green);
  position: absolute;
  right: 0.4rem;
  top: 0.4rem;
  font-size: 2.4rem;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.35);
}
.free.two {
  top: auto;
  bottom: 0.4rem;
  left: 0.6rem;
  right: auto;
}
.catch .gnum {
  font-size: 2.4rem;
}
</style>

<!--
Вторая метрика смотрит с другой стороны.
[click] Теперь считаем не улов, а озеро. Рыб в озере было десять. В сеть попало восемь, а две ушли — вот они, снаружи.
[click] Recall отвечает на вопрос: сколько рыбы из озера мы поймали? Восемь из десяти, recall 0.8. Каждая пятая поломка осталась незамеченной: цвет сломался, а сеть промолчала. Смотреть надо на оба числа сразу. Порог 0.5 у лампочек работает как размер ячейки: крупная ячейка почти не тащит мусор, но и рыбы ловит мало, а мелкая выгребет всю рыбу вместе с мусором. Как спам-фильтр: низкий precision — письмо заказчика уехало в спам, низкий recall — спам лезет во входящие.
-->

---
layout: simple-slide
variant: 20
---

## Precision и recall по свойствам

<div class="pr-wrap">

<table class="pr">
  <thead><tr><th>свойство</th><th>в улове рыба, а не мусор</th><th>поймано рыбы из озера</th></tr></thead>
  <tbody>
    <tr :class="{ hot: $clicks === 1 }"><td>рамка (<code>border</code>)</td><td>0.95</td><td>0.94</td></tr>
    <tr><td>межстрочный (<code>line-height</code>)</td><td>0.93</td><td>0.86</td></tr>
    <tr><td>цвет (<code>color</code>)</td><td>0.91</td><td>0.82</td></tr>
    <tr :class="{ hot: $clicks === 2 }"><td>жирность (<code>font-weight</code>)</td><td>0.88</td><td class="lo">0.75</td></tr>
    <tr :class="{ hot: $clicks === 3 }"><td>межбуквенный (<code>letter-spacing</code>)</td><td class="lo">0.70</td><td>0.84</td></tr>
  </tbody>
</table>

<div class="cards reads">
  <div class="card ok" v-click="1"><code>border</code>ловит почти идеально</div>
  <div class="card no" v-click="2"><code>font-weight</code>чаще всех уходит из сети</div>
  <div class="card no" v-click="3"><code>letter-spacing</code>больше всех мусора в улове</div>
</div>

</div>

<style scoped>
.pr td,
.pr th {
  padding: 0.3rem 1rem;
}
tr.hot td {
  color: var(--color-green);
}
td.lo {
  color: #ff6b6b;
  font-weight: 700;
}
.pr-wrap {
  display: inline-flex;
  flex-direction: column;
}
.reads {
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-top: 1rem;
}
.reads .card {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 1rem;
  padding: 0.55rem 0.9rem;
}
.reads code {
  align-self: flex-start;
  font-size: 1rem !important;
  font-weight: 700;
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
variant: 16
---

## Что в итоге

<div class="cards three">
  <div class="card ok" v-click="1">
    <div class="ico"><tabler-circle-check /></div>
    <b>Задача решена</b>: тест называет, что сломалось
    <div class="log res-log">color (0.94), font-weight (0.71)</div>
  </div>
  <div class="card" v-click="2">
    <div class="ico"><tabler-brain /></div>
    <b>Сеть работает</b>: ~90 % попаданий, 2.6 мс на окошко, обучение за пару часов на ноутбуке. Всё на JavaScript
  </div>
  <div class="card" v-click="3">
    <div class="ico"><tabler-sparkles /></div>
    <b>Это кроличья нора</b>: безумно интересно и очень глубоко. Ныряйте!
  </div>
</div>

<style scoped>
.three {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1rem;
}
.three .ico {
  font-size: 2.6rem;
}
.res-log {
  margin-top: 0.8rem;
  padding: 0.5rem 0.7rem;
}
</style>

<!--
Давайте вернёмся к тому, с чего начали.
[click] Задача решена. Скриншотный тест больше не говорит «картинки не совпали». Он говорит: сломались цвет и жирность, и вот насколько сеть в этом уверена. Это читает и человек, и AI-агент, и оба знают, что чинить.
[click] И сеть правда работает: около девяноста процентов попаданий на компонентах, которых она не видела, две с половиной миллисекунды на окошко, а всё обучение — пара часов на обычном ноутбуке. Ни строчки Python, всё на JavaScript, который мы и так знаем.
[click] Но главное, что я хочу, чтобы вы унесли: это безумно интересно. Машинное обучение — глубокая кроличья нора. Сегодня мы прошли по самому краю: свёртки, эпохи, кучки, метрики. А дальше ещё больше: другие архитектуры, свои свойства, настоящие макеты из Figma вместо синтетики. Не бойтесь, ныряйте глубже — порог входа для фронтендера гораздо ниже, чем кажется.
-->
