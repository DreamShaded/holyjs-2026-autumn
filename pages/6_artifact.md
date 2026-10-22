---
layout: interjection
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
variant: 26
---

## Как устроена сеть и почему она маленькая

<div class="tower" v-click="1">
  <span class="blk w16">16</span><span class="blk w16">16</span><span class="op">÷2</span>
  <span class="blk w32">32</span><span class="blk w32">32</span><span class="op">÷2</span>
  <span class="blk w64">64</span><span class="blk w96">96</span>
  <span class="op">→</span><span class="q">нашёл?</span>
  <span class="op">→</span><span class="blk dense">64</span>
  <span class="op">→</span><span class="bulbs"><tabler-bulb /><tabler-bulb /><tabler-bulb /><tabler-bulb /><tabler-bulb /></span>
</div>

<div class="cards two">
  <div class="card stat" v-click="2"><span class="gnum">97 653</span>числа подкручиваются при обучении. Для нейросети это мало</div>
  <div class="card" v-click="3">Изначально планировали шире (32-…-128), но мы искали минимальную модель, дающую интересные цифры</div>
</div>

<style scoped>
.tower {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.6rem 0 1.4rem;
}
.blk {
  display: grid;
  place-items: center;
  width: 48px;
  border-radius: 8px;
  font-weight: 700;
  background: rgba(98, 236, 255, 0.18);
  border: 1px solid var(--color-cyan);
}
.w16 { height: 60px; }
.w32 { height: 90px; }
.w64 { height: 120px; }
.w96 { height: 150px; }
.dense {
  height: 60px;
  background: rgba(86, 255, 113, 0.18);
  border-color: var(--color-green);
}
.op {
  color: var(--dd-sub);
  font-weight: 700;
}
.q {
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  border: 1px dashed var(--dd-card-border);
}
.bulbs {
  display: flex;
  flex-direction: column;
  font-size: 1.3rem;
  line-height: 1;
  color: #ffe278;
}
.two {
  grid-template-columns: 1fr 1.3fr;
}
</style>

<!--
Как устроена наша сеть.
[click] Это башенка. Два этажа по 16 трафаретов, потом уменьшаем картинку вдвое. Два этажа по 32 трафарета, снова уменьшаем. Потом этажи на 64 и на 96 трафаретов. Дальше каждый трафарет отвечает «нашёл или нет». Маленький слой из 64 чисел-ячеек собирает эти ответы вместе, и на выходе пять лампочек.
[click] Всего при обучении подкручивается 97 653 числа. Звучит много, но для нейросети это очень мало: у больших моделей их миллиарды. Весь файл с весами меньше половины мегабайта.
[click] Изначально мы планировали сеть шире, от 32 до 128 трафаретов на этаже. Но такая широкая сеть роняла браузер, когда видеокарты нет и всё рисуется программно. А главное, цель была найти минимальную модель, которая уже даёт интересные цифры. Чем меньше сеть, тем быстрее она в тестах и тем проще её понять.
-->

---
layout: two-cols
variant: 26
leftWidth: 55%
---

::header::
## Как выглядит модель

::default::

<div class="files">
  <div class="card" v-click="1"><code>model.json</code>: инструкция по сборке: какие этажи и в каком порядке</div>
  <div class="card" v-click="2"><code>weights.bin</code>: сами детали: все 97 653 подкрученных числа</div>
  <div class="card" v-click="3"><code>meta.json</code>: паспорт: какая лампочка какое свойство означает, какого размера окошко, сколько эпох училась</div>
  <div class="card" v-click="4"><code>cv.json</code>: табель с оценками по пяти кучкам, рядом сами пять проверочных сетей (<code>folds/0..4/</code>)</div>
</div>

::right::

<pre class="log meta" v-click="3">{
  "registryVersion": <span v-mark.box.orange="5">"3445fa09…"</span>,
  "outputOrder": [
    "color", "font-weight",
    "letter-spacing",
    "line-height", "border"
  ],
  "windowSize": 64,
  "epochs": 6,
  "stopMetric": "top1pair"
}</pre>

<p v-click="5" class="sub">В паспорте есть отпечаток списка свойств (<code>registryVersion</code>). Если список поменяли, а сеть старая, это видно сразу</p>

<style scoped>
.files {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.files .card {
  padding: 0.6rem 0.9rem;
}
.meta {
  margin-top: 0.2rem;
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
