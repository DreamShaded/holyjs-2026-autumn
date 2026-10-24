<script setup lang="ts">
// Старый ботинок уровня 7 — «мусор» в улове. Красный = ложная находка.
import A7Sprite from "./A7Sprite.vue";
import { BOOT, BOOT_PAL } from "./sprites";

withDefaults(defineProps<{ px?: number }>(), { px: 3 });
</script>

<template>
  <A7Sprite class="a7-boot" :rows="BOOT" :palette="BOOT_PAL" :px="px" />
</template>
