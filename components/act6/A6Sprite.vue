<script setup lang="ts">
// Пиксельный спрайт акта 6 «Артефакт»: каждая строка — ряд пикселей, «.» — прозрачный.
// Цвет символа берётся из palette; символ без цвета не рисуется.
// Подряд идущие пиксели одного цвета склеиваются в один rect, чтобы DOM был лёгким.
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		rows: readonly string[];
		palette: Record<string, string>;
		px?: number;
	}>(),
	{ px: 4 },
);

interface Run {
	x: number;
	y: number;
	w: number;
	c: string;
}

const cols = computed(() => props.rows.reduce((m, r) => Math.max(m, r.length), 0));

const runs = computed<Run[]>(() => {
	const out: Run[] = [];
	props.rows.forEach((row, y) => {
		let x = 0;
		while (x < row.length) {
			const c = row[x];
			let w = 1;
			while (x + w < row.length && row[x + w] === c) w++;
			if (c !== "." && props.palette[c]) out.push({ x, y, w, c });
			x += w;
		}
	});
	return out;
});
</script>

<template>
  <svg
    class="a6-sprite"
    :viewBox="`0 0 ${cols * px} ${rows.length * px}`"
    :width="cols * px"
    :height="rows.length * px"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <rect
      v-for="(r, i) in runs"
      :key="i"
      :x="r.x * px"
      :y="r.y * px"
      :width="r.w * px"
      :height="px"
      :fill="palette[r.c]"
    />
  </svg>
</template>

<style scoped>
.a6-sprite {
  display: block;
  flex-shrink: 0;
}
</style>
