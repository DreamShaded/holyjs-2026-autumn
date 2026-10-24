<script setup lang="ts">
// Экран аркадной «рыбалки» для слайдов precision и recall: ночное небо, лодка с удочкой, озеро.
// Леска идёт от кончика удочки к точке lineTo — туда страница ставит сеть.
// Вне сети в озере плавают рыба и мусор (только в сцене haul), показываются при showSwimmers.
// Размер экрана фиксированный, 460×372: страница кладёт сеть поверх в тех же координатах.
import { computed } from "vue";
import A7Sprite from "./A7Sprite.vue";
import { BOOT, BOOT_PAL, FISH, FISH_PAL, type Swimmer } from "./sprites";

const props = withDefaults(
	defineProps<{
		/** haul — сеть вытащена из воды (precision), sunk — сеть в воде (recall) */
		scene: "haul" | "sunk";
		showSwimmers?: boolean;
		showLine?: boolean;
	}>(),
	{ showSwimmers: false, showLine: true },
);

// обитатели озера вне сети на экране precision: рыба и мусор вперемешку
const HAUL_SWIMMERS: Swimmer[] = [
	{ kind: "fish", x: 34, y: 158 },
	{ kind: "boot", x: 156, y: 176 },
	{ kind: "fish", x: 270, y: 168, flip: true },
	{ kind: "fish", x: 380, y: 214 },
	{ kind: "boot", x: 70, y: 252 },
	{ kind: "fish", x: 214, y: 262, flip: true },
	{ kind: "boot", x: 330, y: 300 },
	{ kind: "fish", x: 120, y: 322 },
];
const swimmers = computed(() => (props.scene === "haul" ? HAUL_SWIMMERS : []));
// куда уходит леска: к верху вытащенной сети или вниз, к сети под водой
const lineTo = computed(() => (props.scene === "haul" ? { x: 330, y: 22 } : { x: 240, y: 152 }));

const W = 460;
const H = 372;
const WATER = 120;
const TIP = { x: 198, y: 8 };

// звёзды неба: фиксированный «случайный» набор, чтобы скриншоты были стабильны
const stars = [
	[24, 18],
	[70, 44],
	[118, 12],
	[246, 22],
	[300, 54],
	[352, 14],
	[410, 40],
	[436, 82],
	[262, 86],
	[150, 70],
];
// гребни волн: ряды пунктира, ряд сдвигается ступенькой
const waves = [WATER + 14, WATER + 70, WATER + 132, WATER + 196];
</script>

<template>
  <div class="a7-pond" :style="{ width: `${W}px`, height: `${H}px` }">
    <svg :viewBox="`0 0 ${W} ${H}`" :width="W" :height="H" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="0" y="0" :width="W" :height="WATER" fill="#0b0720" />
      <rect v-for="(s, i) in stars" :key="'s' + i" :x="s[0]" :y="s[1]" width="3" height="3" fill="#b9b0d6" class="star" :style="{ '--d': `${i * 170}ms` }" />
      <!-- луна -->
      <rect x="28" y="12" width="24" height="24" fill="#ffe13e" />
      <rect x="24" y="16" width="32" height="16" fill="#ffe13e" />
      <rect x="36" y="16" width="16" height="12" fill="#0b0720" />
      <!-- вода: полосы глубины -->
      <rect x="0" :y="WATER" :width="W" :height="H - WATER" fill="#0a1d42" />
      <rect x="0" :y="WATER + 90" :width="W" :height="H - WATER - 90" fill="#08173a" />
      <rect x="0" :y="WATER + 180" :width="W" :height="H - WATER - 180" fill="#061230" />
      <rect x="0" :y="WATER" :width="W" height="4" fill="#3ef0ff" opacity="0.7" />
      <g v-for="(y, r) in waves" :key="'w' + r" class="wave" :class="{ odd: r % 2 === 1 }">
        <rect v-for="n in 12" :key="n" :x="(n - 1) * 40 + (r % 2) * 20" :y="y" width="16" height="3" fill="#2a6fb0" />
      </g>
      <!-- лодка и рыбак -->
      <g class="boat">
        <rect x="40" :y="WATER - 20" width="128" height="12" fill="#8a4a2a" />
        <rect x="48" :y="WATER - 8" width="112" height="8" fill="#6a3620" />
        <rect x="40" :y="WATER - 20" width="128" height="4" fill="#c0703a" />
        <rect x="104" :y="WATER - 52" width="16" height="32" fill="#3ef0ff" />
        <rect x="104" :y="WATER - 68" width="16" height="14" fill="#ffc29a" />
        <rect x="100" :y="WATER - 72" width="24" height="6" fill="#ffe13e" />
        <!-- удочка: ступенчатая диагональ к кончику -->
        <rect v-for="n in 10" :key="'r' + n" :x="120 + (n - 1) * 8" :y="WATER - 52 - n * 6" width="8" height="4" fill="#e8d0a0" />
      </g>
      <!-- леска -->
      <g v-if="showLine" class="line">
        <rect :x="Math.min(TIP.x, lineTo.x)" :y="TIP.y" :width="Math.abs(lineTo.x - TIP.x) + 2" height="2" fill="#f2ecff" opacity="0.75" />
        <rect :x="lineTo.x" :y="TIP.y" width="2" :height="Math.max(0, lineTo.y - TIP.y)" fill="#f2ecff" opacity="0.75" />
      </g>
    </svg>

    <div v-if="showSwimmers" class="swimmers">
      <div
        v-for="(s, i) in swimmers"
        :key="i"
        class="swimmer"
        :class="s.kind"
        :style="{ left: `${s.x}px`, top: `${s.y}px`, '--d': `${(i % 4) * 260}ms` }"
      >
        <A7Sprite :rows="s.kind === 'fish' ? FISH : BOOT" :palette="s.kind === 'fish' ? FISH_PAL : BOOT_PAL" :px="3" :flip="s.flip" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.a7-pond {
  position: relative;
  overflow: hidden;
}
.a7-pond svg {
  display: block;
}
.swimmers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.swimmer {
  position: absolute;
  opacity: 0.8;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .wave {
    animation: a7-wave 1.6s steps(2, end) infinite;
  }
  .wave.odd {
    animation-direction: reverse;
  }
  .star {
    animation: a7-twinkle 1.8s steps(2, end) var(--d) infinite;
  }
  .swimmer {
    animation: a7-swim 1.4s steps(2, end) var(--d) infinite;
  }
}
@keyframes a7-wave {
  50% {
    transform: translateX(8px);
  }
}
@keyframes a7-twinkle {
  50% {
    opacity: 0.2;
  }
}
@keyframes a7-swim {
  50% {
    transform: translate(-6px, 3px);
  }
}
</style>
