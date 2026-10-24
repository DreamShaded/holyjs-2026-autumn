<script setup lang="ts">
// Полоса «задачник» под графиком второго слайда «Как сеть учится».
// step — номер клика:
//   1 — зубрёжка: все листки задач — «учебник», сеть заучивает их по кругу (листки мигают);
//   2 — защита: часть листков уезжает за замок и становится «контрольной», на тренировке их нет.
// Цвета совпадают с сериями графика: учебник — голубой, контрольная — красный.
const props = defineProps<{ step: number }>();

const N = 16;
/** сколько листков прячем в контрольную */
const HIDDEN = 4;
</script>

<template>
  <div class="sp" :class="{ 'sp-cram': props.step === 1, 'sp-split': props.step >= 2 }" aria-hidden="true">
    <div class="sp-sheets">
      <i v-for="k in N" :key="k" :class="{ test: k > N - HIDDEN }" :style="{ '--k': k }" />
      <span class="sp-lock" />
    </div>
  </div>
</template>

<style scoped>
.sp {
  width: 400px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.sp-sheets {
  position: relative;
  width: 380px;
  display: flex;
  gap: 4px;
  height: 30px;
}
/* листок: уголок загнут ступенькой */
.sp-sheets i {
  width: 18px;
  height: 24px;
  margin-top: 3px;
  background: color-mix(in srgb, var(--pa-cyan) 70%, #07040f);
  clip-path: polygon(0 0, 66% 0, 66% 17%, 100% 17%, 100% 100%, 0 100%);
  transition: transform 0.45s steps(4, end), background 0.3s steps(2, end);
}
.sp-split .sp-sheets i.test {
  background: var(--pa-red);
  transform: translateX(28px);
}
/* рамка «сейфа» вокруг спрятанных листков: 12 листков по 22px + сдвиг 28px */
.sp-lock {
  position: absolute;
  left: calc(12 * 22px + 28px - 7px);
  top: 0;
  width: calc(4 * 22px - 4px + 14px);
  height: 30px;
  box-shadow: inset 0 0 0 3px var(--pa-red), 0 0 10px -2px var(--pa-red);
  opacity: 0;
  transition: opacity 0.3s steps(3, end);
}
.sp-split .sp-lock {
  opacity: 1;
}
@media screen and (prefers-reduced-motion: no-preference) {
  /* зубрёжка: листки по очереди вспыхивают, как карточки с ответами */
  .sp-cram .sp-sheets i {
    animation: sp-cram 1.6s steps(1, end) infinite;
    animation-delay: calc(var(--k) * 0.1s - 1.6s);
  }
}
@keyframes sp-cram {
  0%,
  12% {
    background: #f2ecff;
  }
  13%,
  100% {
    background: color-mix(in srgb, var(--pa-cyan) 70%, #07040f);
  }
}
</style>
