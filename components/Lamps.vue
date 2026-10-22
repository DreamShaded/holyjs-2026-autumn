<script setup lang="ts">
// Пять выходов сети как лампочки (sigmoid): яркость = уверенность 0..1.
// threshold — порог: лампа ярче порога «горит» (обводка), линия порога видна в режиме bars.
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		values: number[];
		labels?: string[];
		threshold?: number | null;
		bars?: boolean;
		showValues?: boolean;
		barHeight?: number;
	}>(),
	{
		labels: () => ["color", "font-weight", "letter-spacing", "line-height", "border"],
		threshold: null,
		bars: false,
		showValues: true,
		barHeight: 170,
	},
);

const items = computed(() =>
	props.values.map((v, i) => ({
		v,
		label: props.labels[i],
		on: props.threshold !== null && v > props.threshold,
	})),
);
</script>

<template>
  <div class="lamps" :class="{ bars }" :style="{ '--rows': showValues ? 3 : 2 }">
    <div v-for="it in items" :key="it.label" class="lamp" :class="{ on: it.on }">
      <div v-if="!bars" class="bulb" :style="{ '--v': it.v }" />
      <div v-else class="track" :style="{ height: `${barHeight}px` }">
        <div class="fill" :style="{ height: `${it.v * barHeight}px` }" />
        <!-- линия порога рисуется кусками в каждой дорожке и заходит в промежутки -->
        <div v-if="threshold !== null" class="line" :style="{ bottom: `${threshold * barHeight}px` }">
          <span v-if="it === items[0]">{{ threshold }}</span>
        </div>
      </div>
      <div v-if="showValues" class="val">{{ it.v.toFixed(2) }}</div>
      <code class="lbl">{{ it.label }}</code>
    </div>
  </div>
</template>

<style scoped>
/* Общая сетка: лампа/дорожка, число и подпись каждой колонки лежат в общих строках (subgrid),
   поэтому стоят на одной линии, а строку подписей тянет самая длинная из них. */
.lamps {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(var(--rows), auto);
  gap: 0.35rem 1.1rem;
  justify-content: start;
}
.lamp {
  display: grid;
  grid-row: span var(--rows);
  grid-template-rows: subgrid;
  justify-items: center;
  align-items: end;
  width: 7.2rem;
}
.bulb {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 226, 120, calc(0.08 + var(--v) * 0.92));
  box-shadow: 0 0 calc(var(--v) * 40px) calc(var(--v) * 10px) rgba(255, 226, 120, calc(var(--v) * 0.8));
  transition: all 0.4s;
}
.lamp.on .bulb {
  border: 3px solid var(--color-green);
}
.track {
  position: relative;
  width: 46px;
  display: flex;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 6px;
}
.fill {
  width: 100%;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.4s;
}
.lamp.on .fill {
  background: var(--color-green);
}
.val {
  font-weight: 700;
}
/* Плашка подписи во всю ширину колонки и на всю высоту строки: «font-weight» переносится
   по дефису, «color» — нет, а плашки всё равно одного размера. */
.lbl {
  font-size: 1rem !important;
  line-height: 1.25;
  box-sizing: border-box;
  width: 100%;
  align-self: stretch;
  padding: 0.3rem 0.2rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.line {
  position: absolute;
  left: -2.2rem;
  right: -2.2rem;
  border-top: 2px dashed var(--color-cyan);
  transition: bottom 0.4s;
  z-index: 1;
}
.line span {
  position: absolute;
  left: -2.6rem;
  top: -0.8rem;
  color: var(--color-cyan);
  font-weight: 700;
}
</style>
