import Vector2d from './vector';
import { default as Entity, EntityKind } from './entity';

type EntityGroupName =
	"nonCollidingEntities"
	| "collideAllEntities"
	| "collideGroundEntities"
	| "backgroundEntities"
	| "entities"
	| "centerEntities"
	| "foregroundEntities";

export default class World {

	private entityGroups: { [key: string]: Entity[] } = {
		allEntities: [],
		collidellEntities: [],
		nonCollidingEntities: [],
		backgroundEntities: [],
		centerEntities: [],
		foregroundEntities: [],
		collideGroundEntities: [],
		collideAllEntities: []
	}

	private gravity: Vector2d;

	pool: { [kind: number]: Entity[] };

	private static instance: World;
	private roundCount: number = 0;

	constructor() {
		this.gravity = new Vector2d(0, 1e-3);

		this.pool = {};
		// this.pool[EntityKind.PARTICLE] = [];
		// this.pool[EntityKind.BUBBLE] = [];
		// this.pool[EntityKind.COLLECTIBLE] = [];
		World.instance = this;
	}

	render(ctx: CanvasRenderingContext2D, time: number) {
		this.entityGroups.allEntities.forEach((entity) => {
			if (entity.isVisible) {
				entity.draw(ctx, this, time);
			}
		});
	};

	animate(time: number) {
		this.roundCount++;

		this.resolveCollisions(time);

		this.entityGroups.allEntities.forEach(entity => {
			if (entity.isAlive) {
				entity.animate(this, time);
			}
			entity.applyGravity(this.gravity, time);
		});
	};


	clear() {

		// this.containers.forEach((egName: EntityGroupName) => {
		// 	let entityGroup = this[egName];
		// 	if (this.containers.indexOf(egName) < 3) {
		// 		this[egName] = entityGroup.filter((en) => {
		// 			if (en && en.isMarked) {
		// 				if (en.kind >= 90) {
		// 					this.pool[en.kind].push(en);
		// 				}
		// 				return false;
		// 			}
		// 			return true;
		// 		});
		// 	} else {
		// 		this[egName] = entityGroup.filter((en) => {
		// 			return !(en && en.isMarked);
		// 		});
		// 	}
		// });
	};

	resolveCollisions(time: number) {
		// let ents = this.collideGroundEntities,
		// 	lt = ents.length,
		// 	ej = this.groundElement,
		// 	ei;
		// for (let i = 0; i < lt; i++) {
		// 	ei = ents[i];
		// 	if (ei && !ei.isMarked && !ei.isOnGround && ej.collidesWith(ei.body)) ei.collideGround(ej);
		// }
		//
		// ents = this.collideAllEntities;
		// lt = ents.length;
		// for (let i = 0; i < lt; i++) {
		// 	ei = ents[i];
		// 	if (!ei || ei.isMarked || !ei.isAlive) continue;
		// 	for (j = i + 1; j < lt; j++) {
		// 		ej = ents[j];
		// 		if (!ej || ej.isMarked || !ej.isAlive || ej.body.center[0] - parrot.body.center[0] > 300) continue;
		// 		if (ei.body.intersects(ej.body)) {
		// 			ei.collideAction(ej);
		// 			ej.collideAction(ei);
		// 			break;
		// 		}
		// 	}
		// }
	}

	addEntities(entities: Entity[], collisionType: CollisionType = CollisionType.NO_COLLISION, zIndex: ZIndex = ZIndex.CENTER) {
		entities.forEach(entity => this.addEntity(entity, collisionType, zIndex));
	}

	addEntity(e: Entity, collisionType: CollisionType = CollisionType.NO_COLLISION, zIndex: ZIndex = ZIndex.CENTER) {
		this.entityGroups.allEntities.push(e);

		switch (collisionType) {
			case CollisionType.NO_COLLISION:
				this.entityGroups.nonCollidingEntities.push(e);
				break;
			case CollisionType.COLLIDE_GROUND:
				this.entityGroups.collideGroundEntities.push(e);
				break;
			case CollisionType.COLLIDE_ALL:
				this.entityGroups.collideAllEntities.push(e);
				break;
			default:
				this.entityGroups.nonCollidingEntities.push(e);
				break;
		}

		switch (zIndex) {
			case ZIndex.BACKGROUND:
				this.entityGroups.backgroundEntities.push(e);
				break;
			case ZIndex.CENTER:
				this.entityGroups.centerEntities.push(e);
				break;
			case ZIndex.FOREGROUND:
				this.entityGroups.foregroundEntities.push(e);
				break;
			default:
				this.entityGroups.centerEntities.push(e);
				break;
		}
	}
}

export enum CollisionType {
	NO_COLLISION = 0,
	COLLIDE_GROUND = 1,
	COLLIDE_ALL = 2
}

export enum ZIndex {
	FOREGROUND = 2,
	CENTER = 0,
	BACKGROUND = 1
}
