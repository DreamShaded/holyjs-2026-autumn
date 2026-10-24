// Единый реестр уровней доклада: номер, название, цвета и сцена фона.
// Номер уровня слайда задаётся ключом `level: N` во фронтматтере; всё остальное
// (HUD, сплэш, фон, переход между актами) читает данные отсюда. Названия меняются только здесь.
import { useNav, useSlideContext } from "@slidev/client";
import type { SlideRoute } from "@slidev/types";
import { computed, inject, toRaw, unref } from "vue";

export type SceneId =
	| "start"
	| "glitch"
	| "factory"
	| "neurons"
	| "armory"
	| "range"
	| "vault"
	| "arcade"
	| "sunset";

export interface LevelInfo {
	n: number;
	/** название для HUD и сплэша */
	name: string;
	/** основной неоновый акцент уровня */
	accent: string;
	/** второй цвет: свечение, тени, детали сцены */
	accent2: string;
	scene: SceneId;
}

export const LEVELS: readonly LevelInfo[] = [
	{ n: 0, name: "PRESS START", accent: "#3ef0ff", accent2: "#ff3ecf", scene: "start" },
	{ n: 1, name: "Баг в пикселях", accent: "#ff4d6d", accent2: "#3ef0ff", scene: "glitch" },
	{ n: 2, name: "Фабрика данных", accent: "#ffe13e", accent2: "#ff9f3e", scene: "factory" },
	{ n: 3, name: "Теория", accent: "#3ef0ff", accent2: "#a98bff", scene: "neurons" },
	{ n: 4, name: "Арсенал", accent: "#ff9f3e", accent2: "#ff3ecf", scene: "armory" },
	{ n: 5, name: "Тренировка", accent: "#ff3ecf", accent2: "#ffe13e", scene: "range" },
	{ n: 6, name: "Артефакт", accent: "#ffd23e", accent2: "#3ef0ff", scene: "vault" },
	{ n: 7, name: "Метрики", accent: "#9dff3e", accent2: "#3ef0ff", scene: "arcade" },
	{ n: 8, name: "Финал", accent: "#ff7a59", accent2: "#ff3ecf", scene: "sunset" },
];

/** Последний уровень (для счётчика «LEVEL N/8»). */
export const LAST_LEVEL = LEVELS[LEVELS.length - 1].n;

/** Уровень по номеру; неизвестный или отсутствующий номер даёт уровень 0. */
export function getLevel(n: unknown): LevelInfo {
	const i = Number(n);
	return LEVELS.find((l) => l.n === i) ?? LEVELS[0];
}

/** Номер уровня слайда из его фронтматтера (`level: N`), без ключа — null. */
export function routeLevel(route: SlideRoute | undefined): number | null {
	const v = route?.meta?.slide?.frontmatter?.level;
	return v === undefined || v === null || v === "" ? null : Number(v);
}

/** CSS-переменные уровня для корня слоя или layout'а. */
export function levelVars(n: unknown): Record<string, string> {
	const l = getLevel(n);
	return { "--lvl-accent": l.accent, "--lvl-accent2": l.accent2 };
}

export const LEVEL_UP_TRANSITION = "level-up";

// Исходные переходы слайдов, которые мы подменили на level-up: нужны, чтобы вернуть
// значение, если граница уровней сместилась (HMR при правке фронтматтера).
const originalTransition = new WeakMap<object, unknown>();

/**
 * Ставит переход `level-up` на границе уровней.
 * В Slidev переход из фронтматтера слайда N играет между N и N+1 (вперёд и назад),
 * поэтому граница «последний слайд акта → первый слайд следующего» задаётся на последнем
 * слайде акта. Меняем только объект фронтматтера в рантайме, исходники не трогаем:
 * внутри актов остаются переходы оригинала.
 */
export function applyLevelTransitions(routes: readonly SlideRoute[]): void {
	for (let i = 0; i < routes.length; i++) {
		const fm = routes[i]?.meta?.slide?.frontmatter;
		if (!fm) continue;
		const raw = toRaw(fm) as Record<string, unknown>;
		const here = routeLevel(routes[i]);
		const next = routeLevel(routes[i + 1]);
		const boundary = here !== null && next !== null && here !== next;
		// читаем через reactive-прокси, чтобы эффект перезапускался после HMR фронтматтера,
		// а пишем в сырой объект, чтобы не зациклить его
		if (boundary && fm.transition !== LEVEL_UP_TRANSITION) {
			originalTransition.set(raw, raw.transition);
			raw.transition = LEVEL_UP_TRANSITION;
		} else if (!boundary && originalTransition.has(raw)) {
			raw.transition = originalTransition.get(raw);
			originalTransition.delete(raw);
		}
	}
}

/**
 * Навигация для глобальных слоёв. В режиме показа это общий `useNav()`, а при печати/экспорте
 * Slidev рендерит слои внутри каждой страницы и подкладывает свой nav через provide
 * (`$$slidev-context`); берём его, иначе на всех страницах PDF был бы один и тот же уровень.
 */
export function useLevelNav() {
	// biome-ignore lint/suspicious/noExplicitAny: внутренний контекст Slidev без публичного типа
	const injected = inject<any>("$$slidev-context", null);
	const globalNav = useNav();
	const nav = computed(() => injected?.nav ?? globalNav);
	const route = computed<SlideRoute | undefined>(() => unref(nav.value.currentSlideRoute));
	const slides = computed<SlideRoute[]>(() => unref(nav.value.slides) ?? []);
	const level = computed(() => routeLevel(route.value) ?? 0);
	const page = computed<number>(() => Number(unref(nav.value.currentPage)) || 1);
	const total = computed<number>(() => Number(unref(nav.value.total)) || slides.value.length);
	const isPrint = computed<boolean>(() => Boolean(unref(nav.value.isPrintMode)));
	return { globalNav, route, slides, level, page, total, isPrint };
}

/**
 * Уровень слайда внутри layout'а. `level` — служебный ключ фронтматтера Slidev (глубина в Toc),
 * поэтому в пропсы layout'а он не попадает; читаем его из фронтматтера слайда напрямую.
 */
export function useSlideLevel(fallback = 0) {
	const { $frontmatter } = useSlideContext();
	return computed(() => {
		const v = $frontmatter?.level;
		return v === undefined || v === null || v === "" ? fallback : Number(v);
	});
}
