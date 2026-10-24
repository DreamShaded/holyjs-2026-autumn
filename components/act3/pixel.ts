// Пиксельные помощники акта 3 «Теория»: растеризация отрезков и спрайты из строк.
// Всё рисуется прямоугольниками в SVG с shape-rendering: crispEdges.

export type Cell = { x: number; y: number };

/**
 * Клетки сетки шага p вдоль отрезка (x0,y0)–(x1,y1), алгоритм Брезенхэма.
 * Возвращает левые верхние углы клеток в координатах SVG.
 */
export function rasterLine(x0: number, y0: number, x1: number, y1: number, p: number): Cell[] {
	let cx = Math.round(x0 / p);
	let cy = Math.round(y0 / p);
	const ex = Math.round(x1 / p);
	const ey = Math.round(y1 / p);
	const dx = Math.abs(ex - cx);
	const dy = -Math.abs(ey - cy);
	const sx = cx < ex ? 1 : -1;
	const sy = cy < ey ? 1 : -1;
	let err = dx + dy;
	const out: Cell[] = [];
	// защита от бесконечного цикла на некорректных входах
	for (let guard = 0; guard < 2048; guard++) {
		out.push({ x: cx * p - p / 2, y: cy * p - p / 2 });
		if (cx === ex && cy === ey) break;
		const e2 = 2 * err;
		if (e2 >= dy) {
			err += dy;
			cx += sx;
		}
		if (e2 <= dx) {
			err += dx;
			cy += sy;
		}
	}
	return out;
}

export type SpritePx = { x: number; y: number; k: string };

/**
 * Спрайт из строк: один символ — один пиксель размера p, «.» — прозрачный.
 * k — символ палитры, цвет задаёт CSS-класс `px-<k>` у компонента.
 */
export function spriteCells(rows: string[], p: number, ox = 0, oy = 0): SpritePx[] {
	const out: SpritePx[] = [];
	rows.forEach((row, r) => {
		for (let c = 0; c < row.length; c++) {
			const k = row[c];
			if (k !== ".") out.push({ x: ox + c * p, y: oy + r * p, k });
		}
	});
	return out;
}

/** Восьмиугольник «пиксельного круга»: прямоугольник со срезанными ступенькой углами. */
export function notchedRect(x: number, y: number, w: number, h: number, n: number): string {
	return [
		[x + n, y],
		[x + w - n, y],
		[x + w - n, y + n],
		[x + w, y + n],
		[x + w, y + h - n],
		[x + w - n, y + h - n],
		[x + w - n, y + h],
		[x + n, y + h],
		[x + n, y + h - n],
		[x, y + h - n],
		[x, y + n],
		[x + n, y + n],
	]
		.map((pt) => pt.join(","))
		.join(" ");
}
