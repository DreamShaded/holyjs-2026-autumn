<script setup lang="ts">
// Герой экрана экипировки (слайд «Кто что делает»): пиксельный разработчик, на которого
// по шагам надеваются предметы-инструменты. gear — номер шага слайда ($clicks):
// 1 — пояс (tsx/esbuild, vitest) и рюкзак (Vue/Storybook), 2 — перчатки (Playwright),
// 3 — лупа (pixelmatch), 4 — корона-«мозг» (TensorFlow.js), 5 — щит (zod).
// Каждый слой — отдельный спрайт со своим смещением на сетке 24×27 пикселей.
import { computed } from "vue";
import A4Sprite from "./A4Sprite.vue";

const props = withDefaults(defineProps<{ gear?: number; px?: number }>(), { gear: 0, px: 6 });

const COLS = 24;
const ROWS = 27;

// тело 16×24, ставится в (4, 3)
const BODY = [
	"....kkkkkkkk....",
	"...khhhhhhhhk...",
	"...khhhhhhhhk...",
	"...khsssssshk...",
	"...ksessssesk...",
	"...kssssssssk...",
	"...ksssmmsssk...",
	"....kssssssk....",
	".....kssssk.....",
	"..kkttttttttkk..",
	".kukttttttttkuk.",
	".kukttttttttkuk.",
	".kuktttaatttkuk.",
	".kuktttaatttkuk.",
	".kskttttttttksk.",
	".kkkttttttttkkk.",
	"...kppppppppk...",
	"...kppppppppk...",
	"...kpppkkpppk...",
	"...kpppkkpppk...",
	"...kpppkkpppk...",
	"...kpppkkpppk...",
	"..kooookkooook..",
	"..kkkkkkkkkkkk..",
];

interface Layer {
	id: string;
	from: number;
	x: number;
	y: number;
	rows: string[];
	palette: Record<string, string>;
}

const LAYERS: Layer[] = [
	{
		id: "pack",
		from: 1,
		x: 17,
		y: 8,
		rows: ["kkkk", "kGGk", "kGGk", "kGGk", "kkkk"],
		palette: { k: "#07040f", G: "#ff4785" },
	},
	{
		id: "straps",
		from: 1,
		x: 9,
		y: 12,
		rows: ["g....g", "g....g", "g....g", "g....g", "g....g", "g....g", "g....g"],
		palette: { g: "#42b883" },
	},
	{
		id: "belt",
		from: 1,
		x: 7,
		y: 19,
		rows: ["kyyybbyyyk", ".Y......Y.", ".Y......Y."],
		palette: { k: "#07040f", y: "#ffcf00", b: "#3178c6", Y: "#729b1b" },
	},
	{
		id: "gloves",
		from: 2,
		x: 5,
		y: 16,
		rows: ["kRk........kRk", "krk........krk"],
		palette: { k: "#07040f", R: "#e2574c", r: "#2ead33" },
	},
	{
		id: "lens",
		from: 3,
		x: 19,
		y: 11,
		rows: [".kkk.", "kwllk", "klllk", "kllck", ".kkk.", "n....", "n...."],
		palette: { k: "#07040f", w: "#ffffff", l: "#3ef0ff", c: "#1e6f86", n: "#ff9f3e" },
	},
	{
		id: "crown",
		from: 4,
		x: 8,
		y: 0,
		rows: ["o..oo..o", "oo.oo.oo", "oOoOOoOo", "oooooooo"],
		palette: { o: "#ff6f00", O: "#ffe13e" },
	},
	{
		id: "shield",
		from: 5,
		x: 0,
		y: 12,
		rows: ["kkkkk", "kZZZk", "kzzZk", "kzZzk", "kZzzk", "kZZZk", ".kzk.", "..k.."],
		palette: { k: "#07040f", z: "#3068b7", Z: "#8fb7f0" },
	},
];

const bodyPalette = computed(() => ({
	k: "#07040f",
	h: "#6b3f1d",
	s: "#f2c29b",
	// с «мозгом» глаза загораются цветом уровня
	e: props.gear >= 4 ? "var(--lvl-accent, #ff9f3e)" : "#07040f",
	m: "#b85a5a",
	t: "#4b4080",
	u: "#3a3160",
	a: props.gear >= 1 ? "var(--lvl-accent, #ff9f3e)" : "#6d6496",
	p: "#241c42",
	o: "#6d6496",
}));
</script>

<template>
  <div
    class="a4-hero"
    :class="{ 'is-idle': gear <= 0, 'is-full': gear >= 5 }"
    :style="{ width: `${COLS * px}px`, height: `${ROWS * px}px` }"
    aria-hidden="true"
  >
    <A4Sprite class="h-body" :rows="BODY" :palette="bodyPalette" :px="px" :style="{ left: `${4 * px}px`, top: `${3 * px}px` }" />
    <A4Sprite
      v-for="l in LAYERS"
      :key="l.id"
      class="h-layer"
      :class="[`h-${l.id}`, { on: gear >= l.from, fresh: gear === l.from }]"
      :rows="l.rows"
      :palette="l.palette"
      :px="px"
      :style="{ left: `${l.x * px}px`, top: `${l.y * px}px` }"
    />
  </div>
</template>

<style scoped>
.a4-hero {
  position: relative;
  transition: filter 0.3s steps(3);
}
.a4-hero > * {
  position: absolute;
}
/* до первого шага герой стоит «без экипировки» в полумраке */
/* «дыхание» героя: два кадра, сдвиг на один пиксель */
.a4-hero:not(.is-idle) {
  animation: h-breathe 1.6s steps(1, end) infinite;
}
@keyframes h-breathe {
  50% { transform: translateY(-2px); }
}
.is-idle {
  filter: grayscale(0.7) brightness(0.6);
}
.is-full {
  filter: drop-shadow(0 0 0.6rem color-mix(in srgb, var(--lvl-accent) 55%, transparent));
}
.h-layer {
  opacity: 0;
}
.h-layer.on {
  opacity: 1;
}
/* только что надетый предмет «вспыхивает» и прыгает на место */
.h-layer.fresh {
  animation: h-equip 0.6s steps(6, end);
}
@keyframes h-equip {
  0% { opacity: 0; transform: translateY(-18px); filter: brightness(3); }
  50% { opacity: 1; transform: translateY(0); filter: brightness(2.2); }
  100% { opacity: 1; transform: none; filter: none; }
}
/* корона-«мозг» мерцает, когда сеть на месте */
.h-crown.on {
  filter: drop-shadow(0 0 4px #ff9f3e);
}
@media (prefers-reduced-motion: reduce) {
  .h-layer.fresh,
  .a4-hero:not(.is-idle) { animation: none; }
}
@media print {
  .h-layer.fresh,
  .a4-hero:not(.is-idle) { animation: none; }
}
</style>
