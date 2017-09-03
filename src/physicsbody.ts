import Vector2d from "./vector";
import { clamp } from "./utils";

export default class PhysicsBody {
	private angularSpeed: number;
	public rotation: number;
	public friction: number;

	constructor(public readonly center: Vector2d = new Vector2d(),
		public readonly corner: Vector2d = new Vector2d(),
		public readonly speed: Vector2d = new Vector2d(),
		public readonly acceleration: Vector2d = new Vector2d()) {
		this.rotation = 0;
		this.angularSpeed = 0;
		this.friction = 0.006;
	}

	static EPSILON = 5e-3;
	static XLIMIT = 0.5;
	static YLIMIT = 0.5;

	tick(ms: number): void {
		this.move(this.speed.multiply(ms));
		this.rotate(this.angularSpeed * ms);
		this.speed.doAdd(this.acceleration.multiply(ms));
		this.speed.doMultiply(1 - this.friction * ms);
		this.limitSpeed();

		this.assertAllValues();
	}

	assertAllValues() {
		if (!this.acceleration.isOK()) {
			alert("Acceleration is not ok");
			throw Error("Acceleration is not ok");
		}

		if (!this.speed.isOK()) {
			alert("Speed is not ok");
			throw Error("Speed is not OK");
		}

		if (!this.center.isOK()) {
			alert("Center is not OK");
			throw Error("Center is not OK");
		}
	}

	move(vector: Vector2d) {
		this.center.doAdd(vector);
	}

	applyAcceleration(vector: Vector2d, time: number): void {
		this.speed.doAdd(vector.multiply(time));
		this.limitSpeed();
	}

	limitSpeed(): void {
		let mag = this.speed.getMagnitude();
		if (mag != 0) {
			if (mag < PhysicsBody.EPSILON) {
				this.speed.doMultiply(0);
			} else {
				if (Math.abs(this.speed[0]) > PhysicsBody.XLIMIT) {
					this.speed[0] = clamp(this.speed[0], -PhysicsBody.XLIMIT, PhysicsBody.XLIMIT);
				}
				if (Math.abs(this.speed[1]) > PhysicsBody.YLIMIT) {
					this.speed[1] = clamp(this.speed[1], -PhysicsBody.YLIMIT, PhysicsBody.YLIMIT);
				}
			}
		}
		if (Math.abs(this.angularSpeed) < PhysicsBody.EPSILON) this.angularSpeed = 0;
	}

	intersects(other: PhysicsBody, kind: IntersectionCheckKind): boolean {
		const thisAABB = this.getAABB();
		const otherAABB = other.getAABB();

		if (kind === IntersectionCheckKind.ROUND) {
			return this.center.subtract(other.center).getMagnitude() < (this.corner.getMagnitude() + other.corner.getMagnitude());
		} else {
			if (AABB.aabbIntersect(thisAABB, otherAABB)) {
				if (kind === IntersectionCheckKind.AABB) {
					return true;
				} else if (kind === IntersectionCheckKind.POLYGON) {
					return Polygon.polygonIntersect(this.asPolygon(), other.asPolygon());
				} else {
					throw new Error("Not implemented intersection check kind");
				}
			} else {
				return false;
			}
		}
	}

	/**
	 * Get [Left, Top, Width, Height] array
	 * @return An array containing coordinates for [left, top, width, height]
	 */
	getLTWH(): number[] {
		return [
			this.center[0] - this.corner[0],
			this.center[1] - this.corner[1],
			this.corner[0] * 2,
			this.corner[1] * 2];
	}

	getAABB(): AABB {
		const w = Math.abs(this.corner[0] * 2);
		const h = Math.abs(this.corner[1] * 2);
		const r = this.rotation;

		const sinner = Math.abs(Math.sin(r));
		const kosher = Math.abs(Math.cos(r));

		const width = h * sinner + w * kosher;
		const height = w * sinner + h * kosher;

		return new AABB(
			this.center.x - width / 2,
			this.center.y - height / 2,
			width,
			height);
	}

	asPolygon(): Polygon {
		const r = this.rotation;
		const w = this.corner[0] * 2;
		const h = this.corner[1] * 2;

		const a = new Vector2d(-w / 2, -h / 2).rotate(r).doAdd(this.center);
		const b = new Vector2d(w / 2, -h / 2).rotate(r).doAdd(this.center);
		const c = new Vector2d(w / 2, h / 2).rotate(r).doAdd(this.center);
		const d = new Vector2d(-w / 2, h / 2).rotate(r).doAdd(this.center);

		return new Polygon(a, b, c, d);
	}

	rotate(angle: number): PhysicsBody {
		this.rotation += angle;
		return this;
	}

	gravitateTo(location: Vector2d, time: number, gravityStrength: number = 0.5): void {
		const time_ = Math.max(time, 16);
		if (gravityStrength <= 3) {
			this.speed.set(location.subtract(this.center).multiply(time_ / 1000 * gravityStrength));
		} else {
			this.center.set(location);
		}
	}
}

export enum IntersectionCheckKind {
	AABB,
	ROUND,
	POLYGON
}

export class Polygon {
	public readonly points: Vector2d[];

	constructor(...points: Vector2d[]) {
		this.points = points;
	}

	/// Checks if the two polygons are intersecting.
	static polygonIntersect(a: Polygon, b: Polygon): boolean {
		let returnValue = true;
		[a, b].forEach(polygon => {
			for (let i1 = 0; i1 < polygon.points.length; i1++) {
				let i2 = (i1 + 1) % polygon.points.length;
				let p1 = polygon.points[i1];
				let p2 = polygon.points[i2];

				let normal = new Vector2d(p2[1] - p1[1], p1[0] - p2[0]);

				let minA: number | null = null
				let maxA: number | null = null;
				a.points.forEach(p => {
					var projected = normal[0] * p[0] + normal[1] * p[1];
					if (minA == null || projected < minA)
						minA = projected;
					if (maxA == null || projected > maxA)
						maxA = projected;
				});

				let minB: number | null = null;
				let maxB: number | null = null;
				b.points.forEach(p => {
					var projected = normal[0] * p[0] + normal[1] * p[1];
					if (minB == null || projected < minB)
						minB = projected;
					if (maxB == null || projected > maxB)
						maxB = projected;
				});

				if (maxA! < minB! || maxB! < minA!)
					returnValue = false;
			}
		});
		return returnValue;
	}

	getNormalAt(point: Vector2d): Vector2d {
		const pointsLength = this.points.length;
		const centroid = this.getCentroid();
		const pointRotation = point.subtract(centroid).toRotation();
		for (let i = 0; i < pointsLength; i++) {
			const thisPoint = this.points[i].subtract(centroid);
			const nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
			if (Polygon.isBetween(thisPoint.toRotation() , pointRotation , nextPoint.toRotation())) {
				return nextPoint.subtract(thisPoint).getNormal();
			}
		}
		return new Vector2d();
	}

	getSideVectorAt(point: Vector2d): Vector2d {
		const pointsLength = this.points.length;
		const centroid = this.getCentroid();
		const pointRotation = point.subtract(centroid).toRotation();
		for (let i = 0; i < pointsLength; i++) {
			const thisPoint = this.points[i].subtract(centroid);
			const nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
			if (Polygon.isBetween(thisPoint.toRotation() , pointRotation , nextPoint.toRotation())) {
				return nextPoint.subtract(thisPoint);
			}
		}
		return new Vector2d();
	}

	private static normalizeAngle(a: number) {
		return (a + Math.PI * 3) % (Math.PI*2) - Math.PI;
	}
	private static isBetween(angle1: number, target: number, angle2: number): boolean {
		const n1 = Polygon.normalizeAngle(angle1 - target);
		const n2 = Polygon.normalizeAngle(angle2 - target);
		return n1 <= 0 && 0 <= n2;
	}

	getCentroid(): Vector2d {
		const coordinateSum = this.points.reduce((accumulator, next) => {
			accumulator[0] += next.x;
			accumulator[1] += next.y;
			return accumulator;
		}, [0, 0]);
		return new Vector2d(coordinateSum[0] / this.points.length, coordinateSum[1] / this.points.length);
	}

	debugDraw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#ff0000";
		this.points.forEach(p => ctx.fillRect(p.x, p.y, 1, 1));
	}
}

export class AABB {
	get left(): number {
		return this.x;
	}
	get top(): number {
		return this.y;
	}
	get right(): number {
		return this.x + this.width;
	}
	get bottom(): number {
		return this.y + this.height;
	}

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number) {
	}

	static aabbIntersect(r1: AABB, r2: AABB): boolean {
		return !(r2.left > r1.right
			|| r2.right < r1.left
			|| r2.top > r1.bottom
			|| r2.bottom < r1.top);
	}

	debugDraw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = "#6894ca";
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
}