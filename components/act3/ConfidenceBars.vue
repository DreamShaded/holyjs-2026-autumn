<script setup lang="ts">
// Индикаторы уверенности под фото на слайде «Своя уверенность для каждого свойства».
// kind = "shared": одна общая «стирка» — сто процентов делятся на всех, выходит серая каша;
// kind = "split": пять отдельных лампочек, каждая от 0 до 1 сама по себе, порог 0.5.
// Значения split — те же, что у ламп на слайде «Что в результате» (color и font-weight сломаны).
const props = defineProps<{ kind: "shared" | "split" }>();

const SHARED = [30, 24, 19, 15, 12];
const SPLIT = [0.94, 0.71, 0.08, 0.05, 0.03];
const THRESHOLD = 0.5;
/** высота столбика при значении 1, px */
const BAR_H = 64;
</script>

<template>
  <div v-if="props.kind === 'shared'" class="cb cb-shared" aria-hidden="true">
    <span class="cb-lbl">Σ = 100%</span>
    <div class="cb-tank">
      <i v-for="(w, i) in SHARED" :key="i" :style="{ flexGrow: w }" />
      <span class="cb-foam" />
    </div>
  </div>
  <div v-else class="cb cb-split" aria-hidden="true">
    <div class="cb-bars" :style="{ height: `${BAR_H}px` }">
      <span class="cb-thr" :style="{ bottom: `${THRESHOLD * BAR_H}px` }"><b>0.5</b></span>
      <div v-for="(v, i) in SPLIT" :key="i" class="cb-col" :class="{ on: v >= THRESHOLD }">
        <i class="cb-bar" :style="{ height: `${Math.max(4, Math.round((v * BAR_H) / 4) * 4)}px`, animationDelay: `${i * 0.12}s` }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cb {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0.9rem;
  background: #0b0718;
  box-shadow: inset 0 3px 0 0 #3a3160;
}
.cb-lbl {
  flex: none;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--pa-text-dim);
}
/* общая «стирка»: сегменты разных свойств слиплись в серую кашу */
.cb-tank {
  position: relative;
  flex: 1;
  display: flex;
  height: 32px;
  box-shadow: inset 0 0 0 3px #3a3160;
}
.cb-tank i {
  flex-basis: 0;
  border-right: 3px solid #07040f;
}
.cb-tank i:nth-child(1) {
  background: #8e86a8;
}
.cb-tank i:nth-child(2) {
  background: #7a7394;
}
.cb-tank i:nth-child(3) {
  background: #6a6484;
}
.cb-tank i:nth-child(4) {
  background: #5b5674;
}
.cb-tank i:nth-child(5) {
  background: #4d4964;
  border-right: 0;
}
/* пена в барабане: полосы ползут поверх сегментов */
.cb-foam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0 8px, transparent 8px 32px);
}

/* пять отдельных лампочек */
.cb-split {
  justify-content: center;
}
.cb-bars {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  padding: 0 3.25rem 0 0.5rem;
}
.cb-col {
  width: 34px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background: #160e2e;
  box-shadow: inset 0 0 0 2px #2a2148;
}
.cb-bar {
  display: block;
  width: 100%;
  background: #6a5f96;
  transform-origin: bottom;
}
.cb-col.on .cb-bar {
  background: var(--pa-lime);
  box-shadow: 0 0 12px 1px rgba(157, 255, 62, 0.6), inset -4px 0 0 0 rgba(0, 0, 0, 0.2);
}
.cb-thr {
  position: absolute;
  left: 0;
  right: 2.5rem;
  height: 0;
  border-top: 3px dashed var(--pa-yellow);
  z-index: 1;
}
.cb-thr b {
  position: absolute;
  right: -2.75rem;
  top: -0.8rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-yellow);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .cb-foam {
    animation: cb-foam 1.2s steps(8, end) infinite;
  }
  .cb-bar {
    animation: cb-rise 0.6s steps(4, end) both;
  }
}
:global(.slidev-vclick-hidden) .cb-bar {
  animation: none !important;
}
/* полоса маленькая, перерисовка фона дешёвая */
@keyframes cb-foam {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 32px 0;
  }
}
@keyframes cb-rise {
  from {
    transform: scaleY(0);
  }
}
</style>
