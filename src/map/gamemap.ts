
import Entity, { Animatable, Drawable, AnimatableDefault, EntityKind } from "../entity";
import World from "../world";
import PhysicsBody from "../physicsbody";
import Vector2d from "../vector";
import { Graph, Node } from "../graph";

export class GameMap extends AnimatableDefault implements Drawable {
    segments: GameMapSegment[];
    isVisible: boolean;

    draw(ctx: CanvasRenderingContext2D, time: number): void {
        if (this.isVisible) {
            this.segments.forEach(segment => {
                segment.draw(ctx, time);
            });
        }
    }

    onAnimate(time: number): void {

    }

    onRemove(): void {

    }

}

export class GameMapSegment extends AnimatableDefault implements Drawable {
    isVisible: boolean;
    elements: Entity[];
    kind: PointOfInterestKind;

    constructor(kind: PointOfInterestKind) {
        super();
        this.kind = kind;
        this.elements = [];
    }

    draw(ctx: CanvasRenderingContext2D, time: number): void {
        if (this.isVisible) {
            this.elements.forEach(element => {
                element.draw(ctx, time);
            });
        }
    }

    onAnimate(time: number): void {

    }

    onRemove(): void {

    }
}

export class MapGenerator {
    constructor() {

    }

    generate(): Graph<PointOfInterestKind> {
        const g = new Graph<PointOfInterestKind>();

        const spawn = g.createNode(PointOfInterestKind.SPAWN);
        const end = g.createNode(PointOfInterestKind.END, spawn);

        return g;
    }
}

export class MapBuilder {
    constructor() {

    }

    buildMap(graph: Graph<PointOfInterestKind>) {
        let currentNode = graph.nodes[0];

        let currentSegment = this.materialize(currentNode.value);

        let connectedSegments: GameMapSegment[] = this.expressConnectedNodes(currentNode);

        return [currentSegment, ...connectedSegments];
    }

    materialize(kind: PointOfInterestKind): GameMapSegment {
        switch(kind){
            case PointOfInterestKind.SPAWN:
                return new GameMapSegment(PointOfInterestKind.SPAWN);
            case PointOfInterestKind.END:
                return new GameMapSegment(PointOfInterestKind.END);  
            default:
                return new GameMapSegment(PointOfInterestKind.BRANCH);
        }
    }

    expressConnectedNodes(parentNode: Node<PointOfInterestKind>): GameMapSegment[] {
        const childSegments = parentNode.edges.map(edge => {
            const childNode = edge.toNode;
            if (childNode === parentNode) return [];

            const childSegment = this.materialize(childNode.value);
            const connector = this.makeConnector(parentNode, childNode);
            const connectedNodes = this.expressConnectedNodes(childNode);

            return [connector, childSegment, ...connectedNodes];
        });

        return childSegments.reduce((a, n) => a.concat(n), []);
    }

    makeConnector(parentNode: Node<PointOfInterestKind>, childNode: Node<PointOfInterestKind>): GameMapSegment {
        return new GameMapSegment(PointOfInterestKind.CONNECTOR);
    }
}

export enum PointOfInterestKind {
    SPAWN,
    CONNECTOR,
    END,
    BRANCH
}

