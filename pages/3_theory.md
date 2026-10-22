---
layout: interjection
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
variant: 11
leftWidth: 46%
---

::header::
## Что такое нейросеть

::default::

<svg class="neuron" viewBox="0 0 400 270" role="img" aria-label="Искусственный нейрон: три входа с весами складываются в сумму, сумма проходит через порог и даёт выход">
  <g class="inputs">
    <circle cx="36" cy="55" r="22" /><text x="36" y="61">x₁</text>
    <circle cx="36" cy="135" r="22" /><text x="36" y="141">x₂</text>
    <circle cx="36" cy="215" r="22" /><text x="36" y="221">x₃</text>
  </g>
  <g class="edges">
    <line x1="58" y1="55" x2="178" y2="125" />
    <line x1="58" y1="135" x2="178" y2="135" />
    <line x1="58" y1="215" x2="178" y2="145" />
    <line x1="252" y1="135" x2="340" y2="135" marker-end="url(#neuron-arrow)" />
  </g>
  <g class="weights">
    <text x="112" y="78">w₁</text>
    <text x="112" y="126">w₂</text>
    <text x="112" y="200">w₃</text>
  </g>
  <circle class="body" cx="215" cy="135" r="37" />
  <text class="sum" x="215" y="146">Σ</text>
  <text class="out" x="372" y="141">y</text>
  <defs>
    <marker id="neuron-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0L10 5L0 10z" />
    </marker>
  </defs>
</svg>


::right::

<div class="cards col">
  <div class="card ok" v-click="1"><div class="ico"><tabler-adjustments-horizontal /></div><span>Функция с десятками тысяч чисел-весов, которые обучение подгоняет под примеры</span></div>
  <div class="card" v-click="2"><div class="ico"><tabler-brain /></div><span><b>Нейрон</b> — как нервная клетка: складывает входы с весами и «срабатывает» выше порога</span></div>
  <div class="card" v-click="3"><div class="ico"><tabler-topology-star-3 /></div><span><b>Сеть</b> — нейроны слоями: выход одних — вход для следующих</span></div>
</div>

<style scoped>
.neuron {
  width: 400px;
  display: block;
}
.neuron circle {
  fill: var(--dd-card-bg);
  stroke: var(--dd-card-border);
  stroke-width: 2;
}
.neuron .body {
  stroke: var(--color-green);
}
.neuron line {
  stroke: var(--dd-sub);
  stroke-width: 2;
}
.neuron marker path {
  fill: var(--dd-sub);
}
.neuron text {
  fill: currentColor;
  font-size: 20px;
  text-anchor: middle;
}
.neuron .weights text {
  fill: var(--color-cyan);
}
.neuron .sum {
  font-size: 30px;
}
.formula {
  margin-top: 0.6rem;
  font-family: var(--font-mono, monospace);
}
.col {
  grid-template-columns: 1fr;
}
.col .card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.col .card .ico {
  margin-bottom: 0;
  flex: none;
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
variant: 12
leftWidth: 46%
---

::header::
## Как считает один нейрон

::default::

<div class="demo" v-click="5">
  <div class="row"><div class="px" /><div class="px on" /><div class="px" /><span>Σ = 2</span><b class="accent">горит</b></div>
  <div class="row"><div class="px on" /><div class="px on" /><div class="px on" /><span>Σ = 0</span><b class="sub">молчит</b></div>
  <div class="row"><div class="px on" /><div class="px" /><div class="px on" /><span>Σ = −2</span><b class="bad">против</b></div>
</div>

::right::

<div class="cards col">
  <div class="card" v-click="1"><div class="sym">x</div><span><b>Входы</b>: пиксели картинки или выходы прошлого слоя</span></div>
  <div class="card" v-click="2"><div class="sym">w</div><span><b>Вес</b> каждого входа: голос «за», «против» или «всё равно»</span></div>
  <div class="card" v-click="3"><div class="sym">Σ</div><span><b>Сумма</b>: каждый вход умножаем на его вес и складываем</span></div>
  <div class="card ok" v-click="4"><div class="sym">y</div><span><b>Выход</b>: сумма после порога, уходит следующим нейронам</span></div>
</div>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.demo .sub {
  margin: 0 0 0.3rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
}
.px {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background: var(--dd-card-bg);
  border: 1px solid var(--dd-card-border);
}
.px.on {
  background: #fff;
}
.row span {
  margin-left: 1rem;
  width: 5.5rem;
  font-family: monospace;
}
.col {
  grid-template-columns: 1fr;
}
.col .card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.sym {
  flex: none;
  width: 2.2rem;
  font-size: 2rem;
  line-height: 1;
  text-align: center;
  color: var(--color-cyan);
}
.card.ok .sym {
  color: var(--color-green);
}
</style>

<!--
Разберём, что считает один нейрон.
[click] x — входы. Числа, которые нейрон получает. У первого слоя это пиксели картинки: яркость от нуля до единицы. У следующих слоёв — выходы предыдущих нейронов.
[click] w — веса, по одному на каждый вход. Вес говорит, насколько вход важен и куда тянет. Большой положительный — голос «за», отрицательный — голос «против», около нуля — этот вход нейрону безразличен. Веса и есть те самые ручки, их подбирает обучение.
[click] Σ — сумма. Каждый вход умножаем на его вес и всё складываем. Получается одно число: насколько входы голосуют за то, что ищет нейрон.
[click] y — выход. Сумма проходит через порог, и результат уходит дальше: следующим нейронам или в ответ сети.
[click] Пример. Нейрон ищет светлую точку на тёмном фоне: у середины вес плюс два, у соседей минус один. Минус — это «здесь должно быть темно». Одна светлая точка посередине — сумма два, горит. Сплошная светлая заливка — плюсы и минусы гасят друг друга, ноль, молчит: без отрицательных весов нейрон не отличил бы точку от просто светлого пятна. Светлые края при тёмной середине — минус два, голос против. Такой набор весов — это и есть трафарет, о нём следующий слайд.
-->

---
layout: two-cols
variant: 13
leftWidth: 48%
clicks: 4
---

::header::
## Свёртка

::default::

<ConvStencil :step="$clicks" />

::right::

<div class="cards col">
  <div class="card" v-click="1">Один и тот же фильтр ищет один и тот же узор (край буквы, линию рамки) в любом месте картинки</div>
  <div class="card ok" v-click="4"><div class="ico"><tabler-scissors /></div>Можно представить, как трафарет</div>
</div>

<style scoped>
.col {
  grid-template-columns: 1fr;
}
</style>

<!--
Главный кирпичик сети — свёртка. Это трафарет-фильтр три на три пикселя: он ползёт по картинке, умножает соседние пиксели на свои числа — это те самые ручки, их ещё называют весами — и складывает. Получается одно число: насколько это место похоже на то, что ищет фильтр. Слева такой фильтр-трафарет — горизонтальная палочка, рядом буквы «Т» и «Г».
[click] Прикладываем трафарет к верху «Т» — совпало, нашёл палочку.
[click] Тот же трафарет прикладываем к «Г» в другом углу — тоже нашёл. Одни и те же девять чисел работают по всей картинке.
[click] А на пустом месте фильтр молчит.
[click] Важная оговорка: палочку я нарисовал для примера. Сами мы трафареты не рисуем. В TensorFlow.js это слой tf.layers.conv2d с kernelSize: 3, а числа каждого фильтра подбирает обучение.
-->

---
layout: simple-slide
variant: 16
---

## Нейросеть как домик из трафаретов

<div class="house">
  <div class="floor" v-click="3">
    <span class="lvl">3</span>
    <span class="pic spaced">Сохранить</span>
    <span>видит ещё крупнее: «буквы стоят слишком далеко друг от друга», «строки разъехались»</span>
  </div>
  <div class="floor" v-click="2">
    <span class="lvl">2</span>
    <span class="pic">Т Г ▭</span>
    <span>трафареты к ответам первого этажа: «где палочки стоят рядом?» → буквы и линии рамки</span>
  </div>
  <div class="floor" v-click="1">
    <span class="lvl">1</span>
    <span class="pic">| — ⌐ ⌙</span>
    <span>много маленьких трафаретов 3×3: палочка, уголок, край буквы</span>
  </div>
</div>

<style scoped>
.house {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.floor {
  display: grid;
  grid-template-columns: 2.6rem 15rem 1fr;
  align-items: center;
  gap: 1rem;
  background: var(--dd-card-bg);
  border: 1px solid var(--dd-card-border);
  border-radius: 14px;
  padding: 0.8rem 1rem;
}
.lvl {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-cyan);
}
.pic {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-green);
  letter-spacing: 0.1em;
}
.pic.spaced {
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  white-space: nowrap;
}
</style>

<!--
Одна свёртка видит девять пикселей. а у нас компоненты побольше, так? чтобы покрыть большие площади, мы  Свёртки складываем этажами, как домик.
[click] Первый этаж — маленькие трафареты: палочки, уголки, края букв.
[click] Второй этаж прикладывает свои трафареты к ответам первого: «где палочки стоят рядом?». Так складываются буквы и линии рамки.
[click] Третий видит ещё крупнее: «буквы слишком далеко друг от друга» — это letter-spacing, «строки разъехались» — line-height. Между этажами картинку уменьшаем вдвое, как будто отходим от картины на шаг. А в самом конце каждый трафарет отвечает на один вопрос: нашёл я своё где-нибудь на картинке или нет. В TensorFlow.js это готовые слои conv2d, maxPooling2d и globalAveragePooling2d — вся наша сеть умещается в десяток строк.
-->

---
layout: simple-slide
variant: 20
# скрыт ради тайминга, вернуть — убрать hide
hide: true
---

## Альтернативы

<div class="cards three">
  <div class="card no" v-click="1">
    <div class="ico"><tabler-school /></div>
    <b>Трансформер (ViT)</b>: нанять профессора, чтобы он проверил сложение в столбик
  </div>
  <div class="card no" v-click="2">
    <div class="ico"><tabler-telescope /></div>
    <b>Показать весь скриншот целиком</b>: искать опечатку, глядя на страницу с другого конца комнаты
  </div>
  <div class="card no" v-click="3">
    <div class="ico"><tabler-eyeglass /></div>
    <b>Готовая сеть MobileNet</b>: очки, в которых учились узнавать котов и машины, не замечает тонкие детали
  </div>
</div>

<style scoped>
.three {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1rem;
}
.three .ico {
  font-size: 3rem;
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
variant: 26
---

## Своя уверенность для каждого свойства

<div class="pair">
  <figure>
    <img src="/images/slides/washer-broken.jpg" alt="Разбитая стиральная машина брошена на землю, корпус вскрыт">
  </figure>
  <figure v-click="1">
    <img src="/images/slides/dashboard-lights.jpg" alt="Приборная панель автомобиля: одновременно горят лампы check engine и аккумулятора">
  </figure>
</div>

<p class="credits">Фото: JIP, CC BY-SA 4.0; Shixart1985, CC BY 2.0 — Wikimedia Commons</p>

<style scoped>
.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.pair figure {
  margin: 0;
}
.pair img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}
.pair figcaption {
  margin-top: 0.6rem;
}
.credits {
  margin-top: 1rem;
  font-size: 1rem;
  color: var(--dd-sub);
}
</style>

<!--
Теперь про то, как сеть отвечает. Можно сделать ответ как одну общую стирку: закинуть в машинку всё сразу — цветное, белое, чёрное. Уверенность делится на всех, и на выходе серая каша: всего понемногу, ничего чётко. Сеть обязана раздать сто процентов между вариантами, и если сломались два свойства, каждому достанется по половинке.
[click] А нам надо чётко и точечно, как на приборной панели. У каждой лампы свой датчик: check engine горит про двигатель, аккумулятор — про аккумулятор, и они друг другу не мешают. Могут гореть обе сразу, и обе по делу. Так и у нашей сети: пять отдельных лампочек, по одной на свойство, каждая светится от нуля до единицы сама по себе. Яркость — это уверенность, а «сломалось» — значит, лампочка ярче порога, у нас это 0.5. Порог — наша договорённость, а не часть сети.
-->

---
layout: simple-slide
variant: 20
---

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

<!--
Всё, что мы только что разобрали, в коде помещается в одну функцию. Это настоящая архитектура нашей сети, я только убрал настройки регуляризации.
[click] Вот трафарет: слой conv2d с kernelSize: 3. filters — сколько разных трафаретов на этаже. Числа внутри трафаретов мы не пишем, их подберёт обучение. Рядом shrink — maxPooling, то самое «отойти от картины на шаг»: картинка уменьшается вдвое.
[click] А вот этажи домика. На вход окно 64 на 64, в нём семь слоёв цвета: картинка «как надо», «как стало» и маска отличий. На каждом этаже два слоя трафаретов: на первом по шестнадцать, на втором по тридцать два, на третьем шестьдесят четыре и девяносто шесть. Чем выше этаж, тем крупнее узоры и тем больше их видов — всего двести пятьдесят шесть трафаретов.
[click] И выход. globalAveragePooling отвечает каждому трафарету на вопрос «нашёл я своё где-нибудь на картинке или нет». Потом небольшой слой собирает ответы вместе, а последний даёт пять лампочек с sigmoid — те самые со слайда про уверенность.
[click] Всё вместе — около ста тысяч чисел-весов и меньше двадцати строк кода. Осталось понять, как сеть учится зажигать нужные лампочки.
-->

---
layout: two-cols
variant: 12
leftWidth: 50%
clicks: 3
---

::header::
## Как сеть учится

::default::

<div class="cards col">
  <div class="card" v-click="1"><span class="ico-i"><tabler-flame /></span> Как игра «горячо — холодно»: сеть отвечает, мы говорим, насколько она ошиблась. Это число: <b>loss</b></div>
  <div class="card" v-click="2"><span class="ico-i"><tabler-tool /></span> После каждой подсказки сеть чуть-чуть подкручивает свои числа. Так тысячи раз</div>
  <div class="card ok" v-click="3"><span class="ico-i"><tabler-book /></span> Один проход по всем примерам: одна <b>эпоха</b>, как прочитать весь учебник</div>
</div>

::right::

<LineChart
  :series="[{ points: [0.95, 0.62, 0.45, 0.36, 0.3, 0.27, 0.25, 0.24], color: '#62ecff', label: 'loss', show: $clicks >= 1 }]"
  :width="400"
  :height="300"
/>

<style scoped>
.col {
  grid-template-columns: 1fr;
}
</style>

<!--
Как сеть вообще учится?
[click] Как в игре «горячо — холодно». Сеть отвечает, а функция потерь сверяет ответ с правильным — его мы знаем заранее, потому что сами сломали свойство, — и выдаёт одно число: насколько сеть ошиблась. Это число называется loss. У нас функция потерь — binaryCrossentropy: она штрафует каждую лампочку отдельно, «эта не должна была гореть», «эта должна гореть ярче». В TensorFlow.js она готовая: loss: 'binaryCrossentropy'. Чем «холоднее», тем оно больше. Справа видно: в начале loss большой, сеть отвечает почти наугад.
[click] После каждой подсказки сеть чуть-чуть подкручивает свои ручки-числа, чтобы в следующий раз было «теплее». Не сразу, а понемногу. И так тысячи раз. Кривая loss ползёт вниз. В какую сторону крутить каждое число, TensorFlow.js считает сам. У нас это один вызов model.trainOnBatch на каждую пачку из шестнадцати примеров.
[click] Один раз пройти по всем примерам называется эпохой. Это как прочитать весь учебник от корки до корки. Обычно нужно несколько эпох: с первого прочтения учебник не запоминается. Цикл по эпохам — обычный for в нашем коде, перед каждой эпохой примеры перемешиваем.
-->

---
layout: two-cols
variant: 12
leftWidth: 50%
clicks: 2
---

::header::
## Как сеть учится

::default::

<div class="cards col">
  <div class="card no" v-click="1"><div class="ico"><tabler-notes /></div>Главная опасность: зубрёжка. Ученик выучил ответы к задачам из учебника и не решит такую же задачу с другими числами. Это переобучение</div>
  <div class="card ok" v-click="2"><div class="ico"><tabler-eye-off /></div>Защита: часть задач прячем и не показываем на тренировке. Оцениваем сеть только на них, как контрольную</div>
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

<style scoped>
.col {
  grid-template-columns: 1fr;
}
</style>

<!--
[click] У обучения есть главная опасность — зубрёжка. Представьте ученика, который выучил наизусть ответы ко всем задачам в учебнике. На уроке он отличник. А дайте ему ту же задачу с другими числами — и он не решит. У сетей это называется переобучение: сеть запоминает конкретные картинки вместо общего правила.
[click] Защита простая: часть задач прячем и ни разу не показываем на тренировке. А оцениваем сеть только на них, как на контрольной с новыми задачами. Смотрите на график: на учебнике ошибка всё падает, а на контрольной в какой-то момент начинает расти. Вот с этой точки сеть зубрит.
-->
