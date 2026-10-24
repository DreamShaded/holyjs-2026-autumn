<script setup lang="ts">
// Трафарет 3×3 «горизонтальная палочка» прикладывается к пиксельной картинке «ТГ»
// в трёх местах. step: 0 — только картинка и трафарет, 1..3 — позиции A, B, C.
// Аркадный вид: картинка — экран с пиксельной сеткой, трафарет — спрайт-«прицел».
// Текущая позиция — прицел с уголками и сканирующей полосой, внутри него проступает
// узор трафарета; совпавшие клетки подсвечиваются. Прошлые позиции остаются приглушёнными.
import { computed } from "vue";

const props = defineProps<{ step: number }>();

const ART = [
	"............",
	".TTTTT.GGGG.",
	"...T...G....",
	"...T...G....",
	"...T...G....",
	"...T...G....",
	"............",
];
const STENCIL = [
	[0, 0, 0],
	[1, 1, 1],
	[0, 0, 0],
];
// левый верхний угол трафарета (строка, столбец) и нашёл ли он узор
const SPOTS = [
	{ r: 0, c: 1, hit: true },
	{ r: 0, c: 8, hit: true },
	{ r: 3, c: 4, hit: false },
];
const CELL = 24;

const spot = computed(() => (props.step > 0 ? SPOTS[Math.min(props.step, 3) - 1] : null));
const found = computed(() => SPOTS.slice(0, Math.min(props.step, 3)));

/** клетки картинки, совпавшие с «чернилами» трафарета в найденных позициях */
const matched = computed(() => {
	const set = new Set<string>();
	for (const s of found.value) {
		if (!s.hit) continue;
		STENCIL.forEach((row, dr) =>
			row.forEach((v, dc) => {
				if (v && ART[s.r + dr]?.[s.c + dc] !== ".") set.add(`${s.r + dr},${s.c + dc}`);
			}),
		);
	}
	return set;
});
</script>

<template>
  <div class="conv">
    <div class="cv-stencil-wrap">
      <div class="cv-stencil">
        <div v-for="(row, r) in STENCIL" :key="r" class="cv-row">
          <span v-for="(v, c) in row" :key="c" class="cv-cell" :class="{ 'cv-ink': v }" />
        </div>
      </div>
    </div>
    <div class="cv-board" :style="{ width: `${ART[0].length * CELL}px` }">
      <div v-for="(row, r) in ART" :key="r" class="cv-row">
        <span
          v-for="(ch, c) in row"
          :key="c"
          class="cv-cell"
          :class="{ 'cv-ink': ch !== '.', 'cv-match': matched.has(`${r},${c}`) }"
        />
      </div>
      <div
        v-for="(s, i) in found"
        :key="i"
        class="cv-mark"
        :class="{ 'cv-hit': s.hit, 'cv-miss': !s.hit, 'cv-now': s === spot }"
        :style="{ top: `${s.r * CELL}px`, left: `${s.c * CELL}px`, width: `${3 * CELL}px`, height: `${3 * CELL}px` }"
      >
        <!-- узор трафарета, проступающий внутри прицела -->
        <span class="cv-ghost" aria-hidden="true" />
        <i class="cv-corner cv-tl" /><i class="cv-corner cv-tr" /><i class="cv-corner cv-bl" /><i class="cv-corner cv-br" />
        <span class="cv-verdict">{{ s.hit ? "✓" : "✗" }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conv {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.cv-row {
  display: flex;
}
.cv-cell {
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border: 1px solid rgba(185, 176, 214, 0.1);
}

/* ---------- трафарет-спрайт ---------- */
.cv-stencil-wrap {
  padding: 6px;
  background: #0b0718;
  box-shadow:
    0 -3px 0 0 var(--color-cyan),
    0 3px 0 0 var(--color-cyan),
    -3px 0 0 0 var(--color-cyan),
    3px 0 0 0 var(--color-cyan),
    0 0 18px 2px color-mix(in srgb, var(--color-cyan) 40%, transparent);
  animation: cv-float 1.2s steps(2, end) infinite;
}
.cv-stencil .cv-cell {
  border-color: color-mix(in srgb, var(--color-cyan) 35%, transparent);
}
.cv-stencil .cv-cell.cv-ink {
  background: var(--color-cyan);
  border-color: #07040f;
  box-shadow: inset 3px 3px 0 0 rgba(255, 255, 255, 0.45), inset -3px -3px 0 0 rgba(0, 0, 0, 0.25);
}

/* ---------- экран с картинкой ---------- */
.cv-board {
  position: relative;
  background: #0b0718;
  box-shadow:
    0 -3px 0 0 var(--pa-line),
    0 3px 0 0 var(--pa-line),
    -3px 0 0 0 var(--pa-line),
    3px 0 0 0 var(--pa-line);
}
.cv-board .cv-cell.cv-ink {
  background: var(--pa-text);
  border-color: #07040f;
  box-shadow: inset -3px -3px 0 0 rgba(58, 49, 96, 0.55);
}
.cv-board .cv-cell.cv-match {
  background: var(--color-green);
  box-shadow:
    inset -3px -3px 0 0 rgba(0, 0, 0, 0.25),
    0 0 10px 1px color-mix(in srgb, var(--color-green) 60%, transparent);
  position: relative;
  z-index: 1;
}

/* ---------- прицел ---------- */
.cv-mark {
  position: absolute;
  box-sizing: border-box;
  z-index: 2;
  --mc: var(--color-green);
  outline: 2px solid color-mix(in srgb, var(--mc) 55%, transparent);
  background: color-mix(in srgb, var(--mc) 10%, transparent);
  opacity: 0.55;
  transition: opacity 0.3s steps(3, end);
}
.cv-mark.cv-miss {
  --mc: var(--pa-red);
}
.cv-mark.cv-now {
  opacity: 1;
  animation: cv-lock 0.36s steps(3, end) both;
}
/* средняя строка трафарета внутри прицела */
.cv-ghost {
  position: absolute;
  left: 0;
  right: 0;
  top: 24px;
  height: 24px;
  background: repeating-linear-gradient(90deg, transparent 0 2px, color-mix(in srgb, var(--color-cyan) 35%, transparent) 2px 22px, transparent 22px 24px);
}
.cv-now .cv-ghost {
  background: repeating-linear-gradient(90deg, transparent 0 2px, color-mix(in srgb, var(--color-cyan) 45%, transparent) 2px 22px, transparent 22px 24px);
}
/* сканирующая полоса */
.cv-now::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 3px;
  background: var(--mc);
  box-shadow: 0 0 8px var(--mc);
  animation: cv-scan 1.2s steps(12, end) infinite;
}
.cv-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 0 solid var(--mc);
  filter: drop-shadow(0 0 4px var(--mc));
}
.cv-tl {
  top: -6px;
  left: -6px;
  border-top-width: 4px;
  border-left-width: 4px;
}
.cv-tr {
  top: -6px;
  right: -6px;
  border-top-width: 4px;
  border-right-width: 4px;
}
.cv-bl {
  bottom: -6px;
  left: -6px;
  border-bottom-width: 4px;
  border-left-width: 4px;
}
.cv-br {
  bottom: -6px;
  right: -6px;
  border-bottom-width: 4px;
  border-right-width: 4px;
}
.cv-verdict {
  position: absolute;
  right: -1.9rem;
  top: -0.75rem;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
  color: var(--mc);
  text-shadow:
    0.125rem 0.125rem 0 #07040f,
    0 0 0.6rem var(--mc);
}
.cv-miss.cv-now {
  animation:
    cv-lock 0.36s steps(3, end) both,
    cv-shake 0.3s steps(4, end) 0.36s 1;
}

@keyframes cv-lock {
  from {
    transform: scale(1.5);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@keyframes cv-shake {
  0%,
  100% {
    translate: 0 0;
  }
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}
@keyframes cv-scan {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(69px);
  }
}
@keyframes cv-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .cv-stencil-wrap,
  .cv-mark.cv-now,
  .cv-miss.cv-now,
  .cv-now::before {
    animation: none;
  }
}
@media print {
  .cv-stencil-wrap,
  .cv-mark.cv-now,
  .cv-miss.cv-now,
  .cv-now::before {
    animation: none;
  }
}
</style>
