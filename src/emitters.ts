import { default as Entity, EntityKind, Animatable } from './entity';
import World from './world';
import { Explosion, ExplosionParameters } from './explosion';
import { Particle } from "./particle";
import { Color, NumberRange } from './utils';
import Vector2d from './vector';


export abstract class Emitter implements Animatable {
	life: number;
	isAlive: boolean;
	resources: Animatable[];
	kind: EntityKind;
	entity: Entity;
	world: World;
	exploders: Explosion[];
	params: ExplosionParameters[];

	constructor(entity: Entity, world: World, kind: EntityKind, ...params: ExplosionParameters[]) {
		this.entity = entity;
		this.world = world;
		this.kind = kind;
		this.params = params;
		this.exploders = this.params.map(x => new Explosion(x));
	}

	animate(world: World, time: number) {
		this.exploders.forEach(x => x.fire(this.entity.body.center, this.world));
	}
}

export class FireEmitter extends Emitter {
	constructor(entity: Entity, world: World) {
		super(entity, world, EntityKind.EMITTER, {
			gravityFactor: new NumberRange(-0.4, -0.1),
			life: new NumberRange(600, 1000),
			count: new NumberRange(0, 2),
			strength: 0.1,
			size: new NumberRange(8, 8),
			shrink: 1,
			colors: [new Color("#ffaaca")],
			particleType: Particle
		});
	}
}

export class PoisonEmitter extends Emitter {
	constructor(entity: Entity, world: World) {
		super(entity, world, EntityKind.EMITTER, {
			gravityFactor: new NumberRange(-0.2, -0.4),
			life: new NumberRange(600, 800),
			count: new NumberRange(0, 1),
			strength: 0.1,
			size: new NumberRange(2),
			shrink: 2,
			colors: [new Color("#3baa6f")],
			particleType: Particle // Bubble
		});
	}
}

export class WaterEmitter extends Emitter {
	constructor(entity: Entity, world: World) {
		super(entity, world, EntityKind.EMITTER, {
			gravityFactor: new NumberRange(0.1, 0.4),
			life: new NumberRange(600, 1000),
			count: new NumberRange(0, 2),
			offset: new Vector2d(0.1, 0),
			strength: 0.01,
			size: new NumberRange(4),
			shrink: 0.3,
			colors: [new Color("#fff60e")]
		});
	}
}

export class LightningEmitter extends Emitter {
	constructor(entity: Entity, world: World) {
		super(entity, world, EntityKind.EMITTER, {
			gravityFactor: new NumberRange(-.1, .1),
			life: new NumberRange(400, 700),
			count: new NumberRange(0, 1),
			strength: 0.1,
			size: new NumberRange(1, 2),
			shrink: 0,
			colors: [new Color("#ffac22")]
		}, {
			gravityFactor: new NumberRange(0),
			life: new NumberRange(200, 500),
			count: new NumberRange(0, 2),
			strength: 0.01,
			size: new NumberRange(1),
			shrink: 0,
			colors: [new Color("#4b86ac")]
		});
	}
}

