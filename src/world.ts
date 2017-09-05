import Vector2d from './vector';
import { default as Entity, EntityKind } from './entity';
import { IntersectionCheckKind } from "./physicsbody";

export default class World {

	private entityGroups: { [kind: number]: Entity[] } = {
		0: []
	}

	pool: { [kind: number]: Entity[] };

	private static instance: World;
	private roundCount: number = 0;

	private colliders: [EntityKind, EntityKind, IntersectionCheckKind, boolean][];

	constructor() {
		// this.gravity = new Vector2d(0, 1e-3);

		this.colliders = [];

		this.pool = {};
		// this.pool[EntityKind.PARTICLE] = [];
		// this.pool[EntityKind.BUBBLE] = [];
		// this.pool[EntityKind.COLLECTIBLE] = [];
		World.instance = this;
	}

	render(ctx: CanvasRenderingContext2D, time: number) {
		Object.keys(this.entityGroups).forEach((entityGroupKey_: string) => {
			const entityGroupKey = +entityGroupKey_;
			if (entityGroupKey === 0) {
				return;
			}

			const entityGroup = this.entityGroups[entityGroupKey];
			entityGroup.forEach(entity => {
				if (entity.isVisible) {
					entity.draw(ctx, time);
				}
			});
		});
	};

	animate(time: number) {
		this.roundCount++;

		this.resolveCollisions(time);

		this.entityGroups[EntityKind.ABSTRACT].forEach(entity => {
			if (entity.isAlive) {
				entity.animate(time);
			}
			// entity.applyGravity(this.gravity, time);
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

		this.colliders.forEach((collisionPair: [EntityKind, EntityKind, IntersectionCheckKind, boolean]) => {
			const freeEntityKind = collisionPair[0];
			const collidedEntityKind = collisionPair[1];
			const intersectionCheckKind = collisionPair[2];
			const isMutual = collisionPair[3];

			const freeEntities = this.entityGroups[freeEntityKind];
			const collidedEntities = this.entityGroups[collidedEntityKind];
			for (let i = 0; i < freeEntities.length; i++) {
				const freeEntity = freeEntities[i];
				if (freeEntity.isMarked || !freeEntity.isAlive) {
					continue;
				}

				for (let j = 0; j < collidedEntities.length; j++) {
					const collidedEntity = collidedEntities[j];
					if (collidedEntity.isMarked || !collidedEntity.isAlive) {
						continue;
					}

					if (freeEntity.body.intersects(collidedEntity.body, intersectionCheckKind)) {
						freeEntity.collideAction(collidedEntity, time);
						if (isMutual) {
							collidedEntity.collideAction(freeEntity, time);
						}
					}
				}
			}
		});
	}

	addCollisionPair(freeEntity: EntityKind, collidedEntity: EntityKind, intersectionCheckKind: IntersectionCheckKind, isMutual: boolean = false) {
		this.colliders.push([freeEntity, collidedEntity, intersectionCheckKind, isMutual]);
	}

	addEntities(entities: Entity[], entityKindOverride?: EntityKind) {
		entities.forEach(entity => this.addEntity(entity, entityKindOverride));
	}

	addEntity(entity: Entity, entityKindOverride?: EntityKind) {
		this.entityGroups[EntityKind.ABSTRACT].push(entity);

		let entityGroup: Entity[] = this.entityGroups[entityKindOverride || entity.kind];
		if (!entityGroup) {
			this.entityGroups[entityKindOverride || entity.kind] = [];
			entityGroup = this.entityGroups[entityKindOverride || entity.kind];
		}

		entityGroup.push(entity);
	}
}
