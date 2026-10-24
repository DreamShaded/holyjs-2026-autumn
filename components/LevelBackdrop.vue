<script setup lang="ts">
// Фон уровня: процедурная пиксельная сцена на canvas низкого разрешения (245×138 «пикселей»,
// каждый растягивается до 4×4 через image-rendering: pixelated) + затемнение под контентом.
// Статика сцены рисуется один раз в offscreen-буфер, динамика — поверх, не чаще 12 кадров/с.
// Анимация останавливается при prefers-reduced-motion, печати/экспорте и скрытой вкладке.
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getLevel, type SceneId } from "./levels";

const props = withDefaults(
	defineProps<{
		level: number;
		/** false: один статичный кадр (печать, экспорт, превью) */
		animate?: boolean;
	}>(),
	{ animate: true },
);

const W = 245;
const H = 138;
const FPS = 12;

// ---------- цвет ----------
type RGB = readonly [number, number, number];
function hex(h: string): RGB {
	const v = Number.parseInt(h.slice(1), 16);
	return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function mix(a: RGB, b: RGB, t: number): RGB {
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function css(c: RGB, a = 1): string {
	return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}

// детерминированный ГПСЧ: сцена одинакова при каждом показе
function rng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// матрица Байера 4×4 для упорядоченного дизеринга градиентов
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const dither = (x: number, y: number, t: number) => t * 16 > BAYER[((y & 3) << 2) | (x & 3)] + 0.5;

// ---------- поверхность рисования ----------
interface Surf {
	px(x: number, y: number, c: RGB, a?: number): void;
	rect(x: number, y: number, w: number, h: number, c: RGB, a?: number): void;
}

/** Растровый буфер для статики: пиксели пишутся прямо в ImageData с альфа-смешиванием. */
class Bitmap implements Surf {
	img: ImageData;
	d: Uint8ClampedArray;
	constructor() {
		this.img = new ImageData(W, H);
		this.d = this.img.data;
	}
	px(x: number, y: number, c: RGB, a = 1) {
		x |= 0;
		y |= 0;
		if (x < 0 || y < 0 || x >= W || y >= H) return;
		const i = (y * W + x) * 4;
		const d = this.d;
		d[i] = d[i] + (c[0] - d[i]) * a;
		d[i + 1] = d[i + 1] + (c[1] - d[i + 1]) * a;
		d[i + 2] = d[i + 2] + (c[2] - d[i + 2]) * a;
		d[i + 3] = 255;
	}
	rect(x: number, y: number, w: number, h: number, c: RGB, a = 1) {
		for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c, a);
	}
}

/** Обёртка над 2D-контекстом для динамики (мало вызовов на кадр). */
class Ctx implements Surf {
	constructor(public c: CanvasRenderingContext2D) {}
	px(x: number, y: number, c: RGB, a = 1) {
		this.c.fillStyle = css(c, a);
		this.c.fillRect(x | 0, y | 0, 1, 1);
	}
	rect(x: number, y: number, w: number, h: number, c: RGB, a = 1) {
		this.c.fillStyle = css(c, a);
		this.c.fillRect(x | 0, y | 0, w | 0, h | 0);
	}
}

// ---------- примитивы ----------
function vgrad(s: Surf, y0: number, y1: number, stops: RGB[], x0 = 0, x1 = W) {
	const n = stops.length - 1;
	for (let y = y0; y < y1; y++) {
		const p = ((y - y0) / Math.max(1, y1 - y0 - 1)) * n;
		const k = Math.min(n - 1, Math.floor(p));
		const t = p - k;
		for (let x = x0; x < x1; x++) s.px(x, y, dither(x, y, t) ? stops[k + 1] : stops[k]);
	}
}
function line(s: Surf, x0: number, y0: number, x1: number, y1: number, c: RGB, a = 1) {
	x0 |= 0;
	y0 |= 0;
	x1 |= 0;
	y1 |= 0;
	const dx = Math.abs(x1 - x0);
	const dy = -Math.abs(y1 - y0);
	const sx = x0 < x1 ? 1 : -1;
	const sy = y0 < y1 ? 1 : -1;
	let e = dx + dy;
	for (let i = 0; i < 2000; i++) {
		s.px(x0, y0, c, a);
		if (x0 === x1 && y0 === y1) break;
		const e2 = 2 * e;
		if (e2 >= dy) {
			e += dy;
			x0 += sx;
		}
		if (e2 <= dx) {
			e += dx;
			y0 += sy;
		}
	}
}
function linePts(x0: number, y0: number, x1: number, y1: number): [number, number][] {
	const pts: [number, number][] = [];
	const fake: Surf = { px: (x, y) => pts.push([x, y]), rect: () => {} };
	line(fake, x0, y0, x1, y1, [0, 0, 0]);
	return pts;
}
function disc(s: Surf, cx: number, cy: number, r: number, color: (x: number, y: number, dx: number, dy: number) => RGB | null) {
	for (let y = -r; y <= r; y++)
		for (let x = -r; x <= r; x++) {
			if (x * x + y * y > r * r + r * 0.6) continue;
			const c = color(cx + x, cy + y, x, y);
			if (c) s.px(cx + x, cy + y, c);
		}
}
/** Спрайт из строк: символ → цвет по палитре. */
function sprite(s: Surf, x: number, y: number, rows: string[], pal: Record<string, RGB>, a = 1) {
	rows.forEach((row, j) => {
		for (let i = 0; i < row.length; i++) {
			const c = pal[row[i]];
			if (c) s.px(x + i, y + j, c, a);
		}
	});
}

// Пиксельный шрифт 3×5 (латиница, цифры, немного знаков) для табло и титров.
const GLYPHS: Record<string, string> = {
	A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110",
	E: "111100110100111", F: "111100110100100", G: "011100101101011", H: "101101111101101",
	I: "111010010010111", J: "001001001101010", K: "101101110101101", L: "100100100100111",
	M: "101111111101101", N: "110101101101101", O: "010101101101010", P: "110101110100100",
	Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010",
	U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101",
	Y: "101101010010010", Z: "111001010100111", "0": "111101101101111", "1": "010110010010111",
	"2": "110001010100111", "3": "110001010001110", "4": "101101111001001", "5": "111100110001110",
	"6": "011100111101111", "7": "111001010010010", "8": "111101111101111", "9": "111101111001110",
	"-": "000000111000000", ".": "000000000000010", ":": "000010000010000", "/": "001001010100100",
	"!": "010010010000010", "?": "110001010000010", "+": "000010111010000", " ": "000000000000000",
};
function text(s: Surf, x: number, y: number, str: string, c: RGB, a = 1) {
	let cx = x;
	for (const ch of str.toUpperCase()) {
		const g = GLYPHS[ch] ?? GLYPHS[" "];
		for (let k = 0; k < 15; k++) if (g[k] === "1") s.px(cx + (k % 3), y + ((k / 3) | 0), c, a);
		cx += 4;
	}
}
const textWidth = (str: string) => str.length * 4 - 1;

// ---------- сцены ----------
interface Scene {
	/** статичный слой (рисуется один раз) */
	base(b: Bitmap): void;
	/** динамика поверх статики; t — секунды с начала */
	frame?(s: Ctx, t: number, dt: number): void;
}

const BG = hex("#07040f");

function starsField(r: () => number, n: number, yMax: number) {
	return Array.from({ length: n }, () => ({
		x: (r() * W) | 0,
		y: (r() * yMax) | 0,
		b: r(),
		ph: r() * 6.28,
		sp: 0.6 + r() * 2.4,
		tw: r() < 0.35,
	}));
}

/** 0 · PRESS START: звёздное небо, планета с кольцом, неоновый город. */
function sceneStart(): Scene {
	const r = rng(11);
	const stars = starsField(r, 110, 92);
	const sky = [hex("#07040f"), hex("#0c0620"), hex("#1a0b38"), hex("#2c0f4c")];
	const cyan = hex("#3ef0ff");
	const mag = hex("#ff3ecf");
	const yel = hex("#ffe13e");
	const windows: { x: number; y: number; c: RGB; ph: number }[] = [];
	return {
		base(b) {
			vgrad(b, 0, H, sky);
			for (const s of stars) if (!s.tw) b.px(s.x, s.y, mix(BG, hex("#d8d0ff"), 0.25 + s.b * 0.45));
			// планета с кольцом (задняя половина кольца — за планетой)
			const pcx = 203;
			const pcy = 38;
			const pr = 21;
			const ring = (front: boolean) => {
				for (let a = 0; a < 6.283; a += 0.01) {
					const x = pcx + Math.cos(a) * 36;
					const y = pcy + Math.sin(a) * 6 - Math.cos(a) * 4;
					const isFront = Math.sin(a) > 0;
					if (isFront !== front) continue;
					b.px(x, y, mix(BG, cyan, isFront ? 0.7 : 0.35));
					b.px(x, y + 1, mix(BG, cyan, isFront ? 0.35 : 0.15));
				}
			};
			ring(false);
			disc(b, pcx, pcy, pr, (x, y, dx, dy) => {
				const light = 1 - (dx + 0.6 * dy + pr) / (2.2 * pr);
				const band = Math.sin((dy + dx * 0.25) * 0.7) > 0.55 ? 0.12 : 0;
				const t = Math.max(0, Math.min(1, light + band));
				const lo = hex("#1d0a33");
				const mid = hex("#5c1670");
				const hi = mix(mid, mag, 0.8);
				return t < 0.5 ? (dither(x, y, t * 2) ? mid : lo) : dither(x, y, (t - 0.5) * 2) ? hi : mid;
			});
			ring(true);
			// город: выше по краям, ниже в центре, чтобы не спорить с текстом
			let x = 0;
			const ground = H - 7;
			while (x < W) {
				const w = 6 + ((r() * 10) | 0);
				const edge = Math.abs(x + w / 2 - W / 2) / (W / 2);
				const h = (8 + edge * edge * 34 + r() * 10) | 0;
				const top = ground - h;
				b.rect(x, top, w, h, hex("#0d0619"));
				b.rect(x, top, w, 1, mix(BG, mag, 0.35));
				if (r() < 0.3 && h > 20) b.rect(x + (w >> 1), top - 4, 1, 4, mix(BG, mag, 0.4)); // антенна
				for (let wy = top + 3; wy < ground - 2; wy += 3)
					for (let wx = x + 2; wx < x + w - 1; wx += 2) {
						if (r() < 0.28) {
							const c = r() < 0.6 ? yel : cyan;
							b.px(wx, wy, mix(BG, c, 0.32));
							if (r() < 0.12) windows.push({ x: wx, y: wy, c, ph: r() * 10 });
						}
					}
				x += w + ((r() * 2) | 0);
			}
			b.rect(0, ground, W, H - ground, hex("#0a0514"));
			for (let gx = 0; gx < W; gx++) b.px(gx, ground, mix(BG, mag, 0.55));
			// перспективная сетка под городом
			for (let k = -14; k <= 14; k++) line(b, W / 2 + k * 3, ground + 1, W / 2 + k * 22, H, mix(BG, mag, 0.22));
		},
		frame(s, t) {
			for (const st of stars) {
				if (!st.tw) continue;
				const v = 0.5 + 0.5 * Math.sin(t * st.sp + st.ph);
				s.px(st.x, st.y, hex("#f2ecff"), 0.15 + v * 0.6);
				if (st.b > 0.85 && v > 0.8) {
					s.px(st.x - 1, st.y, cyan, 0.35);
					s.px(st.x + 1, st.y, cyan, 0.35);
					s.px(st.x, st.y - 1, cyan, 0.35);
					s.px(st.x, st.y + 1, cyan, 0.35);
				}
			}
			for (const w of windows) if (Math.sin(t * 0.7 + w.ph) > 0.2) s.px(w.x, w.y, w.c, 0.6);
			// падающая звезда раз в 7 с
			const cyc = t % 7;
			if (cyc < 0.9) {
				const k = Math.floor(t / 7);
				const rr = rng(100 + k);
				const sx = 30 + rr() * 150;
				const sy = 6 + rr() * 30;
				const p = cyc / 0.9;
				for (let i = 0; i < 7; i++) s.px(sx + (p * 60 - i * 2), sy + (p * 20 - i * 0.66), hex("#f2ecff"), (1 - i / 7) * 0.8 * (1 - p));
			}
		},
	};
}

/** 1 · Баг в пикселях: экран с битыми пикселями, макроблоками и полосами глитча. */
function sceneGlitch(): Scene {
	const r = rng(23);
	const red = hex("#ff4d6d");
	const cyan = hex("#3ef0ff");
	const dead: { x: number; y: number; c: RGB; w: number }[] = [];
	const pure = [hex("#ff2050"), hex("#20ff70"), hex("#3050ff"), hex("#ffffff"), hex("#ff3ecf")];
	for (let i = 0; i < 70; i++) dead.push({ x: (r() * W) | 0, y: (8 + r() * (H - 8)) | 0, c: pure[(r() * pure.length) | 0], w: r() < 0.25 ? 2 : 1 });
	const blinkers = dead.slice(0, 12);
	return {
		base(b) {
			vgrad(b, 0, H, [hex("#07040f"), hex("#0b0617"), hex("#120822")]);
			// субпиксельная решётка LCD: колонки R/G/B едва заметно
			for (let x = 0; x < W; x++) {
				const c = [red, hex("#9dff3e"), hex("#3050ff")][x % 3];
				for (let y = 0; y < H; y++) b.px(x, y, c, 0.025);
			}
			// макроблоки битого видео по краям
			const blocks = [
				[4, 16, 26, 12], [W - 34, 22, 30, 10], [8, H - 40, 18, 14], [W - 26, H - 36, 22, 16], [60, H - 14, 30, 8], [W - 90, 12, 24, 6],
			];
			for (const [bx, by, bw, bh] of blocks) {
				for (let y = 0; y < bh; y++)
					for (let x = 0; x < bw; x++) {
						const chk = ((x >> 1) + (y >> 1)) & 1;
						b.px(bx + x, by + y, chk ? hex("#2a1040") : hex("#140a24"));
					}
				// сдвинутый слайс внутри блока
				const sy = by + ((r() * bh) | 0);
				for (let x = 0; x < bw; x++) b.px(bx + x + 3, sy, x % 4 < 2 ? cyan : red, 0.4);
			}
			// «призрак» кнопки с RGB-расслоением
			const ghost = (gx: number, gy: number, gw: number, gh: number) => {
				const frame = (ox: number, c: RGB, a: number) => {
					for (let x = 1; x < gw - 1; x++) {
						b.px(gx + x + ox, gy, c, a);
						b.px(gx + x + ox, gy + gh - 1, c, a);
					}
					for (let y = 1; y < gh - 1; y++) {
						b.px(gx + ox, gy + y, c, a);
						b.px(gx + gw - 1 + ox, gy + y, c, a);
					}
				};
				frame(-1, red, 0.45);
				frame(1, cyan, 0.45);
				frame(0, hex("#f2ecff"), 0.18);
				text(b, gx + ((gw - textWidth("SAVE")) >> 1), gy + ((gh - 5) >> 1), "SAVE", hex("#f2ecff"), 0.3);
				text(b, gx + ((gw - textWidth("SAVE")) >> 1) + 1, gy + ((gh - 5) >> 1), "SAVE", red, 0.25);
			};
			ghost(14, H - 22, 40, 12);
			ghost(W - 22, 52, 44, 12);
			for (const d of dead) b.rect(d.x, d.y, d.w, 1, d.c, 0.55);
			// подпись «битого» экрана
			text(b, 4, H - 7, "ERR 0X1F", red, 0.28);
			text(b, W - textWidth("DIFF 3.2%") - 4, H - 7, "DIFF 3.2%", cyan, 0.28);
		},
		frame(s, t) {
			// статический шум
			const rr = rng((t * FPS) | 0);
			for (let i = 0; i < 60; i++) s.px(rr() * W, rr() * H, hex("#b9b0d6"), 0.12 + rr() * 0.18);
			for (const d of blinkers) if (Math.sin(t * 3 + d.x) > 0.3) s.rect(d.x, d.y, d.w, 1, d.c, 0.9);
			// полоса глитча раз в 2.4 с
			const cyc = t % 2.4;
			if (cyc < 0.42) {
				const g = rng(500 + Math.floor(t / 2.4) * 7 + ((cyc * 10) | 0));
				const y = 14 + ((g() * (H - 24)) | 0);
				const h = 2 + ((g() * 6) | 0);
				for (let i = 0; i < 7; i++) {
					const w = 8 + g() * 50;
					const x = g() * W;
					s.rect(x, y + ((g() * h) | 0), w, 1 + ((g() * 2) | 0), g() < 0.5 ? red : cyan, 0.32);
				}
				s.rect(0, y, W, 1, hex("#f2ecff"), 0.08);
			}
			// медленно катящаяся строка развёртки
			const ry = (t * 9) % (H + 20) - 10;
			s.rect(0, ry, W, 2, hex("#f2ecff"), 0.035);
		},
	};
}

/** 2 · Фабрика данных: трубы, шестерни, пресс-мутатор и конвейер со скриншотами. */
function sceneFactory(): Scene {
	const yel = hex("#ffe13e");
	const org = hex("#ff9f3e");
	const steel = hex("#2b2140");
	const steelHi = hex("#4a3c66");
	const beltY = H - 19;
	const speed = 10;
	const pressX = 166;
	function gear(s: Surf, cx: number, cy: number, rad: number, teeth: number, ang: number, c: RGB, a: number) {
		disc(s, cx, cy, rad - 2, (x, y, dx, dy) => (dx * dx + dy * dy < 9 ? null : c));
		for (let k = 0; k < teeth; k++) {
			const an = ang + (k / teeth) * Math.PI * 2;
			for (let d = rad - 2; d <= rad + 1; d++) {
				const x = cx + Math.cos(an) * d;
				const y = cy + Math.sin(an) * d;
				s.rect(x - 1, y - 1, 2, 2, c, a);
			}
		}
		s.px(cx, cy, mix(c, org, 0.6), 1);
	}
	return {
		base(b) {
			vgrad(b, 0, H, [hex("#07040f"), hex("#0d0818"), hex("#151024")]);
			// панели стены с заклёпками
			for (let x = 0; x < W; x += 30) {
				for (let y = 16; y < beltY - 4; y++) b.px(x, y, hex("#1c1530"));
				for (let y = 20; y < beltY - 6; y += 12) {
					b.px(x + 3, y, hex("#2a2140"));
					b.px(x + 27, y, hex("#2a2140"));
				}
			}
			// труба сверху и по бокам
			const pipeH = (y: number) => {
				b.rect(0, y, W, 4, steel);
				b.rect(0, y, W, 1, steelHi);
				for (let x = 12; x < W; x += 40) b.rect(x, y - 1, 4, 6, steelHi);
			};
			pipeH(12);
			for (const px of [6, W - 10]) {
				b.rect(px, 12, 4, beltY - 12, steel);
				b.rect(px, 12, 1, beltY - 12, steelHi);
			}
			// вентиль на левой трубе
			disc(b, 8, 60, 4, (x, y, dx, dy) => (dx * dx + dy * dy > 6 ? mix(BG, org, 0.55) : null));
			b.rect(7, 56, 2, 9, mix(BG, org, 0.45));
			// табличка — внизу, под лентой: верхнюю полосу занимает заголовок слайда
			text(b, 16, H - 13, "DATA FACTORY", yel, 0.22);
			text(b, W - 16 - textWidth("LINE 02"), H - 13, "LINE 02", org, 0.22);
			// пресс над конвейером: станина
			b.rect(pressX - 9, 16, 18, 4, steelHi);
			b.rect(pressX - 9, 20, 2, beltY - 22, steel);
			b.rect(pressX + 7, 20, 2, beltY - 22, steel);
			// конвейер
			b.rect(0, beltY, W, 6, hex("#1a1426"));
			b.rect(0, beltY, W, 1, steelHi);
			b.rect(0, beltY + 5, W, 1, hex("#0c0814"));
			for (let x = 4; x < W; x += 9) disc(b, x, beltY + 3, 2, () => hex("#3a2f52"));
			for (let x = 10; x < W; x += 36) b.rect(x, beltY + 6, 3, H - beltY - 10, hex("#1a1426"));
			// сигнальная лента внизу
			for (let x = 0; x < W; x++) for (let y = H - 4; y < H; y++) b.px(x, y, ((x + y) >> 2) & 1 ? mix(BG, yel, 0.42) : hex("#0c0a10"));
		},
		frame(s, t) {
			// шестерни
			gear(s, 26, 34, 11, 9, t * 0.9, mix(BG, steelHi, 0.95), 1);
			gear(s, 42, 46, 7, 7, -t * 1.4 + 0.2, mix(BG, org, 0.4), 1);
			gear(s, W - 28, 36, 12, 10, -t * 0.7, mix(BG, steelHi, 0.95), 1);
			// лента: штрихи едут вправо
			const off = (t * speed) % 6;
			for (let x = -6; x < W; x += 6) s.rect(x + off, beltY + 1, 3, 1, hex("#3a2f52"), 1);
			// скриншоты на ленте; после пресса у них появляется «мутация»
			const gap = 42;
			const shift = (t * speed) % gap;
			for (let i = -1; i < W / gap + 1; i++) {
				const x = i * gap + shift;
				const y = beltY - 10;
				const mutated = x > pressX;
				s.rect(x, y, 15, 10, hex("#0b0716"), 1);
				const fc = mutated ? org : yel;
				s.rect(x, y, 15, 1, fc, 0.65);
				s.rect(x, y + 9, 15, 1, fc, 0.65);
				s.rect(x, y, 1, 10, fc, 0.65);
				s.rect(x + 14, y, 1, 10, fc, 0.65);
				s.rect(x + 3, y + 3, 9, 2, hex("#b9b0d6"), 0.5);
				s.rect(x + 3, y + 6, mutated ? 7 : 5, 1, mutated ? hex("#ff4d6d") : hex("#3ef0ff"), 0.7);
			}
			// пресс-мутатор: опускается раз в 4.2 с, бьёт искрами
			const per = gap / speed;
			const ph = (t % per) / per;
			const down = ph > 0.42 && ph < 0.58 ? 1 - Math.abs(ph - 0.5) / 0.08 : 0;
			const headY = 20 + down * (beltY - 36);
			s.rect(pressX - 1, 20, 2, headY - 20, steelHi, 1);
			s.rect(pressX - 6, headY, 12, 4, mix(BG, org, 0.7), 1);
			s.rect(pressX - 6, headY + 3, 12, 1, org, 0.8);
			if (ph > 0.49 && ph < 0.62) {
				const sp = rng((t * FPS) | 0);
				for (let i = 0; i < 9; i++) s.px(pressX - 8 + sp() * 16, beltY - 12 - sp() * 8, sp() < 0.5 ? yel : org, 0.9);
			}
			// сигнальная лампа
			if (Math.sin(t * 5) > 0) {
				s.rect(W - 18, 17, 4, 3, hex("#ff4d6d"), 0.85);
				s.rect(W - 19, 18, 6, 1, hex("#ff4d6d"), 0.25);
			}
		},
	};
}

/** 3 · Теория: созвездия-нейроны, по связям бегут сигналы. */
function sceneNeurons(): Scene {
	const r = rng(37);
	const cyan = hex("#3ef0ff");
	const vio = hex("#a98bff");
	const stars = starsField(r, 70, H);
	// узлы держим по краям и снизу, центр оставляем тексту
	const nodes: { x: number; y: number; ph: number }[] = [];
	while (nodes.length < 34) {
		const x = 4 + r() * (W - 8);
		const y = 16 + r() * (H - 22);
		const dxc = Math.abs(x - W / 2) / (W / 2);
		const dyc = (y - 16) / (H - 22);
		if (dxc < 0.62 && dyc < 0.8) continue;
		if (nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 13)) continue;
		nodes.push({ x: x | 0, y: y | 0, ph: r() * 6.28 });
	}
	const edges: [number, number][] = [];
	nodes.forEach((n, i) => {
		const near = nodes
			.map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
			.filter((o) => o.j !== i)
			.sort((a, b) => a.d - b.d)
			.slice(0, 2);
		for (const o of near) if (o.d < 48 && !edges.some(([a, b]) => (a === o.j && b === i) || (a === i && b === o.j))) edges.push([i, o.j]);
	});
	const paths = edges.map(([a, b]) => linePts(nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y));
	const adj = nodes.map((_, i) => edges.map((e, k) => (e[0] === i || e[1] === i ? k : -1)).filter((k) => k >= 0));
	const pr = rng(91);
	const packets = Array.from({ length: 9 }, () => ({ e: (pr() * edges.length) | 0, p: pr(), dir: pr() < 0.5 ? 1 : -1, v: 0.5 + pr() * 0.7 }));
	return {
		base(b) {
			vgrad(b, 0, H, [hex("#06040f"), hex("#0a0620"), hex("#0f0a2a")]);
			for (const s of stars) b.px(s.x, s.y, mix(BG, hex("#c8c0ff"), 0.12 + s.b * 0.3));
			for (const p of paths) for (const [x, y] of p) b.px(x, y, mix(BG, vio, 0.28));
			for (const n of nodes) {
				b.px(n.x, n.y, mix(BG, vio, 0.75));
				for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) b.px(n.x + dx, n.y + dy, mix(BG, vio, 0.4));
			}
			text(b, 4, H - 7, "CONV2D 3X3", cyan, 0.24);
			text(b, W - textWidth("RELU") - 4, H - 7, "RELU", vio, 0.26);
		},
		frame(s, t, dt) {
			for (const n of nodes) {
				const v = Math.sin(t * 1.3 + n.ph);
				if (v > 0.55) {
					const a = (v - 0.55) / 0.45;
					s.px(n.x, n.y, cyan, 0.5 + a * 0.5);
					for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) s.px(n.x + dx, n.y + dy, cyan, 0.35 * a);
					for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) s.px(n.x + dx, n.y + dy, cyan, 0.15 * a);
				}
			}
			for (const k of packets) {
				const path = paths[k.e];
				if (!path || path.length < 2) {
					k.e = (Math.random() * paths.length) | 0;
					continue;
				}
				k.p += (dt * k.v * 26) / path.length;
				if (k.p >= 1) {
					// на конце ребра сигнал уходит в соседнее ребро
					const end = k.dir > 0 ? edges[k.e][1] : edges[k.e][0];
					const opts = adj[end];
					const ne = opts[(Math.random() * opts.length) | 0] ?? k.e;
					k.dir = edges[ne][0] === end ? 1 : -1;
					k.e = ne;
					k.p = 0;
					continue;
				}
				for (let tr = 0; tr < 4; tr++) {
					const q = k.p - tr * 0.06;
					if (q < 0) break;
					const idx = Math.round((k.dir > 0 ? q : 1 - q) * (path.length - 1));
					const [x, y] = path[idx];
					s.px(x, y, tr === 0 ? hex("#e6fdff") : cyan, tr === 0 ? 1 : 0.5 - tr * 0.12);
				}
			}
		},
	};
}

/** 4 · Арсенал: кирпичная мастерская, стенды с инструментами, лампы и наковальня с искрами. */
function sceneArmory(): Scene {
	const org = hex("#ff9f3e");
	const mag = hex("#ff3ecf");
	const yel = hex("#ffe13e");
	const metal = hex("#6f6488");
	const metalHi = hex("#a99fc4");
	const wood = hex("#5a3424");
	const pal = { m: metal, h: metalHi, w: wood, o: mix(BG, org, 0.8), g: mix(BG, mag, 0.7), d: hex("#2a1d3a") };
	const HAMMER = ["mmmmmmmh", "mmmmmmmh", "...ww...", "...ww...", "...ww...", "...ww...", "...ww...", "...ww...", "...ww...", "...ww...", "...ww...", "..wwww.."];
	const WRENCH = ["m...m", "mm.mm", ".mmm.", "..m..", "..m..", "..m..", "..m..", "..m..", "..m..", "..m..", ".mmm.", "mm.mm", "m...m"];
	const SWORD = ["...h...", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "..hmh..", "ooooooo", "...w...", "...w...", "..ooo.."];
	const SHIELD = ["ggggggggg", "gdddddddg", "gddmhmddg", "gdmhhhmdg", "gddmhmddg", "gdddddddg", ".gdddddg.", ".gdddddg.", "..gdddg..", "...ggg..."];
	const SCREW = ["..h..", "..m..", "..m..", "..m..", "..m..", ".ooo.", ".ooo.", ".ooo.", ".ooo.", "..o.."];
	const ANVIL = ["mmmmmmmmmmmmmmmmmm", "hhhhhhhhhhhhhhhhh.", ".mmmmmmmmmmmmmmm..", "....mmmmmmmmm.....", ".....mmmmmmm......", ".....mmmmmmm......", "...mmmmmmmmmmm....", "..mmmmmmmmmmmmm..."];
	const benchY = H - 22;
	const anvilX = W - 78;
	const lamps = [76, W - 76];
	const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
	let nextBurst = 0.6;
	return {
		base(b) {
			b.rect(0, 0, W, H, hex("#0b0710"));
			// кирпич
			for (let y = 14; y < benchY; y += 6) {
				const off = ((y / 6) & 1) * 7;
				for (let x = -off; x < W; x += 14) {
					const tone = ((x * 7 + y * 13) % 5) / 5;
					b.rect(x + 1, y + 1, 12, 4, mix(hex("#181020"), hex("#22142a"), tone));
				}
			}
			// стенды-перфорация
			for (const [x0, x1] of [[6, 62], [W - 62, W - 6]]) {
				b.rect(x0, 22, x1 - x0, 72, hex("#1e1426"));
				for (let y = 24; y < 92; y += 4) for (let x = x0 + 2; x < x1 - 1; x += 4) b.px(x, y, hex("#0e0812"));
				b.rect(x0, 22, x1 - x0, 1, mix(BG, org, 0.35));
				b.rect(x0, 93, x1 - x0, 1, hex("#3a2438"));
				b.rect(x0, 22, 1, 72, hex("#3a2438"));
				b.rect(x1 - 1, 22, 1, 72, hex("#3a2438"));
			}
			sprite(b, 12, 30, HAMMER, pal, 0.85);
			sprite(b, 26, 28, WRENCH, pal, 0.85);
			sprite(b, 38, 27, SWORD, pal, 0.9);
			sprite(b, 13, 60, SHIELD, pal, 0.85);
			sprite(b, 30, 62, SCREW, pal, 0.85);
			sprite(b, 44, 60, WRENCH, pal, 0.85);
			sprite(b, W - 56, 27, SWORD, pal, 0.9);
			sprite(b, W - 45, 30, HAMMER, pal, 0.85);
			sprite(b, W - 30, 28, SCREW, pal, 0.85);
			sprite(b, W - 54, 60, WRENCH, pal, 0.85);
			sprite(b, W - 40, 60, SHIELD, pal, 0.85);
			// лампы на проводах
			for (const lx of lamps) {
				b.rect(lx, 14, 1, 6, hex("#3a2f4a"));
				b.rect(lx - 4, 20, 9, 2, hex("#3a2f4a"));
				b.rect(lx - 5, 22, 11, 1, hex("#4a3c5e"));
			}
			// верстак и наковальня
			b.rect(0, benchY, W, 4, wood);
			b.rect(0, benchY, W, 1, mix(wood, org, 0.4));
			b.rect(0, benchY + 4, W, H - benchY - 4, hex("#100a12"));
			for (const lx of [16, 90, W - 90, W - 16]) b.rect(lx, benchY + 4, 3, H - benchY - 4, hex("#2a1a1a"));
			sprite(b, anvilX, benchY - 8, ANVIL, pal, 0.9);
		},
		frame(s, t, dt) {
			// конус света ламп мерцает
			for (const lx of lamps) {
				const fl = 0.07 + 0.025 * Math.sin(t * 9 + lx) + (Math.sin(t * 23 + lx) > 0.95 ? -0.04 : 0);
				for (let y = 23; y < benchY; y++) {
					const half = (y - 23) * 0.55 + 4;
					const a = fl * (1 - (y - 23) / (benchY - 23));
					s.rect(lx - half, y, half * 2 + 1, 1, org, a);
				}
				s.rect(lx - 2, 22, 5, 1, yel, 0.9);
			}
			// искры от наковальни
			nextBurst -= dt;
			if (nextBurst <= 0) {
				nextBurst = 1.4 + Math.random() * 0.8;
				for (let i = 0; i < 12; i++)
					sparks.push({ x: anvilX + 6, y: benchY - 9, vx: (Math.random() - 0.5) * 50, vy: -20 - Math.random() * 35, life: 0.6 + Math.random() * 0.5 });
			}
			for (let i = sparks.length - 1; i >= 0; i--) {
				const p = sparks[i];
				p.life -= dt;
				if (p.life <= 0) {
					sparks.splice(i, 1);
					continue;
				}
				p.vy += 90 * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				s.px(p.x, p.y, p.life > 0.4 ? yel : org, Math.min(1, p.life * 1.6));
			}
			// блик по мечу
			const gy = 27 + ((t * 14) % 30);
			if (gy < 37) s.rect(40, gy, 3, 1, hex("#ffffff"), 0.7);
		},
	};
}

/** 5 · Тренировка: synthwave-полигон — солнце с прорезями, горы, мишени и бегущая сетка. */
function sceneRange(): Scene {
	const r = rng(53);
	const mag = hex("#ff3ecf");
	const yel = hex("#ffe13e");
	const cyan = hex("#3ef0ff");
	const y0 = 86;
	const stars = starsField(r, 60, y0 - 20);
	const ridge = (x: number, side: number) => {
		const u = side < 0 ? x / 90 : (W - x) / 90;
		if (u < 0 || u > 1) return 0;
		return (Math.sin(u * 9.0 + side) * 6 + Math.sin(u * 23 + side * 2) * 3 + (1 - u) * 26) * (1 - u * 0.4);
	};
	return {
		base(b) {
			vgrad(b, 0, y0, [hex("#07040f"), hex("#12062a"), hex("#2a0a46"), hex("#4a0d52")]);
			for (const s of stars) b.px(s.x, s.y, mix(BG, hex("#f2ecff"), 0.2 + s.b * 0.4));
			// солнце
			const cx = W / 2;
			const cy = y0 - 4;
			const rad = 30;
			disc(b, cx, cy, rad, (x, y, dx, dy) => {
				if (y >= y0) return null;
				const u = (dy + rad) / (2 * rad);
				const k = dy + rad;
				// прорези расширяются книзу
				if (dy > -6) {
					const band = (dy + 6) % 7;
					const cut = 1 + ((dy + 6) / 7) | 0;
					if (band < cut) return null;
				}
				return dither(x, y, u) ? mix(mag, hex("#9a1a7a"), 0.2) : mix(yel, hex("#ff8a3e"), Math.min(1, k / rad));
			});
			// горы слева и справа
			for (const side of [-1, 1]) {
				for (let x = 0; x < W; x++) {
					const h = ridge(x, side);
					if (h <= 0) continue;
					const top = (y0 - h) | 0;
					for (let y = top; y < y0; y++) b.px(x, y, mix(hex("#12061f"), hex("#1c0830"), (y - top) / Math.max(1, h)));
					b.px(x, top, mix(BG, mag, 0.75));
				}
			}
			// мишени-стойки
			const target = (tx: number) => {
				b.rect(tx, y0 - 6, 1, 6, hex("#3a1a4a"));
				disc(b, tx, y0 - 11, 5, (_x, _y, dx, dy) => {
					const d = Math.sqrt(dx * dx + dy * dy);
					return d < 1.5 ? mix(BG, hex("#ff4d6d"), 0.9) : d < 3.2 ? mix(BG, hex("#f2ecff"), 0.55) : mix(BG, hex("#ff4d6d"), 0.6);
				});
			};
			target(62);
			target(W - 62);
			// пол и лучи сетки
			vgrad(b, y0, H, [hex("#0a0414"), hex("#12052a"), hex("#1a0634")]);
			for (let x = 0; x < W; x++) b.px(x, y0, mix(BG, mag, 0.9));
			for (let k = -16; k <= 16; k++) line(b, cx + k * 4, y0 + 1, cx + k * 30, H + 4, mix(BG, mag, 0.38));
			text(b, 4, H - 7, "TRAIN 01", cyan, 0.24);
			text(b, W - 4 - textWidth("EPOCH 12"), H - 7, "EPOCH 12", yel, 0.24);
		},
		frame(s, t) {
			// горизонтальные линии бегут к зрителю
			const n = 9;
			const phase = (t * 0.45) % 1;
			for (let i = 0; i < n; i++) {
				const p = (i + phase) / n;
				const y = y0 + 1 + p * p * (H - y0);
				s.rect(0, y, W, 1, mag, 0.15 + p * 0.45);
			}
			// мерцание звёзд
			for (let i = 0; i < 6; i++) {
				const k = Math.floor(t * 1.5 + i * 3.7);
				const rr = rng(k * 13 + i);
				s.px(rr() * W, rr() * (y0 - 30), hex("#f2ecff"), 0.75);
			}
		},
	};
}

/** 6 · Артефакт: сокровищница — колонны, горы монет, сундуки и искры. */
function sceneVault(): Scene {
	const r = rng(67);
	const gold = hex("#ffd23e");
	const goldD = hex("#9a6a12");
	const goldM = hex("#d49a1e");
	const cyan = hex("#3ef0ff");
	const floorY = H - 14;
	const pileH = (x: number) => {
		const l = Math.max(0, 1 - x / 72);
		const rr = Math.max(0, 1 - (W - x) / 72);
		return Math.max(Math.sin((l * Math.PI) / 2) * 30 * l + l * 6, Math.sin((rr * Math.PI) / 2) * 30 * rr + rr * 6);
	};
	const glints = Array.from({ length: 10 }, (_, i) => {
		const left = i % 2 === 0;
		const x = left ? 4 + r() * 50 : W - 54 + r() * 50;
		return { x: x | 0, y: (floorY - pileH(x) * (0.3 + r() * 0.6)) | 0, ph: r() * 3 };
	});
	const dust = Array.from({ length: 22 }, () => ({ x: r() * W, y: r() * H, v: 2 + r() * 4, ph: r() * 6 }));
	return {
		base(b) {
			vgrad(b, 0, H, [hex("#07040f"), hex("#0d0812"), hex("#140c14")]);
			// кладка
			for (let y = 16; y < floorY; y += 10) {
				const off = ((y / 10) & 1) * 11;
				for (let x = -off; x < W; x += 22) b.rect(x + 1, y + 1, 20, 8, mix(hex("#120c18"), hex("#181020"), ((x + y) % 3) / 3));
			}
			// колонны
			for (const cx of [30, W - 46]) {
				b.rect(cx - 2, 16, 20, 4, hex("#2a2030"));
				b.rect(cx, 20, 16, floorY - 24, hex("#1e1826"));
				for (let fx = cx + 2; fx < cx + 16; fx += 4) b.rect(fx, 20, 1, floorY - 24, hex("#2a2234"));
				b.rect(cx + 15, 20, 1, floorY - 24, mix(BG, gold, 0.18));
				b.rect(cx - 2, floorY - 4, 20, 4, hex("#2a2030"));
			}
			// пол
			for (let y = floorY; y < H; y++) for (let x = 0; x < W; x++) b.px(x, y, ((x >> 3) + (y >> 2)) & 1 ? hex("#150d16") : hex("#1b1119"));
			// горы монет
			for (let x = 0; x < W; x++) {
				const h = pileH(x);
				if (h <= 0) continue;
				for (let y = (floorY - h) | 0; y < floorY + 2; y++) {
					const shade = (y - (floorY - h)) / Math.max(1, h);
					const c = dither(x, y, shade) ? goldD : goldM;
					b.px(x, y, mix(BG, c, 0.62));
					if (((x * 3 + y * 5) % 11 === 0)) b.px(x, y, mix(BG, gold, 0.8));
				}
				b.px(x, floorY - h, mix(BG, gold, 0.9));
			}
			// отдельные монеты на склонах: овал с бликом и тёмным ребром
			const cr = rng(71);
			for (let k = 0; k < 46; k++) {
				const left = k % 2 === 0;
				const x = left ? 2 + cr() * 60 : W - 62 + cr() * 60;
				const top = floorY - pileH(x);
				if (pileH(x) < 4) continue;
				const y = top + 2 + cr() * (floorY - top - 4);
				b.rect(x - 2, y, 5, 1, mix(BG, gold, 0.95));
				b.rect(x - 1, y - 1, 3, 1, mix(BG, hex("#fff2a8"), 0.8));
				b.rect(x - 2, y + 1, 5, 1, mix(BG, goldD, 0.9));
			}
			// сундуки
			const chest = (x: number, open: boolean) => {
				const y = floorY - 13;
				b.rect(x, y, 24, 13, hex("#4a2618"));
				b.rect(x, y, 24, 1, mix(BG, gold, 0.8));
				b.rect(x, y + 5, 24, 1, mix(BG, gold, 0.6));
				b.rect(x + 10, y + 4, 4, 4, mix(BG, gold, 0.9));
				if (open) {
					b.rect(x, y - 8, 24, 2, hex("#3a1c12"));
					b.rect(x + 2, y - 3, 20, 3, mix(BG, gold, 0.9));
				} else b.rect(x, y - 4, 24, 4, hex("#5a2e1c"));
			};
			chest(W - 88, true);
			chest(66, false);
			// кристаллы
			for (const [gx, gy, c] of [[20, floorY - 12, cyan], [W - 30, floorY - 16, hex("#ff3ecf")], [44, floorY - 6, hex("#9dff3e")]] as [number, number, RGB][]) {
				sprite(b, gx, gy, [".c.", "ccc", ".c."], { c: mix(BG, c, 0.9) });
			}
		},
		frame(s, t, dt) {
			// свет из открытого сундука
			const pulse = 0.08 + 0.03 * Math.sin(t * 2.2);
			for (let y = floorY - 24; y > 40; y--) {
				const k = floorY - 24 - y;
				s.rect(W - 86 - k * 0.15, y, 20 + k * 0.3, 1, gold, pulse * (1 - k / (floorY - 64)));
			}
			// искры-звёздочки на монетах
			for (const g of glints) {
				const v = Math.sin(t * 2.4 + g.ph * 2.1);
				if (v < 0.3) continue;
				const len = v > 0.8 ? 2 : 1;
				s.px(g.x, g.y, hex("#fff6c8"), 1);
				for (let d = 1; d <= len; d++) {
					const a = 0.7 / d;
					s.px(g.x + d, g.y, gold, a);
					s.px(g.x - d, g.y, gold, a);
					s.px(g.x, g.y + d, gold, a);
					s.px(g.x, g.y - d, gold, a);
				}
			}
			// золотая пыль поднимается
			for (const p of dust) {
				p.y -= p.v * dt;
				if (p.y < 14) p.y = H - 4;
				s.px(p.x + Math.sin(t + p.ph) * 2, p.y, gold, 0.25);
			}
		},
	};
}

/** 7 · Метрики: аркадное табло — LED-матрица, бегущие лампы, таблицы рекордов, эквалайзер. */
function sceneArcade(): Scene {
	const lime = hex("#9dff3e");
	const cyan = hex("#3ef0ff");
	const yel = hex("#ffe13e");
	const panelW = 46;
	const rows = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH"];
	const scores = [98653, 91204, 85117, 80400, 71230, 64018, 50972, 42001, 30553];
	const bulbs: [number, number][] = [];
	for (let y = 16; y < H - 2; y += 5) {
		bulbs.push([1, y]);
		bulbs.push([W - 2, y]);
	}
	for (let x = 4; x < W - 3; x += 5) bulbs.push([x, H - 2]);
	return {
		base(b) {
			b.rect(0, 0, W, H, hex("#06070a"));
			for (let y = 15; y < H; y += 3) for (let x = 1; x < W; x += 3) b.px(x, y, hex("#0f1d12"));
			for (const x0 of [5, W - 5 - panelW]) {
				b.rect(x0, 16, panelW, H - 36, hex("#040605"));
				b.rect(x0, 16, panelW, 1, mix(BG, lime, 0.5));
				b.rect(x0, H - 21, panelW, 1, mix(BG, lime, 0.5));
				b.rect(x0, 16, 1, H - 36, mix(BG, lime, 0.3));
				b.rect(x0 + panelW - 1, 16, 1, H - 36, mix(BG, lime, 0.3));
			}
			// надписи табло приглушены: они лежат под текстом слайда
			text(b, 9, 19, "HI-SCORE", yel, 0.35);
			text(b, W - 5 - panelW + 4, 19, "PRECISION", cyan, 0.32);
			for (let i = 0; i < 9; i++) text(b, 9, 28 + i * 9, rows[i], cyan, 0.2);
			// нижнее основание эквалайзера
			b.rect(60, H - 7, W - 120, 1, mix(BG, lime, 0.35));
		},
		frame(s, t) {
			// бегущие лампы по периметру
			const step = Math.floor(t * 8);
			bulbs.forEach(([x, y], i) => {
				const on = (i + step) % 4 === 0;
				s.px(x, y, on ? yel : mix(BG, yel, 0.25), on ? 1 : 1);
			});
			// рекорды: верхние строки «докручиваются»
			for (let i = 0; i < 9; i++) {
				const v = i < 2 ? scores[i] + ((t * (40 - i * 15)) | 0) : scores[i];
				text(s, 23, 28 + i * 9, String(v).padStart(5, "0").slice(-5), i === 0 ? yel : lime, i === 0 ? 0.4 : 0.24);
			}
			// правое табло: значения метрик мерцают по разрядам
			const vals = ["0.94", "0.81", "0.77", "0.71", "0.62", "0.58", "0.44", "0.31", "0.12"];
			for (let i = 0; i < 9; i++) {
				const blink = Math.sin(t * 3 + i) > 0.92;
				text(s, W - 5 - panelW + 6, 28 + i * 9, vals[i], blink ? hex("#ffffff") : i < 3 ? lime : cyan, blink ? 0.45 : 0.24);
				const bar = (Number(vals[i]) * 14) | 0;
				s.rect(W - 5 - panelW + 24, 29 + i * 9, bar, 3, i < 3 ? lime : cyan, 0.25);
			}
			// эквалайзер
			const n = 30;
			const bw = (W - 120) / n;
			for (let i = 0; i < n; i++) {
				const h = (2 + Math.abs(Math.sin(t * 2.3 + i * 0.7) * Math.sin(t * 1.1 + i * 0.31)) * 10) | 0;
				const x = 60 + i * bw;
				for (let k = 0; k < h; k += 2) s.rect(x, H - 9 - k, bw - 1, 1, k > 8 ? yel : lime, 0.32);
			}
		},
	};
}

/** 8 · Финал: закат над морем, пальмы и титры. */
function sceneSunset(): Scene {
	const y0 = 90;
	const sun = hex("#ffd23e");
	const coral = hex("#ff7a59");
	const mag = hex("#ff3ecf");
	const credits = ["DESIGN-DEALER", "", "TENSORFLOW.JS", "PLAYWRIGHT", "STORYBOOK", "", "HOLYJS 2026", "", "THANKS FOR", "PLAYING!", "", "CONTINUE? 9", "", "GAME OVER", "", "INSERT COIN"];
	const palm = (b: Surf, x: number, flip: number) => {
		const dark = hex("#0b0412");
		for (let i = 0; i < 46; i++) {
			const px = x + flip * Math.round(Math.sin(i / 16) * 6);
			b.rect(px, H - 6 - i, 3, 1, dark);
		}
		const tx = x + flip * 6;
		const ty = H - 52;
		for (const [ang, len] of [[-2.7, 20], [-2.2, 22], [-1.5, 16], [-0.9, 22], [-0.4, 20], [0.2, 15], [-3.1, 14]]) {
			for (let k = 0; k < len; k++) {
				const a = ang * flip + (flip < 0 ? Math.PI : 0);
				const xx = tx + Math.cos(a) * k;
				const yy = ty + Math.sin(a) * k + (k * k) / 40;
				b.rect(xx, yy, 2, 1, dark);
				if (k % 3 === 0) b.px(xx, yy + 1, dark);
			}
		}
	};
	return {
		base(b) {
			vgrad(b, 0, y0, [hex("#0b0420"), hex("#1e0a3e"), hex("#4a1260"), hex("#8a2060"), hex("#c8404e"), hex("#f07040")]);
			// полосы облаков
			for (const [cx, cy, w] of [[40, 34, 46], [W - 70, 26, 54], [W / 2 - 10, 50, 40], [24, 62, 30], [W - 40, 58, 34]]) {
				for (let k = 0; k < 3; k++) b.rect(cx + k * 4, cy + k, w - k * 8, 1, mix(hex("#2a0c40"), mag, 0.25 + k * 0.1), 0.7);
			}
			// солнце садится за горизонт
			const cx = W / 2;
			disc(b, cx, y0, 34, (x, y, dx, dy) => {
				if (y >= y0) return null;
				if (dy > -14 && (dy + 14) % 5 < 1 + (dy + 14) / 7) return null;
				const u = (dy + 34) / 34;
				return dither(x, y, u) ? coral : sun;
			});
			// море
			vgrad(b, y0, H, [hex("#1a0a30"), hex("#0e0620"), hex("#07040f")]);
			for (let x = 0; x < W; x++) b.px(x, y0, mix(BG, coral, 0.8));
			palm(b, 14, 1);
			palm(b, W - 17, -1);
		},
		frame(s, t) {
			// дорожка от солнца на воде
			const cx = W / 2;
			for (let y = y0 + 2; y < H; y += 2) {
				const d = (y - y0) / (H - y0);
				const w = 34 * (1 - d * 0.6);
				for (let k = 0; k < 4; k++) {
					const seg = (Math.sin(t * 1.7 + y * 0.9 + k * 2.1) * 0.5 + 0.5) * w;
					const x = cx - w + k * (w / 2) + Math.sin(t + y + k) * 3;
					s.rect(x, y, Math.max(2, seg * 0.45), 1, d < 0.4 ? sun : coral, 0.5 * (1 - d));
				}
			}
			// титры ползут вверх в боковых колонках по кругу: в любой момент видно несколько строк
			const lineH = 9;
			const span = credits.length * lineH;
			for (let i = 0; i < credits.length; i++) {
				const y = 16 + ((((i * lineH - t * 4) % span) + span) % span);
				if (y > y0 - 6) continue;
				const str = credits[i];
				const xL = 34;
				const xR = W - 34 - textWidth(str);
				const fade = Math.min(1, (y - 16) / 14, (y0 - 6 - y) / 14);
				text(s, i % 2 ? xR : xL, y, str, hex("#ffe6d0"), 0.35 * fade);
			}
		},
	};
}

const SCENES: Record<SceneId, () => Scene> = {
	start: sceneStart,
	glitch: sceneGlitch,
	factory: sceneFactory,
	neurons: sceneNeurons,
	armory: sceneArmory,
	range: sceneRange,
	vault: sceneVault,
	arcade: sceneArcade,
	sunset: sceneSunset,
};

// ---------- жизненный цикл ----------
const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let scene: Scene | null = null;
let baseLayer: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let surf: Ctx | null = null;
let t0 = 0;
let last = 0;
let reduce: MediaQueryList | null = null;

function draw(t: number, dt: number) {
	if (!ctx || !baseLayer || !scene || !surf) return;
	ctx.globalAlpha = 1;
	ctx.drawImage(baseLayer, 0, 0);
	scene.frame?.(surf, t, dt);
}

function loop(now: number) {
	raf = requestAnimationFrame(loop);
	if (document.hidden) return;
	if (now - last < 1000 / FPS - 2) return;
	const dt = Math.min(0.25, (now - last) / 1000);
	last = now;
	draw((now - t0) / 1000, dt);
}

function stop() {
	if (raf) cancelAnimationFrame(raf);
	raf = 0;
}

function shouldAnimate() {
	return props.animate && !(reduce?.matches ?? false);
}

function start() {
	stop();
	const el = canvas.value;
	if (!el) return;
	try {
		ctx = el.getContext("2d");
		if (!ctx) return;
		ctx.imageSmoothingEnabled = false;
		surf = new Ctx(ctx);
		scene = SCENES[getLevel(props.level).scene]();
		const bmp = new Bitmap();
		scene.base(bmp);
		baseLayer = document.createElement("canvas");
		baseLayer.width = W;
		baseLayer.height = H;
		baseLayer.getContext("2d")?.putImageData(bmp.img, 0, 0);
		t0 = performance.now();
		last = t0;
		// стоп-кадр берём на 2-й секунде: на нём уже есть сигналы, искры, бегущие лампы
		draw(2, 1 / FPS);
		if (shouldAnimate()) raf = requestAnimationFrame(loop);
	} catch (e) {
		// фон декоративный: ошибка отрисовки не должна ронять слайд
		console.warn("[LevelBackdrop] scene failed", e);
	}
}

function onMotionPref() {
	if (shouldAnimate()) {
		if (!raf) raf = requestAnimationFrame(loop);
	} else stop();
}

onMounted(() => {
	reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
	reduce.addEventListener("change", onMotionPref);
	start();
});
onBeforeUnmount(() => {
	stop();
	reduce?.removeEventListener("change", onMotionPref);
});
watch(() => props.level, start);
watch(() => props.animate, onMotionPref);
</script>

<template>
  <div class="level-backdrop" :data-scene="getLevel(props.level).scene" aria-hidden="true">
    <canvas ref="canvas" class="lb-canvas" :width="W" :height="H" />
    <div class="lb-scrim" />
  </div>
</template>

<style scoped>
.level-backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #07040f;
  pointer-events: none;
}
.lb-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
/* затемнение под контентом: центр глуше, края — сцена */
.lb-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(7, 4, 15, 0.72) 0, rgba(7, 4, 15, 0.45) 4.5rem, rgba(7, 4, 15, 0) 7.5rem),
    radial-gradient(ellipse 72% 66% at 50% 50%, rgba(7, 4, 15, 0.74) 0%, rgba(7, 4, 15, 0.6) 58%, rgba(7, 4, 15, 0.18) 100%);
}
</style>
