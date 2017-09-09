
import Vector2d from "./vector";
import PhysicsBody from "./physicsbody";
import { lerp } from "./utils";
import Entity, { EntityKind } from "./entity";

export class Camera extends Entity {
    onAnimate(time: number): void {
    }
    onRemove(): void {
    }

    width: number;
    height: number;
    body: PhysicsBody;
    target: { center: Vector2d } | null;
    zoom: number = 1; // not easy lol
    private zoomTarget: number = 1;

    constructor(width: number, height: number) {
        super(EntityKind.PLAYER);
        this.width = width;
        this.height = height;
        this.target = null;
        this.body = new PhysicsBody(new Vector2d(0, 0), new Vector2d(this.width / 2, this.height / 2), 0);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.body.center.x, this.body.center.y, 5, 5);
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(this.body.center.x - this.body.corner.x, this.body.center.y - this.body.corner.y, this.body.corner.x * 2, this.body.corner.y * 2)
        ctx.beginPath();
        ctx.moveTo(this.body.center.x - this.body.corner.x, this.body.center.y - this.body.corner.y);
        ctx.lineTo(this.body.center.x + this.body.corner.x, this.body.center.y + this.body.corner.y);
        ctx.stroke();
    }

    getTranslation(): Vector2d {
        const ltwh = this.body.getLTWH();
        return new Vector2d(-ltwh[0], -ltwh[1]);
    }

    animate(time: number): void {
        if (this.target !== null) {
            this.body.gravitateTo(this.target.center, time, .25);
        }
        this._zoom();
        this.body.tick(time);
        this.body.rotate(0.001);
    }

    zoomTo(zoom: number) {
        this.zoomTarget = zoom;
    }

    private _zoom(): void {
        if (this.zoom === this.zoomTarget) {
            return;
        } else {
            const targetZoom = lerp(this.zoom, this.zoomTarget, 0.1, 0.005);
            this.zoom = targetZoom;
            this.body.corner.setXY(this.width / 2 / this.zoom, this.height / 2 / this.zoom);
        }
    }
}
