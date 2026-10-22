---
layout: simple-slide
variant: 11
transition: slide-left
---

## Готовим данные

<div class="flow steps">
  <div class="card" v-click="1"><div class="ico"><logos-storybook-icon /></div>берём сторибук</div>
  <div class="arrow" v-click="2">→</div>
  <div class="card" v-click="2"><div class="ico"><tabler-camera /></div>генерируем чистые скриншоты</div>
  <div class="arrow" v-click="3">→</div>
  <div class="card" v-click="3"><div class="ico"><tabler-tool /></div>программно искажаем (мутация)</div>
  <div class="arrow" v-click="4">→</div>
  <div class="card ok" v-click="4"><div class="ico"><tabler-camera /></div>собираем мутированные скриншоты</div>
</div>

<div class="pair">
  <img v-click="2" src="/images/dd/card-clean.png" class="pix" alt="Карточка, эталон">
  <img v-click="4" src="/images/dd/card-render.png" class="pix" alt="Карточка после мутации letter-spacing">
</div>

<style scoped>
.steps .card {
  flex: 1;
}
.pair {
  display: flex;
  gap: 1rem;
  margin-top: 1.4rem;
}
.pair img {
  width: 400px;
}
</style>

<!--
Чтобы сеть чему-то научилась, ей нужны размеченные данные, в нашем случае это скриншоты компонентов, отличающихся от эталонов, в которых мы точно знаем, какие CSS свойства отличаются. Где их взять?
[click] Берём Storybook — витрину, где каждый компонент лежит отдельно и в разных состояниях. Одно такое состояние, например «кнопка Primary», в сторибуке называется сторёй — все, думаю ,это и так знают.
[click] Фотографируем каждый компонент «как надо», это эталон. Снимает Playwright: открывает сторю, ждёт загрузки шрифтов и делает page.screenshot. Это "как надо"
[click] Дальше нарочно портим одно CSS-свойство, например межбуквенный интервал. То есть создаём мутацию. В коде это page.evaluate: прямо в странице выбираем элемент и пишем ему el.style.setProperty с новым значением.
[click] И фотографируем ещё раз, «как стало», затем накладываем друг и на друга и видим, что на правой карточке буквы чуть разъехались. Получилась пара картинок, и мы знаем правильный ответ — сломался letter-spacing. Таких пар длеаем тысячи без ручной разметки. А если после поломки не поменялся ни один пиксель — скажем, у компонента нет рамки, а мы поменяли её толщину, — такую пару честно выбрасываем: учиться на ней нечему.
-->
