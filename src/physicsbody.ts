import Vector2d from "./vector";
import { clamp } from "./utils";

export default class PhysicsBody {
	private angularSpeed: number;
	private rotation: number;
	private friction: number;

	constructor(public center: Vector2d = new Vector2d(),
	            public corner: Vector2d = new Vector2d(),
	            public speed: Vector2d = new Vector2d(),
	            public acceleration: Vector2d = new Vector2d()) {
		this.rotation = 0;
		this.angularSpeed = 0;
		this.friction = 0.006;
	}

	static EPSILON = 5e-3;
	static XLIMIT = 0.5;
	static YLIMIT = 0.5;

	tick(ms: number) {
		this.move(this.speed.multiply(ms));
		this.rotate(this.angularSpeed * ms);
		this.speed.doAdd(this.acceleration.multiply(ms));
		this.speed.doMultiply(1 - this.friction * ms);
		this.limitSpeed();
	};

	move(vector: Vector2d) {
		this.center.doAdd(vector);
		return this;
	};

	applyAcceleration(vector: Vector2d, time: number) {
		this.speed.doAdd(vector.multiply(time));
		this.limitSpeed();
	};

	limitSpeed = function () {
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
	};

	intersects(other: PhysicsBody) {
		if (Math.abs(this.center[0] - other.center[0]) > (this.corner[0] + other.corner[0])) {
			return false;
		} else if (Math.abs(this.center[1] - other.center[1]) > (this.corner[1] + other.corner[1])) {
			return false;
		}
		return true;
	};

	getLTWH(): number[] {
		return [
			this.center[0] - this.corner[0],
			this.center[1] - this.corner[1],
			this.corner[0] * 2,
			this.corner[1] * 2];
	};

	rotate = function (angle: number) {
		this.rotation += angle;
	};

	gravitateTo(location: Vector2d, time: number) {
		time = Math.max(time, 16);
		this.speed = (location.subtract(this.center).multiply(time / 2000));
	};
}