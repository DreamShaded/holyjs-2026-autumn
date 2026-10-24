<script setup>
// Две колонки: шапка (слот header) + сетка leftWidth / 1fr, как в теме оригинала.
import { computed } from "vue";
import { levelVars, useSlideLevel } from "../components/levels";

const props = defineProps({
	variant: { type: [Number, String], default: 1 },
	leftWidth: { type: String, default: "50%" },
	align: { type: String, default: "top" },
	leftAlign: { type: String, default: null },
	rightAlign: { type: String, default: null },
	class: { type: String, default: "" },
});

const level = useSlideLevel();

function getAlignClass(align) {
	return { top: "justify-start", center: "justify-center", bottom: "justify-end" }[align] || "justify-start";
}
const leftClass = computed(() => getAlignClass(props.leftAlign || props.align));
const rightClass = computed(() => getAlignClass(props.rightAlign || props.align));
</script>

<template>
  <div class="slidev-layout two-cols" :data-level="level" :style="levelVars(level)">
    <div class="pa-two-cols flex flex-col h-full">
      <div v-if="$slots.header">
        <slot name="header" />
      </div>
      <div class="w-full grid gap-8 flex-1 min-h-0" :style="{ gridTemplateColumns: `${props.leftWidth} 1fr` }">
        <div class="col-left flex flex-col min-w-0" :class="leftClass">
          <slot />
        </div>
        <div class="col-right flex flex-col min-w-0" :class="rightClass">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* шапка ближе к колонкам, чем в теме оригинала: моноширинный текст длиннее, место нужнее */
.pa-two-cols {
  gap: 1.25rem;
}
</style>
