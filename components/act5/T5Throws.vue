<script setup lang="ts">
// «Два броска одной рукой» к скрытому слайду «Когда остановить тренировку»:
// шкала попаданий 76–94 %. step 1 — старый уровень ~80 и новые результаты 85 и 89,
// step 2 — два броска из одной руки ложатся в разные места (пиксельные дуги),
// step 3 — полоса шума перезапуска шириной 4 пункта. Всё декоративное (aria-hidden).
import { computed } from "vue";

const props = defineProps<{ step: number }>();

const W = 860;
const H = 150;
const BASE = 118; // y линии шкалы
const MIN = 76;
const MAX = 94;
const PX = 6; // пиксель дуги
const X0 = 60; // рука бросающего
const xs = (v: number) => 120 + ((v - MIN) / (MAX - MIN)) * (W - 160);
const ticks = [76, 78, 80, 82, 84, 86, 88, 90, 92, 94];

/** пиксели параболы от руки до точки падения */
function arc(to: number, peak: number) {
	const x1 = xs(to);
	const out: { x: number; y: number }[] = [];
	const seen = new Set<string>();
	const n = 60;
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const x = X0 + (x1 - X0) * t;
		const y = BASE - 40 + (40 * t) - 4 * peak * t * (1 - t);
		const cx = Math.round(x / PX);
		const cy = Math.round(y / PX);
		const k = `${cx},${cy}`;
		if (seen.has(k)) continue;
		seen.add(k);
		// пунктир: каждый второй пиксель
		if (out.length % 2 === 0 || i === n) out.push({ x: cx * PX, y: cy * PX });
		else out.push({ x: -100, y: -100 });
	}
	return out.filter((p) => p.x >= 0);
}
const throws = computed(() => [
	{ v: 85, cells: arc(85, 70), d: 0 },
	{ v: 89, cells: arc(89, 95), d: 0.35 },
]);
</script>

<template>
  <svg class="t5-throws" :class="`st-${Math.min(step, 3)}`" :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" shape-rendering="crispEdges" aria-hidden="true">
    <!-- полоса шума: 85…89 -->
    <g class="th-noise">
      <rect :x="xs(85)" :y="BASE - 64" :width="xs(89) - xs(85)" height="64" class="th-band" />
      <text :x="(xs(85) + xs(89)) / 2" :y="BASE - 72" class="th-lbl th-noise-lbl">NOISE 4</text>
    </g>
    <!-- шкала -->
    <rect x="100" :y="BASE" :width="W - 120" height="6" class="th-axis" />
    <g v-for="t in ticks" :key="t">
      <rect :x="xs(t) - 2" :y="BASE + 6" width="4" height="8" class="th-axis" />
      <text :x="xs(t)" :y="BASE + 32" class="th-tick">{{ t }}</text>
    </g>
    <!-- рука: пиксельная кисть у левого края -->
    <g class="th-hand">
      <rect :x="X0 - 18" :y="BASE - 46" width="24" height="18" class="th-skin" />
      <rect :x="X0 - 12" :y="BASE - 58" width="6" height="12" class="th-skin" />
      <rect :x="X0 - 42" :y="BASE - 40" width="24" height="12" class="th-sleeve" />
    </g>
    <!-- старый уровень ~80 -->
    <g class="th-old">
      <rect :x="xs(80) - 2" :y="BASE - 52" width="4" height="52" class="th-old-pole" />
      <rect :x="xs(80) + 2" :y="BASE - 52" width="34" height="16" class="th-old-flag" />
      <text :x="xs(80) + 19" :y="BASE - 60" class="th-lbl th-old-lbl">~80</text>
    </g>
    <!-- броски -->
    <g v-for="(t, i) in throws" :key="i" class="th-throw" :style="{ '--d': `${t.d}s` }">
      <rect v-for="(c, k) in t.cells" :key="k" :x="c.x" :y="c.y" :width="PX" :height="PX" class="th-dot" :style="{ '--k': k }" />
      <g class="th-ball">
        <rect :x="xs(t.v) - 9" :y="BASE - 18" width="18" height="18" class="th-ball-b" />
        <rect :x="xs(t.v) - 9" :y="BASE - 11" width="18" height="3" class="th-ball-l" />
        <rect :x="xs(t.v) - 2" :y="BASE - 18" width="3" height="18" class="th-ball-l" />
      </g>
    </g>
    <!-- результаты повторов -->
    <g class="th-res">
      <rect :x="xs(85) - 3" :y="BASE - 4" width="6" height="14" class="th-pin" />
      <rect :x="xs(89) - 3" :y="BASE - 4" width="6" height="14" class="th-pin" />
    </g>
  </svg>
</template>

<style scoped>
.t5-throws {
  display: block;
  overflow: visible;
}
.th-axis { fill: #6d6496; }
.th-tick {
  fill: var(--pa-text-dim);
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 20px;
  text-anchor: middle;
}
.th-lbl {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 20px;
  text-anchor: middle;
}
.th-skin { fill: #ffb48a; }
.th-sleeve { fill: var(--lvl-accent); }
.th-old-pole { fill: #6d6496; }
.th-old-flag { fill: #3a3160; }
.th-old-lbl { fill: var(--pa-text-dim); }
.th-dot { fill: var(--pa-orange); }
.th-ball-b { fill: var(--pa-orange); }
.th-ball-l { fill: #7a3a10; }
.th-pin { fill: var(--pa-lime); }
.th-band { fill: rgba(255, 159, 62, 0.18); stroke: var(--pa-orange); stroke-width: 3; stroke-dasharray: 8 6; }
.th-noise-lbl { fill: var(--pa-orange); }

/* видимость по шагам */
.th-res, .th-throw, .th-noise, .th-hand { opacity: 0; transition: opacity 0.3s steps(3, end); }
.st-1 .th-res, .st-2 .th-res, .st-3 .th-res { opacity: 1; }
.st-2 .th-throw, .st-3 .th-throw, .st-2 .th-hand, .st-3 .th-hand { opacity: 1; }
.st-3 .th-noise { opacity: 1; }
/* бросок: дуга прорисовывается пикселями от руки, затем мяч падает на место */
.st-2 .th-dot {
  animation: th-dot 0.01s linear both;
  animation-delay: calc(var(--d) + var(--k) * 18ms);
}
@keyframes th-dot { from { opacity: 0; } to { opacity: 1; } }
.st-2 .th-ball {
  animation: th-ball 0.3s steps(3, end) both;
  animation-delay: calc(var(--d) + 0.3s);
}
@keyframes th-ball {
  from { transform: translateY(-24px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.st-3 .th-band { animation: th-blink 0.5s steps(1, end) 3; }
@keyframes th-blink { 50% { opacity: 0.3; } }
@media (prefers-reduced-motion: reduce) {
  .t5-throws * { animation: none !important; transition: none !important; }
}
</style>
