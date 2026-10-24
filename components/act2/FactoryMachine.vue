<script setup lang="ts">
// Пиксельный станок конвейера «Фабрики данных» (уровень 2).
// kind: feeder — бункер-раздатчик сторей, camera — фотобудка, press — пресс-мутатор.
// on — станок запитан (горит), live — сейчас его шаг: играет действие (вспышка, удар пресса).
// Спрайты нарисованы строками: один символ = один пиксель 4×4, «.» — прозрачный.
import { computed } from "vue";

type Kind = "feeder" | "camera" | "press";

const props = withDefaults(
	defineProps<{
		kind: Kind;
		/** цвет подсветки: level — акцент уровня, ok — лайм */
		tone?: "level" | "ok";
		on?: boolean;
		live?: boolean;
	}>(),
	{ tone: "level", on: false, live: false },
);

const PX = 4;

// k — контур, l — светлый металл, m — металл, d — тёмный металл, a — акцент, b — второй акцент,
// g — стекло, w — блик, f — лампа-вспышка, p — поршень (рисуется отдельной группой).
const SPRITES: Record<Kind, string[]> = {
	feeder: [
		"....kkkk..kkkk..kkkk....",
		"....kaak..kbbk..kaak....",
		"....kawk..kbwk..kawk....",
		"....kkkk..kkkk..kkkk....",
		"kkkkkkkkkkkkkkkkkkkkkkkk",
		"klllllllllllllllllllllll",
		"kmmmmmmmmmmmmmmmmmmmmmmk",
		".kmmmaammmmmmmmmmaammmk.",
		"..kmmmmmmmmmmmmmmmmmmk..",
		"...kmmmmmmaaaammmmmmk...",
		"....kmmmmmagwammmmmk....",
		".....kmmmmaaaammmmk.....",
		"......kmmmmmmmmmmk......",
		".......kddddddddk.......",
		"........kmmmmmmk........",
		"........kmmmmmmk........",
		"........kaaaaaak........",
		"........kk....kk........",
		"........kk....kk........",
		"........kk....kk........",
	],
	camera: [
		"...........kk...........",
		"..........kffk..........",
		"..........kffk..........",
		"..kkkkkkkkkkkkkkkkkkkk..",
		"..klllllllllllllllllll..",
		"..klmmmmmmmmmmmmmmmaak..",
		"..klmmmmkkkkkkkkmmmmmk..",
		"..klmmmkggggggggkmmmmk..",
		"..klmmkggwwggggggkmmmk..",
		"..klmmkggwgggggggkmmmk..",
		"..klmmkgggggggggbkmmmk..",
		"..klmmkggggggggbbkmmmk..",
		"..klmmmkggggggggkmmmmk..",
		"..klmmmmkkkkkkkkmmmmmk..",
		"..kddddddddddddddddddk..",
		"..kkkkkkkkkkkkkkkkkkkk..",
		"...kdk............kdk...",
		"...kdk............kdk...",
		"...kak............kak...",
		"...kdk............kdk...",
	],
	press: [
		"kkkkkkkkkkkkkkkkkkkkkkkk",
		"klllllllllllllllllllllll",
		"kmmaammmmmmmmmmmmmmaammk",
		"kddddddddddddddddddddddk",
		"kkkkkkkkkkkkkkkkkkkkkkkk",
		"kmk..................kmk",
		"kmk..................kmk",
		"kak..................kak",
		"kmk..................kmk",
		"kmk..................kmk",
		"kmk..................kmk",
		"kak..................kak",
		"kmk..................kmk",
		"kmk..................kmk",
		"kmk..................kmk",
		"kak..................kak",
		"kmk..................kmk",
		"kmk..................kmk",
		"kmk..................kmk",
		"kdk..................kdk",
	],
};

// поршень пресса: шток и боёк
const PISTON = [
	"........kllk........",
	"........kmmk........",
	"........kmmk........",
	"........kmmk........",
	"..kkkkkkkkkkkkkkkk..",
	"..kaaaaaaaaaaaaaak..",
	"..kmmmmmmmmmmmmmmk..",
	"..kddddddddddddddk..",
	"..kkkkkkkkkkkkkkkk..",
];

interface Run {
	x: number;
	y: number;
	w: number;
	c: string;
}

// склеиваем подряд идущие пиксели одного цвета в один rect
function runs(rows: string[], dx = 0, dy = 0): Run[] {
	const out: Run[] = [];
	rows.forEach((row, y) => {
		let x = 0;
		while (x < row.length) {
			const c = row[x];
			let w = 1;
			while (x + w < row.length && row[x + w] === c) w++;
			if (c !== ".") out.push({ x: x + dx, y: y + dy, w, c });
			x += w;
		}
	});
	return out;
}

const body = computed(() => runs(SPRITES[props.kind]));
const piston = computed(() => (props.kind === "press" ? runs(PISTON, 2, 4) : []));
const W = 24;
const H = 20;
</script>

<template>
  <div
    class="factory-machine"
    :class="[`fm-${props.kind}`, `fm-${props.tone}`, { 'fm-on': props.on, 'fm-live': props.live }]"
    aria-hidden="true"
  >
    <svg
      :viewBox="`0 0 ${W * PX} ${H * PX}`"
      :width="W * PX"
      :height="H * PX"
      shape-rendering="crispEdges"
    >
      <g class="fm-body">
        <rect
          v-for="(r, i) in body"
          :key="i"
          :class="`c-${r.c}`"
          :x="r.x * PX"
          :y="r.y * PX"
          :width="r.w * PX"
          :height="PX"
        />
      </g>
      <g v-if="piston.length" class="fm-piston">
        <rect
          v-for="(r, i) in piston"
          :key="`p${i}`"
          :class="`c-${r.c}`"
          :x="r.x * PX"
          :y="r.y * PX"
          :width="r.w * PX"
          :height="PX"
        />
      </g>
    </svg>
    <!-- вспышка фотобудки: конус света вниз на ленту -->
    <span v-if="props.kind === 'camera'" class="fm-flash" />
    <!-- искры пресса -->
    <span v-if="props.kind === 'press'" class="fm-sparks">
      <i v-for="n in 8" :key="n" :style="{ '--i': n }" />
    </span>
  </div>
</template>

<style scoped>
.factory-machine {
  --fm-a: #4a4266;
  --fm-b: #3d3658;
  --fm-glow: transparent;
  position: relative;
  width: 96px;
  height: 80px;
  transition: filter 0.3s steps(3);
}
.fm-on {
  --fm-a: var(--lvl-accent);
  --fm-b: var(--lvl-accent2);
  --fm-glow: color-mix(in srgb, var(--lvl-accent) 55%, transparent);
  filter: drop-shadow(0 0 0.5rem var(--fm-glow));
}
.fm-on.fm-ok {
  --fm-a: var(--pa-lime);
  --fm-glow: rgba(157, 255, 62, 0.5);
}
svg {
  display: block;
  overflow: visible;
}
.c-k { fill: #07040f; }
.c-l { fill: #6d6496; }
.c-m { fill: #3a3160; }
.c-d { fill: #241c42; }
.c-a { fill: var(--fm-a); }
.c-b { fill: var(--fm-b); }
.c-g { fill: #1b3a4f; }
.c-w { fill: #7d74a8; }
.c-f { fill: #4a4266; }
.fm-on .c-l { fill: #8f86c4; }
.fm-on .c-m { fill: #4b4080; }
.fm-on .c-g { fill: #1e6f86; }
.fm-on .c-w { fill: #e9f9ff; }
.fm-on .c-f { fill: #fff6c2; }

/* ---------- действие на своём шаге ---------- */
.fm-flash {
  position: absolute;
  left: 50%;
  top: 60px;
  width: 88px;
  height: 64px;
  transform: translateX(-50%);
  clip-path: polygon(30% 0, 70% 0, 100% 100%, 0 100%);
  background: linear-gradient(#fffbe0, color-mix(in srgb, var(--fm-a) 40%, transparent));
  opacity: 0;
  pointer-events: none;
}
.fm-live .fm-flash {
  animation: fm-flash 1.8s steps(1, end) 0.25s infinite;
}
.fm-live .c-f {
  animation: fm-bulb 1.8s steps(1, end) 0.25s infinite;
}
@keyframes fm-flash {
  0% { opacity: 0.85; }
  6% { opacity: 0.45; }
  12%, 100% { opacity: 0; }
}
@keyframes fm-bulb {
  0% { fill: #ffffff; }
  12%, 100% { fill: #fff6c2; }
}

.fm-piston {
  transform: translateY(0);
}
.fm-live .fm-piston {
  animation: fm-stamp 1.2s steps(6, end) infinite;
}
@keyframes fm-stamp {
  0%, 30% { transform: translateY(0); }
  50%, 62% { transform: translateY(28px); }
  100% { transform: translateY(0); }
}

.fm-sparks {
  position: absolute;
  left: 50%;
  top: 74px;
  pointer-events: none;
}
.fm-sparks i {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--pa-yellow);
  box-shadow: 0 0 6px var(--pa-orange);
  opacity: 0;
}
.fm-live .fm-sparks i {
  animation: fm-spark 1.2s steps(4, end) infinite;
  animation-delay: calc(0.6s + var(--i) * 0.01s);
}
.fm-sparks i:nth-child(odd) { background: var(--pa-orange); }
@keyframes fm-spark {
  0%, 4% { opacity: 1; transform: translate(0, 0); }
  40% {
    opacity: 1;
    transform: translate(calc((var(--i) - 4.5) * 9px), calc(-14px - var(--i) * 2px));
  }
  60%, 100% {
    opacity: 0;
    transform: translate(calc((var(--i) - 4.5) * 13px), 6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fm-live .fm-flash,
  .fm-live .c-f,
  .fm-live .fm-piston,
  .fm-live .fm-sparks i {
    animation: none;
  }
}
@media print {
  .fm-live .fm-flash,
  .fm-live .c-f,
  .fm-live .fm-piston,
  .fm-live .fm-sparks i {
    animation: none;
  }
}
</style>
