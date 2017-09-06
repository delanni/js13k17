
import Vector2d from "../vector";
import Entity, { EntityKind } from "../entity";
import World from "../world";
import PhysicsBody, { Polygon } from "../physicsbody";

const SCALER = 3;
const WALL_WIDTH = 10;

abstract class MapComponent {
    baseConnector: Connector;
    connectors: Connector[];
    entities: Entity[];
    walls: Wall[];
    isMaterialized: boolean;
    protected abstract materialize(connectTo: Connector): void;
    protected abstract createWalls(): void;

    connectTo(connectTo: Connector) {
        this.materialize(connectTo);
        if (!this.baseConnector) {
            throw Error("This element cannot be connected. Please define the baseConnector");
        }
        connectTo.link = this.baseConnector;
        this.baseConnector.link = connectTo;
        this.isMaterialized = true;
        this.createWalls();
        this.moveToPlace();
    }

    private moveToPlace() {
        const connectedBase = this.baseConnector.link;
        if (!connectedBase) {
            return;
        }
        const rotation = connectedBase.rotation;
        const connectedBaseLocation = connectedBase.location.subtract(this.baseConnector.location.copy().rotate(-rotation));

        this.entities.forEach(entity => {
            entity.body.rotate(rotation);
            entity.body.center.doRotate(-rotation).doAdd(connectedBaseLocation);
        });

        this.walls.forEach(wall => {
            wall.body.rotate(rotation);
            wall.body.center.doRotate(-rotation).doAdd(connectedBaseLocation);
        });

        this.connectors.forEach(connector => {
            connector.rotation += rotation;
            connector.location.doRotate(-rotation).doAdd(connectedBaseLocation);
        });

        this.baseConnector.location.set(connectedBase.location);
        this.baseConnector.rotation = connectedBase.rotation;
    }

    constructor() {
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
        public link: Connector | null = null) { }
}

export class SpawnPoint extends MapComponent {
    static SIZE = 60 * SCALER;

    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), SpawnPoint.SIZE, SpawnPoint.SIZE, 0);
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, SpawnPoint.SIZE / 2), 0, 0
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -SpawnPoint.SIZE / 2), 0, SpawnPoint.SIZE)
        );
    }

    createWalls(): void {

    }
}

export class Walkway extends MapComponent {
    public readonly length: number;
    public readonly width: number;

    constructor(length: number, width: number) {
        super();
        this.length = length * SCALER;
        this.width = width * SCALER;
    }

    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), this.width, this.length, 0, "#ccffee");
        this.entities.push(base);
        this.entities.push(new Floor(new Vector2d(0 + 30, 0), 5, 5, Math.PI / 4, "#000000"));
        this.baseConnector = new Connector(
            new Vector2d(0, this.length / 2), 0, this.width
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -this.length / 2), 0, this.width),
        );
    }

    createWalls(): void {
        this.walls.push(
            new Wall(new Vector2d(-this.width / 2, 0), WALL_WIDTH, this.length, 0),
            new Wall(new Vector2d(this.width / 2, 0), WALL_WIDTH, this.length, 0)
        )
    }
}

export class Splitter extends MapComponent {
    public readonly size: number;
    private halfSize: number;

    constructor(size: number) {
        super();
        this.size = size * SCALER;
        this.halfSize = this.size / 2;
    }

    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), this.size, this.size, 0, "#fcffae");
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, this.halfSize), 0, this.halfSize
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -this.halfSize), 0, this.halfSize),
            new Connector(new Vector2d(-this.halfSize, 0), Math.PI / 2, this.halfSize),
            new Connector(new Vector2d(this.halfSize, 0), -Math.PI / 2, this.halfSize)
        );
    }

    createWalls(): void {

    }
}

export class EndPoint extends MapComponent {
    static SIZE = 60 * SCALER;

    materialize(connectTo: Connector): void {
        const base = new Floor(new Vector2d(0, 0), EndPoint.SIZE, EndPoint.SIZE, 0, "#ffeeee");
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, EndPoint.SIZE / 2), 0, EndPoint.SIZE
        );
    }

    createWalls(): void {

    }
}

export class Closer extends MapComponent {
    public readonly width: number;

    constructor(width: number) {
        super();
        this.width = width * SCALER;
    }

    materialize(connectTo: Connector): void {
        this.baseConnector = new Connector(new Vector2d(0, 0), 0, 0);
    }

    createWalls(): void {
        this.walls.push(new Wall(new Vector2d(0, 0), this.width, WALL_WIDTH, 0));
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
        ctx.fillRect(-w / 2 - 1, -h / 2 - 1, w + 1, h + 1);
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
        ctx.fillRect(-w / 2 - 1, -h / 2 - 1, w + 1, h + 1);
        ctx.restore();
    }
}