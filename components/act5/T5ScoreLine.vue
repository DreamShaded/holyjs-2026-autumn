<script setup lang="ts">
// Шкала попаданий к слайду «Проверки»: на ней оседают результаты контрольных.
// single — одна контрольная на одной story (100 %, «слишком хорошо»);
// count — сколько раундов k-fold уже показано (точки падают на шкалу вместе с рядами KFold);
// mean — итог: среднее, полоса ± и разброс между кучками. Все надписи декоративные.
import { computed } from "vue";

const props = withDefaults(
	defineProps<{ scores: number[]; count?: number; single?: boolean; mean?: boolean }>(),
	{ count: 0, single: false, mean: false },
);

const MIN = 0.5;
const MAX = 1;
const W = 360; // ширина шкалы, px
const pos = (v: number) => ((v - MIN) / (MAX - MIN)) * W;
const ticks = [0.5, 0.6, 0.7, 0.8, 0.9, 1];

const shown = computed(() => props.scores.slice(0, Math.max(0, Math.min(props.count, props.scores.length))));
const avg = computed(() => props.scores.reduce((a, b) => a + b, 0) / props.scores.length);
const sd = computed(() => {
	const m = avg.value;
	// выборочное отклонение (n − 1), как в «80 ± 16 %»
	return Math.sqrt(props.scores.reduce((a, b) => a + (b - m) ** 2, 0) / (props.scores.length - 1));
});
const lo = computed(() => Math.min(...props.scores));
const hi = computed(() => Math.max(...props.scores));
// точки с одинаковым значением ставим друг на друга
const stackOf = (i: number) => shown.value.slice(0, i).filter((v) => Math.abs(v - shown.value[i]) < 0.03).length;
</script>

<template>
  <div class="t5-line" aria-hidden="true">
    <div class="sl-track" :style="{ width: `${W}px` }">
      <div v-if="mean" class="sl-band" :style="{ left: `${pos(avg - sd)}px`, width: `${pos(avg + sd) - pos(avg - sd)}px` }" />
      <div v-if="mean" class="sl-range" :style="{ left: `${pos(lo)}px`, width: `${pos(hi) - pos(lo)}px` }" />
      <i v-for="t in ticks" :key="t" class="sl-tick" :style="{ left: `${pos(t)}px` }" />
      <div v-if="single && !count" class="sl-dot sl-single" :style="{ left: `${pos(1)}px` }"><span>1 STORY?!</span></div>
      <div
        v-for="(v, i) in shown"
        :key="i"
        class="sl-dot"
        :class="{ low: v < 0.7, top: v === 1 }"
        :style="{ left: `${pos(v)}px`, '--k': stackOf(i) }"
      ><b>{{ i + 1 }}</b></div>
      <div v-if="mean" class="sl-mean" :style="{ left: `${pos(avg)}px` }"><span>⌀ {{ Math.round(avg * 100) }} ± {{ Math.round(sd * 100) }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.t5-line {
  position: relative;
  padding: 3.1rem 1.4rem 1.9rem 1.2rem;
}
.sl-track {
  position: relative;
  height: 8px;
  background: repeating-linear-gradient(90deg, #3a3160 0 8px, #241c42 8px 12px);
  box-shadow: 0 0 0 2px #07040f;
}
.sl-tick {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 16px;
  margin-left: -2px;
  background: #6d6496;
}
/* точка раунда «падает» на шкалу */
.sl-dot {
  position: absolute;
  bottom: calc(14px + var(--k, 0) * 26px);
  width: 22px;
  height: 22px;
  margin-left: -11px;
  display: grid;
  place-items: center;
  background: var(--pa-cyan);
  box-shadow: 0 0 0 3px #07040f, 0 0 10px rgba(62, 240, 255, 0.7);
  animation: sl-drop 0.4s steps(4, end);
}
.sl-dot b {
  font-family: var(--pa-font-display);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
}
.sl-dot.low { background: var(--pa-red); box-shadow: 0 0 0 3px #07040f, 0 0 10px rgba(255, 77, 109, 0.7); }
.sl-dot.top { background: var(--pa-lime); box-shadow: 0 0 0 3px #07040f, 0 0 10px rgba(157, 255, 62, 0.7); }
@keyframes sl-drop {
  from { transform: translateY(-36px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.sl-single {
  background: var(--pa-yellow);
  box-shadow: 0 0 0 3px #07040f, 0 0 12px rgba(255, 225, 62, 0.8);
  animation: sl-drop 0.4s steps(4, end), sl-sus 0.8s steps(1, end) 0.4s infinite;
}
.sl-single span {
  position: absolute;
  right: -4px;
  bottom: 30px;
  white-space: nowrap;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--pa-red);
}
@keyframes sl-sus { 50% { transform: translateY(-4px); } }
/* итог: полоса ± и разброс */
.sl-band {
  position: absolute;
  top: -10px;
  height: 28px;
  background: repeating-linear-gradient(45deg, rgba(157, 255, 62, 0.4) 0 4px, rgba(157, 255, 62, 0.12) 4px 8px);
  box-shadow: inset 0 0 0 2px var(--pa-lime);
  animation: sl-open 0.5s steps(5, end);
  transform-origin: 50% 50%;
}
.sl-range {
  position: absolute;
  top: 2px;
  height: 4px;
  background: var(--pa-lime);
}
@keyframes sl-open { from { transform: scaleX(0); } }
.sl-mean {
  position: absolute;
  top: -18px;
  width: 4px;
  height: 76px;
  margin-left: -2px;
  background: var(--pa-lime);
  box-shadow: 0 0 8px var(--pa-lime);
}
.sl-mean span {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 0.1rem 0.35rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--pa-lime);
}
@media (prefers-reduced-motion: reduce) {
  .t5-line * { animation: none !important; }
}
</style>
