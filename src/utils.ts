export function randBetween(min: number, max: number, floorit: boolean = false) {
	let n = Math.random() * (max - min) + min;
	return floorit ? Math.floor(n) : n;
}

export function randBetweenVector(arrayOrVector: { [index: number]: number }) {
	return randBetween(arrayOrVector[0], arrayOrVector[1]);
}

export function pickRandom<T>(array: T[]) {
	return array[randBetween(0, array.length, true)];
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function arrayOf<T>(size: number, filler: (index: number) => T): T[] {
	const array: T[] = new Array(size);

	for (let i = 0; i < size; i++) {
		array[i] = filler(i);
	}

	return array;
}

// export function maxInrange<T>(array: T[], from:number, to:number) {
// 	if (from >= 0 && to <= this.length && from < to) return Math.max.apply(null, this.slice(from, to));
// 	return NaN;
// }

// Array.prototype.random = function() {
// 	if (this.length <= 1) return this[0] || null;
// 	return this[randBetween(0, this.length, 1)];
// };
//
// Array.prototype.copy = function() {
// 	if (this.length == 2)
// 		return new Vector2d(this[0], this[1]);
// 	return this.slice();
// }

export function identity(e: any) {
	return e;
}

export function clone(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export type Constructable<T> = {
	new(...args: any[]): T
}

export class NumberRange {
	constructor(public min: number, public max: number = min) {
	}

	getRandom(): number {
		return randBetween(this.min, this.max);
	}

	static getRandom(target: NumberRange | number): number {
		if (target instanceof NumberRange) {
			return target.getRandom();
		} else {
			return target;
		}
	}
}


export class Color {
	private hexValue: string;

	constructor(hex: string) {
		this.hexValue = hex;
	}

	static fromRgb(r: number, g: number, b: number) {
		throw Error("Dont use this yet");
	}

	toString() {
		return this.hexValue;
	}

	valueOf() {
		return this.hexValue;
	}
}

export function shuffle<T>(array: T[]): T[] {
	return array.slice(0).sort(() => Math.random() - 0.5);
}
