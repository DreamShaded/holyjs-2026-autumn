<script setup lang="ts">
// Пять выходов сети как лампочки (sigmoid): яркость = уверенность 0..1.
// threshold — порог: лампа ярче порога «горит» (обводка), линия порога видна в режиме bars.
// Аркадный вид: каждая лампа — пиксельный индикатор-«power-up» (спрайт 16×16, пиксель 4px)
// с полоской заряда из 10 клеток под ним. Данные те же: яркость и заряд считаются из v.
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

// Спрайт лампы 16×16: o — контур, g — стекло, h — блик, b — цоколь.
const SPRITE = [
	"................",
	".....oooooo.....",
	"...oogggggggo...",
	"..oghhgggggggo..",
	"..oghggggggggo..",
	".oghgggggggggo..",
	".ogggggggggggo..",
	".ogggggggggggo..",
	".ogggggggggggo..",
	"..ogggggggggo...",
	"..oogggggggoo...",
	"....ogggggo.....",
	"....obbbbbo.....",
	"....obbbbbo.....",
	".....obbbo......",
	"................",
];
// контур занимает столбцы 1..13, сдвиг на один пиксель центрирует его в квадрате 64×64
const PX = 4;
const pixels = (kind: string) => {
	const out: { x: number; y: number }[] = [];
	SPRITE.forEach((row, y) => {
		for (let x = 0; x < row.length; x++) if (row[x] === kind) out.push({ x: (x + 1) * PX, y: y * PX });
	});
	return out;
};
const OUTLINE = pixels("o");
const GLASS = pixels("g");
const SHINE = pixels("h");
const BASE = pixels("b");

const CELLS = 10;

const items = computed(() =>
	props.values.map((v, i) => ({
		v,
		label: props.labels[i],
		on: props.threshold !== null && v > props.threshold,
		// клетки заряда: округление до ближайшей, но ненулевое значение даёт хотя бы одну клетку
		charge: v > 0 ? Math.max(1, Math.round(v * CELLS)) : 0,
	})),
);
</script>

<template>
  <div class="lamps" :class="{ bars }" :style="{ '--rows': showValues ? 3 : 2 }">
    <div
      v-for="(it, i) in items"
      :key="it.label"
      class="lamp"
      :class="{ on: it.on }"
      :style="{ '--v': it.v, '--i': i }"
    >
      <div v-if="!bars" class="head">
        <svg class="bulb" viewBox="0 0 64 64" width="64" height="64" shape-rendering="crispEdges" aria-hidden="true">
          <rect v-for="(p, k) in GLASS" :key="`g${k}`" :x="p.x" :y="p.y" :width="PX" :height="PX" class="lp-glass" />
          <rect v-for="(p, k) in SHINE" :key="`h${k}`" :x="p.x" :y="p.y" :width="PX" :height="PX" class="lp-shine" />
          <rect v-for="(p, k) in BASE" :key="`b${k}`" :x="p.x" :y="p.y" :width="PX" :height="PX" class="lp-base" />
          <rect v-for="(p, k) in OUTLINE" :key="`o${k}`" :x="p.x" :y="p.y" :width="PX" :height="PX" class="lp-outline" />
        </svg>
        <div class="charge" aria-hidden="true">
          <i v-for="c in CELLS" :key="c" :class="{ lit: c <= it.charge }" :style="{ '--c': c }" />
        </div>
      </div>
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

/* ---------- лампа-индикатор ---------- */
.head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.bulb {
  display: block;
  overflow: visible;
  /* свечение растёт с уверенностью; у погасшей лампы его нет совсем */
  filter: drop-shadow(0 0 calc(var(--v) * 14px) rgba(255, 225, 62, calc(var(--v) * 0.95)))
    drop-shadow(0 0 calc(var(--v) * 4px) rgba(255, 159, 62, calc(var(--v) * 0.9)));
}
.lp-glass {
  /* от «тёмного стекла» к яркому жёлтому неону: та же шкала, что в оригинале */
  fill: color-mix(in srgb, var(--pa-yellow) calc(8% + var(--v) * 92%), #1d1636);
}
.lp-shine {
  fill: color-mix(in srgb, #ffffff calc(var(--v) * 85%), #3a3160);
}
.lp-base {
  fill: #3a3160;
}
.lp-outline {
  fill: color-mix(in srgb, var(--pa-yellow) calc(var(--v) * 60%), #6a5f96);
}
.lamp.on .lp-outline {
  fill: var(--color-green);
}
.lamp.on .bulb {
  filter: drop-shadow(0 0 calc(var(--v) * 14px) rgba(255, 225, 62, calc(var(--v) * 0.95)))
    drop-shadow(0 0 3px var(--color-green));
}

/* полоска заряда: 10 пиксельных клеток */
.charge {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: #0b0718;
  box-shadow: 0 0 0 2px #3a3160;
}
.charge i {
  width: 4px;
  height: 8px;
  background: #241c40;
}
.charge i.lit {
  background: var(--pa-yellow);
  box-shadow: 0 0 4px rgba(255, 225, 62, 0.7);
}
.lamp.on .charge {
  box-shadow: 0 0 0 2px var(--color-green);
}
.lamp.on .charge i.lit {
  background: var(--color-green);
  box-shadow: 0 0 4px var(--color-green);
}

/* ---------- режим «столбики» ---------- */
.track {
  position: relative;
  width: 46px;
  display: flex;
  align-items: flex-end;
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(7, 4, 15, 0.9) 8px 10px),
    #1a1333;
  box-shadow: 0 0 0 3px #3a3160;
}
.fill {
  width: 100%;
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(7, 4, 15, 0.9) 8px 10px),
    #8a80b4;
  transition: height 0.4s steps(6, end);
}
.lamp.on .fill {
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(7, 4, 15, 0.9) 8px 10px),
    var(--color-green);
  box-shadow: 0 0 10px color-mix(in srgb, var(--color-green) 60%, transparent);
}
.line {
  position: absolute;
  left: -2.2rem;
  right: -2.2rem;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--color-cyan) 0 6px, transparent 6px 10px);
  transition: bottom 0.4s steps(6, end);
  z-index: 1;
}
.line span {
  position: absolute;
  left: -2.6rem;
  top: -0.8rem;
  color: var(--color-cyan);
  font-weight: 700;
}

/* ---------- числа и подписи ---------- */
.val {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.2;
  padding-top: 0.15rem;
  color: color-mix(in srgb, var(--pa-yellow) calc(var(--v) * 100%), var(--pa-text-dim));
  text-shadow: 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.65);
}
.lamp.on .val {
  color: var(--color-green);
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
  background: #0f0a22 !important;
  color: var(--pa-text) !important;
  border-radius: 0 !important;
  box-shadow:
    0 -2px 0 0 #3a3160,
    0 2px 0 0 #3a3160,
    -2px 0 0 0 #3a3160,
    2px 0 0 0 #3a3160;
}
.lamp.on .lbl {
  color: var(--color-green) !important;
  box-shadow:
    0 -2px 0 0 var(--color-green),
    0 2px 0 0 var(--color-green),
    -2px 0 0 0 var(--color-green),
    2px 0 0 0 var(--color-green);
}
</style>

<style>
/* Анимация «включения»: лампы зажигаются по очереди с пиксельным мерцанием, заряд набирается
   по клеткам. Не scoped: правило должно видеть предка v-click. Пока предок скрыт кликом,
   анимации нет; при показе свойство animation применяется заново и анимация стартует. */
.lamps .bulb {
  animation: lamps-power 0.45s steps(1, end) calc(var(--i) * 70ms) both;
}
.lamps .charge i {
  animation: lamps-cell 0.05s steps(1, end) calc(var(--i) * 70ms + var(--c) * 30ms) both;
}
.slidev-vclick-hidden .lamps .bulb,
.slidev-vclick-hidden .lamps .charge i {
  animation: none;
}
@keyframes lamps-power {
  0% {
    opacity: 0.15;
  }
  20% {
    opacity: 1;
  }
  35% {
    opacity: 0.3;
  }
  55% {
    opacity: 1;
  }
  70% {
    opacity: 0.6;
  }
  85%,
  100% {
    opacity: 1;
  }
}
@keyframes lamps-cell {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lamps .bulb,
  .lamps .charge i {
    animation: none;
  }
}
@media print {
  .lamps .bulb,
  .lamps .charge i {
    animation: none;
  }
}
</style>
