import { NumberRange, Color, Constructable, randBetween, pickRandom, randBetweenVector } from './utils';
import { Particle } from './particle';
import World, { CollisionType, ZIndex } from './world';
import Vector2d from './vector';
import Entity from './entity';

export interface ExplosionParameters {
	count?: NumberRange;
	size: NumberRange;
	strength?: number;
	offset?: Vector2d;
	colors: Color[];
	center?: Vector2d;
	life: NumberRange;
	collisionType?: CollisionType;
	zIndex?: ZIndex;
	gravityFactor: NumberRange;
	shrink?: number;
	particleType?: Constructable<Entity>
}

export class Explosion {
	count: number;
	// zIndex: ZIndex;
	params: ExplosionParameters;
	// private collisionType: CollisionType;

	constructor(params: ExplosionParameters, timeFactor: number = NaN) {
		let tf = (timeFactor / 16.666);
		if (isNaN(tf)) {
			tf = 1;
		}

		this.params = {
			...params, ...{
				count: new NumberRange(15, 35),
				size: new NumberRange(1, 4),
				strength: .3,
				offset: new Vector2d(0, 0),
				colors: [new Color("#ec17fa"), new Color("#a2ffcb")],
				center: new Vector2d(0, 0),
				life: new NumberRange(400, 800),
				collisionType: CollisionType.NO_COLLISION,
				zIndex: ZIndex.BACKGROUND,
				gravityFactor: new NumberRange(1),
				shrink: 0,
				particleType: Particle
			}
		};
	}

	fire(xy: Vector2d, world: World): Entity[] {
		// let params = this.params;
		// let kind = pm.particleType.kind;
		let particles: Entity[] = [];
		let particleTypeConstructor: Constructable<Entity> | undefined = this.params.particleType;
		if (!particleTypeConstructor) {
			return particles;
		}

		for (let i = 0; i < this.count; i++) {
			// if (kind >= 90 && world.pool[kind].length) {
			// 	let part = world.pool[kind].pop();
			// 	part.isAlive = part.isVisible = !(part.isMarked = false);
			// 	part.fill(xy.copy(),
			// 		randBetween(pm.size),
			// 		pm.colors.random(),
			// 		randBetween(pm.life),
			// 		pm.shrink);
			// } else {
			let particle: Particle = new particleTypeConstructor(
				world,
				xy.copy(),
				this.params.size.getRandom(),
				pickRandom(this.params.colors),
				this.params.life.getRandom(),
				this.params.shrink) as Particle;
			// }
			particles.push(particle);
			particle.body.speed.set(Vector2d.random(this.params.strength).doAdd(this.params.offset || new Vector2d()));
			particle.gravityFactor = this.params.gravityFactor.getRandom();
			world.addEntity(particle, this.params.collisionType, this.params.zIndex);
		}
		return particles;
	}
}
