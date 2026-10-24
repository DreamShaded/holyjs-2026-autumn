<script setup lang="ts">
// Пиксельный искусственный нейрон (слайд «Что такое нейросеть»).
// step — номер клика слайда:
//   0 — схема в покое: три входа x, веса w, сумма Σ, выход y;
//   1 — на проводах появляются «ручки-регуляторы» весов, их подкручивают (обучение);
//   2+ — нейрон работает: по проводам бегут импульсы, Σ вспыхивает, выход y загорается.
// Геометрия совпадает с SVG оригинала (viewBox 400×270), чтобы картинка не «прыгала».
import { computed } from "vue";
import { notchedRect, rasterLine } from "./pixel";

const props = defineProps<{ step: number }>();

/** размер «пикселя» проводов */
const P = 4;

const INPUTS = [
	// lx/ly — подпись веса: сбоку от провода, чтобы его не пересекать
	{ cy: 55, ey: 125, label: "x₁", w: "w₁", knob: 86, off: 7, lx: 128, ly: 76 },
	{ cy: 135, ey: 135, label: "x₂", w: "w₂", knob: 135, off: -6, lx: 112, ly: 121 },
	{ cy: 215, ey: 145, label: "x₃", w: "w₃", knob: 184, off: 4, lx: 128, ly: 206 },
];
const X0 = 60;
const X1 = 176;
const KNOB_X = 112;

const wires = computed(() =>
	INPUTS.map((inp, i) => ({
		i,
		cells: rasterLine(X0, inp.cy, X1, inp.ey, P),
		dx: X1 - X0,
		dy: inp.ey - inp.cy,
		...inp,
	})),
);
const outWire = rasterLine(256, 135, 336, 135, P);

const tuning = computed(() => props.step === 1);
const knobs = computed(() => props.step >= 1);
const live = computed(() => props.step >= 2);

const orb = (cy: number) => notchedRect(14, cy - 22, 44, 44, 8);
const body = notchedRect(177, 97, 76, 76, 12);
const yBox = notchedRect(352, 115, 40, 40, 6);
</script>

<template>
  <svg
    class="nrn"
    :class="{ 'nrn-live': live, 'nrn-tune': tuning }"
    viewBox="0 0 400 270"
    width="400"
    height="270"
    shape-rendering="crispEdges"
    role="img"
    aria-label="Искусственный нейрон: три входа с весами складываются в сумму, сумма проходит через порог и даёт выход"
  >
    <!-- провода входов -->
    <g class="nrn-wires">
      <g v-for="w in wires" :key="w.i">
        <rect v-for="(c, k) in w.cells" :key="k" :x="c.x" :y="c.y" :width="P" :height="P" />
      </g>
      <rect v-for="(c, k) in outWire" :key="`o${k}`" :x="c.x" :y="c.y" :width="P" :height="P" />
      <!-- пиксельный наконечник стрелки -->
      <rect x="338" y="127" width="4" height="16" />
      <rect x="342" y="131" width="4" height="8" />
    </g>

    <!-- импульсы: бегут по проводам, только когда нейрон работает -->
    <g v-if="live" class="nrn-pulses" aria-hidden="true">
      <rect
        v-for="w in wires"
        :key="`p${w.i}`"
        class="nrn-pulse"
        :x="X0 - 5"
        :y="w.cy - 5"
        width="10"
        height="10"
        :style="{ '--dx': `${w.dx}px`, '--dy': `${w.dy}px` }"
      />
      <rect class="nrn-pulse-out" x="251" y="130" width="10" height="10" style="--dx: 84px; --dy: 0px" />
    </g>

    <!-- входы -->
    <g class="nrn-inputs">
      <g v-for="w in wires" :key="`i${w.i}`">
        <polygon :points="orb(w.cy)" class="nrn-orb" />
        <rect :x="18" :y="w.cy - 18" width="6" height="6" class="nrn-shine" />
        <text :x="36" :y="w.cy + 7">{{ w.label }}</text>
      </g>
    </g>

    <!-- веса: подписи и ручки-регуляторы на проводах -->
    <g class="nrn-weights">
      <g v-for="w in wires" :key="`w${w.i}`">
        <text :x="w.lx" :y="w.ly">{{ w.w }}</text>
        <g v-if="knobs" class="nrn-knob">
          <rect :x="KNOB_X - 18" :y="w.knob - 2" width="36" height="4" class="nrn-track" />
          <rect
            :x="KNOB_X - 4"
            :y="w.knob - 8"
            width="8"
            height="16"
            class="nrn-handle"
            :class="`nrn-h${w.i}`"
            :style="{ '--off': `${w.off}px` }"
          />
        </g>
      </g>
    </g>

    <!-- тело нейрона: сумма -->
    <polygon :points="body" class="nrn-body" />
    <polygon :points="body" class="nrn-flash" aria-hidden="true" />
    <text class="nrn-sum" x="215" y="146">Σ</text>

    <!-- выход -->
    <polygon :points="yBox" class="nrn-ybox" />
    <polygon :points="yBox" class="nrn-yglow" aria-hidden="true" />
    <text class="nrn-out" x="372" y="141">y</text>
  </svg>
</template>

<style scoped>
.nrn {
  display: block;
  width: 400px;
  height: 270px;
  overflow: visible;
}
.nrn text {
  font-family: var(--pa-font-body);
  font-size: 20px;
  font-weight: 700;
  text-anchor: middle;
  fill: var(--pa-text);
}

/* провода */
.nrn-wires rect {
  fill: #5d5288;
  transition: fill 0.3s steps(3, end);
}
.nrn-live .nrn-wires rect {
  fill: color-mix(in srgb, var(--pa-cyan) 55%, #3a3160);
}

/* входы */
.nrn-orb {
  fill: #120b26;
  stroke: #6a5f96;
  stroke-width: 3;
}
.nrn-live .nrn-orb {
  stroke: var(--pa-cyan);
}
.nrn-shine {
  fill: rgba(255, 255, 255, 0.35);
}

/* веса */
.nrn-weights text {
  fill: var(--pa-cyan);
  font-size: 20px;
}
.nrn-track {
  fill: #2a2148;
}
.nrn-handle {
  fill: var(--pa-yellow);
  stroke: #07040f;
  stroke-width: 2;
  transform: translateX(var(--off));
  transition: transform 0.4s steps(4, end);
}

/* сумма и выход */
.nrn-body {
  fill: #120b26;
  stroke: var(--pa-lime);
  stroke-width: 3;
}
.nrn-flash {
  fill: var(--pa-lime);
  opacity: 0;
}
.nrn-sum {
  font-size: 30px !important;
}
/* тёмная обводка: текст читается и на вспышке */
.nrn-sum,
.nrn-out {
  stroke: #07040f;
  stroke-width: 5px;
  paint-order: stroke;
}
.nrn-ybox {
  fill: #120b26;
  stroke: #6a5f96;
  stroke-width: 3;
}
.nrn-yglow {
  fill: var(--pa-lime);
  opacity: 0;
}
.nrn-live .nrn-ybox {
  stroke: var(--pa-lime);
}

/* импульсы: статичный кадр — у входов; движение включается ниже */
.nrn-pulse,
.nrn-pulse-out {
  fill: var(--pa-cyan);
}
.nrn-pulse-out {
  fill: var(--pa-lime);
  opacity: 0;
}

@media screen and (prefers-reduced-motion: no-preference) {
  .nrn-knob {
    animation: nrn-in 0.3s steps(3, end) both;
  }
  /* шаг 1: ручки подкручивают туда-сюда */
  .nrn-tune .nrn-handle {
    animation: nrn-tweak 1.6s steps(1, end) infinite;
  }
  .nrn-tune .nrn-h1 {
    animation-delay: -0.5s;
  }
  .nrn-tune .nrn-h2 {
    animation-delay: -1.1s;
  }

  /* шаг 2+: цикл «импульсы → вспышка Σ → импульс на выход → y горит» */
  .nrn-pulse {
    animation: nrn-travel-in 2.4s infinite;
  }
  .nrn-pulse-out {
    animation: nrn-travel-out 2.4s infinite;
  }
  .nrn-live .nrn-flash {
    animation: nrn-flash 2.4s infinite;
  }
  .nrn-live .nrn-yglow {
    animation: nrn-yglow 2.4s infinite;
  }
  .nrn-live .nrn-body {
    animation: nrn-body 2.4s infinite;
  }
}

@keyframes nrn-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes nrn-tweak {
  0% {
    transform: translateX(-12px);
  }
  25% {
    transform: translateX(4px);
  }
  50% {
    transform: translateX(12px);
  }
  75% {
    transform: translateX(-4px);
  }
}
@keyframes nrn-travel-in {
  0% {
    transform: translate(0, 0);
    opacity: 1;
    animation-timing-function: steps(10, end);
  }
  36% {
    transform: translate(var(--dx), var(--dy));
    opacity: 1;
  }
  37%,
  100% {
    transform: translate(var(--dx), var(--dy));
    opacity: 0;
  }
}
@keyframes nrn-travel-out {
  0%,
  44% {
    transform: translate(0, 0);
    opacity: 0;
  }
  45% {
    transform: translate(0, 0);
    opacity: 1;
    animation-timing-function: steps(7, end);
  }
  72% {
    transform: translate(var(--dx), var(--dy));
    opacity: 1;
  }
  73%,
  100% {
    transform: translate(var(--dx), var(--dy));
    opacity: 0;
  }
}
@keyframes nrn-flash {
  0%,
  36% {
    opacity: 0;
  }
  38%,
  46% {
    opacity: 0.85;
  }
  50%,
  100% {
    opacity: 0;
  }
}
@keyframes nrn-body {
  0%,
  36% {
    filter: none;
  }
  38%,
  50% {
    filter: drop-shadow(0 0 10px var(--pa-lime));
  }
  52%,
  100% {
    filter: none;
  }
}
@keyframes nrn-yglow {
  0%,
  72% {
    opacity: 0;
  }
  74%,
  96% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}
</style>
