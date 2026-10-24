<script setup lang="ts">
// Плашка «ПОПЫТКА n/3» в правом верхнем углу слайда: три слайда подряд — три попытки
// вылечить переобучение (ранняя остановка, dropout/L2, данные). Последняя удачная — лайм.
// Декоративная, стоит в потоке слайда абсолютно, клики не занимает.
const props = withDefaults(defineProps<{ n: number; total?: number; win?: boolean }>(), {
	total: 3,
	win: false,
});
</script>

<template>
  <div class="try-tag" :class="{ win: props.win }">
    <span class="pips" aria-hidden="true">
      <i v-for="i in props.total" :key="i" :class="{ on: i <= props.n }" />
    </span>
    ПОПЫТКА {{ props.n }}/{{ props.total }}
  </div>
</template>

<style scoped>
.try-tag {
  position: absolute;
  top: 3.6rem;
  right: 3.5rem;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.15rem 0.7rem;
  font-family: var(--pa-font-pixel);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.04em;
  color: var(--pa-yellow);
  background: rgba(16, 10, 34, 0.9);
  box-shadow:
    0 -3px 0 0 var(--pa-yellow),
    0 3px 0 0 var(--pa-yellow),
    -3px 0 0 0 var(--pa-yellow),
    3px 0 0 0 var(--pa-yellow);
}
.try-tag.win {
  color: var(--pa-lime);
  box-shadow:
    0 -3px 0 0 var(--pa-lime),
    0 3px 0 0 var(--pa-lime),
    -3px 0 0 0 var(--pa-lime),
    3px 0 0 0 var(--pa-lime),
    0 0 1rem -0.2rem rgba(157, 255, 62, 0.6);
}
.pips {
  display: inline-flex;
  gap: 4px;
}
.pips i {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.18);
}
.pips i.on {
  background: currentColor;
}
</style>
