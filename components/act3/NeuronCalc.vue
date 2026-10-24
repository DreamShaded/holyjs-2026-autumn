<script setup lang="ts">
// Аркадный «калькулятор нейрона» (слайд «Как считает один нейрон»).
// step — номер клика слайда:
//   1..4 — по очереди включаются блоки x, w, Σ, y (текущий помечен курсором);
//   5    — автомат крутит три раунда примера из заметок: точка, заливка, края.
// Веса примера: у середины +2, у соседей −1 («здесь должно быть темно»).
// Слот по умолчанию — табло раундов со слайда; активная строка табло подсвечивается
// классом r0/r1/r2 на корне (один таймер на автомат и табло, поэтому они не расходятся).
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ step: number }>();

/** длительность одного раунда, мс */
const ROUND_MS = 1600;

const WEIGHTS = [-1, 2, -1];
/** три раунда: пиксели входа, сумма и исход */
const ROUNDS = [
	{ px: [0, 1, 0], sum: "2", out: "on" },
	{ px: [1, 1, 1], sum: "0", out: "idle" },
	{ px: [1, 0, 1], sum: "−2", out: "neg" },
] as const;

const running = computed(() => props.step >= 5);

// Таймер раундов: идёт только пока автомат включён и анимации разрешены.
const round = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
function stop() {
	if (timer) clearInterval(timer);
	timer = null;
	round.value = 0;
}
function start() {
	stop();
	const calm =
		typeof window === "undefined" ||
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
		window.matchMedia?.("print").matches;
	if (calm) return;
	const t0 = performance.now();
	timer = setInterval(() => {
		round.value = Math.floor((performance.now() - t0) / ROUND_MS) % 3;
	}, 100);
}
watch(running, (on) => (on ? start() : stop()), { immediate: true });
onBeforeUnmount(stop);
const lit = (n: number) => props.step >= n;
const cur = (n: number) => props.step === n;
const fmtW = (w: number) => (w > 0 ? `+${w}` : `−${Math.abs(w)}`);
</script>

<template>
  <div class="calc" :class="[{ 'calc-run': running }, `r${round}`]">
    <div class="calc-box" aria-hidden="true">
      <div class="calc-bar"><i /><i /><i /><span>NEURON.CALC</span><b v-if="running" class="calc-rec">RUN</b></div>
      <div class="calc-body">
        <!-- x: три пикселя входа -->
        <div class="calc-row" :class="{ 'is-lit': lit(1), 'is-cur': cur(1) }">
          <span class="calc-lbl">x</span>
          <div class="calc-cells">
            <div v-for="i in 3" :key="i" class="calc-cell">
              <span class="fn">?</span>
              <span v-for="(r, k) in ROUNDS" :key="k" class="fr" :class="[`f${k}`, { on: r.px[i - 1] }]" />
            </div>
          </div>
        </div>
        <!-- w: веса под каждым пикселем -->
        <div class="calc-row" :class="{ 'is-lit': lit(2), 'is-cur': cur(2) }">
          <span class="calc-lbl">w</span>
          <div class="calc-cells">
            <span v-for="(w, i) in WEIGHTS" :key="i" class="calc-w" :class="w > 0 ? 'pos' : 'neg'">{{ fmtW(w) }}</span>
          </div>
        </div>
        <!-- Σ и выход y -->
        <div class="calc-row calc-row-out">
          <span class="calc-lbl" :class="{ 'is-lit': lit(3), 'is-cur': cur(3) }">Σ</span>
          <div class="calc-sum" :class="{ 'is-lit': lit(3) }">
            <span class="fn">= ?</span>
            <span v-for="(r, k) in ROUNDS" :key="k" class="fr" :class="`f${k}`">= {{ r.sum }}</span>
          </div>
          <span class="calc-arrow" :class="{ 'is-lit': lit(4) }" />
          <div class="calc-y" :class="{ 'is-lit': lit(4), 'is-cur': cur(4) }">
            <span class="calc-lbl">y</span>
            <div class="calc-lamp">
              <span class="fn" />
              <span v-for="(r, k) in ROUNDS" :key="k" class="fr" :class="[`f${k}`, `o-${r.out}`]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.calc {
  --c-on: var(--lvl-accent);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.calc-box {
  background: #0b0718;
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line),
    6px 6px 0 0 rgba(0, 0, 0, 0.5);
}
.calc-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.15rem 0.75rem;
  background: color-mix(in srgb, var(--lvl-accent) 18%, #07040f);
  border-bottom: 3px solid var(--pa-line);
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
  color: var(--pa-text);
}
.calc-bar i {
  width: 6px;
  height: 6px;
  background: var(--lvl-accent);
}
.calc-bar span {
  margin-left: 0.4rem;
  letter-spacing: 0.08em;
}
.calc-rec {
  margin-left: auto;
  color: var(--pa-red);
  font-weight: 700;
}
.calc-body {
  padding: 0.7rem 1rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.calc-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.calc-lbl {
  position: relative;
  width: 1.75rem;
  text-align: center;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1;
  color: #6a5f96;
  transition: color 0.3s steps(3, end);
}
.is-lit > .calc-lbl,
.calc-lbl.is-lit {
  color: var(--c-on);
  text-shadow: 0 0 10px color-mix(in srgb, var(--c-on) 60%, transparent);
}
/* курсор текущего шага */
.is-cur > .calc-lbl::before,
.calc-lbl.is-cur::before {
  content: "";
  position: absolute;
  left: -0.85rem;
  top: 50%;
  margin-top: -6px;
  border: 6px solid transparent;
  border-left-color: var(--pa-yellow);
}
.calc-cells {
  display: flex;
  gap: 0.6rem;
}
.calc-cell,
.calc-w {
  width: 52px;
}
.calc-cell {
  position: relative;
  height: 52px;
  background: #160e2e;
  box-shadow: inset 0 0 0 3px #3a3160;
  display: grid;
  place-items: center;
}
.is-lit .calc-cell {
  box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--c-on) 70%, #3a3160);
}
.calc-cell .fn {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.5rem;
  color: #6a5f96;
}
.calc-cell .fr {
  position: absolute;
  inset: 3px;
  opacity: 0;
}
.calc-cell .fr.on {
  background: #f2ecff;
  box-shadow: inset -4px -4px 0 0 #b9b0d6;
}
.calc-w {
  text-align: center;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.25rem;
  color: #6a5f96;
}
.is-lit .calc-w.pos {
  color: var(--pa-lime);
}
.is-lit .calc-w.neg {
  color: var(--pa-red);
}
.calc-row-out {
  margin-top: 0.3rem;
}
.calc-sum {
  position: relative;
  width: calc(52px * 3 + 1.2rem);
  height: 48px;
  background: #050a08;
  box-shadow: inset 0 0 0 3px #3a3160;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-display);
  font-size: 1.125rem;
  color: #4a4070;
}
.calc-sum.is-lit {
  box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--c-on) 70%, #3a3160);
  color: var(--pa-lime);
  text-shadow: 0 0 8px rgba(157, 255, 62, 0.6);
}
.calc-sum .fr {
  position: absolute;
  opacity: 0;
}
.calc-arrow {
  width: 22px;
  height: 6px;
  background: #3a3160;
}
.calc-arrow.is-lit {
  background: var(--c-on);
}
.calc-y {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.calc-lamp {
  position: relative;
  width: 48px;
  height: 48px;
}
.calc-lamp > span {
  position: absolute;
  inset: 0;
  clip-path: polygon(25% 0, 75% 0, 75% 12.5%, 87.5% 12.5%, 87.5% 25%, 100% 25%, 100% 75%, 87.5% 75%, 87.5% 87.5%, 75% 87.5%, 75% 100%, 25% 100%, 25% 87.5%, 12.5% 87.5%, 12.5% 75%, 0 75%, 0 25%, 12.5% 25%, 12.5% 12.5%, 25% 12.5%);
}
.calc-lamp .fn {
  background: #2a2148;
}
.is-lit .calc-lamp .fn {
  background: #3a3160;
}
.calc-lamp .fr {
  opacity: 0;
}
.calc-lamp .o-on {
  background: var(--pa-lime);
  box-shadow: inset -6px -6px 0 0 rgba(0, 0, 0, 0.2);
}
.calc-lamp .o-idle {
  background: #6a5f96;
}
.calc-lamp .o-neg {
  background: var(--pa-red);
  box-shadow: inset -6px -6px 0 0 rgba(0, 0, 0, 0.2);
}

/* режим «автомат крутит раунды»: виден кадр текущего раунда */
.calc-run .fn {
  opacity: 0;
}
.calc-run.r0 .fr.f0,
.calc-run.r1 .fr.f1,
.calc-run.r2 .fr.f2 {
  opacity: 1;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .calc-rec {
    animation: calc-rec 1s steps(1, end) infinite;
  }
  .is-cur > .calc-lbl::before,
  .calc-lbl.is-cur::before {
    animation: calc-rec 0.8s steps(1, end) infinite;
  }
}
@keyframes calc-rec {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
