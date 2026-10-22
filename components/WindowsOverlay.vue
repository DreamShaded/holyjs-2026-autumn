<script setup lang="ts">
// Настоящий рендер карточки с мутацией letter-spacing. Поверх: bbox отличий (step 1),
// окна 64×64 с шагом 48 (step 2), полоса перекрытия 16px (step 3), голоса окон (step 4).
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
    <div class="stage" :style="{ width: s(504), height: s(183) }">
      <img src="/images/dd/card-render.png" class="pix" :style="{ width: s(504) }" alt="Карточка после мутации letter-spacing">
      <div v-if="step >= 1" class="bbox" :style="{ left: s(BBOX.x0), top: s(BBOX.y0), width: s(BBOX.x1 - BBOX.x0), height: s(BBOX.y1 - BBOX.y0) }" />
      <template v-if="step >= 2">
        <div
          v-for="(w, i) in wins"
          :key="i"
          class="win"
          :class="{ odd: i % 2 }"
          :style="{ left: s(w.x), top: s(w.y), width: s(WIN), height: s(WIN), '--d': `${i * 60}ms` }"
        >
          <span v-if="step >= 4" class="vote">{{ w.v.toFixed(2) }}</span>
        </div>
      </template>
      <div v-if="step >= 3" class="overlap" :style="{ left: s(BBOX.x0 + STRIDE), top: s(ROW_Y + 8), width: s(WIN - STRIDE), height: s(WIN - 8) }" />
    </div>
    <div v-if="step >= 4" class="avg">
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
.stage {
  position: relative;
}
.bbox {
  position: absolute;
  border: 3px dashed #ff6b6b;
  border-radius: 4px;
}
.win {
  position: absolute;
  border: 2px solid var(--color-cyan);
  background: rgba(98, 236, 255, 0.08);
  box-sizing: border-box;
  animation: pop 0.3s var(--d) both;
}
.win.odd {
  border-color: #ffd36b;
  background: rgba(255, 211, 107, 0.08);
}
.win.odd .vote {
  top: auto;
  bottom: -1.9rem;
}
.overlap {
  position: absolute;
  background: rgba(86, 255, 113, 0.45);
  outline: 2px solid var(--color-green);
}
.vote {
  position: absolute;
  top: -1.9rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-cyan);
  background: rgba(0, 0, 0, 0.7);
  padding: 0 0.3rem;
  border-radius: 4px;
}
.avg {
  font-size: 1.4rem;
}
.avg b {
  color: var(--color-green);
}
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
</style>
