<script setup lang="ts">
// Трафарет 3×3 «горизонтальная палочка» прикладывается к пиксельной картинке «ТГ»
// в трёх местах. step: 0 — только картинка и трафарет, 1..3 — позиции A, B, C.
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
</script>

<template>
  <div class="conv">
    <div class="stencil">
      <div v-for="(row, r) in STENCIL" :key="r" class="srow">
        <span v-for="(v, c) in row" :key="c" class="cell" :class="{ ink: v }" />
      </div>
    </div>
    <div class="board" :style="{ width: `${ART[0].length * CELL}px` }">
      <div v-for="(row, r) in ART" :key="r" class="srow">
        <span v-for="(ch, c) in row" :key="c" class="cell" :class="{ ink: ch !== '.' }" />
      </div>
      <div
        v-for="(s, i) in found"
        :key="i"
        class="mark"
        :class="{ hit: s.hit, miss: !s.hit, now: s === spot }"
        :style="{ top: `${s.r * CELL}px`, left: `${s.c * CELL}px`, width: `${3 * CELL}px`, height: `${3 * CELL}px` }"
      >
        <span class="verdict">{{ s.hit ? "✓" : "✗" }}</span>
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
.board {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
}
.srow {
  display: flex;
}
.cell {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}
.cell.ink {
  background: #e8eefc;
}
.stencil .cell {
  border-color: var(--color-cyan);
}
.stencil .cell.ink {
  background: var(--color-cyan);
}
.mark {
  position: absolute;
  border: 3px solid;
  border-radius: 4px;
  box-sizing: border-box;
  transition: all 0.3s;
  opacity: 0.55;
}
.mark.now {
  opacity: 1;
}
.mark.hit {
  border-color: var(--color-green);
  background: rgba(86, 255, 113, 0.12);
}
.mark.miss {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.12);
}
.verdict {
  position: absolute;
  right: -1.6rem;
  top: -0.6rem;
  font-size: 1.5rem;
  font-weight: 700;
}
.hit .verdict {
  color: var(--color-green);
}
.miss .verdict {
  color: #ff6b6b;
}
</style>
