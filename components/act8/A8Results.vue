<script setup lang="ts">
// Таблица результатов после прохождения игры: миры 1–8 доклада, у каждого отметка CLEAR.
// Названия и цвета берутся из реестра уровней, поэтому таблица совпадает с HUD и картой на титуле.
// Чисто декоративная (aria-hidden): текст слайда не меняет.
import { LEVELS } from "../levels";

const worlds = LEVELS.filter((l) => l.n > 0).map((l) => ({ n: l.n, name: l.name, accent: l.accent }));
</script>

<template>
  <div class="a8-res" aria-hidden="true">
    <div class="a8-res__head">RESULTS</div>
    <ol class="a8-res__list">
      <li
        v-for="w in worlds"
        :key="w.n"
        class="a8-res__row"
        :style="{ '--w': w.accent, '--i': w.n }"
      >
        <span class="a8-res__num">{{ w.n }}</span>
        <span class="a8-res__name">{{ w.name }}</span>
        <span class="a8-res__ok">CLEAR</span>
      </li>
    </ol>
    <div class="a8-res__total">
      <span>8/8</span>
      <span class="a8-res__stars"><i /><i /><i /></span>
    </div>
  </div>
</template>

<style scoped>
.a8-res {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.7rem 0.85rem 0.75rem;
  background: rgba(16, 10, 34, 0.86);
  box-shadow:
    0 -3px 0 0 var(--lvl-accent),
    0 3px 0 0 var(--lvl-accent),
    -3px 0 0 0 var(--lvl-accent),
    3px 0 0 0 var(--lvl-accent),
    0 0 1.4rem -0.3rem color-mix(in srgb, var(--lvl-accent) 60%, transparent);
  text-align: left;
}
.a8-res__head {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow: 2px 2px 0 #7a3d00;
}
.a8-res__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.a8-res__row {
  display: grid;
  grid-template-columns: 1.4rem 1fr auto;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.2;
  color: var(--pa-text);
  /* строки «проставляются» по очереди при показе слайда */
  animation: a8-row-in 0.22s steps(3, end) both;
  animation-delay: calc(var(--i) * 50ms);
}
.a8-res__row::before {
  display: none;
}
.a8-res__num {
  display: grid;
  place-items: center;
  height: 1.2rem;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--w);
}
.a8-res__name {
  white-space: nowrap;
  /* пунктир-«отточие» до отметки, как в таблице рекордов */
  background: repeating-linear-gradient(90deg, #4a4078 0 3px, transparent 3px 7px) right 0 bottom 0.25rem / 100% 2px no-repeat;
}
.a8-res__ok {
  font-size: 1.125rem;
  color: var(--pa-lime);
  letter-spacing: 0.06em;
  text-shadow: 0 0 0.5rem color-mix(in srgb, var(--pa-lime) 55%, transparent);
}
.a8-res__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.45rem;
  border-top: 3px solid var(--pa-line);
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-lime);
}
.a8-res__stars {
  display: flex;
  gap: 0.35rem;
}
/* звезда из пикселей: ромб-крест через clip-path */
.a8-res__stars i {
  width: 1rem;
  height: 1rem;
  background: var(--pa-yellow);
  clip-path: polygon(50% 0, 62% 38%, 100% 38%, 69% 60%, 81% 100%, 50% 76%, 19% 100%, 31% 60%, 0 38%, 38% 38%);
  animation: a8-star 1.6s steps(1, end) infinite;
}
.a8-res__stars i:nth-child(2) {
  animation-delay: 0.2s;
}
.a8-res__stars i:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes a8-row-in {
  from {
    opacity: 0;
    transform: translateX(-0.75rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes a8-star {
  0%,
  80% {
    filter: none;
  }
  81%,
  100% {
    filter: brightness(1.6) drop-shadow(0 0 4px #fff3a0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .a8-res__row,
  .a8-res__stars i {
    animation: none;
  }
}
</style>
