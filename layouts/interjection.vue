<script setup>
// Сплэш уровня: «LEVEL N», текст слайда (TextBig и т.п.) и название уровня из levels.ts,
// если оно не повторяет текст слайда. Всё, кроме слота, декоративное.
import { computed, onMounted, onUpdated, ref } from "vue";
import { LAST_LEVEL, getLevel, levelVars, useSlideLevel } from "../components/levels";

const props = defineProps({
	variant: { type: [Number, String], default: 1 },
	contentPos: { type: String, default: "center" },
	contentAlign: { type: String, default: "center" },
});

const level = useSlideLevel();

const info = computed(() => getLevel(level.value));
const contentPosClass = computed(
	() => ({ top: "justify-start", center: "justify-center", bottom: "justify-end" })[String(props.contentPos)] || "justify-start",
);
const contentAlignClass = computed(() =>
	String(props.contentAlign) === "center" ? "items-center text-center" : "items-start text-left",
);

// название уровня показываем, только если слайд не говорит то же самое своим текстом
const slotEl = ref(null);
const slotText = ref("");
const norm = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();
function readSlot() {
	slotText.value = norm(slotEl.value?.textContent ?? "");
}
onMounted(readSlot);
onUpdated(readSlot);
const showName = computed(() => slotText.value !== norm(info.value.name));
</script>

<template>
  <div class="slidev-layout interjection" :data-level="level" :style="levelVars(level)">
    <div class="w-full h-full flex flex-col" :class="[contentPosClass, contentAlignClass]">
      <div class="pa-splash-stage" aria-hidden="true">STAGE {{ info.n }}/{{ LAST_LEVEL }}</div>
      <div class="pa-splash-level" aria-hidden="true">LEVEL {{ info.n }}</div>
      <div ref="slotEl" class="pa-splash-slot">
        <slot />
      </div>
      <div v-if="showName" class="pa-splash-name" aria-hidden="true">{{ info.name }}</div>
      <div class="pa-splash-ready" aria-hidden="true">READY?</div>
    </div>
  </div>
</template>

<style scoped>
.pa-splash-stage {
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.375rem;
  letter-spacing: 0.2em;
  color: var(--pa-text-dim);
  margin-bottom: 0.9rem;
}
.pa-splash-level {
  font-family: var(--pa-font-display);
  font-size: 3.5rem;
  line-height: 1.1;
  color: var(--lvl-accent);
  text-shadow:
    0.25rem 0.25rem 0 color-mix(in srgb, var(--lvl-accent2) 70%, #07040f),
    0.5rem 0.5rem 0 rgba(0, 0, 0, 0.5),
    0 0 1.5rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
  margin-bottom: 1.4rem;
}
.pa-splash-slot {
  max-width: 100%;
}
.pa-splash-slot :deep(.text-big) {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 4.5rem;
  line-height: 1;
  letter-spacing: 0.04em;
  margin: 0;
}
.pa-splash-slot :deep(.text-gradient) {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  filter: drop-shadow(0.25rem 0.25rem 0 rgba(0, 0, 0, 0.55));
}
.pa-splash-name {
  margin-top: 1.25rem;
  padding: 0.35rem 0.9rem;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.75rem;
  line-height: 1.1;
  color: var(--pa-bg);
  background: var(--lvl-accent);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent);
}
.pa-splash-ready {
  margin-top: 1.6rem;
  font-family: var(--pa-font-display);
  font-size: 1.125rem;
  line-height: 1;
  color: var(--pa-text);
  animation: pa-ready 0.9s steps(1, end) infinite;
}
@keyframes pa-ready {
  0%,
  55% {
    opacity: 1;
  }
  56%,
  100% {
    opacity: 0.2;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pa-splash-ready {
    animation: none;
  }
}
</style>
