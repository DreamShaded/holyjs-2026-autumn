<script setup lang="ts">
// Верхний глобальный слой: HUD, пиксельное растворение на смене уровня и CRT-оверлей.
// Здесь же расставляется переход level-up на границах уровней (см. levels.ts).
import { computed, onBeforeUnmount, ref, watch, watchEffect } from "vue";
import CrtOverlay from "./components/CrtOverlay.vue";
import Hud from "./components/Hud.vue";
import { applyLevelTransitions, levelVars, routeLevel, useLevelNav } from "./components/levels";

const { globalNav, slides, level, page, total, isPrint } = useLevelNav();

watchEffect(() => applyLevelTransitions(globalNav.slides.value));

const slideLevels = computed(() => slides.value.map((r) => routeLevel(r)));

// растворение: сетка клеток вспыхивает и гаснет со случайной задержкой (только opacity)
const COLS = 20;
const ROWS = 12;
const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
	const x = i % COLS;
	const y = (i / COLS) | 0;
	// псевдослучайная задержка, стабильная между показами
	const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
	return { i, delay: Math.round((h - Math.floor(h)) * 260) };
});
const fx = ref(0);
const fxLevel = ref(0);
let fxTimer: ReturnType<typeof setTimeout> | undefined;
watch(level, (now, before) => {
	if (isPrint.value || now === before) return;
	if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	fxLevel.value = now;
	fx.value++;
	clearTimeout(fxTimer);
	fxTimer = setTimeout(() => {
		fx.value = 0;
	}, 900);
});
onBeforeUnmount(() => clearTimeout(fxTimer));
</script>

<template>
  <Hud
    v-if="level > 0"
    :level="level"
    :page="page"
    :total="total"
    :slide-levels="slideLevels"
  />
  <div
    v-if="fx"
    :key="fx"
    class="pa-levelup"
    :style="levelVars(fxLevel)"
    aria-hidden="true"
  >
    <i v-for="c in cells" :key="c.i" :style="{ animationDelay: `${c.delay}ms` }" />
  </div>
  <CrtOverlay :animate="!isPrint" />
</template>

<style scoped>
.pa-levelup {
  position: absolute;
  inset: 0;
  z-index: 25;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(12, 1fr);
  pointer-events: none;
}
.pa-levelup i {
  display: block;
  opacity: 0;
  background: #07040f;
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--lvl-accent) 35%, transparent);
  animation: pa-dissolve 0.56s steps(4, end) both;
}
.pa-levelup i:nth-child(7n + 3) {
  background: color-mix(in srgb, var(--lvl-accent) 70%, #07040f);
}
@keyframes pa-dissolve {
  0% {
    opacity: 0;
  }
  35% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
