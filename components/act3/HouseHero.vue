<script setup lang="ts">
// Пиксельный герой-платформер для слайда «Нейросеть как домик из трафаретов».
// Стоит на уступе этажа, который сейчас достроен: step 0 — на земле, 1..3 — на крыше этажа N.
// lift — высота одного этажа с зазором (px), base — высота «земли» под первым этажом.
import { computed } from "vue";
import { spriteCells } from "./pixel";

const props = withDefaults(defineProps<{ step: number; lift?: number; base?: number }>(), {
	lift: 108,
	base: 12,
});

const PX = 4;
// k — контур, c — шлем, w — визор, s — лицо, m — куртка, y — руки
const HERO = [
	"..kkkk..",
	".kcccck.",
	".kwwwck.",
	".kssssk.",
	"..kkkk..",
	".kmmmmk.",
	"kymmmmyk",
	".kmmmmk.",
	".km..mk.",
	".kk..kk.",
];
const cells = spriteCells(HERO, PX);
const W = HERO[0].length * PX;
const H = HERO.length * PX;

const level = computed(() => Math.max(0, Math.min(3, props.step)));
const y = computed(() => -(props.base + level.value * props.lift));
</script>

<template>
  <div class="hh" :style="{ transform: `translateY(${y}px)` }" aria-hidden="true">
    <svg class="hh-sprite" :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" shape-rendering="crispEdges">
      <rect v-for="(c, i) in cells" :key="i" :x="c.x" :y="c.y" :width="PX" :height="PX" :class="`px-${c.k}`" />
    </svg>
  </div>
</template>

<style scoped>
.hh {
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-left: -16px;
  transition: transform 0.6s steps(6, end);
}
.hh-sprite {
  display: block;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--pa-magenta) 50%, transparent));
}
.px-k {
  fill: #07040f;
}
.px-c {
  fill: var(--pa-cyan);
}
.px-w {
  fill: #ffffff;
}
.px-s {
  fill: #ffc59e;
}
.px-m {
  fill: var(--pa-magenta);
}
.px-y {
  fill: var(--pa-yellow);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .hh-sprite {
    animation: hh-bob 0.8s steps(1, end) infinite;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hh {
    transition: none;
  }
}
@keyframes hh-bob {
  0%,
  50% {
    transform: translateY(0);
  }
  51%,
  100% {
    transform: translateY(-4px);
  }
}
</style>
