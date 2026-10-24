---
theme: none
colorSchema: dark
highlighter: shiki
lineNumbers: false
defaults:
  transition: slide-left
title: "ML своими руками на JS"
mdc: true
fonts:
  sans: JetBrains Mono
  mono: JetBrains Mono
  provider: none
favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-1 -2 13 12' shape-rendering='crispEdges'%3E%3Crect x='-1' y='-2' width='13' height='12' fill='%2307040f'/%3E%3Cpath fill='%233ef0ff' d='M2 0h1v1h-1zM8 0h1v1h-1zM3 1h1v1h-1zM7 1h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM1 3h1v1h-1zM2 3h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM0 4h1v1h-1zM1 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM0 5h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM0 6h1v1h-1zM2 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1z'/%3E%3C/svg%3E"
layout: title
level: 0
variant: 6
contentPos: bottom
contentAlign: left
---

# ML своими руками на JS

Троицкий Роман, ПАО Сбербанк | ЦЦРР

<A1WorldMap />

<style scoped>
/* под карту мира у нижнего края: логотип и PRESS START поднимаются на одну строку */
.slidev-layout.title {
  padding-bottom: 4.75rem;
}
</style>

<!--
Всем привет! Сегодня я расскажу, как мы на чистом JavaScript научили маленькую нейросеть отвечать на очень фронтендерский вопрос: «что именно сломалось в вёрстке?». Не просто "картинки не совпали", а прям конкретные свойства с такой-то вероятностью указаны неверно. Проект называется design-dealer. На его примере разберём, как устроены свёрточные сети, как их создавать и обучать и, главное, как интерпретировать метрики обучения. Я очень хочу показать вам, как прекрасен и глубок мир машлёрна, и надеюсь, что хотя бы несколько человек уйдут с доклада с намерением попробовать обучить сетку под свои задачи.
-->

---
src: ./pages/1_hook.md
---

---
layout: two-cols
level: 1
variant: 4
leftWidth: 50%
transition: slide-left
rightAlign: center
---

## WHOAMI

<div class="select-chip" aria-hidden="true">SELECT PLAYER</div>

<v-clicks>
  <ul class="perks">
    <li>Влюблён во фронтенд;</li>
    <li>Senior FE =&gt; DSE;</li>
    <li>Cтудент магистратуры ИТМО;</li>
    <li>Вхожу в ПК HolyJS, Сбера, MoscowCSS;</li>
    <li>I use Arch btw;</li>
    <li>I <3 Vue!</li>
  </ul>
</v-clicks>

<A1PlayerStats :step="$clicks" class="stats" />

::right::
<WhoAmI :images="['/images/whoami/1.jpg', '/images/whoami/2.jpg', '/images/whoami/3.jpg']" alt="Рома Троицкий на митапах и конфах без регистрации и смс" />

<style scoped>
/* Экран выбора персонажа: перки игрока открываются по кликам как «предметы»,
   карточка статов под ними растёт вместе со списком, справа — портрет PLAYER 1. */
.select-chip {
  position: absolute;
  top: 3.6rem;
  left: 13rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-yellow);
  animation: who-blink 1.1s steps(1, end) infinite;
}
.perks {
  margin: 0.2rem 0 0;
}
.perks li {
  padding: 0.05rem 0 0.05rem 1.5rem;
  margin-bottom: 0.2rem;
}
.perks li:not(.slidev-vclick-hidden) {
  animation: perk-in 0.35s steps(4, end) both;
}
/* последний открытый перк — под курсором выбора */
.perks li.slidev-vclick-current {
  color: var(--pa-yellow);
  text-shadow: 0 0 0.5rem rgba(255, 225, 62, 0.45);
}
.stats {
  margin-top: auto;
}
@keyframes perk-in {
  from {
    opacity: 0;
    transform: translateX(-1rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes who-blink {
  0%,
  60% {
    opacity: 1;
  }
  61%,
  100% {
    opacity: 0.25;
  }
}
@media (prefers-reduced-motion: reduce) {
  .select-chip,
  .perks li {
    animation: none !important;
  }
}
</style>

<!--
Зовут меня Рома Троицкий.
[click] Я всей душой люблю веб, особенно его клиентскую часть.
[click] Весной сменил позицию фронтенд-разработчика на инженера по исследованию данных, перешёл в аппарат президента Сбербанка, центр цифровых решений руководства, создаём всеведущего и всемогущего агента для топов Сбера.
[click] И большую роль в этом сыграл институт информационных технологий, механики и оптики — ИТМО.
[click] Горжусь тем, что помогаю готовить крутейшие конференции, особенно эту, любимую, лучшую отраслевую конференцию Холиджс.
[click] А так как люблю on-premise-решения, то заморачиваюсь сейчас не тем, как запустить большие языковые модели локально, а тем, как обучить ансамбль малых узкоспециализированных моделей выполнять задачи на уровне больших моделей
[click] И нежно люблю вью джс — кстати, на нём и написаны компоненты, на которых обучалась модель, и на нём написана моя презентация и презентация Дена Чернова.
-->

---
layout: simple-slide
level: 1
variant: 5
transition: slide-left
---

<div class="meme">
  <div class="side side--l" aria-hidden="true">
    <span class="cont">CONTINUE?</span>
    <span class="count" />
  </div>
  <div class="cab">
    <div class="cab-marquee" aria-hidden="true"><span>EASY MODE</span></div>
    <div class="cab-bezel">
      <img src="/images/slides/ml-is-easy-meme.png" alt="Комикс: жираф стоит по шею в воде и зовёт «Давайте в ML, это просто!», бегемот на берегу отвечает «Какой же ты негодяй»">
      <i class="cab-glass" aria-hidden="true" />
    </div>
    <div class="cab-panel" aria-hidden="true">
      <i class="stick" />
      <i class="btn btn--r" /><i class="btn btn--c" /><i class="btn btn--y" />
      <i class="slot-coin" />
    </div>
  </div>
  <div class="side side--r" aria-hidden="true">
    <span class="cont">DIFFICULTY</span>
    <span class="diff-bar"><i /><i /><i /><i /><i /><i /><i /><i /></span>
    <span class="cont cont--hard">HARD</span>
  </div>
</div>

<style scoped>
/* Мем на экране игрового автомата: «EASY MODE» на вывеске, а сбоку честная шкала сложности
   и отсчёт CONTINUE? — сколько бы ни звали в ML «это просто», игра всё равно на HARD. */
.meme {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.25rem;
  width: 100%;
  height: 100%;
}
.cab {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  filter: drop-shadow(0 0 1.4rem color-mix(in srgb, var(--lvl-accent2) 30%, transparent));
}
.cab-marquee {
  position: relative;
  margin: 0 -1.25rem;
  padding: 0.6rem 0 0.5rem;
  text-align: center;
  background: linear-gradient(180deg, #3b0d2a, #1a0618);
  box-shadow:
    0 -4px 0 0 var(--lvl-accent),
    -4px 0 0 0 var(--lvl-accent),
    4px 0 0 0 var(--lvl-accent),
    0 4px 0 0 #07040f;
}
.cab-marquee span {
  font-family: var(--pa-font-display);
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow:
    3px 3px 0 #b02a7c,
    0 0 0.9rem rgba(255, 225, 62, 0.6);
  animation: meme-flicker 3.2s steps(1, end) infinite;
}
.cab-bezel {
  position: relative;
  line-height: 0;
  padding: 1rem 1.1rem;
  background: linear-gradient(180deg, #221a3e, #120c26);
  box-shadow:
    -4px 0 0 0 #3a3160,
    4px 0 0 0 #3a3160;
}
.meme img {
  height: 20.5rem;
  width: auto;
  border-radius: 0;
  box-shadow:
    0 0 0 4px #05030b,
    0 0 0 7px color-mix(in srgb, var(--lvl-accent2) 55%, #07040f);
}
/* стекло кинескопа: сканлайны и блик */
.cab-glass {
  position: absolute;
  inset: 1rem 1.1rem;
  pointer-events: none;
  background:
    linear-gradient(125deg, rgba(255, 255, 255, 0.1) 0 18%, transparent 18% 100%),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0 2px, transparent 2px 4px);
}
.cab-panel {
  position: relative;
  height: 3.25rem;
  margin: 0 -1.25rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0 1.75rem;
  background: linear-gradient(180deg, #2c2350, #171030);
  box-shadow:
    0 4px 0 0 var(--lvl-accent),
    -4px 0 0 0 var(--lvl-accent),
    4px 0 0 0 var(--lvl-accent),
    0 -4px 0 0 #07040f;
}
.stick {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 1.25rem;
  background: var(--pa-red);
  box-shadow:
    inset -4px -4px 0 #9c1d3a,
    0 0 0.5rem rgba(255, 77, 109, 0.6);
  animation: meme-stick 1.6s steps(1, end) infinite;
}
.stick::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  width: 6px;
  height: 0.6rem;
  margin-left: -3px;
  background: #8c84b0;
}
.btn {
  width: 1rem;
  height: 1rem;
  box-shadow: inset -3px -3px 0 rgba(0, 0, 0, 0.35);
}
.btn--r { background: var(--pa-red); }
.btn--c { background: var(--pa-cyan); }
.btn--y { background: var(--pa-yellow); }
.slot-coin {
  margin-left: auto;
  width: 0.5rem;
  height: 1.5rem;
  background: #07040f;
  box-shadow:
    0 0 0 3px #c9a3ff,
    0 0 0.6rem rgba(255, 225, 62, 0.7);
}
/* боковые таблички */
.side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 9.5rem;
}
.cont {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.2;
  text-align: center;
  color: var(--pa-text);
}
.side--l .cont {
  color: var(--pa-cyan);
}
.count::after {
  content: "9";
  font-family: var(--pa-font-display);
  font-size: 3rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow: 4px 4px 0 #b02a7c;
  animation: meme-count 10s steps(1, end) infinite;
}
.diff-bar {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
}
.diff-bar i {
  width: 3rem;
  height: 0.8rem;
  background: color-mix(in srgb, var(--pa-lime) calc(100% - var(--k, 0) * 12%), var(--pa-red));
}
.diff-bar i:nth-child(1) { --k: 0; }
.diff-bar i:nth-child(2) { --k: 1; }
.diff-bar i:nth-child(3) { --k: 2; }
.diff-bar i:nth-child(4) { --k: 3; }
.diff-bar i:nth-child(5) { --k: 4; }
.diff-bar i:nth-child(6) { --k: 5; }
.diff-bar i:nth-child(7) { --k: 6; }
.diff-bar i:nth-child(8) {
  --k: 8;
  animation: meme-blink 0.8s steps(1, end) infinite;
}
.cont--hard {
  font-size: 1.25rem;
  color: var(--pa-red);
  text-shadow: 0 0 0.7rem rgba(255, 77, 109, 0.7);
}
@keyframes meme-count {
  0% { content: "9"; }
  10% { content: "8"; }
  20% { content: "7"; }
  30% { content: "6"; }
  40% { content: "5"; }
  50% { content: "4"; }
  60% { content: "3"; }
  70% { content: "2"; }
  80% { content: "1"; }
  90% { content: "0"; }
}
@keyframes meme-flicker {
  0%, 46%, 50%, 100% { opacity: 1; }
  47%, 49% { opacity: 0.35; }
}
@keyframes meme-blink {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.25; }
}
@keyframes meme-stick {
  0%, 49% { transform: translateX(-3px); }
  50%, 100% { transform: translateX(3px); }
}
@media (prefers-reduced-motion: reduce) {
  .meme *, .meme *::before, .meme *::after { animation: none !important; }
}
</style>

<!--
Сразу оговорюсь: с одного доклада погрузиться в ML невозможно. Кому-то по шею, кому-то пока с головой. Но я постараюсь показать, что всё-таки пропасть между фронтендером и ML не такая жуткая, как кажется, и при достаточном уровне желания вы разберётесь)
-->

---
src: ./pages/2_data.md
---

---
src: ./pages/3_theory.md
---

---
src: ./pages/4_tools.md
---

---
src: ./pages/5_training.md
---

---
src: ./pages/6_artifact.md
---

---
src: ./pages/7_metrics.md
---

---
src: ./pages/8_outro.md
---
