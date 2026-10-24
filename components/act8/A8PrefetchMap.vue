<script setup lang="ts">
// Квест «следующий экран»: карта экранов как карта уровней.
// Пройденный путь главная → каталог → товар подсвечен циан, модель ставит на «корзину»:
// узел светится жёлтым и заранее грузится (полоска PRELOAD заполняется ступеньками).
// «Поиск» — менее вероятная ветка, приглушена пунктиром. Декоративный (aria-hidden).
type Node = { id: string; label: string; x: number; y: number; state: "done" | "next" | "alt" };

const W = 86;
const H = 50;
const nodes: Node[] = [
	{ id: "home", label: "главная", x: 4, y: 20, state: "done" },
	{ id: "cat", label: "каталог", x: 106, y: 20, state: "done" },
	{ id: "item", label: "товар", x: 208, y: 20, state: "done" },
	{ id: "cart", label: "корзина", x: 310, y: 20, state: "next" },
	{ id: "search", label: "поиск", x: 208, y: 112, state: "alt" },
];
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const edges: Array<[string, string, Node["state"]]> = [
	["home", "cat", "done"],
	["cat", "item", "done"],
	["item", "cart", "next"],
	["cat", "search", "alt"],
];
</script>

<template>
  <svg class="a8-map" viewBox="0 0 400 180" aria-hidden="true">
    <g class="edges">
      <template v-for="([a, b, st], i) in edges" :key="i">
        <line
          v-if="byId[a].y === byId[b].y"
          :class="st"
          :x1="byId[a].x + W"
          :y1="byId[a].y + H / 2"
          :x2="byId[b].x"
          :y2="byId[b].y + H / 2"
        />
        <polyline
          v-else
          :class="st"
          :points="`${byId[a].x + W / 2},${byId[a].y + H} ${byId[a].x + W / 2},${byId[b].y + H / 2} ${byId[b].x},${byId[b].y + H / 2}`"
          fill="none"
        />
      </template>
    </g>

    <g v-for="n in nodes" :key="n.id" class="node" :class="n.state">
      <rect :x="n.x" :y="n.y" :width="W" :height="H" />
      <!-- полоска заголовка окна -->
      <rect :x="n.x" :y="n.y" :width="W" height="8" class="bar" />
      <text :x="n.x + W / 2" :y="n.y + 36">{{ n.label }}</text>
    </g>

    <!-- предзагрузка «корзины» -->
    <g class="preload">
      <text x="310" y="94" class="pl-tag">PRELOAD</text>
      <rect x="310" y="102" :width="W" height="12" class="pl-track" />
      <rect x="312" y="104" :width="W - 4" height="8" class="pl-fill" />
    </g>
  </svg>
</template>

<style scoped>
.a8-map {
  display: block;
  width: 100%;
  height: auto;
  shape-rendering: crispEdges;
}
.edges line,
.edges polyline {
  stroke-width: 4;
}
.edges .done { stroke: var(--pa-cyan); }
.edges .next {
  stroke: var(--pa-yellow);
  stroke-dasharray: 8 6;
  animation: a8-flow 0.6s steps(2, end) infinite;
}
.edges .alt {
  stroke: #3a3160;
  stroke-dasharray: 4 6;
}
@keyframes a8-flow {
  to { stroke-dashoffset: -14; }
}
.node rect {
  fill: #100a22;
  stroke-width: 3;
}
.node text {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 18px;
  text-anchor: middle;
}
.node.done rect { stroke: var(--pa-cyan); }
.node.done .bar { fill: var(--pa-cyan); }
.node.done text { fill: var(--pa-text); }
.node.next rect {
  stroke: var(--pa-yellow);
  filter: drop-shadow(0 0 6px rgba(255, 225, 62, 0.7));
}
.node.next .bar { fill: var(--pa-yellow); }
.node.next text { fill: var(--pa-yellow); }
.node.alt rect { stroke: #3a3160; }
.node.alt .bar { fill: #3a3160; }
.node.alt text { fill: var(--pa-text-dim); }
.pl-tag {
  font-family: var(--pa-font-pixel);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.08em;
  fill: var(--pa-yellow);
}
.pl-track {
  fill: none;
  stroke: var(--pa-yellow);
  stroke-width: 2;
}
.pl-fill {
  fill: var(--pa-yellow);
  transform-origin: 312px 0;
  animation: a8-load 2.4s steps(8, end) infinite;
}
@keyframes a8-load {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce), print {
  .edges .next, .pl-fill { animation: none; }
}
</style>
