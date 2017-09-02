export default class Vector2d {
	[idx: number]: number;

	constructor(x?: number, y?: number) {
		this[0] = x || 0;
		this[1] = y || 0;
	}

	static random(base: number = 1): Vector2d {
		const x = Math.random() * base - base / 2;
		const y = Math.random() * base - base / 2;
		return new Vector2d(x, y);
	}

	set(loc: Vector2d): Vector2d {
		this[0] = loc[0];
		this[1] = loc[1];
		return this;
	}

	add(other: Vector2d): Vector2d {
		return new Vector2d(this[0] + other[0], this[1] + other[1]);
	}

	doAdd(other: Vector2d): Vector2d {
		this[0] += other[0];
		this[1] += other[1];
		return this;
	}

	subtract(other: Vector2d): Vector2d {
		return new Vector2d(this[0] - other[0], this[1] - other[1]);
	}

	doSubtract(other: Vector2d): Vector2d {
		this[0] -= other[0];
		this[1] -= other[1];
		return this;
	}

	multiply(scalar: number): Vector2d {
		return new Vector2d(this[0] * scalar, this[1] * scalar);
	}

	doMultiply(scalar: number): Vector2d {
		this[0] *= scalar;
		this[1] *= scalar;
		return this;
	}

	getMagnitude(): number {
		return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
	}

	copy(): Vector2d {
		return new Vector2d(this[0], this[1]);
	}

	normalize(scaling: number = 1): Vector2d {
		const magnitude = this.getMagnitude();
		if (magnitude === 0){
			return new Vector2d();
		}
		return this.multiply(1 / magnitude * scaling);
	}

	toRotation(): number {
		return Math.atan2(this[1], this[0]) + Math.PI / 2;
	}
}