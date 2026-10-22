<script setup lang="ts">
// Простой SVG-график по эпохам: несколько линий, каждая показывается по флагу show,
// вертикальная отметка marker и полупрозрачная зона band (например, «patience»).
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
const n = computed(() => Math.max(...props.series.map((s) => s.points.length)));
const x = (i: number) => PAD.l + (i * (props.width - PAD.l - PAD.r)) / (n.value - 1);
const y = (v: number) => PAD.t + (1 - v) * (props.height - PAD.t - PAD.b);
const path = (pts: number[]) => pts.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
</script>

<template>
  <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="chart">
    <line :x1="PAD.l" :y1="height - PAD.b" :x2="width - PAD.r" :y2="height - PAD.b" class="axis" />
    <text v-for="i in n" :key="i" :x="x(i - 1)" :y="height - PAD.b + 22" class="tick">{{ i }}</text>
    <text :x="width - PAD.r" :y="height - 2" class="tick end">{{ xLabel }}</text>
    <g v-if="band && band.show !== false">
      <rect :x="x(band.from)" :y="PAD.t" :width="x(band.to) - x(band.from)" :height="height - PAD.t - PAD.b" class="band" />
      <text :x="(x(band.from) + x(band.to)) / 2" :y="PAD.t + 20" class="tick band-lbl">{{ band.label }}</text>
    </g>
    <g v-for="s in series" :key="s.label" :class="{ hidden: s.show === false }" class="series">
      <path :d="path(s.points)" :stroke="s.color" class="line" />
      <circle v-for="(v, i) in s.points" :key="i" :cx="x(i)" :cy="y(v)" r="4" :fill="s.color" />
      <text :x="x(s.points.length - 1) - 6" :y="y(s.points[s.points.length - 1]) - 12" :fill="s.color" class="lbl">{{ s.label }}</text>
    </g>
    <g v-if="marker && marker.show !== false">
      <line :x1="x(marker.x)" :y1="PAD.t" :x2="x(marker.x)" :y2="height - PAD.b" class="marker" />
      <text :x="x(marker.x) + 8" :y="PAD.t + 44" class="tick mk-lbl">{{ marker.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.chart {
  overflow: visible;
}
.axis {
  stroke: rgba(255, 255, 255, 0.4);
}
.tick {
  fill: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  text-anchor: middle;
}
.tick.end {
  text-anchor: end;
}
.series {
  transition: opacity 0.4s;
}
.series.hidden {
  opacity: 0;
}
.line {
  fill: none;
  stroke-width: 3;
}
.lbl {
  font-size: 18px;
  font-weight: 700;
  text-anchor: end;
}
.marker {
  stroke: var(--color-green);
  stroke-width: 2;
  stroke-dasharray: 6 4;
}
.mk-lbl {
  fill: var(--color-green);
  text-anchor: start;
  font-weight: 700;
}
.band {
  fill: rgba(98, 236, 255, 0.1);
}
.band-lbl {
  fill: var(--color-cyan);
}
</style>
