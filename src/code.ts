import GameLoop from "./gameLoop";
import {Mouse, Keyboard} from "./input";
import World, { CollisionType, ZIndex } from './world';
import { Lightningbolt } from './projectiles';
import Vector2d from './vector';

let canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;

let mouse = new Mouse(canvas);
let keyboard = new Keyboard();

let gameLoop: GameLoop = new GameLoop(canvas);

let world = new World();

(<any>window)["world"] = world;

gameLoop.start();
gameLoop.addRenderCallback(function(time, context){
	context.save();
	context.translate(mouse.x, mouse.y);
	context.fillRect(-4, -4, 8, 8);
	context.restore();
});

gameLoop.addRenderCallback(function(time, context){
	world.animate(time);
	world.render(context, time);
});

mouse.onClick(2, (ev, scaledX, scaledY) => {
	let e = new Lightningbolt(new Vector2d(scaledX, scaledY), world, Vector2d.random(0.5));
	world.addEntity(e, CollisionType.NO_COLLISION, ZIndex.CENTER);
});