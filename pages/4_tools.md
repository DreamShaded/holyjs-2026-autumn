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


<div class="tiles">
  <div class="tile no" v-click="1">
    <span class="badge">медленно</span>
    <div class="big-ico"><logos-nodejs-icon /></div>
    <div class="title">JS в Node</div>
    <div class="num bad">116 с</div>
    <div class="cap">на маленькой задаче</div>
  </div>
  <div class="tile no" v-click="2">
    <span class="badge">не учится</span>
    <div class="big-ico"><logos-webassembly /></div>
    <div class="title">WebAssembly</div>
    <div class="num bad">только ответы</div>
    <div class="cap">быстрый, но обучать на нём нельзя</div>
  </div>
  <div class="tile ok" v-click="3">
    <span class="badge">выбрал</span>
    <div class="big-ico"><logos-chrome /></div>
    <div class="title">Headless Chromium</div>
    <div class="num accent">&lt; 4 с</div>
    <div class="cap">та же задача на видеокарте через WebGL</div>
  </div>
</div>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-top: 0.8rem;
}
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  min-height: 300px;
  padding: 2rem 1.2rem 1.4rem;
  border-radius: 20px;
  background: var(--dd-card-bg);
  border: 1px solid var(--dd-card-border);
}
.tile.no {
  border-color: rgba(255, 107, 107, 0.6);
  background: linear-gradient(180deg, rgba(255, 107, 107, 0.12), var(--dd-card-bg) 60%);
}
.tile.ok {
  border: 2px solid var(--color-green);
  background: linear-gradient(180deg, rgba(86, 255, 113, 0.14), var(--dd-card-bg) 60%);
  box-shadow: 0 0 32px rgba(86, 255, 113, 0.25);
}
.badge {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  font-size: 1rem;
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  border: 1px solid currentColor;
}
.no .badge {
  color: var(--dd-red);
}
.ok .badge {
  color: var(--color-green);
}
.big-ico {
  font-size: 4.5rem;
  line-height: 1;
  margin: 0.4rem 0 0.6rem;
}
.title {
  font-size: 1.4rem;
  font-weight: 700;
}
.num {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.1;
}
.cap {
  color: var(--dd-sub);
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

<div class="pipe">
  <div class="tile" v-click="1">
    <div class="big-ico"><logos-nodejs-icon /></div>
    <div class="title">Node</div>
    <div class="cap">поднимает браузер</div>
  </div>
  <div class="arrow" v-click="2"><tabler-arrow-right /></div>
  <div class="tile ok" v-click="2">
    <div class="big-ico"><logos-chrome /></div>
    <div class="title">Браузер</div>
    <div class="cap">учит сеть на видеокарте</div>
  </div>
  <div class="arrow" v-click="3"><tabler-arrow-right /></div>
  <div class="tile" v-click="3">
    <div class="big-ico cyan"><tabler-package /></div>
    <div class="title">Веса</div>
    <div class="cap">возвращаются в Node и ложатся в файлы</div>
  </div>
</div>

<div v-click="4" class="speed">
  <span class="gnum">2.6 мс</span>
  <span class="sub">применение в Node: на кусочек картинки вместо</span>
  <span class="bad big">61 мс</span>
</div>

<style scoped>
.pipe {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.8rem;
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  min-height: 210px;
  justify-content: center;
  padding: 1.4rem 1rem;
  border-radius: 20px;
  background: var(--dd-card-bg);
  border: 1px solid var(--dd-card-border);
}
.tile.ok {
  border: 2px solid var(--color-green);
  background: linear-gradient(180deg, rgba(86, 255, 113, 0.14), var(--dd-card-bg) 60%);
  box-shadow: 0 0 32px rgba(86, 255, 113, 0.25);
}
.big-ico {
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 0.4rem;
}
.title {
  font-size: 1.4rem;
  font-weight: 700;
}
.cap {
  color: var(--dd-sub);
}
.arrow {
  font-size: 2.2rem;
  color: var(--dd-sub);
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
