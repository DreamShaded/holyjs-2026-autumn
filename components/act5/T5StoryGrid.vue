<script setup lang="ts">
// Набор story как сетка мини-карточек (декоративная, aria-hidden).
// few  — 12 story: 6 компонентов × 2 состояния (две колонки на компонент);
// many — 54 story: 6 компонентов × 3 состояния = 18 исходных (верхний ряд)
//        и под каждым ещё два варианта окружения: светлый фон и другой шрифт/кегль.
// Цвет — компонент, поэтому видно: компоненты те же, меняется окружение.
import { computed } from "vue";

const props = defineProps<{ mode: "few" | "many" }>();

const HUES = ["#3ef0ff", "#ff3ecf", "#ffe13e", "#9dff3e", "#ff9f3e", "#a98bff"];
const cells = computed(() => {
	const states = props.mode === "few" ? 2 : 3;
	const rows = props.mode === "few" ? 1 : 3;
	const out: { c: number; row: number; i: number; hue: string }[] = [];
	let i = 0;
	for (let row = 0; row < rows; row++) {
		for (let comp = 0; comp < 6; comp++) {
			for (let st = 0; st < states; st++) {
				out.push({ c: comp * states + st, row, i: i++, hue: HUES[comp] });
			}
		}
	}
	return out;
});
const cols = computed(() => (props.mode === "few" ? 12 : 18));
</script>

<template>
  <div class="t5-grid" :class="`m-${mode}`" :style="{ '--cols': cols }" aria-hidden="true">
    <div class="sg-cells">
      <i
        v-for="t in cells"
        :key="t.i"
        :class="`r${t.row}`"
        :style="{ '--hue': t.hue, '--i': t.i, gridColumn: t.c + 1, gridRow: t.row + 1 }"
      />
    </div>
  </div>
</template>

<style scoped>
.t5-grid {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.sg-cells {
  display: grid;
  grid-template-columns: repeat(var(--cols), 16px);
  grid-auto-rows: 16px;
  gap: 5px;
}
.m-few .sg-cells {
  grid-template-columns: repeat(var(--cols), 14px);
  grid-auto-rows: 18px;
}
/* мини-карточка: рамка цвета компонента и «строка текста» внутри */
.sg-cells i {
  position: relative;
  background: #120c28;
  box-shadow: inset 0 0 0 2px var(--hue);
  animation: sg-in 0.2s steps(2, end) both;
  animation-delay: calc(var(--i) * 12ms);
}
.sg-cells i::after {
  content: "";
  position: absolute;
  left: 4px;
  right: 4px;
  top: 7px;
  height: 2px;
  background: var(--hue);
}
/* вариант 1: светлый фон вокруг компонента */
.sg-cells i.r1 {
  background: #f2ecff;
}
/* вариант 2: другой шрифт и кегль — строка текста толще и короче */
.sg-cells i.r2::after {
  top: 6px;
  right: 7px;
  height: 4px;
}
@keyframes sg-in {
  from { transform: scale(0); }
  to { transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sg-cells i { animation: none; }
}
</style>
