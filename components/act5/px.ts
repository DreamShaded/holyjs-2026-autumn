// Пиксельные помощники акта 5 «Тренировка»: спрайты из строк для SVG с crispEdges.

export type Px = { x: number; y: number; k: string };

/**
 * Спрайт из строк: один символ — одна клетка, «.» — прозрачная.
 * Координаты в клетках; размер клетки задаёт компонент через viewBox.
 */
export function sprite(rows: readonly string[], ox = 0, oy = 0): Px[] {
	const out: Px[] = [];
	rows.forEach((row, y) => {
		for (let x = 0; x < row.length; x++) {
			const k = row[x];
			if (k !== ".") out.push({ x: ox + x, y: oy + y, k });
		}
	});
	return out;
}

/** Детерминированная псевдослучайная последовательность (mulberry32): одинаковая картинка при каждом показе. */
export function rng(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
