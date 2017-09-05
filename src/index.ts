
import GameLoop, { RenderCallback } from "./gameLoop";
import { Mouse, Keyboard } from "./input";
import World from './world';
import { Lightningbolt } from './projectiles';
import Vector2d from './vector';
import { Particle } from "./particle";
import { Color, arrayOf } from "./utils";
import { Camera } from "./camera";
import { Player } from "./player";
import { Civilian } from "./civilian";
// import { GameMap, GameMapSegment, MapBuilder, MapGenerator, PointOfInterestKind, Wall } from "./gamemap";
import { EntityKind } from "./entity";
import { IntersectionCheckKind } from "./physicsbody";
import { createGrowingGraph } from "./graph";
import { Wall, Connector, SpawnPoint, EndPoint, Walkway } from "./map/components";

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

const player = new Player(new Vector2d(0, 0), 10, new Color("#03ff30"));

const civilians: Civilian[] = arrayOf(50, (i) => new Civilian(new Vector2d(Math.random() * 640 - 320, Math.random() * 100), 10, new Color("#da92df")));

const walls: Wall[] = arrayOf(10, i => new Wall(Vector2d.random(400), Math.random() * 20, Math.random() * 500, Math.random() * Math.PI));
// const walls = [new Wall(world, new Vector2d(100, 100), 300, 100, 0)];

world.addEntity(player);
world.addEntities(civilians);
world.addEntities(walls);

world.addCollisionPair(EntityKind.PLAYER, EntityKind.WALL, IntersectionCheckKind.POLYGON);
world.addCollisionPair(EntityKind.CIVILIAN, EntityKind.WALL, IntersectionCheckKind.POLYGON);

camera.target = player.body;

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

// gameLoop.addRenderCallback((time, context) => {
// 	var p = walls[0].body.asPolygon();
// 	var mouseWorldPosition = new Vector2d(mouse.x, mouse.y).add(camera.body.center).subtract(camera.body.corner);

// 	var normal = p.getNormalAt(mouseWorldPosition);

// 	context.save();
// 	const translation = camera.getTranslation();
// 	context.translate(translation[0], translation[1]);

// 	context.fillStyle = "white";
// 	context.fillRect(mouseWorldPosition.x, mouseWorldPosition.y, 5, 5);

// 	context.beginPath();
// 	context.moveTo(p.getCentroid().x, p.getCentroid().y);
// 	context.lineTo(mouseWorldPosition.x, mouseWorldPosition.y);
// 	context.lineTo(mouseWorldPosition.x + normal.x, mouseWorldPosition.y + normal.y);
// 	context.stroke();

// 	context.restore();
// });

// const g = createGrowingGraph();

// gameLoop.addRenderCallback((time, context) => {
// 	context.strokeStyle = "#fafaca";
// 	context.beginPath();
// 	g.edges.forEach(edge => {
// 		context.moveTo(edge.fromNode.value.X, edge.fromNode.value.Y);
// 		context.lineTo(edge.toNode.value.X, edge.toNode.value.Y);
// 	})
// 	context.stroke();

// 	context.fillStyle = "#cafafa";
// 	g.nodes.forEach(node => {
// 		context.fillRect(node.value.X - node.value.S / 2, node.value.Y - node.value.S / 2, node.value.S, node.value.S);
// 	});
// });

// const mapGenerator = new MapGenerator();
// const mapGraph = mapGenerator.generate();
// const mapBuilder = new MapBuilder();
// const mapSegments = mapBuilder.buildMap(mapGraph);

const x = new Connector(
	new Vector2d(0, 0),
	0,
	0,
	null
);

const spawn = new SpawnPoint();
spawn.connectTo(x);

const w1 = new Walkway();
w1.connectTo(spawn.connectors[0]);

const w2 = new Walkway();
w2.connectTo(w1.connectors[1]);

const end = new EndPoint();
end.connectTo(w2.connectors[2]);

gameLoop.addRenderCallback((time, context) => {
	context.save();
	const translation = camera.getTranslation();
	context.translate(translation[0], translation[1]);
	context.rotate(camera.getRotation());
	
	const drawn = [spawn
		,w1
		,w2
		,end
	];

	drawn.map(x=>x.entities).reduce((a,n)=>a.concat(n)).forEach(a => {
		a.draw(context, time);
	});

	drawn.forEach(x=>{
		x.baseConnector.location.debugDraw(context, "#ff0000");
		x.connectors.forEach(a=>a.location.debugDraw(context, "#000000"));
	});

	context.restore();
});

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
