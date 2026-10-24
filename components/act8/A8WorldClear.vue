<script setup lang="ts">
// Финальная карта мира — пара к карте на титуле (A1WorldMap): те же узлы 0–8 на тропе,
// но все пройдены, тропа сплошная, а на узле 8 поднят флаг. Цвета из реестра уровней.
// Декоративная (aria-hidden).
import { LEVELS } from "../levels";

const nodes = LEVELS.map((l) => ({ n: l.n, accent: l.accent }));
</script>

<template>
  <div class="a8-map" aria-hidden="true">
    <span class="a8-map__lbl">WORLD</span>
    <ol class="a8-map__path">
      <li
        v-for="node in nodes"
        :key="node.n"
        class="a8-map__node"
        :class="{ 'is-goal': node.n === 8 }"
        :style="{ '--node': node.accent, '--i': node.n }"
      >
        {{ node.n }}
        <span v-if="node.n === 8" class="a8-map__flag"><i /></span>
      </li>
    </ol>
    <span class="a8-map__lbl a8-map__clear">ALL CLEAR</span>
  </div>
</template>

<style scoped>
.a8-map {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.a8-map__lbl {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text-dim);
}
.a8-map__clear {
  color: var(--pa-lime);
  text-shadow: 0 0 0.5rem color-mix(in srgb, var(--pa-lime) 55%, transparent);
}
.a8-map__path {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* тропа пройдена: сплошная полоса заливается слева направо при показе */
.a8-map__path::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  margin-top: -1.5px;
  background: linear-gradient(90deg, #3ef0ff, #ff4d6d, #ffe13e, #3ef0ff, #ff9f3e, #ff3ecf, #ffd23e, #9dff3e, #ff7a59);
  transform-origin: left center;
  animation: a8-trail 0.55s steps(9, end) both;
}
.a8-map__node {
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
  animation: a8-node-in 0.24s steps(3, end) both;
  animation-delay: calc(var(--i) * 55ms);
}
.a8-map__node::before {
  display: none;
}
.a8-map__node.is-goal {
  box-shadow:
    0 0 0 3px #07040f,
    0 0 0 6px var(--node),
    0 0 1rem var(--node);
}
/* флажок над последним узлом: древко + полотнище, полотнище «плещется» на 2 кадра */
.a8-map__flag {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 3px);
  width: 3px;
  height: 1.75rem;
  background: #f2ecff;
}
.a8-map__flag i {
  position: absolute;
  left: 3px;
  top: 0;
  width: 1.1rem;
  height: 0.75rem;
  background: var(--pa-lime);
  clip-path: polygon(0 0, 100% 0, 78% 50%, 100% 100%, 0 100%);
  transform-origin: left center;
  animation: a8-flag 0.7s steps(1, end) infinite;
}
@keyframes a8-trail {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes a8-node-in {
  from {
    opacity: 0;
    transform: translateY(-0.4rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes a8-flag {
  0%,
  49% {
    transform: none;
  }
  50%,
  100% {
    transform: scaleX(0.82) skewY(6deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .a8-map__path::before,
  .a8-map__node,
  .a8-map__flag i {
    animation: none;
  }
}
</style>
