<script setup lang="ts">
// Финальный экран уровня: три звезды рейтинга и кроличья нора.
// Шаги 1–3 зажигают по звезде (задача решена, сеть работает, кроличья нора).
// На шаге 3 кролик прыгает в нору и уходит под землю — торчат только уши, а под землёй
// проступает глубокий извилистый ход.
import { computed } from "vue";
import A7Sprite from "./A7Sprite.vue";
import { RABBIT, STAR } from "./sprites";

const props = defineProps<{ step: number }>();

const STAR_ON = { Y: "#ffe13e" };
const STAR_OFF = { Y: "#2a2150" };
const RABBIT_PAL = { W: "#f2ecff", p: "#ff3ecf", K: "#07040f" };

const dive = computed(() => props.step >= 3);

const sky: Array<[number, number]> = [
	[18, 20],
	[64, 42],
	[120, 14],
	[176, 36],
	[214, 12],
	[150, 70],
	[30, 82],
	[206, 84],
];

// ход норы: ступенчатая кривая вниз, клетка 8×8
const tunnel: Array<[number, number]> = [];
{
	let x = 152;
	let y = 136;
	const moves = [0, 0, 1, 1, 0, -1, -1, -1, 0, 1, 1, 0, 0, -1];
	for (const m of moves) {
		tunnel.push([x, y]);
		x += m * 8;
		y += 8;
		tunnel.push([x, y]);
	}
}
</script>

<template>
  <div class="a7-finale" :class="{ dive }">
    <div class="stars">
      <div v-for="n in 3" :key="n" class="star" :class="{ on: step >= n }">
        <A7Sprite :rows="STAR" :palette="step >= n ? STAR_ON : STAR_OFF" :px="5" />
      </div>
    </div>
    <div class="burrow">
      <svg viewBox="0 0 240 250" width="240" height="250" shape-rendering="crispEdges" aria-hidden="true">
        <!-- ночное небо над норой -->
        <rect v-for="(st, i) in sky" :key="'k' + i" :x="st[0]" :y="st[1]" width="3" height="3" fill="#b9b0d6" />
        <!-- земля в разрезе: трава, грунт, глубина темнеет -->
        <rect x="0" y="120" width="240" height="130" fill="#3a2414" />
        <rect x="0" y="170" width="240" height="80" fill="#2c1a0e" />
        <rect x="0" y="215" width="240" height="35" fill="#1f1209" />
        <rect x="0" y="116" width="240" height="8" fill="#9dff3e" />
        <rect v-for="n in 15" :key="'g' + n" :x="(n - 1) * 16 + 4" y="110" width="4" height="6" fill="#9dff3e" />
        <rect v-for="n in 9" :key="'s' + n" :x="(n * 53) % 230" :y="140 + ((n * 37) % 100)" width="6" height="4" fill="#5a3a22" />
        <!-- нора -->
        <rect x="140" y="118" width="48" height="12" fill="#07040f" />
        <rect x="136" y="122" width="56" height="8" fill="#07040f" />
        <rect x="148" y="130" width="32" height="6" fill="#07040f" />
        <!-- глубокий ход проступает на шаге 3 -->
        <g v-if="dive" class="tunnel">
          <rect v-for="(c, i) in tunnel" :key="i" :x="c[0] + 4" :y="c[1]" width="16" height="8" fill="#07040f" :style="{ '--d': `${300 + i * 20}ms` }" />
        </g>
      </svg>
      <!-- кролик: над землёй, на шаге 3 ныряет; всё ниже травы обрезается -->
      <div class="above">
        <div class="bunny">
          <A7Sprite :rows="RABBIT" :palette="RABBIT_PAL" :px="4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a7-finale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.stars {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
}
/* средняя звезда чуть выше — как в рейтинге уровня */
.star:nth-child(2) {
  transform: translateY(-10px);
}
.star.on {
  filter: drop-shadow(0 0 8px rgba(255, 225, 62, 0.75));
}
.burrow {
  position: relative;
  width: 240px;
  height: 250px;
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
  background: #0b0720;
}
.burrow svg {
  display: block;
}
/* окно «над землёй»: всё, что опускается ниже травы, срезается маской — кролик уходит в нору.
   Маска clip-path, а не overflow: прокрутки нет, обрезается только картинка */
.above {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 120px;
  clip-path: inset(0);
}
.bunny {
  position: absolute;
  left: 48px;
  top: 64px;
}
/* итоговый кадр ныряния: кролик в норе, видны только уши */
.dive .bunny {
  transform: translate(96px, 40px);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .bunny {
    animation: a7-idle 1.6s steps(2, end) infinite;
  }
  .dive .bunny {
    animation: a7-dive 0.6s steps(6, end) both;
  }
  .star.on {
    animation: a7-star 0.3s steps(3, end) both;
  }
  .star:nth-child(2).on {
    animation-name: a7-star-mid;
  }
  .tunnel rect {
    animation: a7-dig 0.1s steps(1, end) var(--d) both;
  }
}
@keyframes a7-idle {
  50% {
    transform: translateY(-4px);
  }
}
@keyframes a7-dive {
  0% {
    transform: none;
  }
  40% {
    transform: translate(44px, -44px);
  }
  70% {
    transform: translate(96px, -8px);
  }
  100% {
    transform: translate(96px, 40px);
  }
}
@keyframes a7-star {
  from {
    transform: scale(0.4);
  }
  to {
    transform: none;
  }
}
@keyframes a7-star-mid {
  from {
    transform: translateY(-10px) scale(0.4);
  }
  to {
    transform: translateY(-10px);
  }
}
@keyframes a7-dig {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
