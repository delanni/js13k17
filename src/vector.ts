export default class Vector2d {
	[idx: number]: number;

	constructor(x?: number, y?: number) {
		this[0] = x || 0;
		this[1] = y || 0;
	}

	static random(base: number = 1) {
		const x = Math.random() * base - base / 2;
		const y = Math.random() * base - base / 2;
		return new Vector2d(x, y);
	};

	set(loc: Vector2d) {
		this[0] = loc[0];
		this[1] = loc[1];
	};

	add(other: Vector2d) {
		return new Vector2d(this[0] + other[0], this[1] + other[1]);
	};

	doAdd(other: Vector2d) {
		this[0] += other[0];
		this[1] += other[1];
		return this;
	};

	subtract(other: Vector2d) {
		return new Vector2d(this[0] - other[0], this[1] - other[1]);
	};

	doSubtract(other: Vector2d) {
		this[0] -= other[0];
		this[1] -= other[1];
		return this;
	};

	multiply(scalar: number) {
		return new Vector2d(this[0] * scalar, this[1] * scalar);
	};

	doMultiply(scalar: number) {
		this[0] *= scalar;
		this[1] *= scalar;
		return this;
	};

	getMagnitude() {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
	};

	copy() {
		return new Vector2d(this[0], this[1]);
	};
}