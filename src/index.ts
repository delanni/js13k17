
import GameLoop from "./gameLoop";
import { Mouse, Keyboard } from "./input";
import World from './world';
import { Lightningbolt } from './projectiles';
import Vector2d from './vector';
import { Particle } from "./particle";
import { Color, arrayOf } from "./utils";
import { Camera } from "./camera";
import { Player } from "./player";
import { Civilian } from "./civilian";
import { Wall } from "./gamemap";
import { EntityKind } from "./entity";
import { IntersectionCheckKind } from "./physicsbody";

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

const player = new Player(world, new Vector2d(0, 0), 10, new Color("#03ff30"));

const civilians: Civilian[] = arrayOf(50, (i) => new Civilian(world, new Vector2d(Math.random() * 640 - 320, Math.random() * 100), 10, new Color("#da92df")));

const walls: Wall[] = arrayOf(5, i => new Wall(world, Vector2d.random(400), Math.random() * 20, Math.random() * 500, Math.random() * Math.PI));
// const walls = [new Wall(world, new Vector2d(100, 100), 300, 100, 0)];

world.addEntity(player);
world.addEntities(civilians);
world.addEntities(walls);

world.addCollisionPair(EntityKind.PLAYER, EntityKind.WALL, IntersectionCheckKind.POLYGON);

camera.target = player.body;

gameLoop.addAnimateCallback(time => {
	world.animate(time);
	camera.animate(time);
});

gameLoop.addAnimateCallback((n) => {
	const direction = readDirectionFromKeyboard();

	player.body.applyAcceleration(direction.normalize(Player.PLAYER_SPEED_FACTOR), n);
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
