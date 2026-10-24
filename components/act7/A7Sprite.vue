<script setup lang="ts">
// Спрайт уровня 7 в SVG. Клетка = px пикселей, цвет символа — из palette.
// Символ без цвета в палитре пропускается: так слой спрайта можно выключить.
// Можно отразить по горизонтали (flip), чтобы рыба плыла в другую сторону.
import { computed } from "vue";
import { type SpriteRows, spriteRuns, spriteSize } from "./sprites";

const props = withDefaults(
	defineProps<{
		rows: SpriteRows;
		palette: Record<string, string>;
		px?: number;
		flip?: boolean;
	}>(),
	{ px: 3, flip: false },
);

const size = computed(() => spriteSize(props.rows));
const runs = computed(() => spriteRuns(props.rows).filter((r) => props.palette[r.k]));
</script>

<template>
  <svg
    class="a7-sprite"
    :viewBox="`0 0 ${size.w} ${size.h}`"
    :width="size.w * px"
    :height="size.h * px"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <g :transform="flip ? `translate(${size.w} 0) scale(-1 1)` : undefined">
      <rect
        v-for="(r, i) in runs"
        :key="i"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        height="1"
        :fill="palette[r.k]"
      />
    </g>
  </svg>
</template>

<style scoped>
.a7-sprite {
  display: block;
  flex: none;
  overflow: visible;
}
</style>
