
import Vector2d from "../vector";
import Entity, { EntityKind } from "../entity";
import World from "../world";
import PhysicsBody, { Polygon } from "../physicsbody";

abstract class MapComponent {
    baseConnector: Connector;
    connectors: Connector[];
    entities: Entity[];
    walls: Wall[];
    isMaterialized: boolean;
    abstract materialize(connectTo: Connector): void;
    abstract createWalls(): void;

    connectTo(connectTo: Connector) {
        this.materialize(connectTo);
        if (!this.baseConnector){
            throw Error("This element cannot be connected. Please define the baseConnector");
        }
        connectTo.link = this.baseConnector;
        this.baseConnector.link = connectTo;
        this.isMaterialized = true;
        this.moveToPlace();
    }

    private moveToPlace() {
        const connectedBase = this.baseConnector.link;
        if (!connectedBase){
            return;
        }
        const rotation = connectedBase.rotation;
        const connectedBaseLocation = connectedBase.location.subtract(this.baseConnector.location.copy().rotate(-rotation));

        this.entities.forEach(entity => {
            entity.body.rotate(rotation);
            entity.body.center.doAdd(connectedBaseLocation);
        });

        this.connectors.forEach(connector => {
            connector.rotation += rotation;
            connector.location.doRotate(-rotation).doAdd(connectedBaseLocation);
        });

        this.baseConnector.location.set(connectedBase.location);
        this.baseConnector.rotation = connectedBase.rotation;
    }

    constructor(){
        this.connectors = [];
        this.entities = [];
        this.walls = [];
        this.isMaterialized = false;
    }
}

export class Connector {
    constructor(
        public location: Vector2d,
        public rotation: number,
        public openingWidth: number,
        public link: Connector | null = null){}
}

export class SpawnPoint extends MapComponent {
    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), 60, 60, 0);
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, 30), 0, 0
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -30), 0, 60)
        );
    }

    createWalls(): void {

    }
}

export class Walkway extends MapComponent {
    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), 90, 150, 0, "#ccffee");
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, 75), 0, 60
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -75), 0, 60),
            new Connector(new Vector2d(-45, -60), Math.PI/2, 60),
            new Connector(new Vector2d(45, -60), -Math.PI/2, 60)
        );
    }

    createWalls(): void {

    }

}

export class EndPoint extends MapComponent {
    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), 60, 60, 0, "#ffeeee");
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, 30), 0, 60
        );
    }
    createWalls(): void {

    }

}

export class Wall extends Entity {
    static WALL_COLOR = "#398527";

    constructor(center: Vector2d, width: number, height: number, rotation: number) {
        super(EntityKind.WALL);
        this.body = new PhysicsBody(center, new Vector2d(width / 2, height / 2)).rotate(rotation);
    }

    onAnimate(time: number): void {
    }

    onRemove(): void {
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
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

export class Floor extends Entity {
    static FLOOR_COLOR = "#e9c5e7";

    color: string;

    constructor(center: Vector2d, width: number, height: number, rotation: number, color: string = Floor.FLOOR_COLOR) {
        super(EntityKind.FLOOR);
        this.body = new PhysicsBody(center, new Vector2d(width / 2, height / 2)).rotate(rotation);
        this.color = color;
    }

    onAnimate(time: number): void {
    }

    onRemove(): void {
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        let ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
    }
}