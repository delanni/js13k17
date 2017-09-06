export default class Vector2d {
	[idx: number]: number;

	constructor(x?: number, y?: number) {
		this[0] = x || 0;
		this[1] = y || 0;
	}

	get x(): number {
		return this[0];
	}

	get y(): number {
		return this[1];
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
		if (magnitude === 0) {
			return new Vector2d();
		}
		return this.multiply(1 / magnitude * scaling);
	}

	doNormalize(scaling: number = 1): Vector2d {
		return this.set(this.normalize());
	}

	toRotation(): number {
		return Math.atan2(this[1], this[0]) + Math.PI / 2;
	}

	isOK(): boolean {
		return isFinite(this[0]) && isFinite(this[1]);
	}

	multiplyMatrix(matrix: Matrix2) {
		const x = this.x * matrix.m11 + this.y * matrix.m21;
		const y = this.x * matrix.m12 + this.y * matrix.m22;
		return new Vector2d(x, y);
	}

	getNormal() {
		return new Vector2d(this.y, -this.x);
	}

	rotate(tetha: number): Vector2d {
		const rotationMatrix = new Matrix2(
			Math.cos(tetha), Math.sin(tetha),
			-Math.sin(tetha), Math.cos(tetha)
		);
		return this.multiplyMatrix(rotationMatrix);
	}

	doRotate(tetha: number): Vector2d {
		const rotated = this.rotate(tetha);
		this.set(rotated);
		return this;
	}

	dotProduct(otherVector: Vector2d): number {
		return this.x * otherVector.x + this.y * otherVector.y;
	}

	project(otherVector: Vector2d): Vector2d {
		return otherVector.multiply(this.dotProduct(otherVector));
	}

	debugDraw(context: CanvasRenderingContext2D, color: string, size: number = 2) {
		context.fillStyle = color;
		context.fillRect(this.x, this.y, size, size);
	}
}

export class Matrix2 {
	constructor(
		public m11: number,
		public m12: number,
		public m21: number,
		public m22: number
	) { }
}
