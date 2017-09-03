export class Keyboard {
	constructor(element?: HTMLElement | HTMLCanvasElement) {
		(element || window).addEventListener("keydown", this.setKey.bind(this), false);
		(element || window).addEventListener("keyup", this.unsetKey.bind(this), false);
	}

	keys: {
		[keyCode: number]: boolean
	} = {};

	listeners: {
		[keyCode: number]: (event: KeyboardEvent) => any
	} = {};

	onceListeners: {
		[keyCode: number]: (event: KeyboardEvent) => any
	} = {};

	getKey(keyCode: number) {
		return this.keys[keyCode];
	}

	getKeys() {
		return Object.keys(this.keys).reduce((a: number[], next: string) => {
			if (this.keys[+next]) a.push(+next);
			return a;
		}, []);
	}

	on(key: number, eventHandler: (event: KeyboardEvent) => any) {
		this.listeners[key] = eventHandler;
	}

	once(key: number, eventHandler: (event: KeyboardEvent) => any) {
		this.onceListeners[key] = eventHandler;
	}

	setKey(event: KeyboardEvent) {
		let key = event.keyCode;
		if (!this.keys[key]) {
			this.keys[key] = true;
			if (this.listeners[key]) {
				this.listeners[key](event);
			}
			if (this.onceListeners[key]) {
				this.onceListeners[key](event);
				delete this.onceListeners[key];
			}
		}
	}

	unsetKey(event: KeyboardEvent) {
		let key = event.keyCode;
		this.keys[key] = false;
	}

	static KEY = {
		W: "W".charCodeAt(0),
		S: "S".charCodeAt(0),
		A: "A".charCodeAt(0),
		D: "D".charCodeAt(0),
		I: "I".charCodeAt(0),
		K: "K".charCodeAt(0),
		J: "J".charCodeAt(0),
		L: "L".charCodeAt(0),
		SPACE: " ".charCodeAt(0)
	}
}

export class Mouse {
	keys: {
		[keyCode: number]: boolean
	} = {};

	listeners: {
		[keyCode: number]: (event: MouseEvent, x: number, y: number) => any
	} = {};

	onceListeners: {
		[keyCode: number]: (event: MouseEvent, x: number, y: number) => any
	} = {};

	moveListeners: ((event: MouseEvent, x: number, y: number) => any)[] = [];

	public x = 0;
	public y = 0;

	private _scaleX = 1;
	private _scaleY = 1;


	constructor(element?: HTMLCanvasElement) {
		this._scaleX = element ? element.offsetWidth / element.width : 1;
		this._scaleY = element ? element.offsetHeight / element.height : 1;
		(element || window).addEventListener("mousemove", this.move.bind(this), false);
		(element || window).addEventListener("mousedown", this.setKey.bind(this), false);
		(element || window).addEventListener("mouseup", this.unsetKey.bind(this), false);
		(element || window).oncontextmenu = function (ev: PointerEvent) {
			return false;
		};
	}

	move(event: MouseEvent) {
		this.x = event.offsetX / this._scaleX;
		this.y = event.offsetY / this._scaleY;

		this.moveListeners.forEach(f => f(event, this.x, this.y));
	}

	onClick(key: number, handler: (mouseEvent: MouseEvent, scaledX: number, scaledY: number) => any) {
		this.listeners[key] = handler;
	}

	onceClick(key: number, handler: (mouseEvent: MouseEvent, scaledX: number, scaledY: number) => any) {
		this.onceListeners[key] = handler;
	}

	setKey(event: MouseEvent) {
		let key = event.button;
		let scaledX = event.x / this._scaleX;
		let scaledY = event.y / this._scaleY;
		if (!this.keys[key]) {
			this.keys[key] = true;
			if (this.listeners[key]) {
				this.listeners[key](event, scaledX, scaledY);
			}
			if (this.onceListeners[key]) {
				this.onceListeners[key](event, scaledX, scaledY);
				delete this.onceListeners[key];
			}
		}
	}

	unsetKey(event: MouseEvent) {
		let key = event.button;
		this.keys[key] = false;
	}

	getKey(key: number) {
		return this.keys[key];
	}

	getKeys(): number[] {
		return Object.keys(this.keys).reduce((a: number[], next: string) => {
			if (this.keys[+next]) {
				a.push(+next);
			}
			return a;
		}, []);
	}
}
