<script setup lang="ts">
// Счётчик метрики из 10 клеток: одна клетка — одна штука в знаменателе.
// fish — рыба (засчитана), boot — ботинок в улове (мусор), gone — рыба, ушедшая из сети.
// При on клетки заполняются по очереди; до этого видна пустая рамка счётчика.
import A7Sprite from "./A7Sprite.vue";
import { BOOT, BOOT_PAL, FISH, FISH_PAL } from "./sprites";

defineProps<{ cells: Array<"fish" | "boot" | "gone">; on: boolean }>();

const GONE_PAL = { G: "#ff4d6d", g: "#ff4d6d", K: "#07040f" };
</script>

<template>
  <div class="a7-meter" :class="{ on }" aria-hidden="true">
    <div v-for="(c, i) in cells" :key="i" class="cell" :class="c" :style="{ '--d': `${i * 50}ms` }">
      <template v-if="on">
        <A7Sprite v-if="c === 'fish'" :rows="FISH" :palette="FISH_PAL" :px="2" />
        <A7Sprite v-else-if="c === 'boot'" :rows="BOOT" :palette="BOOT_PAL" :px="2" />
        <A7Sprite v-else :rows="FISH" :palette="GONE_PAL" :px="2" class="ghost" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.a7-meter {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 4px;
  background: #07040f;
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.cell {
  height: 34px;
  display: grid;
  place-items: center;
  background: #120c28;
}
.on .cell.fish {
  background: rgba(157, 255, 62, 0.22);
  box-shadow: inset 0 -4px 0 0 #9dff3e;
}
.on .cell.boot {
  background: rgba(255, 77, 109, 0.24);
  box-shadow: inset 0 -4px 0 0 #ff4d6d;
}
.on .cell.gone {
  background: transparent;
  outline: 2px dashed #ff4d6d;
  outline-offset: -2px;
}
.ghost {
  opacity: 0.55;
}
@media screen and (prefers-reduced-motion: no-preference) {
  .on .cell {
    animation: a7-cell 0.2s steps(2, end) var(--d) both;
  }
}
@keyframes a7-cell {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
