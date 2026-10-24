<script setup lang="ts">
// Рыба уровня 7 — «настоящая поломка» в улове. Лайм = попадание.
import A7Sprite from "./A7Sprite.vue";
import { FISH, FISH_PAL } from "./sprites";

withDefaults(defineProps<{ px?: number; flip?: boolean }>(), { px: 3, flip: false });
</script>

<template>
  <A7Sprite class="a7-fish" :rows="FISH" :palette="FISH_PAL" :px="px" :flip="flip" />
</template>
