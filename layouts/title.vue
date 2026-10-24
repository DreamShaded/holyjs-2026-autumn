<script setup>
// Титул — стартовый экран аркады: строка очков сверху, логотип-заголовок, мигающее PRESS START.
// Контент слайда (заголовок и подпись) остаётся в слоте; всё остальное декоративное.
import { computed } from "vue";
import { levelVars, useSlideLevel } from "../components/levels";

const props = defineProps({
	variant: { type: [Number, String], default: 1 },
	contentPos: { type: String, default: "center" },
	contentAlign: { type: String, default: "center" },
});

const level = useSlideLevel();

const contentPosClass = computed(
	() => ({ top: "justify-start", center: "justify-center", bottom: "justify-end" })[String(props.contentPos)] || "justify-start",
);
const contentAlignClass = computed(() =>
	String(props.contentAlign) === "center" ? "items-center text-center" : "items-start text-left",
);
</script>

<template>
  <div class="slidev-layout title" :data-level="level" :style="levelVars(level)">
    <div class="pa-title-top" aria-hidden="true">
      <span><b class="p1">1UP</b> 000000</span>
      <span><b class="hi">HI-SCORE</b> 999999</span>
      <span><b class="p2">2UP</b> 000000</span>
    </div>
    <div class="pa-title-body w-full h-full flex flex-col" :class="[contentPosClass, contentAlignClass]">
      <div class="pa-title-logo">
        <slot />
      </div>
      <div class="pa-title-press" aria-hidden="true">
        <span class="pa-blink">▶ PRESS START</span>
        <span class="pa-coin">INSERT COIN · HOLYJS 2026</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slidev-layout.title {
  padding: 4.5rem 3.5rem 3rem;
}
.pa-title-top {
  position: absolute;
  top: 1.25rem;
  left: 3.5rem;
  right: 3.5rem;
  display: flex;
  justify-content: space-between;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text);
}
.pa-title-top b {
  font-weight: 400;
  margin-right: 0.5rem;
}
.pa-title-top .p1 {
  color: var(--pa-red);
}
.pa-title-top .hi {
  color: var(--pa-yellow);
}
.pa-title-top .p2 {
  color: var(--pa-cyan);
}
.pa-title-logo {
  max-width: 50rem;
}
.pa-title-logo :deep(h1) {
  /* перенос перед «на JS»: две строки логотипа вместо висячего «JS» */
  max-width: 17em;
  font-size: 2.5rem;
  line-height: 1.35;
  margin: 0 0 1.25rem;
  color: transparent;
  background: linear-gradient(
    180deg,
    #fff 0 30%,
    var(--pa-cyan) 30% 55%,
    #3aa8ff 55% 72%,
    var(--pa-magenta) 72% 100%
  );
  background-size: 100% 1.35em;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  filter: drop-shadow(0.25rem 0.25rem 0 #4a0f5c) drop-shadow(0 0 1rem rgba(62, 240, 255, 0.35));
}
.pa-title-logo :deep(p) {
  font-family: var(--pa-font-pixel);
  font-weight: 500;
  font-size: 1.75rem;
  letter-spacing: 0.02em;
  margin: 0;
  color: var(--pa-text);
  padding: 0.5rem 0.9rem;
  display: inline-block;
  background: rgba(7, 4, 15, 0.78);
  box-shadow:
    0 -3px 0 0 var(--pa-magenta),
    0 3px 0 0 var(--pa-magenta),
    -3px 0 0 0 var(--pa-magenta),
    3px 0 0 0 var(--pa-magenta);
}
.pa-title-press {
  display: flex;
  align-items: baseline;
  gap: 2rem;
  margin-top: 2rem;
  font-family: var(--pa-font-display);
  line-height: 1;
}
.pa-blink {
  font-size: 1.125rem;
  color: var(--pa-yellow);
  text-shadow: 0.1875rem 0.1875rem 0 #7a1f6a;
  animation: pa-blink 1.1s steps(1, end) infinite;
}
.pa-coin {
  font-size: 1rem;
  color: var(--pa-text-dim);
}
@keyframes pa-blink {
  0%,
  60% {
    opacity: 1;
  }
  61%,
  100% {
    opacity: 0.15;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pa-blink {
    animation: none;
  }
}
</style>
