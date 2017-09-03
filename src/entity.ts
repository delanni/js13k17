import World from "./world";
import Vector2d from './vector';
import { Emitter } from "./emitters";
import PhysicsBody from "./physicsbody";

export interface Animatable {
	animate(world: World, time: number): void;
	life: number;
	isAlive: boolean;
	resources: Animatable[];
}

export interface Drawable {
	draw(ctx: CanvasRenderingContext2D, world: World, time: number): void;
	isVisible: boolean;
}

export abstract class AnimatableDefault implements Animatable {
	life: number;
	isAlive: boolean;
	resources: Animatable[];
	body: PhysicsBody;
	isMarked: boolean;

	abstract onAnimate(world: World, time: number): void;
	abstract onRemove(): void;

	constructor() {
		this.resources = [];
		this.isAlive = true;
		this.isMarked = false;
	}

	animate(world: World, time: number) {
		if (!this.isAlive) return;
		if (this.body) {
			this.body.tick(time);
		}
		this.onAnimate(world, time);
		if (this.resources) {
			this.resources.forEach((e: Emitter) => {
				e.animate(world, time);
			});
		}
		this.life -= time;
		if (this.life < 0) {
			this.markForRemoval();
		}
	}

	markForRemoval() {
		this.isAlive = false;
		this.isMarked = true;
		this.onRemove();
		if (this.resources) {
			this.resources.length = 0;
		}
	}
}

export default abstract class Entity extends AnimatableDefault implements Drawable {
	maxLife: number;
	kind: EntityKind;
	isVisible: boolean;
	protected world: World;

	constructor(kind: EntityKind, world: World) {
		super();
		this.resources = [];
		this.world = world;
		this.kind = kind;
		this.isVisible = true;
		this.life = this.maxLife = Infinity;
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
	}

	collideAction(otherEntity: Entity) {
	}

	applyGravity(gravityVector: Vector2d, time: number) {
	}
}

export enum EntityKind {
	ABSTRACT = -1,

	// TARGETS
	FIRETARGET = 0,
	WATERTARGET = 1,
	POISONTARGET = 2,
	LIGHTNINGTARGET = 3,

	// REUSABLES
	PARTICLE = 92,
	BUBBLE = 91,
	COLLECTIBLE = 90,

	// PROJECTILES
	FIREBALL = 40,
	WATERBOLT = 41,
	POISONBALL = 42,
	LIGHTNINGBOLT = 43,

	// EMITTERS
	FIREEMITTER = 50,
	WATEREMITTER = 51,
	POISONEMITTER = 52,
	LIGHTNINGEMITTER = 53,

	// ETC
	PLAYER = 11,
	SPRITE = 10
}
