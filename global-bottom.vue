<script setup lang="ts">
// Нижний глобальный слой: фон текущего уровня. Смонтирован только фон активного уровня,
// при смене уровня старый фон гаснет, новый проявляется (opacity).
import LevelBackdrop from "./components/LevelBackdrop.vue";
import { useLevelNav } from "./components/levels";

const { level, isPrint } = useLevelNav();
</script>

<template>
  <div class="pa-backdrop-layer">
    <Transition name="pa-lvl-fade">
      <LevelBackdrop :key="level" :level="level" :animate="!isPrint" />
    </Transition>
  </div>
</template>

<style scoped>
.pa-backdrop-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: #07040f;
}
.pa-lvl-fade-enter-active,
.pa-lvl-fade-leave-active {
  transition: opacity 0.6s steps(6, end);
}
.pa-lvl-fade-enter-from,
.pa-lvl-fade-leave-to {
  opacity: 0;
}
</style>
