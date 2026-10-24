<script setup lang="ts">
// Настоящий рендер карточки с мутацией letter-spacing. Поверх: bbox отличий (step 1),
// окна 64×64 с шагом 48 (step 2), полоса перекрытия 16px (step 3), голоса окон (step 4).
// Аркадный вид: рендер в рамке «экрана», bbox — «бегущие муравьи» пиксельным пунктиром,
// окна — прицелы-рамки, по очереди выпрыгивающие на экран, голоса — пиксельные таблички.
// Геометрия (координаты, размеры, шаг, перекрытие) та же, что в оригинале.
const props = defineProps<{ step: number }>();

const SCALE = 1.35;
const BBOX = { x0: 46, y0: 16, x1: 490, y1: 150 };
const WIN = 64;
const STRIDE = 48;
const ROW_Y = 48;
// уверенность в letter-spacing по каждому окну (иллюстрация голосования)
const VOTES = [0.91, 0.84, 0.88, 0.62, 0.93, 0.79, 0.86, 0.9];
// нечётные окна чуть смещены по вертикали только ради читаемости перекрытий
const wins = VOTES.map((v, i) => ({ x: BBOX.x0 + i * STRIDE, y: ROW_Y + (i % 2) * 8, v }));
const avg = VOTES.reduce((a, b) => a + b, 0) / VOTES.length;
const s = (n: number) => `${n * SCALE}px`;
</script>

<template>
  <div class="wo">
    <div class="wo-stage" :style="{ width: s(504), height: s(183) }">
      <img src="/images/dd/card-render.png" class="pix wo-img" :style="{ width: s(504) }" alt="Карточка после мутации letter-spacing">
      <div v-if="step >= 1" class="wo-bbox" :style="{ left: s(BBOX.x0), top: s(BBOX.y0), width: s(BBOX.x1 - BBOX.x0), height: s(BBOX.y1 - BBOX.y0) }" />
      <template v-if="step >= 2">
        <div
          v-for="(w, i) in wins"
          :key="i"
          class="wo-win"
          :class="{ 'wo-odd': i % 2 }"
          :style="{ left: s(w.x), top: s(w.y), width: s(WIN), height: s(WIN), '--d': `${i * 60}ms` }"
        >
          <span v-if="step >= 4" class="wo-vote" :style="{ '--d': `${i * 40}ms` }">{{ w.v.toFixed(2) }}</span>
        </div>
      </template>
      <div v-if="step >= 3" class="wo-overlap" :style="{ left: s(BBOX.x0 + STRIDE), top: s(ROW_Y + 8), width: s(WIN - STRIDE), height: s(WIN - 8) }" />
    </div>
    <div v-if="step >= 4" class="wo-avg">
      ⌀ <b>{{ avg.toFixed(2) }}</b> <code>letter-spacing</code>
    </div>
  </div>
</template>

<style scoped>
.wo {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.wo-stage {
  position: relative;
}

/* ---------- bbox: «бегущие муравьи» из пиксельных штрихов ---------- */
.wo-bbox {
  position: absolute;
  --ant: #ff4d6d;
  background:
    repeating-linear-gradient(90deg, var(--ant) 0 8px, transparent 8px 14px) top left / 100% 3px no-repeat,
    repeating-linear-gradient(90deg, var(--ant) 0 8px, transparent 8px 14px) bottom left / 100% 3px no-repeat,
    repeating-linear-gradient(0deg, var(--ant) 0 8px, transparent 8px 14px) top left / 3px 100% no-repeat,
    repeating-linear-gradient(0deg, var(--ant) 0 8px, transparent 8px 14px) top right / 3px 100% no-repeat;
  filter: drop-shadow(0 0 3px rgba(255, 77, 109, 0.8));
  animation:
    wo-in 0.3s steps(3, end) both,
    wo-ants 0.7s steps(7, end) 0.3s infinite;
}

/* ---------- окна: прицельные рамки ---------- */
.wo-win {
  position: absolute;
  box-sizing: border-box;
  --wc: var(--color-cyan);
  border: 3px solid var(--wc);
  background: color-mix(in srgb, var(--wc) 10%, transparent);
  box-shadow:
    0 0 8px 1px color-mix(in srgb, var(--wc) 55%, transparent),
    inset 0 0 0 1px rgba(7, 4, 15, 0.6);
  animation: wo-pop 0.27s steps(3, end) var(--d) both;
}
.wo-win.wo-odd {
  --wc: var(--pa-yellow);
}
/* пиксельные «уголки» поверх рамки окна */
.wo-win::before {
  content: "";
  position: absolute;
  inset: -6px;
  background:
    linear-gradient(var(--wc), var(--wc)) top left / 9px 3px no-repeat,
    linear-gradient(var(--wc), var(--wc)) top left / 3px 9px no-repeat,
    linear-gradient(var(--wc), var(--wc)) top right / 9px 3px no-repeat,
    linear-gradient(var(--wc), var(--wc)) top right / 3px 9px no-repeat,
    linear-gradient(var(--wc), var(--wc)) bottom left / 9px 3px no-repeat,
    linear-gradient(var(--wc), var(--wc)) bottom left / 3px 9px no-repeat,
    linear-gradient(var(--wc), var(--wc)) bottom right / 9px 3px no-repeat,
    linear-gradient(var(--wc), var(--wc)) bottom right / 3px 9px no-repeat;
}

/* ---------- перекрытие 16px ---------- */
.wo-overlap {
  position: absolute;
  background: repeating-linear-gradient(
    45deg,
    color-mix(in srgb, var(--color-green) 75%, transparent) 0 4px,
    color-mix(in srgb, var(--color-green) 35%, transparent) 4px 8px
  );
  outline: 3px solid var(--color-green);
  box-shadow: 0 0 12px 2px color-mix(in srgb, var(--color-green) 60%, transparent);
  animation: wo-blink 0.6s steps(1, end) both;
}

/* ---------- голоса ---------- */
.wo-vote {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem 0.3rem;
  color: var(--wc);
  background: #07040f;
  box-shadow:
    0 -2px 0 0 var(--wc),
    0 2px 0 0 var(--wc),
    -2px 0 0 0 var(--wc),
    2px 0 0 0 var(--wc);
  white-space: nowrap;
  animation: wo-vote 0.24s steps(2, end) calc(var(--d) + 0.1s) both;
}
.wo-odd .wo-vote {
  top: auto;
  bottom: -2rem;
}

/* ---------- итог голосования ---------- */
.wo-avg {
  /* обычный строчный поток, а не flex: фраза «⌀ 0.84 letter-spacing» остаётся одной строкой текста */
  align-self: flex-start;
  font-size: 1.4rem;
  line-height: 1.3;
  padding: 0.05rem 0.8rem;
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 var(--color-green),
    0 3px 0 0 var(--color-green),
    -3px 0 0 0 var(--color-green),
    3px 0 0 0 var(--color-green);
  animation: wo-in 0.3s steps(3, end) 0.25s both;
}
.wo-avg b {
  font-family: var(--pa-font-display);
  font-weight: 400;
  font-size: 1.25rem;
  color: var(--color-green);
  text-shadow: 0 0 0.6rem color-mix(in srgb, var(--color-green) 60%, transparent);
}

@keyframes wo-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes wo-ants {
  from {
    background-position:
      0 0,
      0 100%,
      0 0,
      100% 0;
  }
  to {
    background-position:
      14px 0,
      -14px 100%,
      0 -14px,
      100% 14px;
  }
}
@keyframes wo-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
@keyframes wo-vote {
  from {
    opacity: 0;
    translate: 0 6px;
  }
}
@keyframes wo-blink {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  75%,
  100% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .wo-bbox,
  .wo-win,
  .wo-overlap,
  .wo-vote,
  .wo-avg {
    animation: none;
  }
}
@media print {
  .wo-bbox,
  .wo-win,
  .wo-overlap,
  .wo-vote,
  .wo-avg {
    animation: none;
  }
}
</style>
