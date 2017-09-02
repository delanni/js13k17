
import Vector2d from "./vector";
import PhysicsBody from "./physicsbody";

export class Camera {
    body: PhysicsBody;
    target: { center: Vector2d } | null;
    // zoom: number = 1; // not easy lol

    constructor() {
        this.target = null;
        this.body = new PhysicsBody(new Vector2d(0, 0), new Vector2d(640 / 2, 480 / 2), new Vector2d(), new Vector2d());
    }

    getTranslation(): Vector2d {
        const ltwh = this.body.getLTWH();
        return new Vector2d(-ltwh[0], -ltwh[1]);
    }

    getRotation(): number {
        return -this.body.rotation;
    }

    animate(time: number): void {
        if (this.target !== null) {
            this.body.gravitateTo(this.target.center, time, .25);
        }
        this.body.tick(time);
    }
}