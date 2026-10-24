<script setup lang="ts">
// Карточка статов игрока для экрана выбора персонажа (WHOAMI).
// Шкалы растут вместе с пунктами списка: step — номер текущего клика слайда ($clicks).
// Таблица порогов ниже — единственное место, где задано, на каком клике какая шкала растёт.
// Декоративная (aria-hidden): текст слайда остаётся в списке.
import { computed } from "vue";

const props = withDefaults(defineProps<{ step?: number }>(), { step: 0 });

const CELLS = 10;

// для каждой шкалы: [клик, сколько клеток с этого клика]
const STATS: { key: string; label: string; color: string; grow: [number, number][] }[] = [
	{ key: "fe", label: "FRONTEND", color: "var(--pa-cyan)", grow: [[1, 10]] },
	{ key: "ml", label: "ML / DS", color: "var(--pa-magenta)", grow: [[2, 4], [3, 6], [5, 8]] },
	{ key: "pc", label: "COMMUNITY", color: "var(--pa-yellow)", grow: [[4, 8]] },
	{ key: "vue", label: "VUE", color: "var(--pa-lime)", grow: [[6, 10]] },
];

const rows = computed(() =>
	STATS.map((s) => {
		let filled = 0;
		for (const [at, n] of s.grow) if (props.step >= at) filled = n;
		return { ...s, filled, max: filled === CELLS };
	}),
);
</script>

<template>
  <div class="a1-stats" aria-hidden="true">
    <div class="a1-stats__head">
      <span class="a1-stats__tag">P1</span>
      <span class="a1-stats__title">STATS</span>
    </div>
    <div v-for="r in rows" :key="r.key" class="a1-stats__row" :style="{ '--bar': r.color }">
      <span class="a1-stats__lbl">{{ r.label }}</span>
      <span class="a1-stats__bar">
        <i v-for="c in CELLS" :key="c" :class="{ on: c <= r.filled }" :style="{ '--c': c }" />
      </span>
      <span class="a1-stats__max" :class="{ on: r.max }">MAX</span>
    </div>
  </div>
</template>

<style scoped>
.a1-stats {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.55rem 0.9rem 0.7rem;
  background: rgba(7, 4, 15, 0.82);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent);
}
.a1-stats__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.2rem;
}
.a1-stats__tag {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  padding: 0.2rem 0.3rem;
  color: var(--pa-bg);
  background: var(--lvl-accent);
}
.a1-stats__title {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text);
}
.a1-stats__row {
  display: grid;
  grid-template-columns: 7.5rem 1fr 3rem;
  align-items: center;
  gap: 0.75rem;
}
.a1-stats__lbl {
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.1;
  letter-spacing: 0.04em;
  color: var(--pa-text-dim);
}
.a1-stats__bar {
  display: flex;
  gap: 3px;
}
.a1-stats__bar i {
  flex: 1;
  height: 0.85rem;
  background: #1c1730;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.35);
}
.a1-stats__bar i.on {
  background: var(--bar);
  box-shadow:
    inset 0 -3px 0 rgba(0, 0, 0, 0.3),
    0 0 6px color-mix(in srgb, var(--bar) 60%, transparent);
  /* клетки набираются по очереди слева направо */
  animation: a1-cell 0.06s steps(1, end) both;
  animation-delay: calc(var(--c) * 45ms);
}
.a1-stats__max {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--pa-lime);
  opacity: 0;
}
.a1-stats__max.on {
  opacity: 1;
  animation: a1-max 0.9s steps(1, end) 0.5s 2;
}
@keyframes a1-cell {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes a1-max {
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
  .a1-stats__bar i.on,
  .a1-stats__max.on {
    animation: none;
  }
}
</style>
