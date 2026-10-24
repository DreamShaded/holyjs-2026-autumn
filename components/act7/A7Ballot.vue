<script setup lang="ts">
// Слайд «Top-1: по парам или по окошкам?» — избирательный участок.
// Большая карточка нарезана на 24 окошка, маленькая кнопка — на 2 (≈92 % окошек у карточки).
// Шаг 1: окошки получают вердикт (лайм — угадано, красный — нет) и голосуют:
//   урна «по окошкам» получает 26 жетонов (по одному от окошка),
//   урна «по парам» — 2 жетона (по одному от компонента: карточка угадана, кнопка — нет).
//   20 из 26 ≈ 78 %, 1 из 2 ≈ 53 % — схема повторяет пропорции раннего прогона.
// Шаг 2: окошки превращаются в учеников (аналогия со старостой: большой и маленький класс).
// Шаг 3: карточка подсвечивается — это её окошки перетянули счёт.
import { computed } from "vue";
import A7Sprite from "./A7Sprite.vue";
import { PERSON } from "./sprites";

const props = defineProps<{ step: number }>();

const HIT = "#9dff3e";
const MISS = "#ff4d6d";

// окошки карточки: сетка 6×4, плитка 36×30, зазор 4
const CARD_MISS = new Set([3, 10, 17, 20]);
const cardTiles = Array.from({ length: 24 }, (_, i) => ({
	i,
	x: 14 + (i % 6) * 40,
	y: 14 + Math.floor(i / 6) * 34,
	w: 36,
	h: 30,
	hit: !CARD_MISS.has(i),
}));
// окошки кнопки: обе мимо — кнопку сеть угадывала плохо
const btnTiles = [
	{ i: 24, x: 288, y: 57, w: 44, h: 34, hit: false },
	{ i: 25, x: 338, y: 57, w: 44, h: 34, hit: false },
];
const tiles = [...cardTiles, ...btnTiles];

// жетоны урны «по окошкам»: сначала угаданные, потом промахи — так доля читается глазом
const chips = computed(() => {
	const sorted = [...tiles].sort((a, b) => Number(b.hit) - Number(a.hit));
	return sorted.map((t, k) => ({
		k,
		x: 17 + (k % 13) * 18,
		y: 204 + Math.floor(k / 13) * 18,
		hit: t.hit,
	}));
});

const voted = computed(() => props.step >= 1);
const people = computed(() => props.step >= 2);
const bigClass = computed(() => props.step >= 3);
const personPal = (hit: boolean) => ({ H: hit ? HIT : MISS, P: hit ? HIT : MISS });
</script>

<template>
  <div class="a7-ballot" :class="{ voted, people, big: bigClass }">
    <svg viewBox="0 0 400 252" width="400" height="252" shape-rendering="crispEdges" aria-hidden="true">
      <!-- карточка: макет Vuetify-карточки -->
      <g class="comp card-comp">
        <rect class="frame" x="8" y="8" width="248" height="144" />
        <rect x="14" y="14" width="236" height="16" fill="#2a2150" />
        <rect x="14" y="36" width="96" height="72" fill="#1d3550" />
        <rect x="22" y="80" width="18" height="20" fill="#2c5a7a" />
        <rect x="44" y="64" width="24" height="36" fill="#2c5a7a" />
        <rect x="72" y="72" width="30" height="28" fill="#2c5a7a" />
        <rect x="120" y="40" width="120" height="8" fill="#3a3160" />
        <rect x="120" y="56" width="96" height="8" fill="#3a3160" />
        <rect x="120" y="72" width="110" height="8" fill="#3a3160" />
        <rect x="120" y="88" width="70" height="8" fill="#3a3160" />
        <rect x="14" y="118" width="64" height="22" fill="#3b2a6a" />
        <rect x="86" y="118" width="64" height="22" fill="#3b2a6a" />
      </g>
      <!-- маленькая кнопка -->
      <g class="comp btn-comp">
        <rect class="frame" x="282" y="52" width="106" height="44" />
        <rect x="300" y="68" width="70" height="10" fill="#5a4a9a" />
      </g>

      <!-- окошки, которые видит сеть -->
      <g class="tiles">
        <g v-for="t in tiles" :key="t.i" class="tile" :class="{ hit: t.hit, miss: !t.hit }" :style="{ '--d': `${t.i * 14}ms` }">
          <rect class="tile-fill" :x="t.x" :y="t.y" :width="t.w" :height="t.h" />
          <rect class="tile-edge" :x="t.x + 1" :y="t.y + 1" :width="t.w - 2" :height="t.h - 2" />
        </g>
      </g>

      <!-- урна «по окошкам» (циан, как полоса «по окошкам» на табло) -->
      <g class="urn urn-win">
        <rect x="8" y="182" width="248" height="66" fill="#100a22" />
        <rect class="urn-rim" x="8" y="182" width="248" height="4" />
        <rect class="urn-rim" x="8" y="244" width="248" height="4" />
        <rect class="urn-rim" x="8" y="182" width="4" height="66" />
        <rect class="urn-rim" x="252" y="182" width="4" height="66" />
        <rect x="100" y="176" width="64" height="6" fill="#3a3160" />
        <rect x="108" y="178" width="48" height="2" fill="#07040f" />
      </g>
      <!-- урна «по парам» (лайм, как полоса «по парам» на табло) -->
      <g class="urn urn-pair">
        <rect x="282" y="182" width="106" height="66" fill="#100a22" />
        <rect class="urn-rim" x="282" y="182" width="106" height="4" />
        <rect class="urn-rim" x="282" y="244" width="106" height="4" />
        <rect class="urn-rim" x="282" y="182" width="4" height="66" />
        <rect class="urn-rim" x="384" y="182" width="4" height="66" />
        <rect x="311" y="176" width="48" height="6" fill="#3a3160" />
        <rect x="317" y="178" width="36" height="2" fill="#07040f" />
      </g>

      <!-- провода «кто куда голосует»: окошки карточки и кнопки → урна окошек,
           каждый компонент целиком → урна пар -->
      <g v-if="voted" class="wires">
        <rect v-for="n in 5" :key="'w' + n" x="96" :y="150 + n * 5" width="4" height="3" fill="#3ef0ff" />
        <rect v-for="n in 5" :key="'c' + n" :x="252 + n * 8" y="128" width="5" height="4" fill="#9dff3e" />
        <rect v-for="n in 7" :key="'d' + n" x="296" :y="128 + n * 7" width="4" height="4" fill="#9dff3e" />
        <rect v-for="n in 6" :key="'p' + n" x="352" :y="94 + n * 13" width="4" height="7" fill="#9dff3e" />
      </g>
      <!-- жетоны: по одному от окошка -->
      <g v-if="voted" class="chips">
        <rect
          v-for="c in chips"
          :key="c.k"
          class="chip"
          :x="c.x"
          :y="c.y"
          width="14"
          height="14"
          :fill="c.hit ? HIT : MISS"
          :style="{ '--d': `${c.k * 16}ms` }"
        />
      </g>
      <!-- жетоны: по одному от компонента -->
      <g v-if="voted" class="chips">
        <g class="chip" style="--d: 120ms">
          <rect x="294" y="200" width="40" height="30" :fill="HIT" />
          <rect x="298" y="204" width="32" height="5" fill="#07040f" />
          <rect x="298" y="212" width="14" height="14" fill="#07040f" />
        </g>
        <g class="chip" style="--d: 260ms">
          <rect x="342" y="208" width="36" height="16" :fill="MISS" />
          <rect x="348" y="214" width="24" height="4" fill="#07040f" />
        </g>
      </g>
    </svg>

    <!-- ученики поверх окошек: большой класс и маленький -->
    <div v-if="people" class="crowd">
      <A7Sprite
        v-for="t in tiles"
        :key="t.i"
        class="kid"
        :rows="PERSON"
        :palette="personPal(t.hit)"
        :px="4"
        :style="{ left: `${t.x + t.w / 2 - 10}px`, top: `${t.y + t.h / 2 - 14}px`, '--d': `${t.i * 12}ms` }"
      />
    </div>
  </div>
</template>

<style scoped>
.a7-ballot {
  position: relative;
  width: 400px;
  height: 252px;
}
.a7-ballot svg {
  display: block;
}
.frame {
  fill: #0e0820;
  stroke: #4b4080;
  stroke-width: 4;
}
.urn-win .urn-rim {
  fill: #3ef0ff;
}
.urn-pair .urn-rim {
  fill: #9dff3e;
}
.big .card-comp .frame {
  stroke: #3ef0ff;
  filter: drop-shadow(0 0 6px rgba(62, 240, 255, 0.8));
}

/* окошко до голосования: пунктир поверх макета */
.tile-fill {
  fill: transparent;
  transition: fill 0.2s steps(2) var(--d);
}
.tile-edge {
  fill: none;
  stroke: #3ef0ff;
  stroke-width: 2;
  stroke-dasharray: 4 4;
  opacity: 0.75;
}
.voted .tile.hit .tile-fill {
  fill: rgba(157, 255, 62, 0.42);
}
.voted .tile.miss .tile-fill {
  fill: rgba(255, 77, 109, 0.5);
}
.voted .tile.hit .tile-edge {
  stroke: #9dff3e;
  stroke-dasharray: none;
  opacity: 1;
}
.voted .tile.miss .tile-edge {
  stroke: #ff4d6d;
  stroke-dasharray: none;
  opacity: 1;
}
/* пока ученики стоят в окошках, фон окошка приглушаем */
.people .tile-fill {
  opacity: 0.45;
}

.crowd {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.kid {
  position: absolute;
}

@media screen and (prefers-reduced-motion: no-preference) {
  .chip {
    transform-box: fill-box;
    animation: a7-drop 0.32s steps(4, end) var(--d) both;
  }
  .kid {
    animation: a7-pop 0.24s steps(3, end) var(--d) both;
  }
  .big .card-comp .frame {
    animation: a7-glow 1.2s steps(2, end) infinite;
  }
  .wires rect {
    animation: a7-blink 0.8s steps(2, end) infinite;
  }
}
@keyframes a7-drop {
  from {
    transform: translateY(-36px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes a7-pop {
  from {
    transform: translateY(6px) scaleY(0.4);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes a7-glow {
  50% {
    stroke: #9dff3e;
  }
}
@keyframes a7-blink {
  50% {
    opacity: 0.3;
  }
}
</style>
