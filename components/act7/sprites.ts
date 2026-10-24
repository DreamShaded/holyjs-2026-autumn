// Пиксельные спрайты уровня 7 «Метрики»: рыба, ботинок, ученик, звезда, кролик, «портреты» свойств.
// Спрайт задаётся строками: один символ — одна клетка, «.» — пусто.
// Символ — ключ палитры; цвет подставляет компонент A7Sprite.

export type SpriteRows = readonly string[];

/** Рыба смотрит влево: G — тело, g — брюхо, K — глаз. 13×7. */
export const FISH: SpriteRows = [
	".....GGG.....",
	"...GGGGGGG..G",
	".GGKGGGGGGGGG",
	"GGGGGGGGGGGG.",
	".GGGGGGGGGGGG",
	"...ggggggg..G",
	".....ggg.....",
];

/** Старый ботинок: B — кожа, b — шнуровка, S — подошва. 11×9. */
export const BOOT: SpriteRows = [
	"..BBBBB....",
	"..BbBbB....",
	"..BBBBB....",
	"..BbBbB....",
	"..BBBBB....",
	"..BBBBBBB..",
	".BBBBBBBBB.",
	".BBBBBBBBBB",
	".SSSSSSSSSS",
];

/** Ученик для аналогии со старостой: H — голова, P — туловище. 5×7. */
export const PERSON: SpriteRows = [".HHH.", ".HHH.", "..H..", "PPPPP", ".PPP.", ".P.P.", ".P.P."];

/** Звезда рейтинга уровня. 11×10. */
export const STAR: SpriteRows = [
	".....Y.....",
	".....Y.....",
	"....YYY....",
	"YYYYYYYYYYY",
	".YYYYYYYYY.",
	"..YYYYYYY..",
	"..YYYYYYY..",
	".YYYY.YYYY.",
	".YYY...YYY.",
	"YY.......YY",
];

/** Кролик сидит: W — шерсть, p — уши и нос, K — глаза. 10×12. */
export const RABBIT: SpriteRows = [
	".WW...WW..",
	".Wp...pW..",
	".Wp...pW..",
	".WW...WW..",
	".WWWWWWW..",
	"WWKWWWKWW.",
	"WWWWpWWWW.",
	".WWWWWWW..",
	"..WWWWWW..",
	".WWWWWWWW.",
	"WWWWWWWWWW",
	".WW....WW.",
];

/** «Портреты» бойцов-свойств на экране статов. 9×9, C — основной цвет, c — второй. */
export const PORTRAITS: Record<string, SpriteRows> = {
	border: [
		"CCCCCCCCC",
		"C.......C",
		"C.ccccc.C",
		"C.c...c.C",
		"C.c...c.C",
		"C.c...c.C",
		"C.ccccc.C",
		"C.......C",
		"CCCCCCCCC",
	],
	lineHeight: [
		"c........",
		"c.CCCCCCC",
		"c........",
		"c........",
		"c.CCCCC..",
		"c........",
		"c........",
		"c.CCCCCCC",
		"c........",
	],
	color: [
		"RRRR.GGGG",
		"RRRR.GGGG",
		"RRRR.GGGG",
		"RRRR.GGGG",
		".........",
		"BBBB.YYYY",
		"BBBB.YYYY",
		"BBBB.YYYY",
		"BBBB.YYYY",
	],
	fontWeight: [
		"CCCCCCC..",
		"CCC..CCC.",
		"CCC..CCC.",
		"CCCCCCC..",
		"CCC..CCC.",
		"CCC...CCC",
		"CCC...CCC",
		"CCC..CCC.",
		"CCCCCCC..",
	],
	letterSpacing: [
		".........",
		".C.....C.",
		"C.C...C.C",
		"CCC...CCC",
		"C.C...C.C",
		".........",
		"c.......c",
		"ccccccccc",
		"c.......c",
	],
};

/** Палитры рыбы и ботинка: рыба — лайм (попадание), ботинок — красный (мусор). */
export const FISH_PAL = { G: "#9dff3e", g: "#5fbf2a", K: "#07040f" };
export const BOOT_PAL = { B: "#ff4d6d", b: "#ffc2cf", S: "#6a1830" };

/** Обитатель озера вне сети: координаты левого верхнего угла в пикселях экрана A7Pond. */
export type Swimmer = { kind: "fish" | "boot"; x: number; y: number; flip?: boolean };

export type Run = { x: number; y: number; w: number; k: string };

/**
 * Склеивает подряд идущие клетки одного ключа в горизонтальные отрезки:
 * вместо сотни прямоугольников на спрайт получается десяток.
 */
export function spriteRuns(rows: SpriteRows): Run[] {
	const out: Run[] = [];
	rows.forEach((row, y) => {
		let x = 0;
		while (x < row.length) {
			const k = row[x];
			let w = 1;
			while (x + w < row.length && row[x + w] === k) w++;
			if (k !== "." && k !== " ") out.push({ x, y, w, k });
			x += w;
		}
	});
	return out;
}

/** Размер спрайта в клетках. */
export function spriteSize(rows: SpriteRows): { w: number; h: number } {
	return { w: rows.reduce((m, r) => Math.max(m, r.length), 0), h: rows.length };
}
