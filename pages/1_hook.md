---
layout: simple-slide
variant: 5
transition: slide-left
---

## Где же ошибка?

<div class="pw">
  <div class="pw-shot">
    <div class="pw-tab">Expected</div>
    <img src="/images/dd/button-clean.png" class="pix" alt="Кнопка «Сохранить», эталон">
  </div>
  <div class="pw-shot">
    <div class="pw-tab">Actual</div>
    <img src="/images/dd/button-render.png" class="pix" alt="Кнопка «Сохранить», рендер">
  </div>
  <div class="pw-shot" v-click="2">
    <div class="pw-tab bad">Diff</div>
    <img src="/images/dd/button-diff.png" class="pix" alt="Дифф pixelmatch: красным отмечены отличающиеся пиксели">
  </div>
</div>

<div class="cards hook">
  <div class="card" v-click="1"><div class="ico"><tabler-eye /></div>Или глаза, или скриншот</div>
  <div class="card" v-click="2"><div class="ico"><tabler-marquee-2 /></div>Скриншот показывает область</div>
  <div class="card ok" v-click="3"><div class="ico"><tabler-target-arrow /></div>Хотим, чтобы агент видел, что именно</div>
</div>

<style scoped>
.pw {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
}
.pw-shot img {
  width: 258px;
}
.pw-tab {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--dd-sub);
}
.hook {
  grid-template-columns: repeat(3, 1fr);
}
</style>

<!--
Давайте погрузимся в задачу. Перед вами обычный скриншотный тест Playwright: слева эталон кнопки, справа то, что отрендерилось сейчас. Видно, что они отличаются, но не очень понятно, только ли жирностью, или ещё межбуквенный отличается. А цвет фона? а текста?
[click] Обычно у нас два пути: смотреть глазами или доверить сравнение скриншотов программе. Глаза устают и пропускают мелочи, а вот программа не устаёт.
[click] Вот что возвращает скриншотный тест: красным закрашены пиксели, которые не совпали. Видно, что что-то случилось с текстом. Но что именно? Цвет? Жирность? Буквы раздвинулись? Скриншот показывает только область, где искать, а дальше снова работают глаза разработчика.
[click] А мы хотим, чтобы проверяющий — человек или AI-агент — сразу получал ответ: что именно поменялось. Здесь, кстати, текст стал тоньше: жирность упала с 600 до 500, и чуть посветлел цвет. Вот об этом весь доклад.
-->

---
layout: simple-slide
variant: 9
transition: slide-up
---

## Что в результате

<div class="res">
  <div class="card" v-click="1">
    <div class="ico"><logos-playwright /></div>
    <b>Playwright</b>: где
    <img src="/images/dd/button-diff.png" class="pix" alt="Дифф кнопки">
  </div>
  <div class="card ok" v-click="2">
    <div class="ico"><tabler-spy /></div>
    <b>design-dealer</b>: что
    <Lamps :values="[0.94, 0.71, 0.08, 0.05, 0.03]" :threshold="0.5" class="mini" />
  </div>
</div>

<div v-click="3" class="log">button--primary: область 12,40–180,72: <span v-mark.underline.orange="4">color (0.94), font-weight (0.71)</span></div>

<style scoped>
.res {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.2rem;
  margin-bottom: 1rem;
}
.res img {
  width: 200px;
  margin-top: 0.6rem;
}
.mini {
  margin-top: 0.6rem;
  gap: 0.4rem;
}
.mini :deep(.lamp) {
  width: 5.4rem;
}
</style>

<!--
Что получается в итоге.
[click] Playwright отвечает на вопрос «где»: вот область, где пиксели не совпали.
[click] design-dealer отвечает на вопрос «что». У него пять лампочек, по одной на каждое CSS-свойство, которое он умеет узнавать: цвет, жирность, межбуквенный интервал, межстрочный интервал и рамка. Чем ярче лампочка, тем увереннее сеть, что сломалось именно это свойство.
[click] И всё это попадает прямо в сообщение упавшего теста. Причём конкретно: компонент такой-то, сломались цвет и жирность. Технически это наш собственный матчер Playwright: если пиксели не совпали, он вырезает кусочки вокруг отличий, спрашивает модель и прикладывает находки к отчёту теста.
[click] То есть на выходе — список находок: какой компонент, в какой области картинки, какое свойство и насколько сеть уверена в этом. Четыре числа после слова «область» — координаты прямоугольника с отличиями. Цифры в скобках — это и есть уверенность от нуля до единицы. Прикольно же, правда? Тогда давайте знакомиться и погружаться вместе в этот волшебный мир машлёрна
-->
