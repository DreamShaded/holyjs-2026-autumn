<script setup lang="ts">
// Станция на трассе данных (слайд «Инфраструктура», пайплайн). Корпус — пиксельная рамка
// с окном, в окне иконка из слота; сверху крыша-спрайт своего вида:
// node — пульт с антеннами, forge — кузня-видеокарта с трубой и огнём, vault — сундук для весов.
// on — станция запитана (горит цветом tone), live — сейчас её шаг: мигают антенны, пылает труба.
import { computed } from "vue";
import A4Sprite from "./A4Sprite.vue";

type Kind = "node" | "forge" | "vault";

const props = withDefaults(
	defineProps<{
		kind: Kind;
		on?: boolean;
		live?: boolean;
		/** цвет подсветки корпуса */
		tone?: string;
	}>(),
	{ on: false, live: false, tone: "var(--lvl-accent)" },
);

const PX = 5;

const ROOFS: Record<Kind, string[]> = {
	node: [
		"....a....................a....",
		"....k....................k....",
		"....k.......kkkkkk.......k....",
		"....k......kllllllk......k....",
		"....k.....kllllllllk.....k....",
		"..kkkkkkkkkkkkkkkkkkkkkkkkkk..",
		".kmmmmmmmmmmmmmmmmmmmmmmmmmmk.",
	],
	forge: [
		"..............................",
		"..............................",
		"....................kOOOk.....",
		"....................kmmmk.....",
		"....................kmmmk.....",
		"..kkkkkkkkkkkkkkkkkkkkkkkkkk..",
		".kmmmmmmmmmmmmmmmmmmmmmmmmmmk.",
	],
	vault: [
		"..............................",
		"......kkkkkkkkkkkkkkkkkk......",
		".....kaaaaaaaaaaaaaaaaaak.....",
		"....kammmmmmmmmmmmmmmmmmak....",
		"...kammmmmmmmmmmmmmmmmmmmak...",
		"..kkkkkkkkkkkkkkkkkkkkkkkkkk..",
		".kmmmmmmmmmmmmmmmmmmmmmmmmmmk.",
	],
};

// огонь над трубой кузни: два кадра, сменяются ступенькой
const FLAME_A = ["..f.f", ".fffy", "fyyyf"];
const FLAME_B = [".f.f.", "fyff.", "fyyyf"];

const palette = computed(() => ({
	k: "#07040f",
	l: props.on ? "#8f86c4" : "#4a4266",
	m: props.on ? "#4b4080" : "#2c2450",
	a: props.on ? props.tone : "#4a4266",
	O: props.on ? "#ff4d6d" : "#3a3160",
}));
const flamePal = { f: "#ff9f3e", y: "#ffe13e" };
</script>

<template>
  <div
    class="a4-station"
    :class="[`st-${kind}`, { 'st-on': on, 'st-live': live }]"
    :style="{ '--st-tone': tone }"
  >
    <div class="st-roof" aria-hidden="true">
      <A4Sprite :rows="ROOFS[kind]" :palette="palette" :px="PX" />
      <template v-if="kind === 'forge' && on">
        <A4Sprite class="st-flame fa" :rows="FLAME_A" :palette="flamePal" :px="PX" />
        <A4Sprite class="st-flame fb" :rows="FLAME_B" :palette="flamePal" :px="PX" />
      </template>
    </div>
    <div class="st-box">
      <div class="st-window"><slot /></div>
      <div class="st-leds" aria-hidden="true"><i v-for="n in 5" :key="n" :style="{ '--i': n }" /></div>
    </div>
  </div>
</template>

<style scoped>
.a4-station {
  --st-frame: #3a3160;
  position: relative;
  width: 150px;
  transition: filter 0.3s steps(3);
}
.st-on {
  --st-frame: var(--st-tone);
  filter: drop-shadow(0 0 0.55rem color-mix(in srgb, var(--st-tone) 45%, transparent));
}
.st-roof {
  position: relative;
  height: 35px;
}
.st-flame {
  position: absolute;
  left: 100px;
  top: -5px;
}
.st-flame.fb { opacity: 0; }
.st-live .st-flame.fa { animation: st-flick 0.4s steps(1, end) infinite; }
.st-live .st-flame.fb { animation: st-flick 0.4s steps(1, end) 0.2s infinite; }
@keyframes st-flick {
  0% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
/* антенны пульта мигают, пока его шаг */
.st-live.st-node .st-roof :deep(rect[fill]:first-child) {
  animation: st-blink 0.6s steps(1, end) infinite;
}

.st-box {
  position: relative;
  margin: 0 5px;
  padding: 10px 12px 8px;
  background: #120c28;
  box-shadow:
    0 -4px 0 0 var(--st-frame),
    0 4px 0 0 var(--st-frame),
    -4px 0 0 0 var(--st-frame),
    4px 0 0 0 var(--st-frame);
}
.st-window {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  background:
    linear-gradient(transparent 50%, rgba(255, 255, 255, 0.04) 50%) 0 0 / 100% 4px,
    #07040f;
  box-shadow: inset 0 0 0 3px #241c42;
  filter: grayscale(0.85) brightness(0.5);
  transition: filter 0.3s steps(3);
}
.st-on .st-window {
  filter: none;
}
.st-leds {
  display: flex;
  gap: 5px;
  margin-top: 7px;
}
.st-leds i {
  width: 10px;
  height: 6px;
  background: #2c2450;
}
.st-on .st-leds i {
  background: var(--st-tone);
}
.st-live .st-leds i {
  animation: st-blink 0.8s steps(1, end) infinite;
  animation-delay: calc(var(--i) * 0.13s);
}
@keyframes st-blink {
  50% { opacity: 0.25; }
}

@media (prefers-reduced-motion: reduce) {
  .st-flame,
  .st-leds i,
  .st-roof :deep(rect) { animation: none !important; }
  .st-flame.fb { display: none; }
}
@media print {
  .st-flame,
  .st-leds i,
  .st-roof :deep(rect) { animation: none !important; }
  .st-flame.fb { display: none; }
}
</style>
