<script setup lang="ts">
// HUD аркады над слайдом: уровень и его название, пиксельная полоса прогресса по слайдам
// (пройденные клетки окрашены цветом своего уровня), SCORE = номер слайда с ведущими нулями.
// Высота 2.25rem; на титуле (уровень 0) не показывается.
import { computed } from "vue";
import { getLevel, levelVars } from "./levels";

const props = defineProps<{
	level: number;
	page: number;
	total: number;
	/** уровень каждого показываемого слайда по порядку */
	slideLevels: (number | null)[];
}>();

const info = computed(() => getLevel(props.level));
const score = computed(() => String(props.page).padStart(6, "0"));
const cells = computed(() =>
	props.slideLevels.map((lv, i) => {
		const no = i + 1;
		const prev = i > 0 ? props.slideLevels[i - 1] : lv;
		return {
			no,
			state: no < props.page ? "done" : no === props.page ? "now" : "todo",
			color: getLevel(lv ?? 0).accent,
			gap: prev !== lv,
		};
	}),
);
</script>

<template>
  <div class="hud" :style="levelVars(props.level)" aria-hidden="true">
    <div class="hud-lvl">
      <span class="hud-tag">LVL</span>
      <span class="hud-num">{{ info.n }}</span>
      <span class="hud-name">{{ info.name }}</span>
    </div>
    <div class="hud-bar">
      <i
        v-for="c in cells"
        :key="c.no"
        class="hud-cell"
        :class="[c.state, { gap: c.gap }]"
        :style="{ '--cell': c.color }"
      />
    </div>
    <div class="hud-score">
      <span class="hud-lives">
        <svg v-for="h in 3" :key="h" viewBox="0 0 7 6" class="hud-heart" shape-rendering="crispEdges">
          <path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" />
        </svg>
      </span>
      <span class="hud-tag">SCORE</span>
      <span class="hud-digits">{{ score }}</span>
    </div>
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.25rem;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  z-index: 20;
  pointer-events: none;
  color: var(--pa-text);
  background: linear-gradient(180deg, rgba(7, 4, 15, 0.94), rgba(12, 7, 26, 0.86));
  /* пиксельный «пунктир» снизу цветом уровня */
  border-bottom: 3px solid transparent;
  border-image: repeating-linear-gradient(90deg, var(--lvl-accent) 0 6px, transparent 6px 9px) 3;
}
.hud-lvl,
.hud-score {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  flex: none;
}
.hud-tag {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-text-dim);
}
.hud-num {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--lvl-accent);
  text-shadow: 0 0 6px var(--lvl-accent);
}
.hud-name {
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.375rem;
  line-height: 1;
  letter-spacing: 0.03em;
  color: var(--pa-text);
}
.hud-name::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.6rem;
  vertical-align: 0.2em;
  background: var(--lvl-accent);
  box-shadow: 0 0 6px var(--lvl-accent);
}
.hud-digits {
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1;
  color: var(--pa-yellow);
  text-shadow: 2px 2px 0 rgba(255, 62, 207, 0.55);
}
.hud-bar {
  flex: 1;
  display: flex;
  gap: 2px;
  height: 12px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.55);
  box-shadow:
    0 -2px 0 0 #2a2346,
    0 2px 0 0 #2a2346,
    -2px 0 0 0 #2a2346,
    2px 0 0 0 #2a2346;
}
.hud-cell {
  flex: 1;
  height: 100%;
  background: #1c1730;
}
.hud-cell.gap {
  margin-left: 3px;
}
.hud-cell.done {
  background: var(--cell);
  opacity: 0.8;
}
.hud-cell.now {
  background: #fff;
  box-shadow: 0 0 6px var(--lvl-accent);
  animation: hud-blink 1s steps(2, jump-none) infinite;
}
.hud-lives {
  display: flex;
  gap: 3px;
  margin-right: 0.4rem;
}
.hud-heart {
  width: 14px;
  height: 12px;
  fill: var(--pa-red);
  filter: drop-shadow(0 0 3px rgba(255, 77, 109, 0.6));
}
@keyframes hud-blink {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hud-cell.now {
    animation: none;
  }
}
@media print {
  .hud-cell.now {
    animation: none;
  }
}
</style>
