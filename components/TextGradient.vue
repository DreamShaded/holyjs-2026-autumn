<script setup lang="ts">
// Текст с аркадной заливкой: полосы палитры (--color-accent-gradient) и редкий
// пиксельный «блик», пробегающий по буквам ступеньками.
import { computed } from "vue";

const props = defineProps<{
	tag?: string;
}>();

const Tag = computed(() => props.tag || "span");
</script>

<template>
  <component :is="Tag" class="text-gradient">
    <slot />
  </component>
</template>

<style scoped>
.text-gradient {
  /* первый слой — блик (полоса шириной в треть текста), второй — полосатая неоновая заливка */
  background:
    linear-gradient(100deg, transparent 0 42%, rgba(255, 255, 255, 0.85) 42% 47%, transparent 47% 52%,
      rgba(255, 255, 255, 0.6) 52% 54%, transparent 54% 100%) -200% 0 / 300% 100% no-repeat,
    var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  animation: tg-shine 4.2s steps(14, end) 0.6s infinite;
}
@keyframes tg-shine {
  0% {
    background-position:
      -200% 0,
      0 0;
  }
  /* блик проходит за первую треть цикла, остальное время текст стоит спокойно */
  33%,
  100% {
    background-position:
      300% 0,
      0 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .text-gradient {
    animation: none;
    background-position:
      -200% 0,
      0 0;
  }
}
@media print {
  .text-gradient {
    animation: none;
  }
}
</style>
