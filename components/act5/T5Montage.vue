<script setup lang="ts">
// Сплэш уровня 5: «тренировочный монтаж». Робот-сеть качает гантель, шкала опыта
// набирается по эпохам и на заполнении вспыхивает LEVEL UP. Декорация, текста доклада нет.
import T5Bot from "./T5Bot.vue";
</script>

<template>
  <div class="t5-montage" aria-hidden="true">
    <div class="mt-bench">
      <T5Bot pose="lift" :cell="4" />
      <div class="mt-mat" />
    </div>
    <div class="mt-xp">
      <div class="mt-row">
        <span class="mt-lbl">EXP</span>
        <span class="mt-ep">EPOCH <b class="mt-cnt" /></span>
      </div>
      <div class="mt-bar">
        <i class="mt-fill" />
      </div>
    </div>
    <div class="mt-lv">
      <span class="mt-up">LEVEL UP!</span>
    </div>
  </div>
</template>

<style scoped>
.t5-montage {
  --cycle: 4s;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.1rem;
}
.mt-bench {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mt-mat {
  width: 76px;
  height: 6px;
  margin-top: 2px;
  background: repeating-linear-gradient(90deg, #3a3160 0 6px, #241c42 6px 12px);
  box-shadow: 0 0 0 2px #07040f;
}
.mt-xp {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;
}
.mt-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--pa-font-pixel);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--pa-text-dim);
}
.mt-lbl { color: var(--lvl-accent2); }
/* счётчик эпох: цифры из content, сменяются вместе с клетками шкалы */
.mt-cnt::after {
  content: "01";
  color: var(--pa-text);
  animation: mt-count var(--cycle) steps(1, end) infinite;
}
@keyframes mt-count {
  0% { content: "01"; }
  20% { content: "02"; }
  40% { content: "03"; }
  60% { content: "04"; }
  80% { content: "05"; }
}
.mt-bar {
  position: relative;
  width: 260px;
  height: 26px;
  /* 20 пустых клеток шкалы */
  background:
    repeating-linear-gradient(90deg, #241c40 0 10px, #0b0718 10px 13px) 4px 4px / 257px 18px no-repeat,
    #0b0718;
  box-shadow: 0 0 0 3px #3a3160, 0 0 0 6px #07040f;
}
/* заливка опыта: растёт клетками за 80 % цикла, затем держится и сбрасывается */
.mt-fill {
  position: absolute;
  left: 4px;
  top: 4px;
  height: 18px;
  width: 0;
  background: repeating-linear-gradient(90deg, var(--lvl-accent) 0 10px, transparent 10px 13px);
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--lvl-accent) 70%, transparent));
  animation: mt-grow var(--cycle) infinite;
}
@keyframes mt-grow {
  0% { width: 0; animation-timing-function: steps(20, end); }
  80% { width: 257px; animation-timing-function: steps(1, end); }
  100% { width: 257px; }
}
.mt-lv {
  width: 9.5rem;
  padding-bottom: 6px;
}
.mt-up {
  display: inline-block;
  font-family: var(--pa-font-display);
  font-size: 1rem;
  line-height: 1.2;
  color: var(--pa-yellow);
  text-shadow: 0.15rem 0.15rem 0 #7a2a6a, 0 0 0.6rem rgba(255, 225, 62, 0.7);
  animation: mt-flash var(--cycle) steps(1, end) infinite;
}
@keyframes mt-flash {
  0%, 83% { opacity: 0; transform: translateY(4px); }
  84% { opacity: 1; transform: none; }
  88% { opacity: 0.2; }
  92% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .t5-montage * { animation: none !important; }
}
@media print {
  .t5-montage * { animation: none !important; }
}
</style>
