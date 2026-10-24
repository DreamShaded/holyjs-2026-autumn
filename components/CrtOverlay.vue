<script setup lang="ts">
// CRT-слой поверх слайда: сканлайны (непрозрачность ≤ 0.08), виньетка, лёгкое мерцание
// и редкая «катящаяся» полоса развёртки. Анимируются только opacity/transform.
// Без анимации: prefers-reduced-motion, печать/экспорт (animate = false).
defineProps<{ animate?: boolean }>();
</script>

<template>
  <div class="crt" :class="{ 'crt-static': !animate }" aria-hidden="true">
    <div class="crt-scan" />
    <div class="crt-roll" />
    <div class="crt-flicker" />
    <div class="crt-vignette" />
  </div>
</template>

<style scoped>
.crt {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 30;
}
.crt > div {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.crt-scan {
  background: repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0 1px, transparent 1px 3px);
}
/* светлая полоса развёртки: едет сверху вниз раз в 9 с (только transform/opacity).
   Не выходит за канвас: overflow у слоя не нужен, иначе аудит видит переполнение. */
.crt-roll {
  inset: 0 0 auto 0 !important;
  height: 22%;
  background: linear-gradient(180deg, rgba(190, 220, 255, 0) 0%, rgba(190, 220, 255, 0.035) 50%, rgba(190, 220, 255, 0) 100%);
  opacity: 0;
  animation: crt-roll 9s linear infinite;
}
.crt-flicker {
  background: rgba(200, 210, 255, 0.025);
  opacity: 0;
  animation: crt-flicker 4.2s steps(1, end) infinite;
}
.crt-vignette {
  background:
    radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0, 0, 0, 0) 62%, rgba(0, 0, 0, 0.42) 100%),
    linear-gradient(90deg, rgba(62, 240, 255, 0.025), transparent 12%, transparent 88%, rgba(255, 62, 207, 0.025));
}
@keyframes crt-roll {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(354%);
    opacity: 0;
  }
}
@keyframes crt-flicker {
  0%,
  100% {
    opacity: 0;
  }
  31% {
    opacity: 1;
  }
  32% {
    opacity: 0;
  }
  67% {
    opacity: 0.6;
  }
  68% {
    opacity: 0;
  }
}
.crt-static .crt-roll,
.crt-static .crt-flicker {
  animation: none;
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .crt-roll,
  .crt-flicker {
    animation: none;
    opacity: 0;
  }
}
@media print {
  .crt-roll,
  .crt-flicker {
    display: none;
  }
}
</style>
