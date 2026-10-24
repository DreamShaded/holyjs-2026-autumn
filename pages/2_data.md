---
layout: simple-slide
level: 2
variant: 11
transition: slide-left
---

## Готовим данные

<div class="factory">
  <div class="line">
    <FactoryMachine class="m m1" kind="feeder" :on="$clicks >= 1" :live="$clicks === 1" />
    <FactoryMachine class="m m2" kind="camera" :on="$clicks >= 2" :live="$clicks === 2" />
    <FactoryMachine class="m m3" kind="press" :on="$clicks >= 3" :live="$clicks === 3" />
    <FactoryMachine class="m m4" kind="camera" tone="ok" :on="$clicks >= 4" :live="$clicks === 4" />
    <div class="rail" :class="{ run: $clicks >= 1 }">
      <FactoryParcel :step="$clicks" :stops="[0.1008, 0.367, 0.633, 0.8992]" />
    </div>
    <div class="belt b2" v-click="2">→</div>
    <div class="belt b3" v-click="3">→</div>
    <div class="belt b4" v-click="4">→</div>
    <div class="plate p1" v-click="1"><div class="ico"><logos-storybook-icon /></div>берём сторибук</div>
    <div class="plate p2" v-click="2"><div class="ico"><tabler-camera /></div>генерируем чистые скриншоты</div>
    <div class="plate p3" v-click="3"><div class="ico"><tabler-tool /></div>программно искажаем (мутация)</div>
    <div class="plate p4 ok" v-click="4"><div class="ico"><tabler-camera /></div>собираем мутированные скриншоты</div>
  </div>
  <div class="pair">
    <div class="cart c-clean" :class="{ lit: $clicks >= 2 }" data-tag="CLEAN">
      <img v-click="2" src="/images/dd/card-clean.png" alt="Карточка, эталон">
    </div>
    <div class="neq" :class="{ lit: $clicks >= 4 }" aria-hidden="true">≠</div>
    <div class="cart c-mut" :class="{ lit: $clicks >= 4 }" data-tag="MUTANT">
      <img v-click="4" src="/images/dd/card-render.png" alt="Карточка после мутации letter-spacing">
    </div>
  </div>
</div>

<style scoped>
/* Сцена «Фабрика данных»: станки стоят в темноте и включаются по кликам, по ленте едет компонент,
   на выходе два картриджа — эталон и мутация. Текст и шаги те же, что в оригинале. */

/* ---------- линия станков: 4 станка и 3 участка ленты между ними ---------- */
.line {
  --belt-w: 3.5rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr var(--belt-w) 1fr var(--belt-w) 1fr var(--belt-w) 1fr;
  grid-template-rows: 100px 18px auto;
  margin-top: -0.25rem;
}
.m {
  grid-row: 1;
  justify-self: center;
  align-self: end;
  z-index: 1;
  /* спрайт 96×80 растягиваем до 120×100: пиксель станка 5px */
  transform: scale(1.25);
  transform-origin: 50% 100%;
}
.m1 { grid-column: 1; }
.m2 { grid-column: 3; }
.m3 { grid-column: 5; }
.m4 { grid-column: 7; }

/* сплошная лента под всеми станками; гусеница едет, когда фабрика запущена */
.rail {
  grid-row: 2;
  grid-column: 1 / -1;
  position: relative;
  z-index: 2;
  background:
    repeating-linear-gradient(90deg, #3a3160 0 12px, #241c42 12px 24px) 0 3px / 100% 9px no-repeat,
    #07040f;
  box-shadow:
    0 -3px 0 0 #6d6496,
    0 3px 0 0 #07040f;
}
.rail.run {
  animation: rail-run 0.6s steps(4, end) infinite;
}
@keyframes rail-run {
  to { background-position: 24px 3px, 0 0; }
}
/* участки ленты между станками: подсвечиваются по клику, стрелка показывает ход */
.belt {
  grid-row: 2;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--lvl-accent);
  box-shadow: 0 0 0.75rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
}
.b2 { grid-column: 2; }
.b3 { grid-column: 4; }
.b4 { grid-column: 6; background: var(--pa-lime); box-shadow: 0 0 0.75rem rgba(157, 255, 62, 0.55); }

/* табличка станка под лентой */
.plate {
  grid-row: 3;
  position: relative;
  margin-top: 0.6rem;
  padding: 0.55rem 0.6rem 0.5rem 0.75rem;
  font-size: 1.125rem;
  line-height: 1.32;
  color: var(--pa-text);
  background: rgba(16, 10, 34, 0.92);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
}
.p1 { grid-column: 1; }
.p2 { grid-column: 3; }
.p3 { grid-column: 5; }
.p4 { grid-column: 7; }
.plate.ok { box-shadow: 0 -3px 0 0 var(--pa-lime), 0 3px 0 0 #3a3160, -3px 0 0 0 #3a3160, 3px 0 0 0 #3a3160; }
/* «болты» таблички */
.plate::before,
.plate::after {
  content: "";
  position: absolute;
  top: 5px;
  width: 4px;
  height: 4px;
  background: #6d6496;
}
.plate::before { left: 5px; }
.plate::after { right: 5px; }
.plate .ico {
  float: right;
  font-size: 1.5rem;
  line-height: 1;
  margin: 0 0 0.1rem 0.3rem;
  color: var(--lvl-accent);
  filter: drop-shadow(0 0 0.3rem color-mix(in srgb, var(--lvl-accent) 50%, transparent));
}
.plate.ok .ico { color: var(--pa-lime); }
/* стойка таблички на ленте */
.line .plate:not(.slidev-vclick-hidden) {
  animation: plate-drop 0.35s steps(4, end);
}
@keyframes plate-drop {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

/* ---------- выход: два картриджа ---------- */
.pair {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3rem 1fr;
  align-items: center;
  margin-top: 0.75rem;
}
.cart {
  position: relative;
  padding: 1.75rem 0.6rem 0.6rem;
  background:
    repeating-linear-gradient(90deg, #2c2450 0 6px, #1a1336 6px 10px) 50% 0.45rem / 40% 0.5rem no-repeat,
    #120c28;
  box-shadow:
    0 -3px 0 0 #3a3160,
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
  transition: box-shadow 0.3s steps(3);
}
/* ярлык картриджа: декоративный, в сравнение текста не входит */
.cart::before {
  content: attr(data-tag);
  position: absolute;
  top: 0.2rem;
  left: 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.2;
  color: #6d6496;
}
.cart::after {
  content: "";
  position: absolute;
  top: 0.45rem;
  right: 0.7rem;
  width: 0.75rem;
  height: 0.75rem;
  background: #2c2450;
}
.cart.lit {
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent),
    0 0 1.2rem -0.2rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
}
.cart.lit::before { color: var(--lvl-accent); }
.cart.lit::after { background: var(--lvl-accent); box-shadow: 0 0 0.5rem var(--lvl-accent); }
.c-mut.lit {
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 1.2rem -0.2rem rgba(157, 255, 62, 0.6);
}
.c-mut.lit::before { color: var(--pa-lime); }
.c-mut.lit::after { background: var(--pa-lime); box-shadow: 0 0 0.5rem var(--pa-lime); }
.cart img {
  display: block;
  width: 100%;
  aspect-ratio: 5040 / 1830;
  object-fit: contain;
  background: #fff;
  image-rendering: auto;
}
/* снимок «выезжает» из щели картриджа */
.cart img:not(.slidev-vclick-hidden) {
  animation: eject 0.5s steps(5, end);
}
@keyframes eject {
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
}
.neq {
  justify-self: center;
  font-family: var(--pa-font-display);
  font-size: 2.25rem;
  line-height: 1;
  color: #3a3160;
}
.neq.lit {
  color: var(--pa-magenta);
  text-shadow: 0.2rem 0.2rem 0 #4a1240, 0 0 0.8rem rgba(255, 62, 207, 0.7);
  animation: neq-blink 1s steps(1, end) 3;
}
@keyframes neq-blink {
  50% { opacity: 0.2; }
}

@media (prefers-reduced-motion: reduce) {
  .rail.run,
  .line .plate:not(.slidev-vclick-hidden),
  .cart img:not(.slidev-vclick-hidden),
  .neq.lit {
    animation: none;
  }
}
</style>

<!--
Чтобы сеть чему-то научилась, ей нужны размеченные данные, в нашем случае это скриншоты компонентов, отличающихся от эталонов, в которых мы точно знаем, какие CSS свойства отличаются. Где их взять?
[click] Берём Storybook — витрину, где каждый компонент лежит отдельно и в разных состояниях. Одно такое состояние, например «кнопка Primary», в сторибуке называется сторёй — все, думаю, это и так знают.
[click] Фотографируем каждый компонент «как надо», это эталон. Снимает Playwright: открывает сторю, ждёт загрузки шрифтов и делает page.screenshot.
[click] Дальше нарочно портим одно CSS-свойство, например межбуквенный интервал. То есть создаём мутацию. Скриптом прямо в странице выбираем элемент и пишем ему el.style.setProperty с новым значением.
[click] И фотографируем ещё раз, «как стало», затем накладываем друг на друга и видим, что на правой карточке буквы чуть разъехались. Получилась пара картинок, и мы знаем правильный ответ — сломался letter-spacing. Таких пар делаем тысячи без ручной разметки и получаем большой датасет
-->
