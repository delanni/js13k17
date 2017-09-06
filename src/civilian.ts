import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody from './physicsbody';
import World from './world';
import { Color } from "./utils";


export class Civilian extends Entity {
	color: Color;
	restitution: number;

	moveSpeedFactor: number = Math.random() * 0.001;

	moveDirection: Vector2d;

	constructor(center: Vector2d, size: number, moveDirection: Vector2d, color: Color) {
		super(EntityKind.CIVILIAN);
		this.color = color;
		this.body = new PhysicsBody(center, new Vector2d(size / 2, size / 2));
		this.restitution = .3;
		this.moveDirection = moveDirection;
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
		const ltwh = this.body.getLTWH();
		const l = ltwh[0], t = ltwh[1], w = ltwh[2] * 1.3, h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.fillStyle = this.color.toString();
		ctx.fillRect(-w / 2, -h / 2, w, h);

		ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
		ctx.restore();
	}

	onAnimate( time: number) {
		if (this.body.speed.getMagnitude() !== 0) {
			this.body.rotation = this.body.speed.toRotation();
		}
		this.body.applyAcceleration(this.moveDirection.normalize(this.moveSpeedFactor), time);
	}

	collideAction(otherEntity: Entity, time: number){
		if (otherEntity.kind === EntityKind.WALL) {
			const wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
			const projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
			this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(this.moveSpeedFactor * time * 2)));
			this.moveDirection = Vector2d.random();
		}
	}

	onRemove(): void {
	}
}
