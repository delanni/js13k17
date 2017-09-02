
import GameLoop from "./gameLoop";
import { Mouse, Keyboard } from "./input";
import World, { CollisionType, ZIndex } from './world';
import { Lightningbolt } from './projectiles';
import Vector2d from './vector';
import { Particle } from "./particle";
import { Color } from "./utils";
import { Camera } from "./camera";

let log = function(...args: any[]){
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

// gameLoop.addRenderCallback(function(time, context){
// 	context.save();
// 	context.translate(mouse.x, mouse.y);
// 	context.fillRect(-4, -4, 8, 8);
// 	context.restore();
// });

// mouse.onClick(2, (ev, scaledX, scaledY) => {
// 	let e = new Lightningbolt(new Vector2d(scaledX, scaledY), world, Vector2d.random(0.5));
// 	world.addEntity(e, CollisionType.NO_COLLISION, ZIndex.CENTER);
// });

const player = new Particle(world, new Vector2d(0, 0), 20, new Color("#03ff30"), Infinity, 0);
player.gravityFactor = 0;
player.body.corner.set(new Vector2d(10, 20));
// keyboard.on(Keyboard.KEY.W, event => {
// 	player.body.speed.doAdd(new Vector2d(0,-1));
// });

// keyboard.on(Keyboard.KEY.S, event => {
// 	player.body.speed.doAdd(new Vector2d(0,1));
// });

// keyboard.on(Keyboard.KEY.A, event => {
// 	player.body.speed.doAdd(new Vector2d(-1,0));
// });

// keyboard.on(Keyboard.KEY.D, event => {
// 	player.body.speed.doAdd(new Vector2d(1,0));
// });
gameLoop.addAnimateCallback(time => {
	world.animate(time);
	camera.animate(time);
});

gameLoop.addAnimateCallback((n) => {

	const playerSpeedFactor = 0.001;
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

	if (keyboard.getKey(Keyboard.KEY.I)) {
		camera.body.center.doAdd(new Vector2d(0, -1));
	}
	if (keyboard.getKey(Keyboard.KEY.K)) {
		camera.body.center.doAdd(new Vector2d(0, 1));
	}
	if (keyboard.getKey(Keyboard.KEY.J)) {
		camera.body.center.doAdd(new Vector2d(-1, 0));
	}
	if (keyboard.getKey(Keyboard.KEY.L)) {
		camera.body.center.doAdd(new Vector2d(1, 0));
	}

	if (direction.getMagnitude() !== 0) {
		player.body.rotation = direction.toRotation();
	}

	player.body.applyAcceleration(direction.normalize(playerSpeedFactor), n);
});

world.addEntity(player);
camera.target = player.body;

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

gameLoop.start();
