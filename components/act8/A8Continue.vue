<script setup lang="ts">
// Экран «CONTINUE?» аркадного автомата: отсчёт 9→0 по кругу и стрелка к QR-коду
// («продолжение» — на сайте). Отсчёт без JS-таймеров: десять цифр лежат в одной ячейке,
// каждая видна свою секунду из десяти (opacity, отрицательная задержка задаёт фазу).
// Лента с transform не годится: аудит считает её выходящей за канвас даже под clip-path.
// В печати и при reduced-motion стоит «9». Декоративный (aria-hidden).
const digits = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
</script>

<template>
  <div class="a8-cont" aria-hidden="true">
    <div class="a8-cont__q">CONTINUE?</div>
    <div class="a8-cont__win">
      <span
        v-for="(d, k) in digits"
        :key="d"
        class="a8-cont__digit"
        :style="{ animationDelay: `${k - 10}s` }"
      >{{ d }}</span>
    </div>
    <div class="a8-cont__scan">
      <span class="a8-cont__arrow" />
      <span>SCAN</span>
    </div>
    <div class="a8-cont__free">FREE PLAY</div>
  </div>
</template>

<style scoped>
.a8-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  text-align: center;
}
.a8-cont__q {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-cyan);
  text-shadow: 0 0 0.6rem color-mix(in srgb, var(--pa-cyan) 60%, transparent);
  animation: a8-blink 1s steps(1, end) infinite;
}
/* ячейка одной цифры: все десять цифр лежат друг на друге */
.a8-cont__win {
  position: relative;
  width: 5rem;
  height: 4.5rem;
}
.a8-cont__digit {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  animation: a8-count 10s steps(1, end) infinite;
  font-family: var(--pa-font-display);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow:
    4px 4px 0 #b4400a,
    0 0 1rem color-mix(in srgb, var(--pa-yellow) 45%, transparent);
}
.a8-cont__scan {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text);
}
/* пиксельная стрелка влево — к QR-коду, «бежит» на 3 шага */
.a8-cont__arrow {
  width: 1.5rem;
  height: 1.125rem;
  background: var(--lvl-accent);
  clip-path: polygon(0 50%, 50% 0, 50% 33%, 100% 33%, 100% 67%, 50% 67%, 50% 100%);
  animation: a8-nudge 0.9s steps(3, end) infinite;
}
.a8-cont__free {
  padding: 0.35rem 0.6rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-lime);
  box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--pa-lime) 55%, #07040f);
}
@keyframes a8-count {
  0%,
  9.99% {
    opacity: 1;
  }
  10%,
  100% {
    opacity: 0;
  }
}
@keyframes a8-blink {
  0%,
  60% {
    opacity: 1;
  }
  61%,
  100% {
    opacity: 0.35;
  }
}
@keyframes a8-nudge {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-0.6rem);
  }
}
@media (prefers-reduced-motion: reduce) {
  .a8-cont__q,
  .a8-cont__digit,
  .a8-cont__arrow {
    animation: none;
  }
  .a8-cont__digit:first-child {
    opacity: 1;
  }
}
@media print {
  .a8-cont__digit {
    animation: none;
  }
  .a8-cont__digit:first-child {
    opacity: 1;
  }
}
</style>
