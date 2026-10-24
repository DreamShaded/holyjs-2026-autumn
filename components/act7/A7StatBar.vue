<script setup lang="ts">
// Столбик стата бойца-свойства. Высота столбика — 1.0, лаймовая часть — значение метрики.
// prc (precision): весь столбик — улов; лайм — рыба, красный остаток — мусор (ботинки).
// rcl (recall): весь столбик — рыба озера; лайм — поймано, пунктирный остаток — ушла из сети.
// fx — эффект для подсвеченного бойца: perfect (столбик сияет), leak (рыба уходит из остатка),
// junk (в остаток падает ботинок). Значение рисуется точно, сетка клеток — только оверлей.
import { computed } from "vue";
import A7Boot from "./A7Boot.vue";
import A7Fish from "./A7Fish.vue";

const props = withDefaults(
	defineProps<{
		value: number;
		kind: "prc" | "rcl";
		fx?: "none" | "perfect" | "leak" | "junk";
		height?: number;
	}>(),
	{ fx: "none", height: 110 },
);

const v = computed(() => Math.min(1, Math.max(0, props.value)));
const fillH = computed(() => Math.round(v.value * props.height));
</script>

<template>
  <div class="a7-stat" :class="[kind, `fx-${fx}`]" :style="{ height: `${height}px` }" aria-hidden="true">
    <div class="rest" :style="{ height: `${height - fillH}px` }">
      <A7Fish v-if="fx === 'leak'" class="leaker" :px="2" />
      <A7Boot v-if="fx === 'junk'" class="junker" :px="2" />
    </div>
    <div class="fill" :style="{ height: `${fillH}px` }" />
    <div class="grid" />
  </div>
</template>

<style scoped>
.a7-stat {
  position: relative;
  width: 40px;
  display: flex;
  flex-direction: column;
  background: #07040f;
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.fill {
  flex: none;
  background: #9dff3e;
}
.rest {
  position: relative;
  flex: none;
}
/* precision: остаток — мусор в улове */
.prc .rest {
  background: #ff4d6d;
}
/* recall: остаток — пустое место ушедшей рыбы */
.rcl .rest {
  outline: 2px dashed #ff4d6d;
  outline-offset: -2px;
}
/* сетка клеток поверх: горизонтальные зазоры каждые 10 px */
.grid {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent 0 8px, rgba(7, 4, 15, 0.9) 8px 10px);
  pointer-events: none;
}
.fx-perfect {
  box-shadow:
    0 -3px 0 0 #9dff3e,
    0 3px 0 0 #9dff3e,
    -3px 0 0 0 #9dff3e,
    3px 0 0 0 #9dff3e,
    0 0 16px rgba(157, 255, 62, 0.7);
}
.fx-leak,
.fx-junk {
  box-shadow:
    0 -3px 0 0 #ff4d6d,
    0 3px 0 0 #ff4d6d,
    -3px 0 0 0 #ff4d6d,
    3px 0 0 0 #ff4d6d,
    0 0 16px rgba(255, 77, 109, 0.6);
}
.leaker,
.junker {
  position: absolute;
  left: 50%;
  bottom: 2px;
  margin-left: -13px;
  z-index: 2;
}
.junker {
  margin-left: -11px;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .fx-perfect .fill {
    animation: a7-shine 0.8s steps(2, end) infinite;
  }
  .leaker {
    animation: a7-leak 1.2s steps(6, end) infinite;
  }
  .junker {
    animation: a7-junk-drop 1.2s steps(6, end) infinite;
  }
}
@keyframes a7-shine {
  50% {
    background: #d6ff9e;
  }
}
/* рыба выпрыгивает из остатка вверх и в сторону — уходит из сети */
@keyframes a7-leak {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  70% {
    transform: translate(26px, -34px);
    opacity: 1;
  }
  100% {
    transform: translate(34px, -40px);
    opacity: 0;
  }
}
/* ботинок падает в остаток сверху — мусор в улове */
@keyframes a7-junk-drop {
  0% {
    transform: translateY(-14px);
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  70%,
  100% {
    transform: none;
    opacity: 1;
  }
}
</style>
