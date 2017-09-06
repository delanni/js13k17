import Entity, { EntityKind } from './entity';
import PhysicsBody from './physicsbody';
import Vector2d from './vector';

type SpriteSheet = any;
type Animation = any;

class SpriteEntity extends Entity {
	spritesheet: any;
	private animations: Animation[];
	private currentAnimation: number;
	private scale: Vector2d;

	constructor(spritesheet: SpriteSheet, center: Vector2d, w: number, h: number, animations: Animation[]) {
		super(EntityKind.SPRITE);
		this.animations = [];
		this.currentAnimation = 0;
		this.body = new PhysicsBody(center.copy(), new Vector2d(w / 2, h / 2));
		this.spritesheet = spritesheet;
		this.scale = new Vector2d(1, 1);
		this.loadAnimations(animations);
	}

	loadAnimations(animations: Animation[]) {
		for (let i = 0; i < animations.length; i++) {
			const animation = this.spritesheet.getAnimation.apply(this.spritesheet, animations[i]);
			this.animations.push(animation);
		}
	}

	reset() {
		this.currentAnimation = 0;
	}

	setAnimation(i: number) {
		if (!this.animations[i]) return;
		this.animations[i].reset();
		this.currentAnimation = i;
	}

	draw(ctx: CanvasRenderingContext2D, time: number) {
		const a = this.animations[this.currentAnimation];
		a.drawFrame(ctx, time, this.body.center[0] - this.body.corner[0],
			this.body.center[1] - this.body.corner[1], this.scale[0], this.scale[1]);
	}

	onAnimate(time: number): void {
		
	}
	
	onRemove(): void {
		throw new Error("Method not implemented.");
	}
}
