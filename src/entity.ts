import World from "./world";
import Vector2d from './vector';
import { Emitter } from "./emitters";

export default abstract class Entity {
	maxLife: number;
	resources: Emitter[];
	kind : EntityKind;
	isVisible: boolean;
	isAlive: boolean;
	isOnGround: boolean;
	isMarked: boolean;
	life: number;
	protected world: World;

	constructor(kind: EntityKind, world: World) {
		this.resources = [];
		this.world = world;
		this.kind = kind;
		this.isVisible = true;
		this.isAlive = true;
		this.isOnGround = false;
		this.isMarked = false;
		this.life = this.maxLife = Infinity;
	}

	draw(ctx: CanvasRenderingContext2D, world: World, time: number) {

	}

	collideAction(otherEntity: Entity) {

	}

	applyGravity(gravityVector: Vector2d, time: number) {
	}

	// collideGround() {
	//
	// }

	onRemove() {

	}

	markForRemoval() {
		this.isVisible = false;
		this.isAlive = false;
		this.isMarked = true;
		this.onRemove();
		if (this.resources) {
			this.resources.length = 0;
		}
	}

	body: any;

	onAnimate(world: World, time: number) {

	}

	animate(world: World, time: number) {
		if (!this.isAlive) return;
		this.body.tick(time);
		this.onAnimate(world, time);
		if (this.resources) {
			this.resources.forEach((e: Emitter) => {
				e.tick(world, time);
			});
		}
		this.life -= time;
		if (this.life < 0 || this.life > this.maxLife) {
			this.markForRemoval();
		}
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