<script setup lang="ts">
// Мини-схемы приёмов против зубрёжки («пауэрапы»), чисто декоративные (aria-hidden):
// dropout — маленькая сеть, в которой на каждом такте выключаются случайные нейроны;
// l2 — столбики весов, которые штраф прижимает к пунктирной границе.
const props = defineProps<{ kind: "dropout" | "l2" }>();

// сеть 3–4–4–2: x слоёв и y нейронов
const LAYERS = [
	{ x: 10, ys: [22, 46, 70] },
	{ x: 46, ys: [10, 34, 58, 82] },
	{ x: 82, ys: [10, 34, 58, 82] },
	{ x: 118, ys: [34, 58] },
];
// фаза выключения скрытых нейронов: в каждую четверть цикла выключены два разных
const PHASE = [0, 2, 1, 3, 2, 0, 3, 1];
const nodes = LAYERS.flatMap((l, li) =>
	l.ys.map((y, yi) => ({
		x: l.x,
		y,
		hidden: li === 1 || li === 2,
		phase: li === 1 ? PHASE[yi] : li === 2 ? PHASE[4 + yi] : -1,
	})),
);
const edges: { x1: number; y1: number; x2: number; y2: number; phase: number }[] = [];
LAYERS.slice(0, -1).forEach((l, li) => {
	const next = LAYERS[li + 1];
	l.ys.forEach((y1, a) =>
		next.ys.forEach((y2, b) => {
			// ребро гаснет вместе с выключенным нейроном на любом его конце
			const pa = li === 1 ? PHASE[a] : li === 2 ? PHASE[4 + a] : -1;
			const pb = li + 1 === 1 ? PHASE[b] : li + 1 === 2 ? PHASE[4 + b] : -1;
			edges.push({ x1: l.x, y1, x2: next.x, y2, phase: pa >= 0 ? pa : pb });
		}),
	);
});

const WEIGHTS = [0.95, 0.35, 0.8, 0.2, 0.6];
</script>

<template>
  <svg v-if="props.kind === 'dropout'" class="t5-reg rg-drop" viewBox="0 0 128 92" width="128" height="92" aria-hidden="true">
    <line
      v-for="(e, i) in edges"
      :key="`e${i}`"
      :x1="e.x1"
      :y1="e.y1"
      :x2="e.x2"
      :y2="e.y2"
      class="rg-edge"
      :class="{ blink: e.phase >= 0 }"
      :style="{ '--ph': e.phase }"
    />
    <g v-for="(n, i) in nodes" :key="`n${i}`" class="rg-node" :class="{ blink: n.hidden }" :style="{ '--ph': n.phase }">
      <rect :x="n.x - 6" :y="n.y - 6" width="12" height="12" class="rg-on" />
      <path :d="`M${n.x - 6} ${n.y - 6}l12 12M${n.x + 6} ${n.y - 6}l-12 12`" class="rg-x" />
    </g>
  </svg>
  <svg v-else class="t5-reg rg-l2" viewBox="0 0 110 92" width="110" height="92" shape-rendering="crispEdges" aria-hidden="true">
    <rect x="0" y="86" width="110" height="4" class="rg-floor" />
    <rect v-for="(w, i) in WEIGHTS" :key="i" :x="6 + i * 21" :y="86 - w * 78" width="14" :height="w * 78" class="rg-bar" :style="{ '--w': w }" />
    <rect v-for="k in 11" :key="`l${k}`" :x="(k - 1) * 10" y="46" width="6" height="3" class="rg-limit" />
  </svg>
</template>

<style scoped>
.t5-reg {
  display: block;
  flex-shrink: 0;
  overflow: visible;
}
.rg-edge {
  stroke: rgba(185, 176, 214, 0.45);
  stroke-width: 1.5;
}
.rg-on {
  fill: var(--pa-cyan);
}
.rg-x {
  stroke: var(--pa-red);
  stroke-width: 3;
  opacity: 0;
}
/* такт 0.8 с: нейроны своей фазы гаснут на четверть цикла */
.rg-node.blink .rg-on {
  animation: rg-off 3.2s steps(1, end) infinite;
  animation-delay: calc(var(--ph) * -0.8s);
}
.rg-node.blink .rg-x {
  animation: rg-xon 3.2s steps(1, end) infinite;
  animation-delay: calc(var(--ph) * -0.8s);
}
.rg-edge.blink {
  animation: rg-edge 3.2s steps(1, end) infinite;
  animation-delay: calc(var(--ph) * -0.8s);
}
@keyframes rg-off {
  0% { fill: #241c40; }
  25% { fill: var(--pa-cyan); }
}
@keyframes rg-xon {
  0% { opacity: 1; }
  25% { opacity: 0; }
}
@keyframes rg-edge {
  0% { stroke: rgba(185, 176, 214, 0.06); }
  25% { stroke: rgba(185, 176, 214, 0.45); }
}
.rg-floor { fill: #6d6496; }
.rg-limit { fill: var(--pa-yellow); }
.rg-bar {
  fill: var(--pa-cyan);
  transform-box: fill-box;
  transform-origin: 50% 100%;
  /* штраф прижимает большие веса сильнее маленьких */
  animation: rg-press 2.4s steps(4, end) infinite alternate;
}
@keyframes rg-press {
  from { transform: scaleY(1); }
  to { transform: scaleY(calc(1 - var(--w) * 0.45)); fill: var(--pa-yellow); }
}
@media (prefers-reduced-motion: reduce) {
  .t5-reg * { animation: none !important; }
}
@media print {
  .t5-reg * { animation: none !important; }
}
</style>
