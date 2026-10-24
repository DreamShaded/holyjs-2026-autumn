<script setup lang="ts">
// Иконки-предметы акта 6: файлы модели как лут из сундука, лампочка выхода и сургучная печать.
// Все спрайты нарисованы здесь же, 12×12 (лампа 9×12, печать 8×8).
import { computed } from "vue";
import A6Sprite from "./A6Sprite.vue";

export type A6IconKind = "scroll" | "bag" | "passport" | "report" | "bulb" | "seal";

const props = withDefaults(defineProps<{ kind: A6IconKind; px?: number; on?: boolean }>(), {
	px: 4,
	on: true,
});

const SPRITES: Record<A6IconKind, { rows: string[]; palette: Record<string, string> }> = {
	// model.json — свёрнутый чертёж сборки
	scroll: {
		rows: [
			"oooooooooooo",
			"oPPPPPPPPPPo",
			"oooooooooooo",
			".obbbbbbbbo.",
			".obwwbwwwbo.",
			".obbbbbbbbo.",
			".obwwwwbwbo.",
			".obbbbbbbbo.",
			".obwbwwwwbo.",
			"oooooooooooo",
			"oPPPPPPPPPPo",
			"oooooooooooo",
		],
		palette: { o: "#0a3442", P: "#3ef0ff", b: "#11607a", w: "#c4fbff" },
	},
	// weights.bin — мешок с монетами-весами
	bag: {
		rows: [
			"...oooooo...",
			"....oyyo....",
			"...oooooo...",
			"...oyyyyo...",
			"..oywyyyyo..",
			".oywyyyyyyo.",
			".oyyyYYyyyo.",
			".oyyYyyyyyo.",
			".oyyyYYyyyo.",
			".oyyyyyYyyo.",
			"..oyyYYyyo..",
			"...oooooo...",
		],
		palette: { o: "#4a2e00", y: "#ffd23e", Y: "#a8740a", w: "#fff4b8" },
	},
	// meta.json — паспорт модели
	passport: {
		rows: [
			"oooooooooooo",
			"ommmmmmmmmmo",
			"omoooommmmmo",
			"omowwommwwmo",
			"omowwommmmmo",
			"omoooommwwmo",
			"ommmmmmmmmmo",
			"omwwwwwwwwmo",
			"ommmmmmmmmmo",
			"omwwwwwgggmo",
			"ommmmmmmmmmo",
			"oooooooooooo",
		],
		palette: { o: "#3b0f33", m: "#ff3ecf", w: "#ffd6f5", g: "#ffd23e" },
	},
	// cv.json — табель: пять столбиков оценок по кучкам
	report: {
		rows: [
			"oooooooooooo",
			"oppppppppppo",
			"opsssssssppo",
			"oppppppppppo",
			"oplppppplppo",
			"oplplppplppo",
			"oplplplplplo",
			"oplplplplplo",
			"oplplplplplo",
			"oppppppppppo",
			"opsspsspsspo",
			"oooooooooooo",
		],
		palette: { o: "#1f3d0a", p: "#e8ffd0", s: "#6aa83a", l: "#4fae12" },
	},
	bulb: {
		rows: [
			"..ooooo..",
			".oyyyyyo.",
			"oyywyyyyo",
			"oywyyyyyo",
			"oyyyyyyyo",
			"oyyyyyyyo",
			".oyyyyyo.",
			"..oyyyo..",
			"..ggggg..",
			"..hhhhh..",
			"..ggggg..",
			"...hhh...",
		],
		palette: { o: "#5a4a1a", y: "#ffe278", w: "#fffbe0", g: "#9a93b8", h: "#5b5480" },
	},
	seal: {
		rows: [
			"..rrrr..",
			".rddddr.",
			"rdwrrwdr",
			"rdrwwrdr",
			"rdrwwrdr",
			"rdwrrwdr",
			".rddddr.",
			"..rrrr..",
		],
		palette: { r: "#ff4d6d", d: "#9a1730", w: "#ffc2cc" },
	},
};

// Погасшая лампа: стекло и блик тёмные, контур приглушён.
const BULB_OFF = { o: "#3a3160", y: "#241c40", w: "#3a3160", g: "#6b6490", h: "#3f3a5e" };

const sprite = computed(() => {
	const s = SPRITES[props.kind];
	if (props.kind === "bulb" && !props.on) return { rows: s.rows, palette: BULB_OFF };
	return s;
});
</script>

<template>
  <A6Sprite :rows="sprite.rows" :palette="sprite.palette" :px="px" />
</template>
