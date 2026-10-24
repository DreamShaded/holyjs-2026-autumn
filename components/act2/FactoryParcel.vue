<script setup lang="ts">
// Компонент-«посылка», которая едет по ленте конвейера от станка к станку.
// step — текущий клик слайда: 0 — посылки нет, 1..4 — стоит у станка с этим номером.
// stops — центры станков в долях ширины ленты (по одному на шаг).
// С шага mutateAt посылка «мутирована»: строки текста разъезжаются, цвет меняется.
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		step: number;
		stops: number[];
		mutateAt?: number;
	}>(),
	{ mutateAt: 3 },
);

const visible = computed(() => props.step >= 1);
const left = computed(() => {
	const i = Math.min(Math.max(props.step, 1), props.stops.length) - 1;
	return `${(props.stops[i] ?? 0) * 100}%`;
});
const mutated = computed(() => props.step >= props.mutateAt);
</script>

<template>
  <div class="factory-parcel" aria-hidden="true">
    <div
      class="fp-box"
      :class="{ 'fp-on': visible, 'fp-mut': mutated }"
      :style="{ left }"
    >
      <i class="fp-l1" /><i class="fp-l2" /><i class="fp-l3" />
    </div>
  </div>
</template>

<style scoped>
.factory-parcel {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.fp-box {
  position: absolute;
  bottom: 100%;
  width: 40px;
  height: 28px;
  margin-left: -20px;
  margin-bottom: 1px;
  background: #f2ecff;
  box-shadow:
    0 -3px 0 0 #07040f,
    0 3px 0 0 #07040f,
    -3px 0 0 0 #07040f,
    3px 0 0 0 #07040f,
    0 0 0.6rem rgba(255, 225, 62, 0.55);
  opacity: 0;
  transform: translateY(-24px);
  transition:
    left 0.9s steps(10, end),
    opacity 0.2s steps(2),
    transform 0.3s steps(3);
}
.fp-box.fp-on {
  opacity: 1;
  transform: translateY(0);
}
.fp-box i {
  position: absolute;
  left: 5px;
  height: 4px;
  background: #241c42;
  transition: all 0.3s steps(3);
}
.fp-l1 { top: 5px; width: 18px; }
.fp-l2 { top: 12px; width: 28px; }
.fp-l3 { top: 19px; width: 12px; }
/* мутация: буквы «разъехались» — строки длиннее и со сдвигом */
.fp-mut {
  background: #ffe9f8;
  box-shadow:
    0 -3px 0 0 #07040f,
    0 3px 0 0 #07040f,
    -3px 0 0 0 #07040f,
    3px 0 0 0 #07040f,
    0 0 0.7rem rgba(255, 62, 207, 0.6);
}
.fp-mut .fp-l1 { width: 26px; background: var(--pa-magenta); }
.fp-mut .fp-l2 { width: 32px; left: 3px; background: #6a1f5a; }
.fp-mut .fp-l3 { width: 18px; background: #6a1f5a; }

@media (prefers-reduced-motion: reduce) {
  .fp-box,
  .fp-box i {
    transition: none;
  }
}
</style>
