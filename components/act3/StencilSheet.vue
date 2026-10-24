<script setup lang="ts">
// Лист-трафарет 3×3 (слайд «Свёртка», шаг 4): ножницы прорезают среднюю строку,
// вырезанная полоска выпадает — остаётся окошко той же формы, что фильтр-палочка.
// Декоративный спрайт, текст слайда рядом с ним.
const C = 28; // клетка листа
</script>

<template>
  <svg class="ss" :viewBox="`0 0 ${C * 3 + 16} ${C * 3 + 16}`" :width="C * 3 + 16" :height="C * 3 + 16" shape-rendering="crispEdges" aria-hidden="true">
    <!-- лист картона -->
    <rect x="8" y="8" :width="C * 3" :height="C * 3" class="ss-sheet" />
    <g class="ss-grid">
      <rect v-for="i in 2" :key="`v${i}`" :x="8 + i * C - 1" y="8" width="2" :height="C * 3" />
      <rect v-for="i in 2" :key="`h${i}`" x="8" :y="8 + i * C - 1" :width="C * 3" height="2" />
    </g>
    <!-- прорезь: средняя строка -->
    <rect x="8" :y="8 + C" :width="C * 3" :height="C" class="ss-hole" />
    <!-- выпадающая полоска -->
    <rect x="8" :y="8 + C" :width="C * 3" :height="C" class="ss-piece" />
    <!-- пунктир реза -->
    <rect x="6" :y="6 + C" :width="C * 3 + 4" :height="C + 4" class="ss-cut" />
  </svg>
</template>

<style scoped>
.ss {
  display: block;
  flex: none;
  overflow: visible;
}
.ss-sheet {
  fill: #d9d0f5;
}
.ss-grid rect {
  fill: #a99fd0;
}
.ss-hole {
  fill: #07040f;
  stroke: var(--pa-lime);
  stroke-width: 3;
  filter: drop-shadow(0 0 6px var(--pa-lime));
}
.ss-piece {
  fill: #d9d0f5;
  opacity: 0;
}
.ss-cut {
  fill: none;
  stroke: var(--pa-yellow);
  stroke-width: 2;
  stroke-dasharray: 4 4;
  opacity: 0;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .ss-cut {
    animation: ss-cut 1.1s steps(1, end) both;
  }
  .ss-piece {
    animation: ss-fall 1.1s steps(4, end) both;
  }
}
/* пока родитель скрыт кликом, анимация не идёт: стартует в момент показа */
:global(.slidev-vclick-hidden) .ss-cut,
:global(.slidev-vclick-hidden) .ss-piece {
  animation: none !important;
}
@keyframes ss-cut {
  0% {
    opacity: 1;
    stroke-dashoffset: 0;
  }
  25% {
    stroke-dashoffset: 8;
  }
  50% {
    opacity: 1;
    stroke-dashoffset: 16;
  }
  60%,
  100% {
    opacity: 0;
  }
}
@keyframes ss-fall {
  0%,
  55% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(48px);
  }
}
</style>
