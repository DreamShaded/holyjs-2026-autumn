---
layout: interjection
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
variant: 12
---

## Кто что делает

<div class="cards grid3">
  <div class="card" v-click="1">
    <div class="ico"><logos-typescript-icon /> <logos-esbuild /> <logos-vitest /></div>
    <b>tsx/esbuild, vitest</b>
  </div>
  <div class="card" v-click="1">
    <div class="ico"><logos-vue /> <logos-vuetifyjs /> <logos-storybook-icon /></div>
    <b>Vue 3 и Storybook</b>; Vuetify — чужие компоненты для проверки
  </div>
  <div class="card" v-click="2">
    <div class="ico"><logos-playwright /> <logos-chrome /></div>
    <b>Playwright + Chromium</b>: руки и глаза
  </div>
  <div class="card" v-click="3">
    <div class="ico"><tabler-zoom-scan /></div>
    <b>pixelmatch + pngjs</b>: игра «найди отличия», кладёт две фотографии одна на другую и обводит, где не совпало
  </div>
  <div class="card ok" v-click="4">
    <div class="ico"><logos-tensorflow /></div>
    <b>TensorFlow.js</b>, мозг: сама сеть, её обучение и применение
  </div>
  <div class="card" v-click="5">
    <div class="ico"><logos-zod /></div>
    <b>zod</b> проверяет документы на входе и выходе: файл модели, находки, список примеров
  </div>
</div>

<style scoped>
.grid3 {
  grid-template-columns: repeat(3, 1fr);
}
.grid3 .ico {
  display: flex;
  gap: 0.4rem;
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
variant: 12
---

## Инфраструктура


<div class="cards grid3">
  <div class="card no" v-click="1">
    <div class="ico"><logos-nodejs-icon /></div>
    обычный JS в Node работает, но <b>116 секунд</b> на маленькой задаче
  </div>
  <div class="card no" v-click="2">
    <div class="ico"><logos-webassembly /></div>
    wasm быстрый, но не умеет учиться, только отвечать
  </div>
  <div class="card ok" v-click="3">
    <div class="ico"><logos-chrome /></div>
    выбрал headless Chromium, WebGL
  </div>
</div>

<style scoped>
.grid3 {
  grid-template-columns: repeat(3, 1fr);
  margin-top: 0.6rem;
}
.grid3 .ico {
  font-size: 2.6rem;
}
</style>

<!--
Где учить сеть — отдельная история.
[click] Первая попытка — обычный JavaScript в Node. Работает, но медленно: 116 секунд на игрушечной задаче. Быстрый нативный вариант tfjs-node на моей машине просто не собрался.
[click] Вторая — WebAssembly. Быстрый, но умеет только отвечать, а учиться не умеет: в нём нет нужной для обучения операции, обратного прохода свёртки. Это как калькулятор, который считает, но не умеет исправлять свои ошибки.
[click] И тогда я пошёл в браузер. Headless Chromium, а в нём WebGL — это доступ к видеокарте прямо из JavaScript. Та же задача заняла меньше четырёх секунд вместо ста шестнадцати. Один совет: в конце обучения печатайте, на чём рисовал WebGL. У нас в логе строчка «renderer ANGLE, NVIDIA RTX 4070». Её можно достать из самого WebGL. Без неё можно час ждать обучения на процессоре, через программное рисование, и не понимать почему.
-->

---
layout: simple-slide
variant: 12
---

## Инфраструктура

<div class="flow infra">
  <div class="card" v-click="1"><div class="ico"><logos-nodejs-icon /></div>Node поднимает браузер</div>
  <div class="arrow" v-click="2">→</div>
  <div class="card ok" v-click="2"><div class="ico"><logos-chrome /></div>браузер учит сеть</div>
  <div class="arrow" v-click="3">→</div>
  <div class="card" v-click="3"><div class="ico"><tabler-package /></div>отдаёт веса обратно в Node, а тот пишет их</div>
</div>

<div v-click="4" class="speed">
  <span class="gnum">2.6 мс</span>
  <span class="sub">применение в Node: на кусочек картинки вместо</span>
  <span class="bad big">61 мс</span>
</div>

<style scoped>
.infra .card {
  flex: 1;
}
.infra .ico {
  font-size: 2.4rem;
}
.speed {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-top: 2rem;
}
.speed .gnum {
  font-size: 4rem;
}
.big {
  font-size: 2.4rem;
  font-weight: 700;
}
</style>

<!--
Как это устроено.
[click] Node запускает браузер через Playwright и подключает в страницу TensorFlow.js и наш бандл. Примеры браузер сам забирает обычным fetch с локального сервера.
[click] Внутри браузера TensorFlow.js учит сеть на видеокарте через WebGL.
[click] Готовые веса браузер отдаёт через model.save со своим обработчиком, а Node пишет их в model.json и weights.bin. Браузер здесь просто ускоритель.
[click] А применять сеть можно уже без браузера: в Node подключаем wasm-бэкенд, tf.setBackend('wasm'). Учиться он не умеет, зато отвечает за 2.6 миллисекунды на кусочек картинки 64 на 64 против 61 на обычном JavaScript, и ответы совпадают до последнего знака. Учим в браузере, применяем в Node.
-->
