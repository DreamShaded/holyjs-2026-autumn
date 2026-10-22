<script setup lang="ts">
// k-fold: пять кучек компонентов, в каждом раунде одна кучка — контрольная.
// step N показывает первые N раундов, scores — оценка раунда на контрольной кучке.
// values — вместо процентов подписать раунды своим текстом; final — шестой ряд «на всех кучках»
// (показывается при step >= 6) с подписью finalValue.
const props = defineProps<{ step: number; scores?: number[]; values?: string[]; final?: boolean; finalValue?: string }>();
const K = 5;
</script>

<template>
  <div class="kfold">
    <div v-for="r in K" :key="r" class="round" :class="{ hidden: step < r }">
      <span class="no">{{ r }}</span>
      <span
        v-for="p in K"
        :key="p"
        class="pile"
        :class="{ val: p === r }"
      ><tabler-flask v-if="p === r" /><tabler-books v-else /></span>
      <span v-if="values" class="score">{{ values[r - 1] }}</span>
      <span v-else class="score" :class="{ low: scores![r - 1] < 0.7, top: scores![r - 1] === 1 }">
        {{ Math.round(scores![r - 1] * 100) }} %
      </span>
    </div>
    <div v-if="final" class="round final" :class="{ hidden: step < 6 }">
      <span class="no">6</span>
      <span v-for="p in K" :key="p" class="pile all"><tabler-books /></span>
      <span class="score top">{{ finalValue }}</span>
    </div>
  </div>
</template>

<style scoped>
.kfold {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.round {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: opacity 0.3s;
}
.round.final {
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
}
.final .score {
  width: auto;
  white-space: nowrap;
}
.pile.all {
  background: rgba(86, 255, 113, 0.15);
  border-color: var(--color-green);
}
.round.hidden {
  opacity: 0;
}
.no {
  width: 1.4rem;
  color: rgba(255, 255, 255, 0.6);
}
.pile {
  width: 52px;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.pile.val {
  background: rgba(98, 236, 255, 0.18);
  border-color: var(--color-cyan);
  color: var(--color-cyan);
}
.score {
  margin-left: 0.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  width: 4.5rem;
}
.score.low {
  color: #ff6b6b;
}
.score.top {
  color: var(--color-green);
}
</style>
