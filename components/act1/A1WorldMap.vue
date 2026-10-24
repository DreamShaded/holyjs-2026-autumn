<script setup lang="ts">
// Карта мира на стартовом экране: девять узлов-уровней доклада (0–8) на пунктирной тропе,
// как карта уровней в аркаде. Узел 0 — «вы здесь», мигает; цвета узлов берутся из реестра уровней,
// поэтому карта всегда совпадает с HUD. Чисто декоративная (aria-hidden), текст слайда не меняет.
import { LEVELS } from "../levels";

const nodes = LEVELS.map((l) => ({ n: l.n, accent: l.accent, name: l.name }));
</script>

<template>
  <div class="a1-map" aria-hidden="true">
    <span class="a1-map__lbl">WORLD</span>
    <ol class="a1-map__path">
      <li
        v-for="node in nodes"
        :key="node.n"
        class="a1-map__node"
        :class="{ 'is-here': node.n === 0 }"
        :style="{ '--node': node.accent, '--i': node.n }"
      >
        {{ node.n }}
      </li>
    </ol>
  </div>
</template>

<style scoped>
.a1-map {
  position: absolute;
  left: 3.5rem;
  right: 3.5rem;
  bottom: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: none;
}
.a1-map__lbl {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text-dim);
}
.a1-map__path {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  /* тропа между узлами: пиксельный пунктир */
  background: repeating-linear-gradient(90deg, #6b5fa0 0 6px, transparent 6px 12px) center / 100% 3px no-repeat;
}
.a1-map__node {
  position: relative;
  width: 1.75rem;
  height: 1.75rem;
  margin: 0;
  padding: 0;
  display: grid;
  place-items: center;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--node);
  box-shadow:
    0 0 0 3px #07040f,
    0 0 0.6rem color-mix(in srgb, var(--node) 70%, transparent);
  /* узлы зажигаются по очереди при показе титула */
  animation: a1-node-in 0.3s steps(3, end) both;
  animation-delay: calc(var(--i) * 70ms);
}
.a1-map__node::before {
  display: none;
}
.a1-map__node.is-here {
  color: #fff;
  background: #07040f;
  box-shadow:
    0 0 0 3px var(--node),
    0 0 0.8rem var(--node);
  animation:
    a1-node-in 0.3s steps(3, end) both,
    a1-here 0.9s steps(1, end) 0.3s infinite;
}
@keyframes a1-node-in {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes a1-here {
  0%,
  55% {
    box-shadow:
      0 0 0 3px var(--node),
      0 0 0.8rem var(--node);
  }
  56%,
  100% {
    box-shadow:
      0 0 0 3px #07040f,
      0 0 0 6px var(--node);
  }
}
@media (prefers-reduced-motion: reduce) {
  .a1-map__node,
  .a1-map__node.is-here {
    animation: none;
  }
}
</style>
