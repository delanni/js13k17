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

	// SETUP LOOP+FUNCTIONS

	private animateListeners: AnimateCallback[] = [];
	private renderListeners: RenderCallback[] = [];
	private timeFactor = 1;
	private lastTime: number;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private isRunning = false;
	private boundGameLoop: FrameRequestCallback;

	public stats : {
		totalFrameTime: number;
		renderTime: number;
		animateTime: number;
		fps: number[];
	};

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		this.stats = {
			totalFrameTime: 0,
			renderTime: 0,
			animateTime: 0,
			fps: []
		};
		if (ctx === null) {
			throw new Error("Failed to retrieve canvas context.");
		} else {
			this.ctx = ctx;
			this.ctx.webkitImageSmoothingEnabled = false;
			this.ctx.imageSmoothingEnabled = false;
		}
	}

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
		this.stats.animateTime = measure(()=>this.animate(time));
		this.stats.renderTime = measure(()=>this.render(time));
		this.stats.totalFrameTime = time;
		this.stats.fps.push((1000 / time)|0);
		this.lastTime = nx;
	}

	public start() {
		this.boundGameLoop = this.gameLoop.bind(this);
		this.isRunning = true;
		this.boundGameLoop(0);
		const interval = setInterval(()=>{
			if (this.isRunning){
				console.log(this.stats);
			} else {
				clearInterval(interval);
			}
		}, 5000);
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

const now = performance ? performance.now.bind(performance) : Date.now.bind(Date);

function measure(fn: Function) {
	const start = now();
	fn();
	return now()-start;
}