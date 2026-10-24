<script setup lang="ts">
// Табло свёртки (слайд «Свёртка»): что «насчитал» трафарет в каждой позиции.
// Трафарет — горизонтальная палочка из трёх клеток, поэтому число в позиции = сколько из трёх
// клеток палочки легли на чернила буквы. Позиции и исходы совпадают с ConvStencil:
// верх «Т» → 3 (нашёл), верх «Г» → 3 (нашёл), пустое место → 0 (молчит).
// step — номер клика: строка табло появляется на своём шаге.
const props = defineProps<{ step: number }>();

const ROWS = [
	{ n: 1, what: "Т", hits: 3 },
	{ n: 2, what: "Г", hits: 3 },
	{ n: 3, what: "·", hits: 0 },
];
</script>

<template>
  <div class="cr" aria-hidden="true">
    <div
      v-for="r in ROWS"
      :key="r.n"
      class="cr-row"
      :class="{ 'cr-on': props.step >= r.n, 'cr-now': props.step === r.n, 'cr-hit': r.hits > 0 }"
    >
      <span class="cr-pos">{{ r.what }}</span>
      <span class="cr-bar"><i v-for="k in 3" :key="k" :class="{ lit: k <= r.hits }" /></span>
      <span class="cr-val">= {{ r.hits }}</span>
      <span class="cr-ok">{{ r.hits ? "✓" : "✗" }}</span>
    </div>
  </div>
</template>

<style scoped>
.cr {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.cr-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.15rem 0.6rem;
  background: rgba(11, 7, 24, 0.75);
  box-shadow: inset 3px 0 0 0 #3a3160;
  opacity: 0;
  --c: var(--pa-red);
}
.cr-row.cr-hit {
  --c: var(--pa-lime);
}
.cr-row.cr-on {
  opacity: 1;
}
.cr-row.cr-now {
  box-shadow: inset 3px 0 0 0 var(--c);
  background: color-mix(in srgb, var(--c) 10%, #0b0718);
}
.cr-pos {
  width: 1.5rem;
  text-align: center;
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--pa-text);
}
.cr-bar {
  display: flex;
  gap: 3px;
}
.cr-bar i {
  width: 22px;
  height: 22px;
  background: #1c1436;
  box-shadow: inset 0 0 0 2px #3a3160;
}
.cr-bar i.lit {
  background: var(--pa-lime);
  box-shadow: inset -3px -3px 0 0 rgba(0, 0, 0, 0.25);
}
.cr-val {
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--c);
}
.cr-ok {
  margin-left: auto;
  font-family: var(--pa-font-body);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--c);
}
@media screen and (prefers-reduced-motion: no-preference) {
  .cr-row.cr-now .cr-bar i.lit {
    animation: cr-fill 0.45s steps(1, end) both;
  }
  .cr-row.cr-now .cr-bar i.lit:nth-child(2) {
    animation-delay: 0.12s;
  }
  .cr-row.cr-now .cr-bar i.lit:nth-child(3) {
    animation-delay: 0.24s;
  }
  .cr-row.cr-now:not(.cr-hit) {
    animation: cr-shake 0.3s steps(3, end) both;
  }
}
@keyframes cr-fill {
  from {
    background: #1c1436;
  }
}
@keyframes cr-shake {
  33% {
    transform: translateX(-4px);
  }
  66% {
    transform: translateX(4px);
  }
}
</style>
