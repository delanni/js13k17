import { Closer, Connector, EndPoint, SpawnPoint, MapComponent, MapComponentKind, Walkway, Splitter } from "./components";
import Vector2d from "../vector";

export interface GameMap {
    spawn: MapComponent;
    end: MapComponent;
    components: MapComponent[];
}

export class MapGenerator {
    constructor() {
    }

    generateMap(center: Vector2d, difficulty: number): GameMap {
        const spawn = this.makeFoundations(center);
        const mainPath = this.generateMainPath(spawn);
        const finalMap = this.decorateAndFinish(mainPath);

        return {
            spawn: spawn,
            end: finalMap.filter(x => x.kind === MapComponentKind.ENDPOINT)[0],
            components: finalMap
        };
    }

    makeFoundations(center: Vector2d): MapComponent {
        const base = new Connector(center.copy(), 0, 0, null);
        const spawn = new SpawnPoint(30);
        spawn.connectTo(base);

        return spawn;
    }

    generateMainPath(spawn: MapComponent): MapComponent[] {
        const walkway = new Walkway(200, 90);
        walkway.connectTo(spawn.connectors[0]);

        const splitter = new Splitter(100);
        splitter.connectTo(walkway.connectors[0]);

        const walkway2 = new Walkway(100, 30);
        walkway2.connectTo(splitter.connectors[2]);

        const end = new EndPoint(30);
        end.connectTo(walkway2.connectors[0]);

        return [walkway, splitter, walkway2, end];
    }

    decorateAndFinish(mainPath: MapComponent[]): MapComponent[] {
        const closers = mainPath.reduce((closers: Closer[], nextComponent: MapComponent) => {
            const unclosedConnectors = nextComponent.connectors.filter(x => !x.link);
            const nextClosers = unclosedConnectors.map(connector => {
                const c = new Closer();
                c.connectTo(connector);
                return c;
            });
            return closers.concat(nextClosers);
        }, []);

        return [...mainPath, ...closers];
    }
}