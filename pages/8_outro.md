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
