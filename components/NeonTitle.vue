<script setup lang="ts">
// Неоновый заголовок: пиксельный шрифт, жёсткая тень цвета уровня и мягкое свечение.
// display — Press Start 2P (только короткие строки!), иначе Handjet.
const props = withDefaults(
	defineProps<{
		tag?: string;
		display?: boolean;
		/** CSS-размер шрифта, не меньше 1rem */
		size?: string;
	}>(),
	{ tag: "h2", display: false, size: "" },
);
</script>

<template>
  <component
    :is="props.tag"
    class="neon-title"
    :class="{ display: props.display }"
    :style="props.size ? { fontSize: `max(1rem, ${props.size})` } : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.neon-title {
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  line-height: 1.05;
  margin: 0 0 0.8rem;
  color: var(--pa-text);
  text-shadow:
    0.1875rem 0.1875rem 0 color-mix(in srgb, var(--lvl-accent) 55%, #07040f),
    0 0 1rem color-mix(in srgb, var(--lvl-accent) 40%, transparent);
}
.neon-title.display {
  font-family: var(--pa-font-display);
  font-weight: 400;
  line-height: 1.3;
  color: var(--lvl-accent);
  text-shadow:
    0.25rem 0.25rem 0 color-mix(in srgb, var(--lvl-accent2) 70%, #07040f),
    0 0 1.25rem color-mix(in srgb, var(--lvl-accent) 55%, transparent);
}
</style>
