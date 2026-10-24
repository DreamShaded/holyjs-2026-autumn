<script setup lang="ts">
// k-fold: пять кучек компонентов, в каждом раунде одна кучка — контрольная.
// step N показывает первые N раундов, scores — оценка раунда на контрольной кучке.
// values — вместо процентов подписать раунды своим текстом; final — шестой ряд «на всех кучках»
// (показывается при step >= 6) с подписью finalValue.
// Аркадный вид: раунд — ряд из пяти слотов-«картриджей», контрольный слот подсвечен и
// сканируется; новый раунд «вставляется» по слотам, когда становится видимым.
const props = defineProps<{ step: number; scores?: number[]; values?: string[]; final?: boolean; finalValue?: string }>();
const K = 5;
</script>

<template>
  <div class="kfold">
    <div v-for="r in K" :key="r" class="kf-round" :class="{ 'kf-off': step < r }">
      <span class="kf-no">{{ r }}</span>
      <span
        v-for="p in K"
        :key="p"
        class="kf-pile"
        :class="{ 'kf-val': p === r }"
        :style="{ '--p': p }"
      ><tabler-flask v-if="p === r" /><tabler-books v-else /></span>
      <span v-if="values" class="kf-score">{{ values[r - 1] }}</span>
      <span v-else class="kf-score" :class="{ 'kf-low': scores![r - 1] < 0.7, 'kf-top': scores![r - 1] === 1 }">
        {{ Math.round(scores![r - 1] * 100) }} %
      </span>
    </div>
    <div v-if="final" class="kf-round kf-final" :class="{ 'kf-off': step < 6 }">
      <span class="kf-no">6</span>
      <span v-for="p in K" :key="p" class="kf-pile kf-all" :style="{ '--p': p }"><tabler-books /></span>
      <span class="kf-score kf-top">{{ finalValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.kfold {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.kf-round {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: opacity 0.3s steps(3, end);
}
.kf-round.kf-off {
  opacity: 0;
}
.kf-round.kf-final {
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  /* пунктир из «пикселей» 6×3 */
  background: repeating-linear-gradient(90deg, rgba(185, 176, 214, 0.45) 0 6px, transparent 6px 12px) top / 100% 3px
    no-repeat;
}

/* номер раунда — индикатор игрока */
.kf-no {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-bg);
  background: var(--pa-text-dim);
  box-shadow:
    0 -2px 0 0 var(--pa-text-dim),
    0 2px 0 0 var(--pa-text-dim),
    -2px 0 0 0 var(--pa-text-dim),
    2px 0 0 0 var(--pa-text-dim);
  margin-right: 0.3rem;
}

/* слот-«картридж»: пиксельная рамка со ступенчатыми углами и прорезью-«контактами» внизу */
.kf-pile {
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  color: var(--pa-text-dim);
  background:
    linear-gradient(var(--pa-line), var(--pa-line)) bottom 4px center / 60% 3px no-repeat,
    #140d2c;
  box-shadow:
    0 -3px 0 0 #3a3160,
    0 3px 0 0 #3a3160,
    -3px 0 0 0 #3a3160,
    3px 0 0 0 #3a3160;
}
.kf-pile.kf-val {
  color: var(--color-cyan);
  background:
    linear-gradient(var(--color-cyan), var(--color-cyan)) bottom 4px center / 60% 3px no-repeat,
    color-mix(in srgb, var(--color-cyan) 20%, #07040f);
  box-shadow:
    0 -3px 0 0 var(--color-cyan),
    0 3px 0 0 var(--color-cyan),
    -3px 0 0 0 var(--color-cyan),
    3px 0 0 0 var(--color-cyan),
    0 0 14px 2px color-mix(in srgb, var(--color-cyan) 55%, transparent);
  overflow: hidden;
}
/* сканирующая полоса по контрольному слоту */
.kf-pile.kf-val::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: color-mix(in srgb, var(--color-cyan) 60%, transparent);
  animation: kf-scan 1.6s steps(9, end) infinite;
}
.kf-pile.kf-all {
  color: var(--color-green);
  background:
    linear-gradient(var(--color-green), var(--color-green)) bottom 4px center / 60% 3px no-repeat,
    color-mix(in srgb, var(--color-green) 16%, #07040f);
  box-shadow:
    0 -3px 0 0 var(--color-green),
    0 3px 0 0 var(--color-green),
    -3px 0 0 0 var(--color-green),
    3px 0 0 0 var(--color-green),
    0 0 12px 1px color-mix(in srgb, var(--color-green) 45%, transparent);
}

.kf-score {
  margin-left: 0.6rem;
  font-family: var(--pa-font-pixel);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  width: 4.5rem;
  white-space: nowrap;
  color: var(--pa-text);
  text-shadow: 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.6);
}
.kf-final .kf-score {
  width: auto;
  min-width: 0;
  /* «6 эп. → в тесты» длиннее процентов: в узкой колонке переносится, а не выталкивает слоты */
  white-space: normal;
  font-size: 1.75rem;
}
.kf-score.kf-low {
  color: var(--pa-red);
  text-shadow:
    0.125rem 0.125rem 0 rgba(0, 0, 0, 0.6),
    0 0 0.6rem color-mix(in srgb, var(--pa-red) 60%, transparent);
}
.kf-score.kf-top {
  color: var(--color-green);
  text-shadow:
    0.125rem 0.125rem 0 rgba(0, 0, 0, 0.6),
    0 0 0.6rem color-mix(in srgb, var(--color-green) 60%, transparent);
}

/* «вставка картриджа»: при показе раунда слоты падают сверху по очереди, затем загорается счёт */
.kf-round:not(.kf-off) .kf-pile {
  animation: kf-insert 0.24s steps(3, end) calc(var(--p) * 45ms) both;
}
.kf-round:not(.kf-off) .kf-score {
  animation: kf-score 0.3s steps(1, end) 0.28s both;
}
@keyframes kf-insert {
  from {
    transform: translateY(-12px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes kf-score {
  0% {
    opacity: 0;
  }
  33% {
    opacity: 1;
  }
  66% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
@keyframes kf-scan {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(40px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .kf-round:not(.kf-off) .kf-pile,
  .kf-round:not(.kf-off) .kf-score,
  .kf-pile.kf-val::after {
    animation: none;
  }
}
@media print {
  .kf-round:not(.kf-off) .kf-pile,
  .kf-round:not(.kf-off) .kf-score,
  .kf-pile.kf-val::after {
    animation: none;
  }
}
</style>
