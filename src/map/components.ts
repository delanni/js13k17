
import Vector2d from "../vector";
import Entity, { EntityKind, Drawable } from "../entity";
import World from "../world";
import PhysicsBody, { Polygon, IntersectionCheckKind } from "../physicsbody";
import { Color } from "../utils";

const SCALER = 2;
const WALL_WIDTH = 10;

export enum MapComponentKind {
    SPAWN,
    ENDPOINT,
    HALL,
    SPLITTER,
    CLOSER,
    TERMINAL
}

export abstract class MapComponent {
    baseConnector: Connector;
    connectors: Connector[];
    entities: Entity[];
    walls: Wall[];
    private isMaterialized: boolean;
    kind: MapComponentKind;
    protected abstract materialize(): void;
    protected abstract createWalls(): void;

    connectTo(connectTo: Connector) {
        this.materialize();
        if (!this.isMaterialized) {
            if (!this.baseConnector) {
                throw Error("This element cannot be connected. Please define the baseConnector");
            } else {
                this.baseConnector.owner = this;
            }
            this.connectors.forEach(c => c.owner = this);
            this.isMaterialized = true;
        }
        connectTo.link = this.baseConnector;
        this.baseConnector.link = connectTo;
        this.createWalls();
        this.closeOpenings();
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
            if (entity.body) {
                entity.body.rotate(rotation);
                entity.body.center.doRotate(-rotation).doAdd(connectedBaseLocation);
            }
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

    protected closeOpenings(): void {
        const link = this.baseConnector.link;
        if (!link) {
            return;
        } else {
            const halfSize = this.baseConnector.openingWidth / 2;
            const halfOpeningSize = link.openingWidth / 2;
            const baseConnectorY = this.baseConnector.location.y;
            const wallCenterOffset = halfOpeningSize + (halfSize - halfOpeningSize) / 2;
            const leftBlocker = new Wall(new Vector2d(-wallCenterOffset, baseConnectorY), Math.abs(halfSize - halfOpeningSize) + WALL_WIDTH, WALL_WIDTH);
            const rightBlocker = new Wall(new Vector2d(wallCenterOffset, baseConnectorY), Math.abs(halfSize - halfOpeningSize) + WALL_WIDTH, WALL_WIDTH);
            this.walls.push(leftBlocker, rightBlocker);
        }
    }

    // TODO: optimize with bounding box around the component
    overlaps(otherComponent: MapComponent): boolean {
        if (this.baseConnector.link && this.baseConnector.link.owner === otherComponent) return false;
        for (let entity of this.entities) {
            for (let otherEntity of otherComponent.entities) {
                if (entity.collides(otherEntity, IntersectionCheckKind.POLYGON)) {
                    return true;
                }
            }
        }
        return false;
    }

    constructor(kind: MapComponentKind) {
        this.connectors = [];
        this.entities = [];
        this.walls = [];
        this.isMaterialized = false;
        this.kind = kind;
    }
}

export class Connector {
    constructor(
        public location: Vector2d,
        public rotation: number,
        public openingWidth: number,
        public link: Connector | null = null,
        public owner: MapComponent | null = null) { }
}

export class Terminal extends MapComponent {
    size: number;
    halfSize: number;
    id: string;

    constructor(size: number, id: string) {
        super(MapComponentKind.TERMINAL);
        this.id = id;
        this.size = size * SCALER;
        this.halfSize = this.size / 2;
    }

    materialize(): void {
        const base = new Floor(new Vector2d(0, 0), this.size, this.size);
        const decal = new Decal(this.id, new Color("lightblue"), new Vector2d(0, -this.size / 4), this.size / 4, 0);

        const terminalExit = new TriggerArea(new Vector2d(0, -this.size / 4), this.size / 2, this.size / 2);
        this.entities.push(base, decal, terminalExit);
        this.baseConnector = new Connector(
            new Vector2d(0, this.halfSize), 0, this.size
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -this.halfSize), 0, this.size)
        );
    }

    createWalls(): void {
        this.walls.push(
            new Wall(new Vector2d(this.halfSize, 0), WALL_WIDTH, this.size),
            new Wall(new Vector2d(-this.halfSize, 0), WALL_WIDTH, this.size)
        )
    }
}

export class Walkway extends MapComponent {
    public readonly length: number;
    public readonly width: number;

    constructor(length: number, width: number) {
        super(MapComponentKind.HALL);
        this.length = length * SCALER;
        this.width = width * SCALER;
    }

    materialize(): void {
        const base = new Floor(new Vector2d(0, 0), this.width, this.length);
        this.entities.push(base);
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
        );
    }
}

export class Splitter extends MapComponent {
    public readonly size: number;
    private halfSize: number;

    constructor(size: number) {
        super(MapComponentKind.SPLITTER);
        this.size = size * SCALER;
        this.halfSize = this.size / 2;
    }

    materialize(): void {
        const base = new Floor(new Vector2d(0, 0), this.size, this.size);
        this.entities.push(base);
        this.baseConnector = new Connector(
            new Vector2d(0, this.halfSize), 0, this.size
        );
        this.connectors.push(
            new Connector(new Vector2d(0, -this.halfSize), 0, this.size),
            new Connector(new Vector2d(-this.halfSize, 0), Math.PI / 2, this.size),
            new Connector(new Vector2d(this.halfSize, 0), -Math.PI / 2, this.size)
        );
    }

    createWalls(): void {
    }
}

export class Closer extends MapComponent {
    constructor() {
        super(MapComponentKind.CLOSER);
    }

    materialize(): void {
        this.baseConnector = new Connector(new Vector2d(0, 0), 0, 0);
    }

    createWalls(): void {
    }
}


export class BoxEntity extends Entity {
    constructor(
        public kind: EntityKind,
        public center: Vector2d,
        public width: number,
        public height: number,
        public rotation: number,
        public color: Color,
        public overdrawWidth: number) {
        super(kind);
        this.body = new PhysicsBody(center, new Vector2d(width / 2, height / 2), rotation);
    }

    onAnimate(time: number): void {
    }
    onRemove(): void {
    }

    draw(ctx: CanvasRenderingContext2D, time: number): void {
        let ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(-w / 2 - this.overdrawWidth, -h / 2 - this.overdrawWidth, w + this.overdrawWidth, h + this.overdrawWidth);
        ctx.restore();
    }
}

export class Wall extends BoxEntity {
    constructor(center: Vector2d, width: number, height: number, rotation: number = 0) {
        super(EntityKind.WALL, center, width, height, rotation, new Color("#39ad3f"), 2);
    }
}

export class Floor extends BoxEntity {
    constructor(center: Vector2d, width: number, height: number, rotation: number = 0) {
        super(EntityKind.FLOOR, center, width, height, rotation, new Color("#dadd5f"), 2);
    }
}

export class TriggerArea extends BoxEntity {
    constructor(center: Vector2d, width: number, height: number, rotation: number = 0) {
        super(EntityKind.TRIGGER_AREA, center, width, height, rotation, new Color("rgba(255, 255, 230, 0.4)"), 2);
    }
}

export class Decal extends Entity {
    color: Color;
    textWidth: number;
    text: string;
    rotation: number;
    center: Vector2d;
    height: number;

    constructor(text: string, color: Color, center: Vector2d, height: number, rotation: number) {
        super(EntityKind.DECAL);
        this.center = center;
        this.color = color;
        this.height = height;
        this.text = text;
        this.body = new PhysicsBody(center, new Vector2d(height * this.text.length, height), rotation);
    }

    onAnimate(time: number): void {
    }

    onRemove(): void {
    }

    draw(ctx: CanvasRenderingContext2D, time: number): void {
        ctx.save();
        ctx.translate(Math.floor(this.center.x), Math.floor(this.center.y));
        ctx.rotate(this.body.rotation);
        ctx.font = `${this.height}px Verdana`;
        this.textWidth = this.textWidth || Math.floor(ctx.measureText(this.text).width);
        ctx.fillStyle = this.color.toString();
        ctx.fillText(this.text, -this.textWidth / 2, this.height / 2);
        ctx.restore();
    }
}