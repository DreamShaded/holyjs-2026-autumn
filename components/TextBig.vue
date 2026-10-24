<script setup lang="ts">
// Крупная надпись сплэша акта: пиксельный шрифт, капс, неоновое свечение.
// Handjet, а не Press Start 2P: кириллица Press Start слишком широкая для фраз сплэша
// (см. отчёт 03, выбор шрифта заголовков). Длинная надпись, не влезающая в строку,
// уменьшается шагами по 0.25rem, но не ниже 2.5rem.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import TextGradient from "./TextGradient.vue";

const props = defineProps<{
	tag?: string;
}>();

const Tag = computed(() => props.tag || "p");

const MAX_REM = 4.5;
const MIN_REM = 2.5;
const STEP_REM = 0.25;

const root = ref<{ $el?: HTMLElement } | HTMLElement | null>(null);
/** подобранный кегль; null — базовый из CSS */
const fitRem = ref<number | null>(null);

function el(): HTMLElement | null {
	const r = root.value as unknown;
	if (!r) return null;
	return r instanceof HTMLElement ? r : ((r as { $el?: HTMLElement }).$el ?? null);
}

/** Уменьшает кегль, пока надпись шире доступного места (перенос строк запрещён). */
function fit() {
	const node = el();
	if (!node) return;
	let rem = MAX_REM;
	node.style.fontSize = `${rem}rem`;
	if (node.clientWidth <= 0) return;
	// ширина блока ограничена контейнером, а строка не переносится: переполнение видно по scrollWidth
	while (node.scrollWidth > node.clientWidth + 1 && rem > MIN_REM) {
		rem = Math.max(MIN_REM, rem - STEP_REM);
		node.style.fontSize = `${rem}rem`;
	}
	fitRem.value = rem;
}

let ro: ResizeObserver | undefined;
onMounted(async () => {
	await nextTick();
	fit();
	// шрифт мог ещё не загрузиться: после загрузки ширина другая
	document.fonts?.ready.then(fit).catch(() => {});
	// следим за каркасом слайда, а не за родителем: ширина родителя сама зависит от кегля
	const box = el()?.closest(".slidev-layout") ?? el()?.parentElement;
	if (box && typeof ResizeObserver !== "undefined") {
		ro = new ResizeObserver(() => fit());
		ro.observe(box);
	}
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <component
    :is="Tag"
    ref="root"
    class="text-big"
    :style="fitRem !== null ? { fontSize: `${fitRem}rem` } : undefined"
  >
    <TextGradient>
      <slot />
    </TextGradient>
  </component>
</template>

<style scoped>
.text-big {
  font-family: var(--pa-font-pixel);
  font-size: 4.5rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  /* неон: жёсткая пиксельная тень + мягкое свечение цвета уровня */
  filter: drop-shadow(0.25rem 0.25rem 0 rgba(7, 4, 15, 0.85))
    drop-shadow(0 0 0.9rem color-mix(in srgb, var(--lvl-accent, #ff3ecf) 55%, transparent));
}
</style>
