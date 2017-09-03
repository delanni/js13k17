
import Entity, { Animatable, Drawable, AnimatableDefault } from "./entity";
import World from "./world";

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
