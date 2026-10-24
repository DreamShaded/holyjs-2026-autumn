<script setup lang="ts">
// Пиксельный робот — «наша сеть» как персонаж уровня «Тренировка».
// Позы: lift — качает гантель (два кадра), idle — стоит и моргает, cheer — руки вверх.
// Чисто декоративный спрайт (aria-hidden), анимация только через steps().
import { computed } from "vue";
import { sprite } from "./px";

const props = withDefaults(defineProps<{ cell?: number; pose?: "lift" | "idle" | "cheer" }>(), {
	cell: 4,
	pose: "idle",
});

// корпус 13×15 клеток: o — контур, b — корпус, h — блик, s — экран, e — глаза, a — антенна, l — ноги
const BODY = sprite([
	"......a......",
	"......o......",
	"..ooooooooo..",
	"..obbbbbbbo..",
	"..ossssssso..",
	"..osessseso..",
	"..ossssssso..",
	"..obbbbbbbo..",
	"...ooooooo...",
	"..obbbbbbbo..",
	"..obhbbbbbo..",
	"..obbbbbbbo..",
	"...ooooooo...",
	"...ol...lo...",
	"...oo...oo...",
]);
// руки и гантель: кадр «внизу» и кадр «вверху»
const DOWN = sprite([
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".b.........b.",
	".b.........b.",
	"dd.........dd",
	"dwwwwwwwwwwwd",
	"dd.........dd",
	".............",
]);
const UP = sprite([
	"dd.........dd",
	"dwwwwwwwwwwwd",
	"dd.........dd",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".............",
]);
const IDLE_ARMS = sprite([
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".............",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".............",
]);
const CHEER_ARMS = sprite([
	".............",
	".............",
	"b...........b",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
	".b.........b.",
]);

const W = 13;
const H = 15;
const frames = computed(() => {
	if (props.pose === "lift") return [DOWN, UP];
	if (props.pose === "cheer") return [CHEER_ARMS];
	return [IDLE_ARMS];
});
</script>

<template>
  <svg
    class="t5-bot"
    :class="`pose-${pose}`"
    :viewBox="`0 0 ${W} ${H}`"
    :width="W * cell"
    :height="H * cell"
    shape-rendering="crispEdges"
    aria-hidden="true"
  >
    <g v-for="(f, i) in frames" :key="i" class="bt-frame" :class="`bt-f${i}`">
      <rect v-for="(p, k) in f" :key="k" :x="p.x" :y="p.y" width="1" height="1" :class="`bt-${p.k}`" />
    </g>
    <g class="bt-body">
      <rect v-for="(p, k) in BODY" :key="k" :x="p.x" :y="p.y" width="1" height="1" :class="`bt-${p.k}`" />
    </g>
  </svg>
</template>

<style scoped>
.t5-bot {
  display: block;
  overflow: visible;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--lvl-accent, #ff3ecf) 55%, transparent));
}
.bt-o { fill: #1a1236; }
.bt-b { fill: var(--lvl-accent, #ff3ecf); }
.bt-h { fill: #ffd0f4; }
.bt-s { fill: #0b2a3a; }
.bt-e { fill: var(--pa-cyan, #3ef0ff); }
.bt-a { fill: var(--pa-yellow, #ffe13e); }
.bt-l { fill: #6d6496; }
.bt-d { fill: #b9b0d6; }
.bt-w { fill: #6d6496; }

/* гантель: два кадра сменяются ступенькой */
.pose-lift .bt-f1 { opacity: 0; }
.pose-lift .bt-f0 { animation: bt-a 1.2s steps(1, end) infinite; }
.pose-lift .bt-f1 { animation: bt-b 1.2s steps(1, end) infinite; }
@keyframes bt-a { 0% { opacity: 1; } 50% { opacity: 0; } }
@keyframes bt-b { 0% { opacity: 0; } 50% { opacity: 1; } }
/* моргание и мигание антенны */
.bt-e { animation: bt-blink 3.2s steps(1, end) infinite; }
@keyframes bt-blink { 0%, 92% { opacity: 1; } 94% { opacity: 0.15; } }
.bt-a { animation: bt-ant 0.9s steps(1, end) infinite; }
@keyframes bt-ant { 50% { fill: var(--lvl-accent, #ff3ecf); } }
.pose-cheer .bt-body { animation: bt-hop 0.6s steps(2, end) infinite; }
.pose-cheer .bt-frame { animation: bt-hop 0.6s steps(2, end) infinite; }
@keyframes bt-hop { 50% { transform: translateY(-1px); } }

@media (prefers-reduced-motion: reduce) {
  .t5-bot * { animation: none !important; }
  .pose-lift .bt-f1 { opacity: 0; }
}
@media print {
  .t5-bot * { animation: none !important; }
}
</style>
