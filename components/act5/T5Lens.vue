<script setup lang="ts">
// Лупа к слайду «Что видит сеть»: что именно получает сеть на каждом шаге.
// step 0 — вся карточка, 1 — область отличий, 2 — одно окошко 64×64 в натуральную сетку пикселей,
// 3 — то же окошко с полосой перекрытия 16 px, 4 — окошки по очереди со своим голосом.
// Геометрия окон повторяет WindowsOverlay (BBOX, шаг 48, окно 64, нечётные ниже на 8).
// Всё декоративное (aria-hidden): слова слайда остаются в разметке слайда.
import { computed } from "vue";

const props = defineProps<{ step: number }>();

const IMG_W = 504; // ширина картинки в единицах WindowsOverlay
const IMG_H = 183;
const BBOX = { x0: 46, y0: 16, x1: 490, y1: 150 };
const WIN = 64;
const STRIDE = 48;
const ROW_Y = 48;
const VOTES = [0.91, 0.84, 0.88, 0.62, 0.93, 0.79, 0.86, 0.9];
const LENS = 136; // сторона лупы, px

const wins = VOTES.map((v, i) => ({ x: BBOX.x0 + i * STRIDE, y: ROW_Y + (i % 2) * 8, v, n: i + 1 }));

/** Фон-вырезка: область (x, y, w, h) картинки вписывается в лупу */
function crop(x: number, y: number, w: number, h: number) {
	const k = Math.min(LENS / w, LENS / h);
	const ox = (LENS - w * k) / 2;
	const oy = (LENS - h * k) / 2;
	return {
		backgroundSize: `${IMG_W * k}px ${IMG_H * k}px`,
		backgroundPosition: `${ox - x * k}px ${oy - y * k}px`,
	};
}

const view = computed(() => {
	if (props.step <= 0) return { style: crop(0, 0, IMG_W, IMG_H), tag: "FULL" };
	if (props.step === 1) return { style: crop(BBOX.x0, BBOX.y0, BBOX.x1 - BBOX.x0, BBOX.y1 - BBOX.y0), tag: "BBOX" };
	return { style: crop(wins[0].x, wins[0].y, WIN, WIN), tag: "64×64" };
});
const modes = ["FULL VIEW", "BBOX", "WIN 64×64", "OVERLAP 16PX", "VOTE → AVG"];
// доля окна, занятая перекрытием со следующим окном
const OVER = ((WIN - STRIDE) / WIN) * 100;
</script>

<template>
  <div class="t5-lens" :class="`st-${Math.min(step, 4)}`" aria-hidden="true">
    <div class="ln-hud">
      <span class="ln-rec">● SCAN</span>
      <span class="ln-mode">{{ modes[Math.min(Math.max(step, 0), 4)] }}</span>
    </div>
    <div class="ln-glass">
      <template v-if="step < 4">
        <div :key="view.tag" class="ln-img" :style="view.style" />
        <div v-if="step === 3" class="ln-over" :style="{ width: `${OVER}%` }" />
        <span class="ln-tag">{{ view.tag }}</span>
      </template>
      <template v-else>
        <div v-for="(w, i) in wins" :key="i" class="ln-cyc" :style="{ '--i': i }">
          <div class="ln-img" :style="crop(w.x, w.y, WIN, WIN)" />
          <span class="ln-tag">WIN {{ w.n }}</span>
          <span class="ln-vote">{{ w.v.toFixed(2) }}</span>
        </div>
      </template>
      <i class="ln-c ln-tl" /><i class="ln-c ln-tr" /><i class="ln-c ln-bl" /><i class="ln-c ln-br" />
    </div>
  </div>
</template>

<style scoped>
.t5-lens {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 152px;
}
.ln-hud {
  display: flex;
  flex-direction: column;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.15;
  letter-spacing: 0.06em;
  color: var(--pa-text-dim);
}
.ln-rec {
  color: var(--pa-red);
  animation: ln-blink 1.2s steps(1, end) infinite;
}
.ln-mode {
  color: var(--lvl-accent);
  text-shadow: 0 0 0.5rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
}
@keyframes ln-blink { 50% { opacity: 0.35; } }

.ln-glass {
  position: relative;
  width: 136px;
  height: 136px;
  margin: 8px;
  background: #fff;
  box-shadow:
    0 0 0 3px #07040f,
    0 0 0 6px var(--lvl-accent),
    0 0 1rem 4px color-mix(in srgb, var(--lvl-accent) 45%, transparent);
}
.ln-img {
  position: absolute;
  inset: 0;
  background-image: url("/images/dd/card-render.png");
  background-repeat: no-repeat;
  /* показываем пиксели окна, а не сглаженное изображение */
  image-rendering: pixelated;
  animation: ln-zoom 0.3s steps(3, end);
}
@keyframes ln-zoom {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: none; opacity: 1; }
}
/* полоса перекрытия с соседним окном: справа, как зелёная полоса на карточке */
.ln-over {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(45deg, rgba(157, 255, 62, 0.75) 0 4px, rgba(157, 255, 62, 0.3) 4px 8px);
  box-shadow: inset 3px 0 0 0 var(--pa-lime);
  animation: ln-blink 0.6s steps(1, end) 3;
}
.ln-tag {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0 0.3rem;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  color: #07040f;
  background: var(--lvl-accent);
}
.ln-vote {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.2rem 0.25rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-lime);
  background: #07040f;
}
/* окна по очереди: у каждого своя восьмая часть цикла */
.ln-cyc {
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: ln-cyc 4.8s steps(1, end) infinite;
  animation-delay: calc((var(--i) - 8) * 0.6s);
}
@keyframes ln-cyc {
  0% { opacity: 1; }
  12.5% { opacity: 0; }
}
/* прицельные уголки поверх стекла */
.ln-c {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid var(--pa-yellow);
}
.ln-tl { left: -14px; top: -14px; border-left-width: 4px; border-top-width: 4px; }
.ln-tr { right: -14px; top: -14px; border-right-width: 4px; border-top-width: 4px; }
.ln-bl { left: -14px; bottom: -14px; border-left-width: 4px; border-bottom-width: 4px; }
.ln-br { right: -14px; bottom: -14px; border-right-width: 4px; border-bottom-width: 4px; }

@media (prefers-reduced-motion: reduce) {
  .t5-lens * { animation: none !important; }
  .ln-cyc:first-child { opacity: 1; }
}
@media print {
  .t5-lens * { animation: none !important; }
  .ln-cyc:first-child { opacity: 1; }
}
</style>
