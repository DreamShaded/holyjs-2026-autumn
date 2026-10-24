---
layout: simple-slide
level: 1
variant: 5
transition: slide-left
---

## Где же ошибка?

<div class="spot" :class="{ 'is-scan': $clicks >= 1, 'is-lock': $clicks >= 3 }">
  <div class="spot-chip" aria-hidden="true"><span class="spot-blink">●</span> SPOT THE DIFF</div>
  <div class="pw">
    <div class="pw-shot crt">
      <div class="pw-tab">Expected</div>
      <div class="crt-bezel">
        <div class="crt-screen">
          <img src="/images/dd/button-clean.png" class="pix" alt="Кнопка «Сохранить», эталон">
          <i class="crt-sweep" aria-hidden="true" />
        </div>
        <i class="crt-led" aria-hidden="true" />
      </div>
    </div>
    <div class="spot-vs" aria-hidden="true">VS</div>
    <div class="pw-shot crt">
      <div class="pw-tab">Actual</div>
      <div class="crt-bezel">
        <div class="crt-screen">
          <img src="/images/dd/button-render.png" class="pix" alt="Кнопка «Сохранить», рендер">
          <i class="crt-sweep" aria-hidden="true" />
          <div class="pw-shot diff" v-click="2">
            <div class="pw-tab bad">Diff</div>
            <img src="/images/dd/button-diff.png" class="pix" alt="Дифф pixelmatch: красным отмечены отличающиеся пиксели">
            <i class="diff-ghost diff-ghost--c" aria-hidden="true" />
            <i class="diff-ghost diff-ghost--m" aria-hidden="true" />
            <i class="diff-ants" aria-hidden="true" />
          </div>
          <div class="diff-reticle" aria-hidden="true"><i /><i /><i /><i /><b>WHAT?</b></div>
        </div>
        <i class="crt-led" aria-hidden="true" />
      </div>
    </div>
  </div>
  <div class="cards hook">
    <div class="card" v-click="1"><div class="ico"><tabler-eye /></div>Или глаза, или скриншот</div>
    <div class="card" v-click="2"><div class="ico"><tabler-marquee-2 /></div>Скриншот показывает область</div>
    <div class="card ok" v-click="3"><div class="ico"><tabler-target-arrow /></div>Хотим, чтобы агент видел, что именно</div>
  </div>
</div>

<style scoped>
/* Мини-игра «найди отличия»: два CRT-монитора (эталон и рендер), дифф проявляется
   глитч-слоем поверх рендера, внизу — диалоговое окно квеста с репликами по кликам. */
.spot {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}
.spot-chip {
  position: absolute;
  top: -3.2rem;
  right: 0;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-yellow);
  padding: 0.45rem 0.6rem;
  background: rgba(7, 4, 15, 0.8);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent);
}
.spot-blink {
  color: var(--pa-red);
  animation: spot-blink 1s steps(1, end) infinite;
}
.pw {
  display: grid;
  grid-template-columns: 1fr 3.5rem 1fr;
  align-items: center;
}
/* ---------- монитор ---------- */
.crt {
  position: relative;
}
.pw-tab {
  display: inline-block;
  font-family: var(--pa-font-pixel);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.04em;
  margin: 0 0 0 0.75rem;
  padding: 0.3rem 0.7rem 0.25rem;
  color: var(--pa-bg);
  background: var(--pa-cyan);
}
.crt-bezel {
  position: relative;
  padding: 0.75rem 0.75rem 1.1rem;
  background: linear-gradient(180deg, #2a2148, #160f2c 70%, #0f0a20);
  box-shadow:
    0 -4px 0 0 #4a3f78,
    0 4px 0 0 #0a0616,
    -4px 0 0 0 #3a3160,
    4px 0 0 0 #1c1636,
    0 10px 0 -2px #0a0616,
    0 0 1.6rem -0.4rem color-mix(in srgb, var(--lvl-accent2) 45%, transparent);
}
.crt-screen {
  position: relative;
  line-height: 0;
  box-shadow: 0 0 0 3px #05030b;
}
.crt-screen img.pix {
  display: block;
  width: 100%;
  height: auto;
  box-shadow: none;
}
/* сканлайны и виньетка кинескопа */
.crt-screen::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  background:
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.13) 0 2px, transparent 2px 4px),
    radial-gradient(ellipse at center, transparent 55%, rgba(10, 4, 30, 0.45) 100%);
}
.crt-led {
  position: absolute;
  right: 0.9rem;
  bottom: 0.35rem;
  width: 6px;
  height: 6px;
  background: var(--pa-lime);
  box-shadow: 0 0 6px var(--pa-lime);
}
/* клик 1: «глаза» пробегают оба экрана сканирующей полосой */
.crt-sweep {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 12%;
  z-index: 3;
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(62, 240, 255, 0.45), transparent);
}
.is-scan .crt-sweep {
  animation: crt-sweep 2.4s steps(24, end) infinite;
}
.spot-vs {
  text-align: center;
  font-family: var(--pa-font-display);
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 1.6rem;
  color: var(--pa-yellow);
  text-shadow:
    3px 3px 0 #b02a7c,
    0 0 0.8rem rgba(255, 225, 62, 0.6);
}
/* ---------- дифф: глитч-слой поверх рендера ---------- */
.diff {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.diff .pw-tab.bad {
  position: absolute;
  top: -2.55rem;
  right: 0.75rem;
  margin: 0;
  color: #fff;
  background: var(--pa-red);
  box-shadow: 0 0 0.8rem rgba(255, 77, 109, 0.7);
}
.diff img.pix {
  display: block;
  width: 100%;
  height: auto;
  box-shadow: none;
}
.diff-ghost {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: url("/images/dd/button-diff.png") center / 100% 100%;
  mix-blend-mode: screen;
}
.diff-ghost--c {
  filter: hue-rotate(180deg) saturate(3);
}
.diff-ghost--m {
  filter: hue-rotate(290deg) saturate(3);
}
.diff:not(.slidev-vclick-hidden) img.pix {
  animation: glitch-in 0.6s steps(1, end) both;
}
.diff:not(.slidev-vclick-hidden) .diff-ghost--c {
  animation: ghost-c 0.6s steps(1, end) both;
}
.diff:not(.slidev-vclick-hidden) .diff-ghost--m {
  animation: ghost-m 0.6s steps(1, end) both;
}
/* «область»: бегущие муравьи вокруг отличий */
.diff-ants {
  position: absolute;
  left: 16%;
  top: 13%;
  width: 67%;
  height: 55%;
  z-index: 3;
  --ant: var(--pa-cyan);
  background:
    linear-gradient(90deg, var(--ant) 8px, transparent 0) 0 0 / 14px 3px repeat-x,
    linear-gradient(90deg, var(--ant) 8px, transparent 0) 0 100% / 14px 3px repeat-x,
    linear-gradient(0deg, var(--ant) 8px, transparent 0) 0 0 / 3px 14px repeat-y,
    linear-gradient(0deg, var(--ant) 8px, transparent 0) 100% 0 / 3px 14px repeat-y;
  filter: drop-shadow(0 0 3px rgba(62, 240, 255, 0.8));
  animation: ants 0.6s steps(3, end) infinite;
}
/* клик 3: прицел захватывает текст — «что именно?» */
.diff-reticle {
  position: absolute;
  left: 15%;
  top: 25%;
  width: 60%;
  height: 31%;
  z-index: 5;
  opacity: 0;
}
.diff-reticle i {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid var(--pa-lime);
  filter: drop-shadow(0 0 4px var(--pa-lime));
}
.diff-reticle i:nth-child(1) { left: 0; top: 0; border-width: 4px 0 0 4px; }
.diff-reticle i:nth-child(2) { right: 0; top: 0; border-width: 4px 4px 0 0; }
.diff-reticle i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 4px 4px; }
.diff-reticle i:nth-child(4) { right: 0; bottom: 0; border-width: 0 4px 4px 0; }
.diff-reticle b {
  position: absolute;
  left: 50%;
  bottom: -2.1rem;
  transform: translateX(-50%);
  font-family: var(--pa-font-display);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1;
  white-space: nowrap;
  padding: 0.3rem 0.45rem;
  color: var(--pa-bg);
  background: var(--pa-lime);
}
.is-lock .diff-reticle {
  opacity: 1;
  animation: lock-on 0.5s steps(5, end) both;
}
/* ---------- диалог квеста: реплики по кликам ---------- */
.hook {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.6rem 1rem 0.6rem 1.1rem;
  background: rgba(7, 4, 15, 0.88);
  box-shadow:
    0 -3px 0 0 #f2ecff,
    0 3px 0 0 #f2ecff,
    -3px 0 0 0 #f2ecff,
    3px 0 0 0 #f2ecff,
    0 0 0 6px #07040f,
    0 0 0 9px var(--lvl-accent);
}
.hook .card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0;
  background: none;
  box-shadow: none;
  line-height: 1.5;
}
.hook .card::after {
  display: none;
}
.hook .card .ico {
  font-size: 1.25rem;
  margin: 0;
  line-height: 1;
}
.hook .card.ok {
  color: var(--pa-lime);
  text-shadow: 0 0 0.5rem rgba(157, 255, 62, 0.45);
}
.hook .card.ok::before {
  content: "▶";
  position: absolute;
  right: 0.25rem;
  color: var(--pa-lime);
  animation: spot-blink 0.8s steps(1, end) infinite;
}
.hook .card:not(.slidev-vclick-hidden) {
  animation: type-in 0.45s steps(12, end) both;
}
@keyframes type-in {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
@keyframes spot-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.2; }
}
@keyframes crt-sweep {
  0% { opacity: 1; transform: translateX(-100%); }
  70% { opacity: 1; transform: translateX(830%); }
  71%, 100% { opacity: 0; transform: translateX(830%); }
}
@keyframes glitch-in {
  0% { clip-path: inset(0 0 85% 0); transform: translateX(-6px); }
  15% { clip-path: inset(40% 0 30% 0); transform: translateX(8px); }
  30% { clip-path: inset(10% 0 50% 0); transform: translateX(-4px); }
  45% { clip-path: inset(0 0 20% 0); transform: translateX(5px); }
  60% { clip-path: inset(60% 0 0 0); transform: translateX(-3px); }
  75% { clip-path: inset(0 0 0 0); transform: translateX(2px); }
  100% { clip-path: inset(0 0 0 0); transform: none; }
}
@keyframes ghost-c {
  0%, 60% { opacity: 0.7; transform: translateX(-7px); }
  61%, 100% { opacity: 0; transform: none; }
}
@keyframes ghost-m {
  0%, 60% { opacity: 0.7; transform: translateX(7px); }
  61%, 100% { opacity: 0; transform: none; }
}
@keyframes ants {
  to { background-position: 14px 0, -14px 100%, 0 -14px, 100% 14px; }
}
@keyframes lock-on {
  from { transform: scale(1.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .spot *, .spot *::before, .spot *::after { animation: none !important; }
}
</style>

<!--
Давайте погрузимся в задачу. Перед вами обычные скриншоты с Playwright: слева эталон кнопки, справа то, что отрендерилось сейчас. Видно, что они отличаются, но не очень понятно, только ли жирностью, или ещё межбуквенный отличается. А цвет фона? а текста?
[click] Обычно у нас два пути: смотреть глазами или доверить сравнение скриншотов программе. Глаза устают и пропускают мелочи, а вот программа не устаёт.
[click] Вот что возвращает скриншотный тест: красным закрашены пиксели, которые не совпали. Видно, что что-то случилось с текстом. Но что именно? Цвет? Жирность? Буквы раздвинулись? Скриншот показывает только область, где искать, а дальше снова работают глаза разработчика.
[click] А мы хотим, чтобы проверяющий — человек или AI-агент — сразу получал ответ: что именно поменялось. Здесь, кстати, текст стал тоньше: жирность упала с 600 до 500, и чуть посветлел цвет. Вот об этом весь доклад.
-->

---
layout: simple-slide
level: 1
variant: 9
transition: slide-up
---

## Что в результате

<div class="coop">
  <div class="res">
    <div class="slot slot--p1">
      <div class="coin" aria-hidden="true"><span>P1</span>INSERT COIN</div>
      <div class="card" v-click="1">
        <div class="plate" aria-hidden="true"><span class="tag">P1</span><span class="role">WHERE</span></div>
        <div class="who"><div class="ico"><logos-playwright /></div><b>Playwright</b>: где</div>
        <div class="area">
          <img src="/images/dd/button-diff.png" class="pix" alt="Дифф кнопки">
          <i class="ants" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div class="link" aria-hidden="true">
      <span class="plus">+</span>
      <span class="coop-tag">CO-OP</span>
    </div>
    <div class="slot slot--p2">
      <div class="coin" aria-hidden="true"><span>P2</span>INSERT COIN</div>
      <div class="card ok" v-click="2">
        <div class="plate" aria-hidden="true"><span class="tag">P2</span><span class="role">WHAT</span><span class="pu">POWER-UPS ×5</span></div>
        <div class="who"><div class="ico"><tabler-spy /></div><b>design-dealer</b>: что</div>
        <Lamps :values="[0.94, 0.71, 0.08, 0.05, 0.03]" :threshold="0.5" class="mini" />
      </div>
    </div>
  </div>

  <div class="term">
    <div class="term-bar" aria-hidden="true"><i /><i /><i /><span>playwright test</span></div>
    <div class="term-cmd" aria-hidden="true"><span class="ps">$</span> npx playwright test <span class="fail" :class="{ on: $clicks >= 3 }">✘ 1 failed</span></div>
    <div v-click="3" class="log">button--primary: <span class="where">область 12,40–180,72</span>: <span v-mark.underline.orange="4">color (0.94), font-weight (0.71)</span><i class="cursor" aria-hidden="true" /></div>
  </div>
</div>

<style scoped>
/* Кооператив двух игроков: P1 Playwright отвечает «где» (область), P2 design-dealer — «что»
   (лампы-power-up'ы). Внизу терминал упавшего теста: строка лога печатается и собирает
   вклад обоих игроков — область от P1 и свойства от P2. */
.coop {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.res {
  display: grid;
  grid-template-columns: 250px 4.5rem 1fr;
  gap: 0.75rem;
  align-items: stretch;
}
/* пустой слот игрока до клика: мигающее INSERT COIN */
.slot {
  position: relative;
  display: flex;
}
.coin {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text-dim);
  background: rgba(7, 4, 15, 0.6);
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
  animation: coin-blink 1.2s steps(1, end) infinite;
}
/* игрок вошёл — табличка слота больше не нужна */
.slot:has(.card:not(.slidev-vclick-hidden)) .coin {
  visibility: hidden;
}
.coin span {
  font-size: 1.5rem;
  color: var(--pa-yellow);
}
.slot .card {
  position: relative;
  z-index: 1;
  flex: 1;
  margin: 0;
  background: rgba(14, 8, 30, 0.96);
}
.slot .card {
  display: flex;
  flex-direction: column;
}
.slot--p1 .card {
  --pa-frame: var(--pa-red);
}
.who {
  display: flex;
  align-items: center;
}
.slot .card:not(.slidev-vclick-hidden) {
  animation: player-in 0.45s steps(5, end) both;
}
.plate {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: -0.75rem -1rem 0.6rem;
  padding: 0.35rem 0.75rem;
  background: color-mix(in srgb, var(--pa-frame) 22%, #07040f);
  border-bottom: 3px solid var(--pa-frame);
}
.plate .tag {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem 0.35rem;
  color: var(--pa-bg);
  background: var(--pa-frame);
}
.plate .role {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text);
}
.plate .pu {
  margin-left: auto;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-lime);
}
.slot .card .ico {
  margin: 0 0.6rem 0 0;
  font-size: 1.5rem;
  line-height: 1;
}
.area {
  position: relative;
  margin: auto 0;
  line-height: 0;
}
.area img.pix {
  width: 100%;
  height: auto;
}
.ants {
  position: absolute;
  left: 15%;
  top: 12%;
  width: 69%;
  height: 57%;
  --ant: var(--pa-red);
  background:
    linear-gradient(90deg, var(--ant) 6px, transparent 0) 0 0 / 10px 3px repeat-x,
    linear-gradient(90deg, var(--ant) 6px, transparent 0) 0 100% / 10px 3px repeat-x,
    linear-gradient(0deg, var(--ant) 6px, transparent 0) 0 0 / 3px 10px repeat-y,
    linear-gradient(0deg, var(--ant) 6px, transparent 0) 100% 0 / 3px 10px repeat-y;
  animation: ants 0.5s steps(2, end) infinite;
}
.mini {
  margin-top: 0.6rem;
  gap: 0.4rem;
}
.mini :deep(.lamp) {
  width: 5.4rem;
}
/* связка игроков */
.link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
}
.plus {
  font-family: var(--pa-font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow:
    3px 3px 0 #b02a7c,
    0 0 0.8rem rgba(255, 225, 62, 0.55);
}
.coop-tag {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--pa-text-dim);
}
/* ---------- терминал упавшего теста ---------- */
.term {
  background: rgba(3, 6, 4, 0.92);
  box-shadow:
    0 -3px 0 0 #2f5a32,
    0 3px 0 0 #2f5a32,
    -3px 0 0 0 #2f5a32,
    3px 0 0 0 #2f5a32,
    0 0 1.2rem -0.3rem rgba(157, 255, 62, 0.35);
}
.term-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.2rem 0.75rem;
  background: #10240f;
  border-bottom: 3px solid #2f5a32;
}
.term-bar i {
  width: 6px;
  height: 6px;
  background: #4f8a48;
}
.term-bar span {
  margin-left: 0.5rem;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.2;
  color: #c9ffbf;
}
.term-cmd {
  padding: 0.45rem 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #9fc79a;
}
.term-cmd .ps {
  color: var(--pa-lime);
}
.fail {
  margin-left: 0.75rem;
  color: var(--pa-red);
  opacity: 0;
}
.fail.on {
  opacity: 1;
  animation: coin-blink 0.9s steps(1, end) 2;
}
.term .log {
  position: relative;
  padding: 0.15rem 1rem 0.55rem;
  background: none;
  box-shadow: none;
  white-space: nowrap;
}
.term .log:not(.slidev-vclick-hidden) {
  animation: type-in 0.6s steps(36, end) both;
}
.where {
  color: #ff9db0;
}
.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.05em;
  margin-left: 0.2em;
  vertical-align: -0.15em;
  background: var(--pa-lime);
  animation: coin-blink 0.9s steps(1, end) infinite;
}
@keyframes type-in {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}
@keyframes player-in {
  0% { transform: translateY(-1.5rem); opacity: 0; }
  60% { transform: translateY(0.25rem); opacity: 1; }
  100% { transform: none; opacity: 1; }
}
@keyframes coin-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.25; }
}
@keyframes ants {
  to { background-position: 10px 0, -10px 100%, 0 -10px, 100% 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .coop *, .coop *::before, .coop *::after { animation: none !important; }
}
</style>

<!--
Что получается в итоге.
[click] Playwright отвечает на вопрос «где»: вот область, где пиксели не совпали.
[click] design-dealer отвечает на вопрос «что». У него пять лампочек, по одной на каждое CSS-свойство, которое он умеет узнавать: цвет, жирность, межбуквенный интервал, межстрочный интервал и рамка. Чем ярче лампочка, тем увереннее сеть, что сломалось именно это свойство.
[click] И всё это попадает прямо в сообщение упавшего теста. Причём конкретно: компонент такой-то, сломались цвет и жирность. Технически это наш собственный матчер Playwright: если пиксели не совпали, он вырезает кусочки вокруг отличий, спрашивает модель и прикладывает находки к отчёту теста.
[click] То есть на выходе — список находок: какой компонент, в какой области картинки, какое свойство и насколько сеть уверена в этом. Четыре числа после слова «область» — координаты прямоугольника с отличиями. Цифры в скобках — это и есть уверенность от нуля до единицы. Прикольно же, правда? Тогда давайте знакомиться и погружаться вместе в этот волшебный мир машлёрна
-->
