<script setup lang="ts">
// Обвязка графика loss на первом слайде «Как сеть учится». Компонент стоит в разметке сразу
// после LineChart внутри контейнера с position: relative (пропсы графика не трогаем, и график
// не перерисовывается от тиков таймера). Поверх графика — «шарик» текущего loss
// (позиционируется от угла контейнера = угла графика), под графиком — термометр
// «горячо — холодно» и счётчик эпох. Всё считается из одного индекса эпохи, поэтому синхронно.
// step — номер клика:
//   1 — сеть отвечает почти наугад: шарик на первой точке, термометр холодный;
//   2 — подкручивание: шарик эпоха за эпохой катится вниз по кривой, термометр теплеет;
//   3 — эпохи: под графиком загораются клетки «прочитанных учебников».
// Геометрия графика повторяет LineChart: width 400, height 300, PAD l20 r20 t20 b44.
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ step: number }>();

/** те же точки, что у серии loss на слайде */
const LOSS = [0.95, 0.62, 0.45, 0.36, 0.3, 0.27, 0.25, 0.24];
const W = 400;
const H = 300; // размеры графика на слайде (пропсы width/height)
const PAD = { l: 20, r: 20, t: 20, b: 44 };
const px = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (LOSS.length - 1);
const py = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);
/** клеток в термометре */
const CELLS = 12;
/** шаг эпохи и пауза на последней точке, мс */
const TICK_MS = 450;
const HOLD_TICKS = 3;

const epoch = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
function stop() {
	if (timer) clearInterval(timer);
	timer = null;
}
function run() {
	stop();
	const calm =
		typeof window === "undefined" ||
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
		window.matchMedia?.("print").matches;
	// без анимации показываем итог: последняя эпоха
	if (calm) {
		epoch.value = LOSS.length - 1;
		return;
	}
	const t0 = performance.now();
	const period = LOSS.length + HOLD_TICKS;
	timer = setInterval(() => {
		const k = Math.floor((performance.now() - t0) / TICK_MS) % period;
		epoch.value = Math.min(k, LOSS.length - 1);
	}, 60);
}
watch(
	() => props.step >= 2,
	(on) => {
		if (on) run();
		else {
			stop();
			epoch.value = 0;
		}
	},
	{ immediate: true },
);
onBeforeUnmount(stop);

const showBall = computed(() => props.step >= 1);
const ball = computed(() => ({ left: `${px(epoch.value) - 9}px`, top: `${py(LOSS[epoch.value]) - 9}px` }));
const heat = computed(() => (props.step >= 1 ? Math.max(1, Math.round((1 - LOSS[epoch.value]) * CELLS)) : 0));
</script>

<template>
  <div class="tr">
    <span v-if="showBall" class="tr-ball" :style="ball" aria-hidden="true" />
    <div class="tr-hud" aria-hidden="true">
      <div class="tr-row" :class="{ dim: props.step < 1 }">
        <tabler-snowflake class="tr-ico cold" />
        <span class="tr-thermo">
          <i v-for="k in CELLS" :key="k" :class="{ on: k <= heat }" :style="{ '--h': (k - 1) / (CELLS - 1) }" />
        </span>
        <tabler-flame class="tr-ico hot" />
      </div>
      <div class="tr-row" :class="{ dim: props.step < 3 }">
        <tabler-book class="tr-ico book" />
        <span class="tr-epochs">
          <i v-for="k in LOSS.length" :key="k" :class="{ on: props.step >= 3 && k - 1 <= epoch }" />
        </span>
        <span class="tr-ep">EP {{ props.step >= 3 ? epoch + 1 : 0 }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .tr намеренно без position: шарик берёт систему координат контейнера с графиком */
/* шарик текущего loss: пиксельный ромб, «катится» по точкам эпох */
.tr-ball {
  position: absolute;
  width: 18px;
  height: 18px;
  background: var(--pa-yellow);
  clip-path: polygon(33% 0, 67% 0, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0 67%, 0 33%, 33% 33%);
  filter: drop-shadow(0 0 6px var(--pa-yellow));
  transition:
    left 0.3s steps(3, end),
    top 0.3s steps(3, end);
}
.tr-hud {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding-left: 20px;
  width: 400px;
}
.tr-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: opacity 0.3s steps(3, end);
}
.tr-row.dim {
  opacity: 0.25;
}
.tr-ico {
  flex: none;
  font-size: 1.5rem;
}
.tr-ico.cold {
  color: var(--pa-cyan);
}
.tr-ico.hot {
  color: var(--pa-orange);
}
.tr-ico.book {
  color: var(--pa-lime);
}
.tr-thermo,
.tr-epochs {
  flex: 1;
  display: flex;
  gap: 3px;
  height: 20px;
  padding: 3px;
  background: #0b0718;
  box-shadow: inset 0 0 0 2px #3a3160;
}
.tr-thermo i,
.tr-epochs i {
  flex: 1;
  background: #1c1436;
}
/* холодные клетки голубые, к правому краю — оранжевые */
.tr-thermo i.on {
  background: color-mix(in srgb, var(--pa-orange) calc(var(--h) * 100%), var(--pa-cyan));
  transition: background 0.2s steps(2, end);
}
.tr-epochs i.on {
  background: var(--pa-lime);
}
.tr-ep {
  flex: none;
  width: 3.5rem;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-lime);
}
@media (prefers-reduced-motion: reduce) {
  .tr-ball {
    transition: none;
  }
}
</style>
