<script setup lang="ts">
// Тензор окошка как стопка из семи пиксельных плёнок (изометрия на 2D-трансформах, без 3D).
// Плёнки 1–3 — R, G, B эталона, 4–6 — R, G, B рендера (буква сдвинута: сломали letter-spacing),
// 7 — маска диффа. По шагу нужные плёнки выезжают из стопки и загораются:
// step 1 → 1–3, step 2 → 4–6, step 3 → 7. Подписи размеров (64, 64, 7) — слоты: текст слайда.
import { computed } from "vue";

const props = defineProps<{ step: number }>();

const N = 8; // клеток на сторону плёнки (символически вместо 64)
// буква «A» 8×8; в рендере та же буква сдвинута на клетку вправо
const GLYPH = ["..####..", ".##..##.", ".##..##.", ".######.", ".##..##.", ".##..##.", ".##..##.", "........"];
const ink = (x: number, y: number, dx: number) => {
	const sx = x - dx;
	return sx >= 0 && sx < N && GLYPH[y][sx] === "#";
};

type Film = { ch: string; tone: string; cells: { x: number; y: number; on: boolean }[] };
const tones = ["r", "g", "b"];
const films = computed<Film[]>(() => {
	const out: Film[] = [];
	for (let f = 0; f < 7; f++) {
		const cells = [];
		for (let y = 0; y < N; y++) {
			for (let x = 0; x < N; x++) {
				let on: boolean;
				if (f < 3) on = ink(x, y, 0);
				else if (f < 6) on = ink(x, y, 1);
				else on = ink(x, y, 0) !== ink(x, y, 1);
				cells.push({ x, y, on });
			}
		}
		out.push({ ch: String(f + 1), tone: f < 6 ? tones[f % 3] : "m", cells });
	}
	return out;
});

const hot = (i: number) =>
	(props.step === 1 && i < 3) || (props.step === 2 && i >= 3 && i < 6) || (props.step === 3 && i === 6);
const CELL = 18; // px на клетку до изометрии
</script>

<template>
  <div class="t5-tensor" :class="{ active: step >= 1 }">
    <div class="ts-stack">
      <div
        v-for="(f, i) in films"
        :key="i"
        class="ts-film"
        :class="[`tone-${f.tone}`, { hot: hot(i) }]"
        :style="{ '--i': i }"
      >
        <div class="ts-iso">
          <svg :viewBox="`0 0 ${N} ${N}`" :width="N * CELL" :height="N * CELL" shape-rendering="crispEdges" aria-hidden="true">
            <rect v-for="(c, k) in f.cells" :key="k" :x="c.x" :y="c.y" width="1" height="1" :class="c.on ? 'ts-ink' : 'ts-bg'" />
          </svg>
        </div>
        <span class="ts-ch" aria-hidden="true">CH{{ f.ch }}</span>
      </div>
    </div>
    <div class="ts-dim ts-w"><slot name="w" /></div>
    <div class="ts-dim ts-h"><slot name="h" /></div>
    <div class="ts-dim ts-d"><slot name="d" /></div>
    <div class="ts-depth" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* сторона плёнки S = 8 клеток × 18px = 144px; после изометрии ромб D×H ≈ 204×118 */
.t5-tensor {
  --s: 144px;
  --d: 204px;
  --gap: 31px;
  position: relative;
  width: 360px;
  height: 352px;
}
.ts-stack {
  position: absolute;
  left: 34px;
  top: 0;
  width: var(--d);
  height: 100%;
}
.ts-film {
  position: absolute;
  left: 0;
  /* плёнка 1 внизу стопки, маска (7) сверху */
  top: calc(6 * var(--gap) - var(--i) * var(--gap));
  width: var(--d);
  height: var(--s);
  transition: transform 0.4s steps(4, end), filter 0.4s steps(4, end), opacity 0.4s steps(4, end);
}
.ts-iso {
  position: absolute;
  left: calc((var(--d) - var(--s)) / 2);
  top: 0;
  width: var(--s);
  height: var(--s);
  /* поворот на 45° и сжатие по вертикали = изометрическая «плёнка», лежащая в стопке */
  transform: scaleY(0.577) rotate(45deg);
  transform-origin: 50% 50%;
}
.ts-iso svg {
  display: block;
  outline: 2px solid rgba(242, 236, 255, 0.55);
}
.tone-r { --ink: #5a0f1c; --bg: #ff4d6d; }
.tone-g { --ink: #12400a; --bg: #9dff3e; }
.tone-b { --ink: #0c1f5c; --bg: #5d8dff; }
.tone-m { --ink: #0b0718; --bg: #0b0718; --mask: #f2ecff; }
.ts-bg { fill: var(--bg); }
.ts-ink { fill: var(--ink); }
.tone-m .ts-ink { fill: var(--mask); }
.ts-film { opacity: 0.55; filter: saturate(0.55) brightness(0.75); }
.t5-tensor.active .ts-film { opacity: 0.3; filter: saturate(0.3) brightness(0.55); }
/* выбранные плёнки выезжают вправо из стопки и горят */
.t5-tensor .ts-film.hot {
  opacity: 1;
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--bg) 70%, transparent));
  transform: translateX(86px);
}
.t5-tensor .tone-m.hot { filter: drop-shadow(0 0 8px rgba(242, 236, 255, 0.7)); }
.ts-ch {
  position: absolute;
  right: -40px;
  top: 64px;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text);
  opacity: 0;
  transition: opacity 0.3s steps(2, end);
}
.ts-film.hot .ts-ch { opacity: 1; }
/* подписи размеров стопки */
.ts-dim {
  position: absolute;
  font-family: var(--pa-font-display);
  font-size: 1.125rem;
  line-height: 1;
  color: var(--pa-cyan);
  text-shadow: 0 0 0.5rem rgba(62, 240, 255, 0.6);
}
.ts-w { left: 62px; top: 322px; }
.ts-h { left: 218px; top: 322px; }
.ts-d { left: 0; top: 168px; }
/* отметка высоты стопки (7 плёнок) */
.ts-depth {
  position: absolute;
  left: 24px;
  top: 72px;
  width: 4px;
  height: 186px;
  background: repeating-linear-gradient(180deg, var(--pa-cyan) 0 6px, transparent 6px 10px);
  opacity: 0.7;
}
@media (prefers-reduced-motion: reduce) {
  .ts-film, .ts-ch { transition: none; }
}
</style>
