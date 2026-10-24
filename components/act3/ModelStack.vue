<script setup lang="ts">
// Мини-карта архитектуры рядом с кодом buildModel: «домик» сети снизу вверх.
// step — номер клика слайда, он же шаг подсветки кода {all|2-6|9-13|15-17|all}:
//   1 — строки 2-6: кирпичики conv (трафарет 3×3) и shrink (÷2) мигают на всех этажах;
//   2 — строки 9-13: вход 64×64×7 и этажи загораются снизу вверх;
//   3 — строки 15-17: globalAveragePooling, dense и пять лампочек выхода;
//   4 — всё вместе, табло «≈100K» весов (оценка из заметок: «около ста тысяч»).
import { computed } from "vue";

const props = defineProps<{ step: number }>();

const FLOORS = [
	{ n: 3, convs: [64, 96], shrink: false },
	{ n: 2, convs: [32, 32], shrink: true },
	{ n: 1, convs: [16, 16], shrink: true },
];
/** уверенность пяти лампочек: горят те, что выше порога 0.5 */
const LAMPS = [0.94, 0.71, 0.08, 0.05, 0.03];

const s = computed(() => props.step);
const all = computed(() => s.value === 0 || s.value >= 4);
const bricks = computed(() => s.value === 1);
const floors = computed(() => s.value === 2 || all.value);
const head = computed(() => s.value === 3 || all.value);
</script>

<template>
  <div class="ms" :class="{ 'ms-bricks': bricks, 'ms-floors': floors, 'ms-head': head, 'ms-done': s >= 4 }" aria-hidden="true">
    <div class="ms-score">
      <span class="ms-score-lbl">PARAMS</span>
      <span class="ms-score-val">≈100K</span>
    </div>
    <div class="ms-out">
      <i v-for="(v, i) in LAMPS" :key="i" :class="{ on: v >= 0.5 }" />
    </div>
    <div class="ms-blk ms-dense">dense</div>
    <div class="ms-blk ms-gap">GAP</div>
    <div v-for="(f, k) in FLOORS" :key="f.n" class="ms-floor" :style="{ '--d': `${(2 - k) * 0.25}s` }">
      <span class="ms-n">{{ f.n }}</span>
      <span v-for="(c, j) in f.convs" :key="j" class="ms-conv">{{ c }}</span>
      <span class="ms-shrink" :class="{ off: !f.shrink }">÷2</span>
    </div>
    <div class="ms-blk ms-in">64×64×7</div>
  </div>
</template>

<style scoped>
.ms {
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1;
  color: #6a5f96;
}
.ms-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  margin-bottom: auto;
  background: #0b0718;
  box-shadow: inset 0 0 0 3px #2a2148;
  opacity: 0.25;
}
.ms-score-lbl {
  font-size: 1.125rem;
  letter-spacing: 0.1em;
}
.ms-score-val {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.2;
}
.ms-done .ms-score {
  opacity: 1;
  color: var(--pa-yellow);
  box-shadow: inset 0 0 0 3px var(--pa-yellow), 0 0 14px -2px rgba(255, 225, 62, 0.6);
}
.ms-out {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
}
.ms-out i {
  width: 18px;
  height: 18px;
  background: #2a2148;
}
.ms-head .ms-out i {
  background: #4a4070;
}
.ms-head .ms-out i.on {
  background: var(--pa-lime);
  box-shadow: 0 0 10px 1px rgba(157, 255, 62, 0.7);
}
.ms-blk,
.ms-floor {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 30px;
  background: #120b26;
  box-shadow: inset 0 0 0 2px #2a2148;
}
.ms-head .ms-dense,
.ms-head .ms-gap {
  color: var(--pa-text);
  box-shadow: inset 0 0 0 2px var(--lvl-accent2);
}
.ms-floor {
  justify-content: flex-start;
  padding: 3px 5px;
}
.ms-n {
  width: 1.25rem;
  text-align: center;
}
.ms-conv,
.ms-shrink {
  display: grid;
  place-items: center;
  height: 24px;
  padding: 0 4px;
  min-width: 30px;
  background: #1c1436;
}
.ms-shrink.off {
  visibility: hidden;
}
.ms-floors .ms-floor,
.ms-floors .ms-in {
  color: var(--pa-text);
  box-shadow: inset 0 0 0 2px var(--lvl-accent);
}
.ms-floors .ms-conv {
  color: #07040f;
  background: var(--lvl-accent);
}
.ms-bricks .ms-conv {
  color: #07040f;
  background: var(--pa-yellow);
}
.ms-bricks .ms-shrink {
  color: #07040f;
  background: var(--pa-orange);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .ms-bricks .ms-conv,
  .ms-bricks .ms-shrink {
    animation: ms-blink 0.7s steps(1, end) 3 both;
  }
  .ms-floors:not(.ms-done) .ms-floor {
    animation: ms-up 0.5s steps(2, end) var(--d) both;
  }
  .ms-head:not(.ms-done) .ms-out i.on {
    animation: ms-blink 0.5s steps(1, end) 0.2s 3 both;
  }
  .ms-done .ms-score-val {
    animation: ms-blink 0.4s steps(1, end) 4 both;
  }
}
@keyframes ms-blink {
  50% {
    filter: brightness(0.4);
  }
}
@keyframes ms-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
