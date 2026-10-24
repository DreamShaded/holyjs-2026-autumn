<script setup lang="ts">
// Квест «человек или бот»: две траектории курсора на пиксельной сетке.
// Человек — лаймовая волна с дрожанием и неровным шагом; бот — красные прямые отрезки
// с ровным шагом и «телепортом» (разрыв). Точки проявляются по очереди (steps), курсор
// мигает в конце. Координаты в клетках по 6px, viewBox 1:1 с пикселями слайда.
// Декоративный (aria-hidden), подписи HUMAN/BOT — короткая латиница.
const CELL = 6;

// детерминированный «шум», чтобы рисунок не прыгал между прогонами
function noise(i: number): number {
	const v = Math.sin(i * 12.9898) * 43758.5453;
	return v - Math.floor(v) - 0.5;
}

// человек: плавная волна по x, шаг то короче, то длиннее, вертикальное дрожание
const human: Array<[number, number]> = [];
{
	let x = 2;
	for (let i = 0; x < 60; i++) {
		const y = 8 + Math.round(3.2 * Math.sin(x / 7) + noise(i) * 1.6);
		human.push([x, y]);
		x += 1 + (noise(i + 99) > 0.15 ? 1 : 0);
	}
}

// бот: вправо по прямой, ровно вниз, «телепорт», снова вправо — шаг строго одинаковый
const bot: Array<[number, number]> = [];
for (let x = 2; x <= 26; x += 2) bot.push([x, 21]);
for (let y = 22; y <= 26; y += 2) bot.push([26, y]);
for (let x = 38; x <= 60; x += 2) bot.push([x, 26]);
</script>

<template>
  <svg class="a8-trails" viewBox="0 0 400 180" aria-hidden="true">
    <defs>
      <pattern id="a8-grid" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="none" stroke="#3a3160" stroke-width="1" />
      </pattern>
    </defs>
    <rect width="400" height="180" fill="url(#a8-grid)" opacity="0.5" />

    <g class="human">
      <rect
        v-for="([x, y], i) in human"
        :key="`h${i}`"
        :x="x * CELL"
        :y="y * CELL"
        :width="CELL"
        :height="CELL"
        :style="{ '--d': `${i * 30}ms` }"
      />
      <text x="12" y="22" class="tag">HUMAN</text>
    </g>

    <g class="bot">
      <rect
        v-for="([x, y], i) in bot"
        :key="`b${i}`"
        :x="x * CELL"
        :y="y * CELL"
        :width="CELL"
        :height="CELL"
        :style="{ '--d': `${i * 30}ms` }"
      />
      <!-- «телепорт»: курсор исчез здесь и появился через 12 клеток -->
      <rect class="warp" :x="27 * CELL" :y="26 * CELL" :width="10 * CELL" height="2" />
      <text x="12" y="118" class="tag">BOT</text>
    </g>

    <!-- курсоры-стрелки в конце траекторий -->
    <g class="cursor human-cursor" :transform="`translate(${61 * CELL} ${human[human.length - 1][1] * CELL - 4})`">
      <path d="M0 0h3v3h3v3h3v3h3v3h-6v6h-3z" />
    </g>
    <g class="cursor bot-cursor" :transform="`translate(${61 * CELL} ${26 * CELL - 4})`">
      <path d="M0 0h3v3h3v3h3v3h3v3h-6v6h-3z" />
    </g>
  </svg>
</template>

<style scoped>
.a8-trails {
  display: block;
  width: 100%;
  height: auto;
  shape-rendering: crispEdges;
}
.human rect {
  fill: var(--pa-lime);
}
.bot rect {
  fill: var(--pa-red);
}
.human rect,
.bot rect {
  animation: a8-dot 0.01s linear var(--d) both;
}
.bot .warp {
  fill: none;
  stroke: var(--pa-red);
  stroke-width: 2;
  stroke-dasharray: 4 6;
  opacity: 0.7;
  animation: none;
}
@keyframes a8-dot {
  from { opacity: 0; }
  to { opacity: 1; }
}
.tag {
  font-family: var(--pa-font-display);
  /* svg сжимается до ширины карточки (~0.95), 18px держат ≥16px на слайде */
  font-size: 18px;
}
.human .tag { fill: var(--pa-lime); }
.bot .tag { fill: var(--pa-red); }
.cursor path {
  fill: var(--pa-text);
  stroke: #07040f;
  stroke-width: 1;
}
.cursor {
  animation: a8-cur 1s steps(1, end) infinite;
}
@keyframes a8-cur {
  50% { opacity: 0.25; }
}
@media (prefers-reduced-motion: reduce), print {
  .human rect, .bot rect, .cursor { animation: none; }
}
</style>
