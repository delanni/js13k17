import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody from './physicsbody';
import World from './world';
import { Color } from "./utils";


export class Player extends Entity {
	color: Color;
	restitution: number;
	hasControl: boolean = true;
	static PLAYER_SPEED_FACTOR = 0.001;

	constructor(center: Vector2d, size: number, color: Color) {
		super(EntityKind.PLAYER);
		this.color = color;
		this.body = new PhysicsBody(center, new Vector2d(size / 2, size / 2));
		this.restitution = .3;
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
		const ltwh = this.body.getLTWH();
		const l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.fillStyle = this.color.toString();
		ctx.fillRect(-w / 2, -h / 2, w, h);

		ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
		ctx.restore();

		this.body.getAABB().debugDraw(ctx);
		this.body.asPolygon().debugDraw(ctx);
	}

	onAnimate(time: number) {
		if (this.body.speed.getMagnitude() !== 0) {
			this.body.rotation = this.body.speed.toRotation();
		}
	}

	onRemove(): void {
	}

	collideAction(otherEntity: Entity, time: number) {
		this.color = new Color("#de8228");

		if (otherEntity.kind === EntityKind.WALL) {
			const wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
			const projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
			this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(Player.PLAYER_SPEED_FACTOR * time)));
			this.hasControl = false;
			setTimeout(() => { this.color = new Color("#39fa93"); this.hasControl = true; }, 300);			
		} else if (otherEntity.kind === EntityKind.CIVILIAN) {
			const connectionVector = otherEntity.body.center.subtract(this.body.center);
			// this.body.speed.doMultiply(0);
			this.body.speed.doAdd(connectionVector.multiply(-0.005));
			this.hasControl = false;
			setTimeout(() => { this.color = new Color("#39fa93"); this.hasControl = true; }, 200);
		}
	}

	move(direction: Vector2d, time: number) {
		if (this.hasControl) {
			this.body.applyAcceleration(direction.normalize(Player.PLAYER_SPEED_FACTOR), time);
		}
	}
}
