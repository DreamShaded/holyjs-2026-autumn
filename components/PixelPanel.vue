<script setup lang="ts">
// Окно с пиксельной рамкой (ступенчатые углы) и полосой-заголовком, как в UI аркады.
// tone задаёт цвет рамки: level — акцент уровня, ok — лайм, no — красный, dim — нейтральный.
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		title?: string;
		tone?: "level" | "ok" | "no" | "dim";
		/** свечение рамки */
		glow?: boolean;
	}>(),
	{ title: "", tone: "level", glow: false },
);

const frame = computed(
	() =>
		({
			level: "var(--lvl-accent)",
			ok: "var(--pa-lime)",
			no: "var(--pa-red)",
			dim: "var(--pa-line)",
		})[props.tone],
);
</script>

<template>
  <section class="pixel-panel" :class="{ glow: props.glow }" :style="{ '--pp-frame': frame }">
    <header v-if="props.title || $slots.title" class="pp-bar">
      <span class="pp-dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="pp-title"><slot name="title">{{ props.title }}</slot></span>
    </header>
    <div class="pp-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pixel-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--dd-card-bg, rgba(18, 11, 38, 0.84));
  box-shadow:
    0 calc(-1 * var(--pa-px)) 0 0 var(--pp-frame),
    0 var(--pa-px) 0 0 var(--pp-frame),
    calc(-1 * var(--pa-px)) 0 0 0 var(--pp-frame),
    var(--pa-px) 0 0 0 var(--pp-frame);
}
.pixel-panel.glow {
  box-shadow:
    0 calc(-1 * var(--pa-px)) 0 0 var(--pp-frame),
    0 var(--pa-px) 0 0 var(--pp-frame),
    calc(-1 * var(--pa-px)) 0 0 0 var(--pp-frame),
    var(--pa-px) 0 0 0 var(--pp-frame),
    0 0 1.5rem -0.2rem color-mix(in srgb, var(--pp-frame) 55%, transparent);
}
.pp-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.2rem 0.75rem;
  background: color-mix(in srgb, var(--pp-frame) 22%, #07040f);
  border-bottom: var(--pa-px) solid var(--pp-frame);
}
.pp-dots {
  display: flex;
  gap: 4px;
}
.pp-dots i {
  width: 6px;
  height: 6px;
  background: var(--pp-frame);
}
.pp-title {
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
  color: var(--pa-text);
}
.pp-body {
  padding: 0.75rem 1rem;
  flex: 1;
  min-height: 0;
}
</style>
