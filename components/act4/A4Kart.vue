<script setup lang="ts">
// Пиксельный карт для гонки на слайде «Инфраструктура»: кузов из спрайта, сверху в кабине
// сидит «пилот» — иконка из слота (логотип движка). fx — выхлоп: smoke — чадит медленный карт,
// flame — реактивное пламя быстрого, none — без выхлопа. color — цвет кузова.
import A4Sprite from "./A4Sprite.vue";

withDefaults(
	defineProps<{
		color?: string;
		fx?: "smoke" | "flame" | "none";
		px?: number;
	}>(),
	{ color: "#6d6496", fx: "none", px: 4 },
);

// 20×11, смотрит вправо; место пилота над кузовом слева от лобового стекла
const BODY = [
	"....................",
	"............kk......",
	"............kwk.....",
	"..kk........kwwk....",
	".kaak.......kkkkkk..",
	".kaaakkkkkkkkaaaaak.",
	"kaaaaaaaaaaaaaaaaaak",
	"kaaaaddddddddddaaaak",
	"kkwwwkkkkkkkkkwwwkkk",
	".kwkwk.......kwkwk..",
	"..kkk.........kkk...",
];
</script>

<template>
  <div class="a4-kart" :class="`fx-${fx}`" :style="{ '--kart': color, width: `${20 * px}px`, height: `${11 * px}px` }">
    <span class="k-pilot"><slot /></span>
    <A4Sprite
      class="k-body"
      :rows="BODY"
      :px="px"
      :palette="{ k: '#4b4080', a: 'var(--kart)', d: '#07040f', w: '#f2ecff' }"
    />
    <span v-if="fx !== 'none'" class="k-fx" aria-hidden="true">
      <i v-for="n in 3" :key="n" :style="{ '--i': n }" />
    </span>
  </div>
</template>

<style scoped>
.a4-kart {
  position: relative;
}
.k-body {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
}
/* пилот-логотип сидит в кабине, нижняя часть закрыта кузовом */
.k-pilot {
  position: absolute;
  left: 20%;
  bottom: 50%;
  z-index: 0;
  line-height: 1;
}
.k-fx {
  position: absolute;
  left: -4px;
  bottom: 30%;
  z-index: 0;
}
.k-fx i {
  position: absolute;
  right: 0;
  width: 10px;
  height: 10px;
}
/* дым медленного карта: серые клубы уплывают назад */
.fx-smoke .k-fx i {
  background: #6d6496;
  opacity: 0;
  animation: k-smoke 1.5s steps(5, end) infinite;
  animation-delay: calc(var(--i) * 0.5s);
}
@keyframes k-smoke {
  0% { opacity: 0.9; transform: translate(0, 0) scale(0.6); }
  100% { opacity: 0; transform: translate(-36px, -14px) scale(1.6); }
}
/* пламя быстрого карта */
.fx-flame .k-fx i {
  height: 8px;
  background: var(--pa-yellow);
  box-shadow: 0 0 8px var(--pa-orange);
  animation: k-flame 0.3s steps(2, end) infinite;
  animation-delay: calc(var(--i) * 0.1s);
}
.fx-flame .k-fx i:nth-child(1) { width: 26px; bottom: -4px; }
.fx-flame .k-fx i:nth-child(2) { width: 18px; bottom: 4px; background: var(--pa-orange); }
.fx-flame .k-fx i:nth-child(3) { width: 12px; bottom: -12px; background: var(--pa-magenta); }
@keyframes k-flame {
  50% { transform: scaleX(0.55); transform-origin: 100% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .k-fx i { animation: none !important; }
}
@media print {
  .k-fx i { animation: none !important; }
}
</style>
