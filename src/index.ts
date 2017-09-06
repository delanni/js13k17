
import GameLoop, { RenderCallback } from "./gameLoop";
import { Mouse, Keyboard } from "./input";
import World from './world';
import { Lightningbolt } from './projectiles';
import Vector2d from './vector';
import { Particle } from "./particle";
import { Color, arrayOf, pickRandom } from "./utils";
import { Camera } from "./camera";
import { Player } from "./player";
import { Civilian } from "./civilian";
// import { GameMap, GameMapSegment, MapBuilder, MapGenerator, PointOfInterestKind, Wall } from "./gamemap";
import { EntityKind } from "./entity";
import { IntersectionCheckKind } from "./physicsbody";
import { createGrowingGraph } from "./graph";
import { Wall, Connector, SpawnPoint, EndPoint, Walkway, Splitter, Closer } from "./map/components";
import EventBus from "./eventbus";

let log = function (...args: any[]) {
	document.getElementById("logholder")!.textContent = args.join(", ");
	console.log.apply(console, arguments);
}

let canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;

let mouse = new Mouse(canvas);
let keyboard = new Keyboard();
let gameLoop: GameLoop = new GameLoop(canvas);
let world = new World();
let camera = new Camera();

(<any>window)["world"] = world;


// const walls: Wall[] = arrayOf(10, i => new Wall(Vector2d.random(400), Math.random() * 20, Math.random() * 500, Math.random() * Math.PI));
// const walls = [new Wall(world, new Vector2d(100, 100), 300, 100, 0)];
// world.addEntities(walls);


world.addCollisionPair(EntityKind.PLAYER, EntityKind.WALL, IntersectionCheckKind.POLYGON);
world.addCollisionPair(EntityKind.CIVILIAN, EntityKind.WALL, IntersectionCheckKind.POLYGON);

const x = new Connector(
	new Vector2d(0, 0),
	0,
	0,
	null
);

const spawn = new SpawnPoint();
spawn.connectTo(x);
world.addEntities(spawn.entities);

const walkway = new Walkway(200, 90);
walkway.connectTo(spawn.connectors[0]);

const splitter = new Splitter(100);
splitter.connectTo(walkway.connectors[0]);

const closer1 = new Closer();
closer1.connectTo(splitter.connectors[0]);

const closer2 = new Closer();
closer2.connectTo(splitter.connectors[1]);

const walkway2 = new Walkway(100, 30);
walkway2.connectTo(splitter.connectors[2]);

const end = new EndPoint();
end.connectTo(walkway2.connectors[0]);

const mapComponents = [spawn, walkway, splitter, walkway2, closer1, closer2, end];

mapComponents.forEach(c => world.addEntities([...c.entities, ...c.walls]));

const player = new Player(spawn.entities[0].body.center.copy(), 10, new Color("#03ff30"));
world.addEntity(player);
camera.target = player.body;

const civilians: Civilian[] = arrayOf(50, (i) => new Civilian(spawn.entities[0].body.center.copy(), 10, Vector2d.random(), new Color("#da92df")));
world.addEntities(civilians);

gameLoop.addAnimateCallback(time => {
	world.animate(time);
	camera.animate(time);
});

gameLoop.addAnimateCallback((n) => {
	const direction = readDirectionFromKeyboard();

	player.move(direction.normalize(n));
	// player.body.applyAcceleration(direction.normalize(Player.PLAYER_SPEED_FACTOR), n);
});

gameLoop.addRenderCallback(function (time, context) {
	if (keyboard.getKey(220 /* \ */)) {
		// Render without camera
		context.save();
		world.render(context, time);
		context.strokeRect.apply(context, camera.body.getLTWH());
		context.restore();
	} else {
		// Render from the camera
		context.save();
		const translation = camera.getTranslation();
		context.translate(translation[0], translation[1]);
		context.rotate(camera.getRotation());
		world.render(context, time);
		context.restore();
	}
});

keyboard.on("T".charCodeAt(0), () => {
	EventBus.instance.replay();
});

// setInterval(() => {
// keyboard.on("V".charCodeAt(0), () => {
// 	const w = new Splitter(90);
// 	const connection = mapComponents[mapComponents.length - 1];
// 	const connectors = connection.connectors.filter(x => x.link == null);
// 	if (connectors.length === 0) {
// 		return;
// 	} else {
// 		const connector = pickRandom(connectors);
// 		w.connectTo(connector);
// 		mapComponents.push(w);
// 		world.addEntities(w.entities);
// 		world.addEntities(w.walls);
// 	}
// });

// keyboard.on("B".charCodeAt(0), () => {
// 	const w = new Walkway(50, 90);
// 	const connection = mapComponents[mapComponents.length - 1];
// 	const connectors = connection.connectors.filter(x => x.link == null);
// 	if (connectors.length === 0) {
// 		return;
// 	} else {
// 		const connector = pickRandom(connectors);
// 		w.connectTo(connector);
// 		mapComponents.push(w);
// 		world.addEntities(w.entities);
// 		world.addEntities(w.walls);
// 	}
// });

// keyboard.on("C".charCodeAt(0), () => {
// 	const w = new Closer(90);
// 	const connection = mapComponents[mapComponents.length - 1];
// 	const connectors = connection.connectors.filter(x => x.link == null);
// 	if (connectors.length === 0) {
// 		return;
// 	} else {
// 		const connector = pickRandom(connectors);
// 		w.connectTo(connector);
// 		// mapComponents.push(w);
// 		world.addEntities(w.entities);
// 		world.addEntities(w.walls);
// 	}
// });


// }, 500);

gameLoop.start();

function readDirectionFromKeyboard() {
	const direction = new Vector2d(0, 0);

	if (keyboard.getKey(Keyboard.KEY.W)) {
		direction.doAdd(new Vector2d(0, -1));
	}
	if (keyboard.getKey(Keyboard.KEY.S)) {
		direction.doAdd(new Vector2d(0, 1));
	}
	if (keyboard.getKey(Keyboard.KEY.A)) {
		direction.doAdd(new Vector2d(-1, 0));
	}
	if (keyboard.getKey(Keyboard.KEY.D)) {
		direction.doAdd(new Vector2d(1, 0));
	}
	return direction;
}
