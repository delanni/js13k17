import World from "./world";
import Vector2d from './vector';
import { Emitter } from "./emitters";
import PhysicsBody, { IntersectionCheckKind } from "./physicsbody";

export interface Animatable {
	animate(time: number): void;
	life: number;
	isAlive: boolean;
	resources: Animatable[];
}

export interface Drawable {
	draw(ctx: CanvasRenderingContext2D, time: number): void;
	isVisible: boolean;
}

export abstract class AnimatableDefault implements Animatable {
	life: number;
	isAlive: boolean;
	resources: Animatable[];
	body: PhysicsBody;
	isMarked: boolean;

	abstract onAnimate(time: number): void;
	abstract onRemove(): void;

	constructor() {
		this.resources = [];
		this.isAlive = true;
		this.isMarked = false;
	}

	animate(time: number) {
		if (!this.isAlive) return;
		if (this.body) {
			this.body.tick(time);
		}
		this.onAnimate(time);
		if (this.resources) {
			this.resources.forEach((e: Emitter) => {
				e.animate(time);
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

	constructor(kind: EntityKind) {
		super();
		this.resources = [];
		this.kind = kind;
		this.isVisible = true;
		this.life = this.maxLife = Infinity;
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
	}

	collideAction(otherEntity: Entity, time: number) {
	}

	collides(otherEntity: Entity, intersectionKind: IntersectionCheckKind): boolean {
		return this.body.intersects(otherEntity.body, intersectionKind);
	}

	applyGravity(gravityVector: Vector2d, time: number) {
	}
}

export enum EntityKind {
	ABSTRACT,

	PROJECTILE,
	EMITTER,

	// REUSABLES
	PARTICLE,
	BUBBLE,
	COLLECTIBLE,

	// ETC
	SPRITE,
	FLOOR,
	WALL,
	CIVILIAN,
	PLAYER
}
