import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody, { IntersectionCheckKind } from './physicsbody';
import World from './world';
import { Color } from "./utils";


export class Civilian extends Entity {
	color: Color;
	restitution: number;

	moveSpeedFactor: number = Math.random() * 0.0005 + 0.0003;

	moveDirection: Vector2d;

	personalSpaceRadius: number;

	constructor(center: Vector2d, size: number, moveDirection: Vector2d, color: Color) {
		super(EntityKind.CIVILIAN);
		// this.color = color;
		this.color = new Color("#00" + Math.floor(this.moveSpeedFactor * 1e4).toString(16) + "000");
		this.body = new PhysicsBody(center, new Vector2d(size / 2, size / 2));
		this.restitution = .3;
		this.moveDirection = moveDirection;
		this.personalSpaceRadius = size * 1.5;
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

	onAnimate(time: number) {
		if (this.body.speed.getMagnitude() !== 0) {
			this.body.rotation = this.body.speed.toRotation();
		}
		this.body.applyAcceleration(this.moveDirection.normalize(this.moveSpeedFactor), time);
	}

	collideAction(otherEntity: Entity, time: number) {
		if (otherEntity.kind === EntityKind.WALL) {
			const wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
			const projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
			this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(this.moveSpeedFactor * time * 2)));
			this.moveDirection = Vector2d.random();
		} else if (otherEntity.kind === EntityKind.CIVILIAN) {
			const connectionVector = this.body.center.subtract(otherEntity.body.center);
			this.body.applyAcceleration(connectionVector, 1/connectionVector.getMagnitude() * 0.01);
		} else if (otherEntity.kind === EntityKind.PLAYER) {
			const connectionVector = otherEntity.body.center.subtract(this.body.center);
			// this.body.speed.doMultiply(0);
			this.body.speed.doAdd(connectionVector.multiply(-0.005));
		}
	}

	collides(otherEntity: Entity, intersectionKind: IntersectionCheckKind): boolean {
		if (intersectionKind === IntersectionCheckKind.ROUND) {
			const distance = this.body.center.subtract(otherEntity.body.center).getMagnitude();
			return distance < (this.personalSpaceRadius + otherEntity.body.corner.getMagnitude());
		} else {
			return super.collides(otherEntity, intersectionKind);
		}
	}

	onRemove(): void {
	}
}
