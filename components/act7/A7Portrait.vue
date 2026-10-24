<script setup lang="ts">
// «Портрет» бойца-свойства на экране статов: пиктограмма самого свойства из пикселей.
import { computed } from "vue";
import A7Sprite from "./A7Sprite.vue";
import { PORTRAITS } from "./sprites";

const props = withDefaults(defineProps<{ name: keyof typeof PORTRAITS; px?: number }>(), { px: 4 });

const PAL = {
	C: "#3ef0ff",
	c: "#ff3ecf",
	R: "#ff4d6d",
	G: "#9dff3e",
	B: "#3e8bff",
	Y: "#ffe13e",
};
const rows = computed(() => PORTRAITS[props.name] ?? PORTRAITS.border);
</script>

<template>
  <A7Sprite class="a7-portrait" :rows="rows" :palette="PAL" :px="px" />
</template>
