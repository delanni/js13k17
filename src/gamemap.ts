
import Entity, { Animatable, Drawable, AnimatableDefault, EntityKind } from "./entity";
import World from "./world";
import PhysicsBody from "./physicsbody";
import Vector2d from "./vector";

export class GameMap extends AnimatableDefault implements Drawable {
    segments: GameMapSegment[];
    isVisible: boolean;

    draw(ctx: CanvasRenderingContext2D, world: World, time: number): void {
        if (this.isVisible) {
            this.segments.forEach(segment => {
                segment.draw(ctx, world, time);
            });
        }
    }

    onAnimate(world: World, time: number): void {

    }

    onRemove(): void {

    }

}

export class GameMapSegment extends AnimatableDefault implements Drawable {
    isVisible: boolean;
    elements: Entity[];

    draw(ctx: CanvasRenderingContext2D, world: World, time: number): void {
        if (this.isVisible) {
            this.elements.forEach(element => {
                element.draw(ctx, world, time);
            });
        }
    }

    onAnimate(world: World, time: number): void {

    }

    onRemove(): void {

    }
}

export class Wall extends Entity {
    static WALL_COLOR = "#398527";

    constructor(world: World, center: Vector2d, width: number, height: number, rotation: number) {
        super(EntityKind.WALL, world);
        this.body = new PhysicsBody(center, new Vector2d(width / 2, height / 2)).rotate(rotation);
    }

    onAnimate(world: World, time: number): void {
    }

    onRemove(): void {
    }

    draw(ctx: CanvasRenderingContext2D, world: World, time: number) {
        let ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = Wall.WALL_COLOR;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();

        this.body.getAABB().debugDraw(ctx);
        this.body.asPolygon().debugDraw(ctx);
    }
}