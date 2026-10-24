<script setup lang="ts">
// Простой SVG-график по эпохам: несколько линий, каждая показывается по флагу show,
// вертикальная отметка marker и полупрозрачная зона band (например, «patience»).
// Аркадный вид: линии растеризуются Брезенхэмом в «пиксели» 4×4 (как на экране старого
// автомата) и прорисовываются слева направо, когда серия появляется. Масштаб осей
// (x(i), y(v)) прежний; пиксели лишь привязаны к сетке 4px, точки данных — по центру.
import { computed } from "vue";

interface Series {
	points: number[];
	color: string;
	label: string;
	show?: boolean;
}

const props = withDefaults(
	defineProps<{
		series: Series[];
		marker?: { x: number; label: string; show?: boolean } | null;
		band?: { from: number; to: number; label: string; show?: boolean } | null;
		xLabel?: string;
		width?: number;
		height?: number;
	}>(),
	{ marker: null, band: null, xLabel: "эпоха", width: 520, height: 300 },
);

const PAD = { l: 20, r: 20, t: 20, b: 44 };
/** размер «пикселя» графика */
const P = 4;
/** время прорисовки серии слева направо, мс */
const DRAW_MS = 520;

const n = computed(() => Math.max(...props.series.map((s) => s.points.length)));
const x = (i: number) => PAD.l + (i * (props.width - PAD.l - PAD.r)) / (n.value - 1);
const y = (v: number) => PAD.t + (1 - v) * (props.height - PAD.t - PAD.b);
const snap = (v: number) => Math.round(v / P);

// Цвета серий приходят из разметки слайдов; показываем их неоновыми аналогами палитры.
const NEON: Record<string, string> = {
	"#62ecff": "var(--pa-cyan)",
	"#ff6b6b": "var(--pa-red)",
	"#56ff71": "var(--pa-lime)",
};
const neon = (c: string) => NEON[c.toLowerCase()] ?? c;

/** Клетки сетки (в единицах P) вдоль отрезка — алгоритм Брезенхэма. */
function raster(x0: number, y0: number, x1: number, y1: number): [number, number][] {
	const out: [number, number][] = [];
	const dx = Math.abs(x1 - x0);
	const dy = -Math.abs(y1 - y0);
	const sx = x0 < x1 ? 1 : -1;
	const sy = y0 < y1 ? 1 : -1;
	let err = dx + dy;
	for (let guard = 0; guard < 4096; guard++) {
		out.push([x0, y0]);
		if (x0 === x1 && y0 === y1) break;
		const e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			x0 += sx;
		}
		if (e2 <= dx) {
			err += dx;
			y0 += sy;
		}
	}
	return out;
}

const plotW = computed(() => props.width - PAD.l - PAD.r);
/** задержка появления пикселя: пропорциональна его x, так линия «рисуется» слева направо */
const delay = (px: number) => `${Math.round(((px - PAD.l) / plotW.value) * DRAW_MS)}ms`;

const drawn = computed(() =>
	props.series.map((s) => {
		const seen = new Set<string>();
		const cells: { x: number; y: number; d: string }[] = [];
		for (let i = 1; i < s.points.length; i++) {
			for (const [cx, cy] of raster(snap(x(i - 1)), snap(y(s.points[i - 1])), snap(x(i)), snap(y(s.points[i])))) {
				const key = `${cx},${cy}`;
				if (seen.has(key)) continue;
				seen.add(key);
				cells.push({ x: cx * P - P / 2, y: cy * P - P / 2, d: delay(cx * P) });
			}
		}
		const dots = s.points.map((v, i) => ({ x: x(i), y: y(v), d: delay(x(i)) }));
		const last = s.points.length - 1;
		return {
			key: s.label,
			label: s.label,
			color: neon(s.color),
			hidden: s.show === false,
			cells,
			dots,
			lblX: x(last) - 6,
			lblY: y(s.points[last]) - 12,
			lblD: delay(x(last)),
		};
	}),
);

// пунктир отметки из пиксельных «штрихов» 4×8 с шагом 14px
const markerDashes = computed(() => {
	const out: number[] = [];
	for (let yy = PAD.t; yy < props.height - PAD.b; yy += 14) out.push(yy);
	return out;
});
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="chart" shape-rendering="crispEdges">
    <!-- фоновая пиксельная сетка: точки на пересечениях эпох и четвертей шкалы -->
    <g class="lc-grid" aria-hidden="true">
      <template v-for="i in n" :key="`gx${i}`">
        <rect
          v-for="q in 5"
          :key="q"
          :x="x(i - 1) - 1"
          :y="y((q - 1) / 4) - 1"
          width="2"
          height="2"
        />
      </template>
    </g>
    <rect :x="PAD.l" :y="height - PAD.b" :width="width - PAD.l - PAD.r" height="3" class="lc-axis" />
    <rect v-for="i in n" :key="`t${i}`" :x="x(i - 1) - 2" :y="height - PAD.b + 3" width="4" height="4" class="lc-axis" />
    <text v-for="i in n" :key="i" :x="x(i - 1)" :y="height - PAD.b + 24" class="lc-tick">{{ i }}</text>
    <text :x="width - PAD.r" :y="height - 2" class="lc-tick lc-end">{{ xLabel }}</text>
    <g v-if="band && band.show !== false">
      <rect :x="x(band.from)" :y="PAD.t" :width="x(band.to) - x(band.from)" :height="height - PAD.t - PAD.b" class="lc-band" />
      <text :x="(x(band.from) + x(band.to)) / 2" :y="PAD.t + 20" class="lc-tick lc-band-lbl">{{ band.label }}</text>
    </g>
    <g
      v-for="s in drawn"
      :key="s.key"
      :class="{ 'lc-off': s.hidden }"
      class="lc-series"
      :style="{ '--sc': s.color }"
    >
      <rect v-for="(c, k) in s.cells" :key="k" :x="c.x" :y="c.y" :width="P" :height="P" class="lc-px" :style="{ '--d': c.d }" />
      <rect
        v-for="(p, i) in s.dots"
        :key="`d${i}`"
        :x="p.x - 6"
        :y="p.y - 6"
        width="12"
        height="12"
        class="lc-dot"
        :style="{ '--d': p.d }"
      />
      <text :x="s.lblX" :y="s.lblY" class="lc-lbl" :style="{ '--d': s.lblD }">{{ s.label }}</text>
    </g>
    <g v-if="marker && marker.show !== false" class="lc-mk">
      <rect v-for="yy in markerDashes" :key="yy" :x="x(marker.x) - 1.5" :y="yy" width="3" height="8" class="lc-marker" />
      <text :x="x(marker.x) + 8" :y="PAD.t + 44" class="lc-tick lc-mk-lbl">{{ marker.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.chart {
  overflow: visible;
}
.lc-grid rect {
  fill: rgba(185, 176, 214, 0.28);
}
.lc-axis {
  fill: #6a5f96;
}
.lc-tick {
  fill: var(--pa-text-dim);
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 20px;
  text-anchor: middle;
}
.lc-tick.lc-end {
  text-anchor: end;
}
.lc-series {
  transition: opacity 0.3s steps(3, end);
  filter: drop-shadow(0 0 4px var(--sc));
}
.lc-series.lc-off {
  opacity: 0;
}
.lc-px {
  fill: var(--sc);
}
.lc-dot {
  fill: var(--pa-bg);
  stroke: var(--sc);
  stroke-width: 3px;
}
.lc-lbl {
  fill: var(--sc);
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 24px;
  text-anchor: end;
  paint-order: stroke;
  stroke: var(--pa-bg);
  stroke-width: 3px;
}
.lc-marker {
  fill: var(--color-green);
}
.lc-mk {
  filter: drop-shadow(0 0 3px var(--color-green));
  animation: lc-blink 1.1s steps(1, end) 3;
}
.lc-mk-lbl {
  fill: var(--color-green);
  text-anchor: start;
  font-size: 22px;
}
.lc-band {
  fill: rgba(62, 240, 255, 0.1);
}
.lc-band-lbl {
  fill: var(--color-cyan);
}

/* прорисовка: пиксели серии появляются по очереди слева направо, когда серия видима.
   linear, а не steps(1, end): со steps из-за погрешности float часть пикселей
   оставалась с opacity 0 после окончания анимации — в линии были дыры */
.lc-series:not(.lc-off) .lc-px,
.lc-series:not(.lc-off) .lc-dot,
.lc-series:not(.lc-off) .lc-lbl {
  animation: lc-pixel 0.01s linear var(--d) both;
}
@keyframes lc-pixel {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes lc-blink {
  0%,
  60% {
    opacity: 1;
  }
  61%,
  100% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lc-series:not(.lc-off) .lc-px,
  .lc-series:not(.lc-off) .lc-dot,
  .lc-series:not(.lc-off) .lc-lbl,
  .lc-mk {
    animation: none;
  }
}
@media print {
  .lc-series:not(.lc-off) .lc-px,
  .lc-series:not(.lc-off) .lc-dot,
  .lc-series:not(.lc-off) .lc-lbl,
  .lc-mk {
    animation: none;
  }
}
</style>

<style>
/* Если график стоит внутри скрытого v-click, прорисовку запускаем в момент показа. */
.slidev-vclick-hidden .chart .lc-px,
.slidev-vclick-hidden .chart .lc-dot,
.slidev-vclick-hidden .chart .lc-lbl {
  animation: none !important;
}
</style>
