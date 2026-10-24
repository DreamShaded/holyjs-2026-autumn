<script setup lang="ts">
// Пиксельный салют победы: несколько вспышек по бокам неба. Каждая вспышка — квадратики
// на окружности, разлетаются через transform и гаснут через opacity (steps, без JS).
// Слой лежит под контентом и не заходит на QR-код: позиции заданы только в боковых полосах.
// Декоративный (aria-hidden).
interface Burst {
	x: string;
	y: string;
	color: string;
	delay: number;
	r: number;
}

const bursts: Burst[] = [
	{ x: "8%", y: "20%", color: "#ff3ecf", delay: 0, r: 2.4 },
	{ x: "27%", y: "13%", color: "#ffe13e", delay: 1.1, r: 2 },
	{ x: "75%", y: "14%", color: "#3ef0ff", delay: 0.55, r: 2.2 },
	{ x: "93%", y: "24%", color: "#9dff3e", delay: 1.7, r: 1.8 },
];

// 12 искр по кругу; смещение каждой — через CSS-переменные
const sparks = Array.from({ length: 12 }, (_, i) => {
	const a = (i / 12) * Math.PI * 2;
	return { i, dx: Math.cos(a).toFixed(3), dy: Math.sin(a).toFixed(3) };
});
</script>

<template>
  <div class="a8-fw" aria-hidden="true">
    <div
      v-for="(b, k) in bursts"
      :key="k"
      class="a8-fw__burst"
      :style="{ left: b.x, top: b.y, '--c': b.color, '--d': `${b.delay}s`, '--r': `${b.r}rem` }"
    >
      <i v-for="s in sparks" :key="s.i" :style="{ '--dx': s.dx, '--dy': s.dy }" />
    </div>
  </div>
</template>

<style scoped>
.a8-fw {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.a8-fw__burst {
  position: absolute;
  width: 0;
  height: 0;
}
.a8-fw__burst i {
  position: absolute;
  left: -3px;
  top: -3px;
  width: 6px;
  height: 6px;
  background: var(--c);
  box-shadow: 0 0 6px var(--c);
  opacity: 0;
  animation: a8-spark 2.4s steps(8, end) infinite;
  animation-delay: var(--d);
}
@keyframes a8-spark {
  0% {
    opacity: 0;
    transform: translate(0, 0);
  }
  8% {
    opacity: 1;
    transform: translate(calc(var(--dx) * var(--r) * 0.3), calc(var(--dy) * var(--r) * 0.3));
  }
  45% {
    opacity: 1;
    transform: translate(calc(var(--dx) * var(--r)), calc(var(--dy) * var(--r) + 0.3rem));
  }
  60%,
  100% {
    opacity: 0;
    transform: translate(calc(var(--dx) * var(--r) * 1.1), calc(var(--dy) * var(--r) + 0.9rem));
  }
}
@media (prefers-reduced-motion: reduce) {
  .a8-fw__burst i {
    animation: none;
    opacity: 0.8;
    transform: translate(calc(var(--dx) * var(--r)), calc(var(--dy) * var(--r)));
  }
}
@media print {
  .a8-fw {
    display: none;
  }
}
</style>
