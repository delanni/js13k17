import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody from './physicsbody';
import World from './world';
import { Color } from "./utils";


export class Player extends Entity {
	color: Color;
	restitution: number;
	static PLAYER_SPEED_FACTOR = 0.001;

	constructor(world: World, center: Vector2d, size: number, color: Color) {
		super(EntityKind.PLAYER, world);
		this.color = color;
		this.body = new PhysicsBody(center, new Vector2d(size / 2, size / 2));
		this.restitution = .3;
	} 

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		const ltwh = this.body.getLTWH();
		const l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.fillStyle = this.color.toString();
		ctx.fillRect(-w / 2, -h / 2, w, h);

		ctx.fillRect(-w / 2, -h / 2 -10, w/2, h/2);
		ctx.restore();
	}

	onAnimate(world: World, time: number) {
		if (this.body.speed.getMagnitude() !== 0) {
			this.body.rotation = this.body.speed.toRotation();
		}
	}

	onRemove(): void {
	}
}
