import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody from './physicsbody';
import World from './world';

type Color = any;

export class Particle extends Entity {
	shrinkage: number;
	private color: Color;
	gravityFactor: number;
	private restitution: number;

	constructor(world: World, center: Vector2d, size: number, color: Color, life: number, shrink: number) {
		super(EntityKind.PARTICLE, world);
		this.color = color;
		this.body = new PhysicsBody(center, new Vector2d(size / 2, size / 2));
		this.life = this.maxLife = life || 300;
		this.gravityFactor = 1;
		this.restitution = .3;
		this.shrinkage = (shrink ? (size / 2) / this.life : 0) * shrink;
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		let ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.fillStyle = this.color;
		ctx.fillRect(-w / 2, -h / 2, w, h);
		ctx.restore();
	}

	onAnimate(world: World, time: number) {
		this.body.corner.doSubtract([this.shrinkage * time, this.shrinkage * time]);
	}

	applyGravity(gravityVector: Vector2d, time: number) {
		this.body.applyAcceleration(gravityVector.multiply(this.gravityFactor), time);
	}

	// collideGround(other: Entity) {
	// 	this.body.speed[1] *= -this.restitution;
	// 	this.body.speed[0] *= this.restitution;
	// 	this.body.angularSpeed *= -this.restitution;
	// 	this.body.limitSpeed();
	// 	if (this.body.speed.getMagnitude() == 0) {
	// 		this.isOnGround = true;
	// 		this.body.angularSpeed = 0;
	// 	}
	// }

}