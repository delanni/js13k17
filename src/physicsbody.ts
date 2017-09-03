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

	assertAllValues(){
		if (!this.acceleration.isOK()){
			alert("Acceleration is not ok");
			throw Error("Acceleration is not ok");
		}

		if (!this.speed.isOK()){
			alert("Speed is not ok");
			throw Error("Speed is not OK");
		}

		if (!this.center.isOK()){
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

	intersects(other: PhysicsBody): boolean {
		if (Math.abs(this.center[0] - other.center[0]) > (this.corner[0] + other.corner[0])) {
			return false;
		} else if (Math.abs(this.center[1] - other.center[1]) > (this.corner[1] + other.corner[1])) {
			return false;
		}
		return true;
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

	rotate(angle: number): void {
		this.rotation += angle;
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
