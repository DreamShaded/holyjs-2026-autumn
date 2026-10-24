<template>
  <div class="whoami">
    <div class="whoami__frame">
      <img
        v-if="currentSrc"
        :key="currentSrc"
        :src="currentSrc"
        :alt="alt"
        class="whoami__img"
      />
      <!-- пиксельная «мозаика» при смене кадра: рисуется поверх фото только во время перехода -->
      <canvas ref="fx" class="whoami__fx" :class="{ 'is-on': fxOn }" aria-hidden="true" />
      <div class="whoami__scan" aria-hidden="true" />
    </div>
    <i class="whoami__corner whoami__corner--tl" aria-hidden="true" />
    <i class="whoami__corner whoami__corner--tr" aria-hidden="true" />
    <i class="whoami__corner whoami__corner--bl" aria-hidden="true" />
    <i class="whoami__corner whoami__corner--br" aria-hidden="true" />
  </div>
</template>

<script setup>
// Портрет игрока: слайдшоу фото в пиксельной рамке. Кадры меняются по таймеру intervalMs,
// как в оригинале; вместо плавного затухания — пиксельная мозаика: текущее фото
// «рассыпается» на всё более крупные блоки, затем новое собирается обратно.
// Без анимации (prefers-reduced-motion, печать, не загрузилась картинка) кадр меняется сразу.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
	images: { type: Array, required: true },
	intervalMs: { type: Number, default: 4000 },
	alt: { type: String, default: "Who am I photo" },
});

const intervalMs = computed(() => props.intervalMs);
const alt = computed(() => props.alt);

const index = ref(0);
const hasImages = computed(
	() => Array.isArray(props.images) && props.images.length > 0,
);

function resolveSrc(src) {
	if (!src) return "";
	// внешние URL и data: URL не трогаем
	if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
	const base = import.meta.env?.BASE_URL || "/";
	return src.startsWith("/") ? `${base}${src.slice(1)}` : `${base}${src}`;
}

const resolvedImages = computed(() =>
	hasImages.value ? props.images.map(resolveSrc) : [],
);

const currentSrc = computed(() =>
	hasImages.value
		? resolvedImages.value[index.value % resolvedImages.value.length]
		: "",
);

// ---------- пиксельный переход ----------

/** размеры блока мозаики (в CSS-пикселях кадра) на каждом шаге «рассыпания» */
const MOSAIC_STEPS = [6, 12, 24, 48];
const FRAME_MS = 60;

const fx = ref(null);
const fxOn = ref(false);
/** предзагруженные картинки по src */
const loaded = new Map();
let fxTimer;

function canAnimate() {
	if (typeof window === "undefined") return false;
	if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
	if (window.matchMedia?.("print").matches) return false;
	return true;
}

function ready(img) {
	return Boolean(img && img.complete && img.naturalWidth > 0);
}

/** Рисует картинку с кадрированием «cover» блоками size×size. */
function drawMosaic(ctx, img, w, h, size) {
	const cols = Math.max(1, Math.ceil(w / size));
	const rows = Math.max(1, Math.ceil(h / size));
	// кадрирование как у object-fit: cover по центру
	const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
	const sw = w / scale;
	const sh = h / scale;
	const sx = (img.naturalWidth - sw) / 2;
	const sy = (img.naturalHeight - sh) / 2;
	const small = drawMosaic.buf || (drawMosaic.buf = document.createElement("canvas"));
	small.width = cols;
	small.height = rows;
	const sctx = small.getContext("2d");
	sctx.imageSmoothingEnabled = true;
	sctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, w, h);
	ctx.drawImage(small, 0, 0, cols, rows, 0, 0, cols * size, rows * size);
}

function stopFx() {
	if (fxTimer) {
		clearTimeout(fxTimer);
		fxTimer = undefined;
	}
	fxOn.value = false;
}

/** Смена кадра на nextIndex: мозаика текущего → подмена → мозаика нового. */
function switchTo(nextIndex) {
	const canvas = fx.value;
	const from = loaded.get(currentSrc.value);
	const to = loaded.get(resolvedImages.value[nextIndex % resolvedImages.value.length]);
	if (!canvas || !canAnimate() || !ready(from) || !ready(to)) {
		stopFx();
		index.value = nextIndex;
		return;
	}
	const w = canvas.clientWidth;
	const h = canvas.clientHeight;
	const ctx = canvas.getContext("2d");
	if (!ctx || w === 0 || h === 0) {
		index.value = nextIndex;
		return;
	}
	canvas.width = w;
	canvas.height = h;
	const frames = [
		...MOSAIC_STEPS.map((size) => ({ img: from, size })),
		...[...MOSAIC_STEPS].reverse().map((size) => ({ img: to, size })),
	];
	stopFx();
	fxOn.value = true;
	let k = 0;
	const tick = () => {
		try {
			if (k === MOSAIC_STEPS.length) index.value = nextIndex;
			if (k >= frames.length) {
				fxOn.value = false;
				fxTimer = undefined;
				return;
			}
			drawMosaic(ctx, frames[k].img, w, h, frames[k].size);
			k++;
			fxTimer = setTimeout(tick, FRAME_MS);
		} catch {
			// эффект декоративный: при любой ошибке просто показываем новый кадр
			stopFx();
			index.value = nextIndex;
		}
	};
	tick();
}

let timer;

function next() {
	if (!hasImages.value) return;
	switchTo((index.value + 1) % props.images.length);
}

function start() {
	stop();
	if (!hasImages.value) return;
	// предзагрузка всех кадров: нужны и для показа, и для мозаики
	resolvedImages.value.forEach((src) => {
		if (loaded.has(src)) return;
		const img = new Image();
		img.src = src;
		loaded.set(src, img);
	});
	timer = window.setInterval(next, intervalMs.value);
}

function stop() {
	if (timer) {
		clearInterval(timer);
		timer = undefined;
	}
	stopFx();
}

onMounted(start);
onBeforeUnmount(stop);
watch(intervalMs, start);
watch(
	() => props.images,
	() => {
		index.value = 0;
		start();
	},
);
</script>

<style scoped>
.whoami {
  --wa-frame: var(--lvl-accent, #3ef0ff);
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 6px;
  background: #07040f;
  /* пиксельная рамка: внешний контур цвета уровня + свечение */
  box-shadow:
    0 -4px 0 0 var(--wa-frame),
    0 4px 0 0 var(--wa-frame),
    -4px 0 0 0 var(--wa-frame),
    4px 0 0 0 var(--wa-frame),
    0 0 22px 2px color-mix(in srgb, var(--wa-frame) 45%, transparent);
}

.whoami__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* квадратное кадрирование */
  overflow: hidden;
}

.whoami__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.whoami__fx {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  opacity: 0;
  pointer-events: none;
}
.whoami__fx.is-on {
  opacity: 1;
}

/* лёгкие сканлайны и пиксельная сетка экрана */
.whoami__scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(0deg, rgba(7, 4, 15, 0.16) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse at center, transparent 60%, rgba(7, 4, 15, 0.45) 100%);
}

/* ступенчатые уголки поверх рамки, как у аркадного портрета */
.whoami__corner {
  position: absolute;
  width: 18px;
  height: 18px;
  background:
    linear-gradient(var(--pa-text, #f2ecff), var(--pa-text, #f2ecff)) top left / 18px 6px no-repeat,
    linear-gradient(var(--pa-text, #f2ecff), var(--pa-text, #f2ecff)) top left / 6px 18px no-repeat;
}
.whoami__corner--tl {
  top: -10px;
  left: -10px;
}
.whoami__corner--tr {
  top: -10px;
  right: -10px;
  transform: scaleX(-1);
}
.whoami__corner--bl {
  bottom: -10px;
  left: -10px;
  transform: scaleY(-1);
}
.whoami__corner--br {
  bottom: -10px;
  right: -10px;
  transform: scale(-1, -1);
}

/* табличка игрока: декоративная, в псевдоэлементе, текст слайда не меняет */
.whoami::after {
  content: "PLAYER 1";
  position: absolute;
  left: 18px;
  bottom: -14px;
  padding: 0.3rem 0.5rem;
  font-family: var(--pa-font-display, monospace);
  font-size: 1rem;
  line-height: 1;
  color: #07040f;
  background: var(--wa-frame);
  box-shadow:
    0 -3px 0 0 var(--wa-frame),
    0 3px 0 0 var(--wa-frame),
    -3px 0 0 0 var(--wa-frame),
    3px 0 0 0 var(--wa-frame),
    0.375rem 0.375rem 0 0 rgba(0, 0, 0, 0.55);
}
</style>
