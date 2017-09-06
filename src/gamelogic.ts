import { Mouse, Keyboard } from "./input";
import World from "./world";
import GameLoop from "./gameLoop";
import { Camera } from "./camera";
import { EntityKind } from "./entity";
import { IntersectionCheckKind } from "./physicsbody";
import Vector2d from "./vector";
import { Connector, SpawnPoint, Walkway, Splitter, Closer, EndPoint, MapComponent } from "./map/components";
import { Player } from "./player";
import { Civilian } from "./civilian";
import { Color, arrayOf } from "./utils";
import EventBus, { GameEventKind, GPlayerCollision } from "./eventbus";
import { MapGenerator } from "./map/gamemap";

export default class GameLogic {
    spawnPoint: MapComponent;
    player: Player;
    civilians: any;
    camera: Camera;
    gameLoop: GameLoop;
    world: World;
    keyboard: Keyboard;
    mouse: Mouse;

    constructor(public readonly canvas: HTMLCanvasElement) {
    }

    init() {
        this.setupInputs(this.canvas);

        this.createWorld(this.canvas);

        this.createMap();

        this.createPlayer();

        this.createCivilians();

        this.setupRenderHooks();

        this.setupAnimateHooks();

        this.setupGameLogic();
    }

    public start() {
        this.gameLoop.start();
    }

    setupInputs(canvas: HTMLCanvasElement) {
        this.mouse = new Mouse(canvas);
        this.keyboard = new Keyboard();
    }

    createWorld(canvas: HTMLCanvasElement) {
        this.world = new World();
        this.gameLoop = new GameLoop(canvas);
        this.camera = new Camera();

        this.world.addCollisionPair(EntityKind.PLAYER, EntityKind.WALL, IntersectionCheckKind.POLYGON);
        this.world.addCollisionPair(EntityKind.PLAYER, EntityKind.CIVILIAN, IntersectionCheckKind.POLYGON, true);
        this.world.addCollisionPair(EntityKind.PLAYER, EntityKind.ENDPOINT, IntersectionCheckKind.POLYGON);
        this.world.addCollisionPair(EntityKind.CIVILIAN, EntityKind.WALL, IntersectionCheckKind.POLYGON);
        setTimeout(() => {
            this.world.addCollisionPair(EntityKind.CIVILIAN, EntityKind.CIVILIAN, IntersectionCheckKind.ROUND);
        }, 2000);
    }

    createMap() {
        const mapGenerator = new MapGenerator();

        const map = mapGenerator.generateMap(new Vector2d(0, 0), 29);

        this.spawnPoint = map.spawn;
        this.world.addEntities([...this.spawnPoint.entities, ...this.spawnPoint.walls]);
        map.components.forEach(component => {
            this.world.addEntities(component.entities);
            this.world.addEntities(component.walls);
        });
    }

    createPlayer() {
        this.player = new Player(this.spawnPoint.entities[0].body.center.copy(), 10, new Color("#03ff30"));
        this.world.addEntity(this.player);
        this.camera.target = this.player.body;
    }

    createCivilians() {
        this.civilians = arrayOf(50, (i) => new Civilian(this.spawnPoint.entities[0].body.center.copy(), 10, Vector2d.random(), new Color("#da92df")));
        this.world.addEntities(this.civilians);
    }

    setupRenderHooks() {
        this.gameLoop.addRenderCallback((time, context) => {
            // Render from the camera
            context.save();
            const translation = this.camera.getTranslation();
            context.translate(translation[0], translation[1]);
            context.rotate(this.camera.getRotation());
            this.world.render(context, time);
            context.restore();
        });
    }

    setupAnimateHooks() {
        const readDirectionFromKeyboard = () => {
            const direction = new Vector2d(0, 0);

            if (this.keyboard.getKey(Keyboard.KEY.W)) {
                direction.doAdd(new Vector2d(0, -1));
            }
            if (this.keyboard.getKey(Keyboard.KEY.S)) {
                direction.doAdd(new Vector2d(0, 1));
            }
            if (this.keyboard.getKey(Keyboard.KEY.A)) {
                direction.doAdd(new Vector2d(-1, 0));
            }
            if (this.keyboard.getKey(Keyboard.KEY.D)) {
                direction.doAdd(new Vector2d(1, 0));
            }
            return direction;
        }


        this.gameLoop.addAnimateCallback(time => {
            this.world.animate(time);
            this.camera.animate(time);
        });

        this.gameLoop.addAnimateCallback((n) => {
            const direction = readDirectionFromKeyboard();

            this.player.move(direction.normalize(), n);
        });
    }

    setupGameLogic() {
        EventBus.instance.subscribeAll(GameEventKind.PLAYER_COLLISION_ENTER, (collisionEvent: GPlayerCollision) => {
            if (collisionEvent.entity.kind === EntityKind.ENDPOINT) {
                this.player.color = new Color("#0000ff");
                EventBus.instance.publish({
                    timestamp: Date.now(),
                    kind: GameEventKind.GAME_WON
                });
            }
        });
    }
}