<script setup>
// Обычный слайд аркады. Пропсы те же, что у layout'а темы оригинала; variant больше не выбирает
// фон (фон задаёт уровень), но принимается, чтобы фронтматтер слайдов работал без правок.
import { computed } from "vue";
import { levelVars, useSlideLevel } from "../components/levels";

const props = defineProps({
	variant: { type: [Number, String], default: 1 },
	contentPos: { type: String, default: "top" },
	contentAlign: { type: String, default: "left" },
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
  <div class="slidev-layout simple-slide" :data-level="level" :style="levelVars(level)">
    <div class="w-full h-full flex flex-col" :class="[contentPosClass, contentAlignClass]">
      <slot />
    </div>
  </div>
</template>
