---
layout: simple-slide
level: 8
variant: 30
clicks: 2
---

## Ваш следующий уровень

<span class="sq-tag" aria-hidden="true">SIDE QUESTS</span>

<div class="sq">
  <div class="sq-recipe">
    <span class="step">ответы бесплатно</span><i>→</i><span class="step">маленькая сеть</span><i>→</i><span class="step">честная контрольная</span><i>→</i><span class="step">порог по цене ошибки</span>
  </div>
  <div class="sq-board">
    <section class="quest q-bot" v-click="1">
      <header><span class="stars">★★<b>★</b></span><span class="q-title">Человек или бот</span><span class="q-time">≈ 1–2 выходных</span></header>
      <A8MouseTrails />
      <p>Живые траектории мыши — свои и коллег, ботов бесплатно рисует Playwright</p>
      <p class="warn">Кучки делим по людям. Заблокировать живого дороже, чем пропустить бота</p>
    </section>
    <section class="quest q-pre" v-click="2">
      <header><span class="stars">★★★</span><span class="q-title">Следующий экран</span><span class="q-time">≈ 2–4 недели</span></header>
      <A8PrefetchMap />
      <p>Ответы уже в аналитике: куда человек пошёл дальше. Угадали — подгружаем заранее</p>
      <p class="warn">Учимся на прошлом месяце, проверяем на этом. Промах стоит трафика</p>
    </section>
  </div>
</div>

<style scoped>
/* Доска побочных квестов: сверху рецепт из доклада, ниже два квеста-карточки.
   Слева «человек или бот» (траектории курсора), справа «следующий экран» (карта экранов
   с предзагрузкой). Время — оценка «по вечерам», сложность — звёзды. */
.sq {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
}
.sq-recipe {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.45rem;
  font-size: 1rem;
  color: var(--pa-text);
}
.sq-recipe i {
  font-style: normal;
  font-size: 1.25rem;
  color: var(--lvl-accent);
}
.sq-recipe .step {
  padding: 0.1rem 0.45rem;
  background: rgba(16, 10, 34, 0.85);
  box-shadow: 0 0 0 2px #3a3160;
}
/* плашка в правом верхнем углу, на уровне заголовка — как «ПОПЫТКА n/3» в акте 5 */
.sq-tag {
  position: absolute;
  top: 3.7rem;
  right: 3.5rem;
  padding: 0.3rem 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-yellow);
}
.sq-board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
.quest {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.6rem 0.8rem 0.7rem;
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--tone),
    0 3px 0 0 var(--tone),
    -3px 0 0 0 var(--tone),
    3px 0 0 0 var(--tone),
    0 0 1.2rem -0.3rem var(--tone);
}
.q-bot { --tone: var(--pa-lime); }
.q-pre { --tone: var(--pa-yellow); }
.quest:not(.slidev-vclick-hidden) {
  animation: sq-in 0.4s steps(4, end);
}
@keyframes sq-in {
  from { opacity: 0; transform: translateY(12px); }
}
.quest header {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}
.stars {
  font-size: 1.125rem;
  color: var(--pa-yellow);
  letter-spacing: 0.05em;
}
.stars b {
  font-weight: inherit;
  color: #3a3160;
}
.q-title {
  font-family: var(--pa-font-pixel);
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1;
  color: var(--tone);
}
.q-time {
  margin-left: auto;
  font-family: var(--pa-font-pixel);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pa-text);
}
.quest p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.35;
  color: var(--pa-text);
}
.quest p.warn {
  color: var(--pa-text-dim);
}
@media (prefers-reduced-motion: reduce), print {
  .quest { animation: none !important; }
}
</style>

<!--
Я дал вам базу, и она не только про скриншоты. Нужны три вещи: задача, где правильный ответ достаётся бесплатно, маленькая сеть и честная контрольная. А порог выбираем по тому, какая ошибка дороже. Вот два проекта на том же рецепте, если захочется попробовать самим.
[click] Первый — человек или бот по движению мыши. Живые траектории записываете у себя и у коллег, а ботов бесплатно рисует Playwright: прямые линии, ровный шаг, курсор прыгает. Это та же синтетика, что у нас с мутациями. Маленькая свёрточная сеть смотрит на траекторию так же, как наша — на окошко. Две ловушки из доклада: кучки для проверки делим по людям, а не по сессиям, иначе сеть выучит почерк конкретного человека. И порог ставим по цене ошибки: заблокировать живого хуже, чем пропустить бота. По моей оценке, это выходные-двое, если делать по вечерам.
[click] Второй посложнее — угадать, на какой экран человек пойдёт дальше, и подгрузить его заранее. Правильные ответы уже лежат в вашей аналитике: куда человек пошёл после этого экрана. Контрольная здесь по времени: учимся на прошлом месяце, проверяем на этом. Сравниваем с «наугад» и с простым правилом «самый частый переход», а цена промаха — лишний трафик. Это недели три-четыре по вечерам, и почти всё время уйдёт на данные и проверку, а не на саму сеть. Выбирайте свой квест.
-->

---
layout: simple-slide
level: 8
variant: 30
contentAlign: center
contentPos: center
---

<A8Fireworks />

## Спасибо!

<div class="fin">
  <A8Results class="fin__side" />
  <div class="fin__code">
    <span class="fin__tab" aria-hidden="true">BONUS CODE</span>
    <div class="fin__bezel">
      <img src="/images/slides/vzhyx-io-light.svg" class="qr qr-light" alt="QR-код сайта vzhyx.io">
    </div>
    <p class="sub">Контакты — на vzhyx.io</p>
  </div>
  <A8Continue class="fin__side" />
</div>

<A8WorldClear class="fin__map" />

<style scoped>
/* финал: экран прохождения игры — результаты миров, QR как бонус-код, CONTINUE? и карта мира */
.fin {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  width: 100%;
}
.fin__side {
  justify-self: center;
}
.fin__code {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fin__tab {
  position: relative;
  z-index: 1;
  margin-bottom: -3px;
  padding: 0.3rem 0.6rem 0.25rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--lvl-accent);
}
/* QR всегда в прямой полярности (тёмные модули на светлом): так его читает любой сканер.
   Подложка без анимаций и свечения внутри; сканлайны CRT над ней ≤ 8% и контраст не ломают.
   Светлая рамка-кинескоп: пиксельные ступенчатые углы, свечение только снаружи */
.fin__bezel {
  padding: 8px;
  background: #f1f1f1;
  box-shadow:
    0 -4px 0 0 var(--lvl-accent),
    0 4px 0 0 var(--lvl-accent),
    -4px 0 0 0 var(--lvl-accent),
    4px 0 0 0 var(--lvl-accent),
    0 0 2rem 0 color-mix(in srgb, var(--lvl-accent) 55%, transparent);
}
.qr {
  display: block;
  width: 248px;
  height: 248px;
  margin: 0;
  border-radius: 0;
}
.sub {
  margin: 0.9rem 0 0;
  font-size: 1.125rem;
  color: var(--pa-text);
}
.fin__map {
  margin-top: 1.1rem;
}
</style>

<!--
Спасибо! QR на экране ведёт на мой сайт, там все контакты. Пишите, если будут вопросы про нейросети на JavaScript.
-->
