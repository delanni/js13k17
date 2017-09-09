import { Closer, Connector, Terminal, MapComponent, MapComponentKind, Walkway, Splitter } from "./components";
import Vector2d from "../vector";
import { shuffle, randBetween, pickRandom } from "../utils";

const SYMBOLS = "ABCDEF♠︎♣︎♥︎♦︎";

export interface GameMap {
    spawn: MapComponent;
    end: MapComponent;
    components: MapComponent[];
}

export class MapGenerator {
    private alphabet: string[];
    private randomSeed: number;

    constructor(seed: number) {
        this.randomSeed = seed;
        this.alphabet = SYMBOLS.split("").filter(x=>x.charCodeAt(0) < 60000);
    }

    getRandomSymbol(): string {
        return this.alphabet.splice(Math.floor(Math.random() * this.alphabet.length), 1)[0] + Math.floor(Math.random() * 10);
    }

    generateMap(center: Vector2d, difficulty: number): GameMap {
        const spawn = this.makeFoundations(center);
        const mainPath = this.generateMainPath(spawn, difficulty);
        const finalMap = this.decorateAndFinish(mainPath);

        return {
            spawn: spawn,
            end: finalMap.filter(x => x.kind === MapComponentKind.ENDPOINT)[0],
            components: finalMap
        };
    }

    private makeFoundations(center: Vector2d): MapComponent {
        const base = new Connector(center.copy(), 0, 0, null);
        const spawn = new Terminal(30, this.getRandomSymbol());
        spawn.connectTo(base);

        return spawn;
    }

    private generateMainPath(spawn: MapComponent, difficulty: number): MapComponent[] {
        const components = [spawn];

        const freeConnectors: Connector[] = [...spawn.connectors];

        while (true) {
            const nextConnector = pickRandom(freeConnectors);
            freeConnectors.splice(freeConnectors.indexOf(nextConnector), 1);

            if (!nextConnector) {
                // throw new Error("Oops, potato");
                return components;
            }

            const pick = Math.random();
            if (pick < 0.6) {
                const walkway = new Walkway(randBetween(30, 200, true), randBetween(20, 200, true));
                if (MapGenerator.tryConnect(walkway, nextConnector, components)) {
                    components.push(walkway);
                    freeConnectors.push(...walkway.connectors);
                    if (MapGenerator.depth(walkway) == difficulty) {
                        break;
                    }
                } else {
                    const closer = MapGenerator.tryCloseConnector(nextConnector);
                    components.push(closer);
                }
            } else {
                const splitter = new Splitter(randBetween(30, 200, true));
                if (MapGenerator.tryConnect(splitter, nextConnector, components)) {
                    components.push(splitter);
                    freeConnectors.push(...shuffle(splitter.connectors));
                    if (MapGenerator.depth(splitter) == difficulty) {
                        break;
                    }
                } else {
                    const closer = MapGenerator.tryCloseConnector(nextConnector);
                    components.push(closer);
                }
            }
        }

        const lastConnector = freeConnectors.pop();
        const end = new Terminal(30, this.getRandomSymbol());
        end.connectTo(lastConnector!);

        return components.concat(end);
    }

    static depth(mapComponent: MapComponent): number {
        let component: MapComponent = mapComponent;
        let depth = 0;
        while (component.baseConnector.link && component.baseConnector.link.owner) {
            component = component.baseConnector.link.owner;
            depth++;
        }
        return depth;
    }

    private static tryConnect(component: MapComponent, nextConnector: Connector, existingComponents: MapComponent[]): boolean {
        component.connectTo(nextConnector);
        if (existingComponents.some(c => component.overlaps(c))) {
            nextConnector.link = null;
            component.baseConnector.link = null;
            return false;
        } else {
            return true;
        }
    }

    private static tryCloseConnector(connector: Connector): MapComponent {
        const closer = new Closer();
        closer.connectTo(connector);
        return closer;
    }

    private decorateAndFinish(mainPath: MapComponent[]): MapComponent[] {
        const closers = mainPath.reduce((closers: Closer[], nextComponent: MapComponent) => {
            const unclosedConnectors = nextComponent.connectors.filter(x => !x.link);
            const nextClosers = unclosedConnectors.map(connector => {
                const c = new Closer();
                c.connectTo(connector);
                return c;
            });
            return closers.concat(nextClosers);
        }, []);

        return mainPath.concat(closers);
    }
}