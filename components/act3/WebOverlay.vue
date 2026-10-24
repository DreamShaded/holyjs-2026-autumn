<script setup lang="ts">
// Пиксельная «сеть» поверх кадра с Человеком-пауком: узлы слоями и связи между ними.
// Чисто декоративный слой (aria-hidden), каламбур «паутина = сеть».
import { rasterLine } from "./pixel";

const P = 3;
// три слоя узлов: вход → скрытый → выход (координаты в системе кадра 400×259)
const LAYERS = [
	[
		[34, 40],
		[22, 130],
		[40, 220],
	],
	[
		[150, 70],
		[170, 150],
		[140, 225],
	],
	[
		[366, 96],
		[372, 190],
	],
];
const edges: { x: number; y: number }[][] = [];
for (let l = 0; l < LAYERS.length - 1; l++) {
	for (const [x0, y0] of LAYERS[l]) {
		for (const [x1, y1] of LAYERS[l + 1]) edges.push(rasterLine(x0, y0, x1, y1, P));
	}
}
const nodes = LAYERS.flat().map(([x, y], i) => ({ x: x - 5, y: y - 5, i }));
</script>

<template>
  <svg class="web" viewBox="0 0 400 259" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">
    <g class="web-edges">
      <g v-for="(e, k) in edges" :key="k">
        <rect v-for="(c, j) in e" :key="j" :x="c.x" :y="c.y" :width="P" :height="P" />
      </g>
    </g>
    <rect
      v-for="n in nodes"
      :key="n.i"
      class="web-node"
      :x="n.x"
      :y="n.y"
      width="10"
      height="10"
      :style="{ animationDelay: `${(n.i * 0.37) % 1.8}s` }"
    />
  </svg>
</template>

<style scoped>
.web {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
}
.web-edges rect {
  fill: color-mix(in srgb, var(--pa-cyan) 45%, transparent);
}
.web-node {
  fill: var(--pa-cyan);
  stroke: #07040f;
  stroke-width: 2;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .web {
    animation: web-in 0.8s steps(4, end) both;
  }
  .web-node {
    animation: web-blink 1.8s steps(1, end) infinite;
  }
}
:global(.slidev-vclick-hidden) .web {
  animation: none !important;
}
@keyframes web-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes web-blink {
  0%,
  60% {
    fill: var(--pa-cyan);
  }
  61%,
  100% {
    fill: var(--pa-lime);
  }
}
</style>
