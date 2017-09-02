import Entity, { EntityKind } from './entity';
import Vector2d from './vector';
import PhysicsBody from './physicsbody';
import { Color, NumberRange } from './utils';
import { Explosion, ExplosionParameters } from './explosion';
import World, { CollisionType, ZIndex } from './world';
import { FireEmitter, Emitter, WaterEmitter, PoisonEmitter, LightningEmitter } from "./emitters";
import { Particle } from './particle';

export abstract class Projectile extends Entity {
	color: Color;

	constructor(entityKind: EntityKind, world: World, center: Vector2d, speed: Vector2d,
	            size: number | Vector2d, color: Color) {
		super(entityKind, world);
		this.life = this.maxLife = 1500;
		if (typeof size === "number") {
			this.body = new PhysicsBody(center.copy(), new Vector2d(size, size));
		} else {
			this.body = new PhysicsBody(center.copy(), size.copy());
		}
		this.body.speed.doAdd(speed);
		this.body.friction = 0;
		this.color = color;
	}

	abstract draw(ctx: CanvasRenderingContext2D, world: World, time: number): any;

	abstract collideAction(otherEntity: Entity): any;
}

export class Fireball extends Projectile {
	private emitter: Emitter;

	constructor(center: Vector2d, world: World) {
		super(EntityKind.FIREBALL, world, center, new Vector2d(0.2, 0), 3, new Color("#ff2222"));
		this.emitter = new FireEmitter(this, world);
		this.emitter.params[0].gravityFactor = new NumberRange(-0.2, 0.1);
		this.emitter.params[0].strength = 0.05;
		this.emitter.params[0].count = new NumberRange(0, 1);

		this.resources.push(this.emitter);
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		const ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2];
		ctx.save();
		ctx.translate(l + w / 2, t + w / 2);
		ctx.fillStyle = this.color.toString();
		ctx.fillRect(-w / 2, -w / 2, w, w);
		ctx.restore();
	}

	collideAction(other: Entity) {
		if (other.kind < 10) {
			// aa.play("hit");
			this.markForRemoval();
			const explosionParameters: ExplosionParameters = {
				gravityFactor: new NumberRange(.7),
				colors: [new Color("#ffcccc")],
				offset: this.body.speed.multiply(.5),
				zIndex: ZIndex.FOREGROUND,
				collisionType: CollisionType.COLLIDE_GROUND,
				shrink: .6,
				size: new NumberRange(1,5),
				life: new NumberRange(0,1000)
			};
			const exp = new Explosion(explosionParameters);
			exp.fire(this.body.center, this.world);
		}
	}
}


export class Waterbolt extends Projectile {
	emitter: WaterEmitter;

	constructor(center: Vector2d, world: World) {
		super(EntityKind.WATERBOLT, world, center, new Vector2d(0.2, 0), 3, new Color("#2930dc"));

		this.emitter = new WaterEmitter(this, world);
		this.emitter.params[0].count = new NumberRange(-1, 1);

		this.resources.push(this.emitter);
	}

	collideAction(other: Entity) {
		if (other.kind < 10) {
			// aa.play("hit");
			this.markForRemoval();
			const explosionParameters: ExplosionParameters = {
				gravityFactor: new NumberRange(.8),
				colors: [new Color("#9209da")],
				offset: this.body.speed.multiply(.25),
				zIndex: ZIndex.FOREGROUND,
				collisionType: CollisionType.COLLIDE_GROUND,
				shrink: .8,
				size: new NumberRange(1,2),
				life: new NumberRange(100, 1000)
			};
			const exp = new Explosion(explosionParameters);
			exp.fire(this.body.center, this.world);
		}
	};

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		const ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.strokeStyle = this.color.toString();
		ctx.beginPath();
		ctx.arc(0, 0, this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.restore();
	}
}

export class Poisonball extends Projectile {
	emitter: PoisonEmitter;

	constructor(center: Vector2d, world: World) {
		super(EntityKind.POISONBALL, world, center, new Vector2d(0.2, 0), 2, new Color("#aca920"));
		this.emitter = new PoisonEmitter(this, world);
		this.resources.push(this.emitter);
	}

	collideAction(other: Entity) {
		if (other.kind < 10) {
			// aa.play("hit");
			this.markForRemoval();
			const explosionParameters: ExplosionParameters = {
				gravityFactor: new NumberRange(-.3),
				colors: [new Color("#ca0920")],
				zIndex: ZIndex.FOREGROUND,
				collisionType: CollisionType.NO_COLLISION,
				shrink: 2,
				particleType: Particle,
				// particleType: Bubble,
				life: new NumberRange(150, 500),
				strength: 0.3,
				count: new NumberRange(4, 10),
				size: new NumberRange(1,4)
			};
			const exp = new Explosion(explosionParameters);
			exp.fire(this.body.center, this.world);
		}
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		const ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
		ctx.save();
		ctx.translate(l + w / 2, t + h / 2);
		ctx.rotate(this.body.rotation);
		ctx.fillStyle = this.color.toString();
		ctx.beginPath();
		ctx.arc(0, 0, this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.restore();
	}
}

export class Lightningbolt extends Projectile {
	emitter: LightningEmitter;

	constructor(center: Vector2d, world: World, speed: Vector2d) {
		super(EntityKind.LIGHTNINGBOLT, world, center, speed, 2, new Color("#c90a72"));

		this.emitter = new LightningEmitter(this, world);
		this.resources.push(this.emitter);
	}


	collideAction(other: Entity) {
		if (other.kind < 10) {
			// aa.play("hit");
			this.markForRemoval();
			const exp = new Explosion({
				size: new NumberRange(1),
				gravityFactor: new NumberRange(-.3, .3),
				colors: [new Color("#0239ba")],
				zIndex: ZIndex.FOREGROUND,
				collisionType: CollisionType.COLLIDE_GROUND,
				shrink: 0,
				life: new NumberRange(150, 500),
				strength: 0.3,
				count: new NumberRange(4, 10)
			});
			exp.fire(this.body.center, this.world);
		}
	};

	onAnimate(world: World, time: number) {
		this.body.center[1] += (Math.random() - 0.5) / 1300 * time * 155;
		this.resources.forEach(r => r.tick(world, time));
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
		const ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2];
		ctx.save();
		ctx.translate(l + w / 2, t + w / 2);
		ctx.fillStyle = this.color.toString();
		ctx.fillRect(-w / 2, -w / 2, w, w);
		ctx.restore();
	}
}
