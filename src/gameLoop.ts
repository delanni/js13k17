export interface AnimateCallback {
	(time: number): any;
}

export interface RenderCallback {
	(time: number, ctx: CanvasRenderingContext2D): any;
}

export default class GameLoop {

	private r(callback: FrameRequestCallback) {
		if (window.requestAnimationFrame) {
			window.requestAnimationFrame(callback);
		} else if (window.webkitRequestAnimationFrame) {
			window.webkitRequestAnimationFrame(callback);
		} else if ((<any>window).mozRequestAnimationFrame) {
			(<any>window).mozRequestAnimationFrame(callback);
		} else {
			window.setTimeout(callback, 1000 / 60, 1000 / 60);
		}
	}

	// function ArcadeAudio() {
	// 	this.sounds = {};
	// }

	// ArcadeAudio.prototype.add = function(key, count, settings) {
	// 	this.sounds[key] = [];
	// 	settings.forEach(function(elem, index) {
	// 		this.sounds[key].push({
	// 			tick: 0,
	// 			count: count,
	// 			pool: []
	// 		});
	// 		for (var i = 0; i < count; i++) {
	// 			var audio = new Audio();
	// 			// audio.src = jsfxr(elem);
	// 			this.sounds[key][index].pool.push(audio);
	// 		}
	// 	}, this);
	// };

	// ArcadeAudio.prototype.play = function(key) {
	// 	if (!window.mute) {
	// 		var sound = this.sounds[key];
	// 		var soundData = sound.length > 1 ? sound[Math.floor(Math.random() * sound.length)] : sound[0];
	// 		soundData.pool[soundData.tick].play();
	// 		soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
	// 	}
	// };

	// var aa = new ArcadeAudio();

	// aa.add('coin', 5, [
	// 	[0, , 0.0116, 0.3061, 0.432, 0.4097, , , , , , 0.5982, 0.6732, , , , , , 1, , , , , 0.5]
	// ]);

	// var s = new SpriteSheet("img/atlas2.png", "atlas");
	// /// SETUP EVERYTIME
	// var loadGameEntities = function(loader) {
	// 	atlas = loader.spriteSheets["atlas"];
	// 	world = new World();
	// 	ground = new GroundEntity(15, 3000);
	// 	world.groundElement = ground;
	// 	parrot = new SpriteEntity(atlas, new Vector2d(0, 73), 16, 12, [
	// 		[16, 12, 6, 400, [27, 0]]
	// 	]);

	// }

	// var loader = new SpriteSheetLoader(loadGameEntities);
	// loader.addItem(s);
	// loader.start(10);

	// SETUP LOOP+FUNCTIONS

	private animateListeners: AnimateCallback[] = [];
	private renderListeners: RenderCallback[] = [];
	private timeFactor = 1;
	private lastTime: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private isRunning = false;
	private boundGameLoop: FrameRequestCallback;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.ctx.webkitImageSmoothingEnabled = false;
		this.ctx.imageSmoothingEnabled = false;
	}

	// Mouse.init(canvas);
	// Keyboard.init();

	render(time: number) {
		this.ctx.save();
		this.ctx.fillStyle = "#323892";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
		this.renderListeners.forEach(renderListener => renderListener(time, this.ctx));
	}

	animate(time: number) {
		this.animateListeners.forEach(animateListener => animateListener(time));
	}

	gameLoop(n: number) {
		let nx = n || ((this.lastTime || 0) + 1000 / 60);
		if (!this.lastTime) {
			this.lastTime = nx;
			this.r(this.boundGameLoop);
			return;
		}

		let time = Math.min((nx - this.lastTime), 70) * this.timeFactor;
		if (this.isRunning) {
			this.r(this.boundGameLoop);
		}
		this.animate(time);
		this.render(time);
		this.lastTime = nx;
	}

	public start() {
		this.boundGameLoop = this.gameLoop.bind(this);
		this.isRunning = true;
		this.boundGameLoop(0);
	}

	public stop() {
		this.isRunning = false;
	}

	public addRenderCallback(callback: RenderCallback) {
		this.renderListeners.push(callback);
	}

	public addAnimateCallback(callback: AnimateCallback) {
		this.animateListeners.push(callback);
	}
}
