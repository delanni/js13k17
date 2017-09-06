// import EventBus, { GameEventKind } from "./eventbus";

// export class ArcadeAudio {
// 	sounds: { [key: string]: any } = {};
// 	isMuted: boolean = false;

// 	constructor() {
// 		this.add('coin', 5, [
// 			[0, , 0.0116, 0.3061, 0.432, 0.4097, , , , , , 0.5982, 0.6732, , , , , , 1, , , , , 0.5]
// 		]);
// 	}

// 	add(key: string, count: number, settings: any[]) {
// 		this.sounds[key] = [];
// 		settings.forEach((elem, index: number) => {
// 			this.sounds[key].push({
// 				tick: 0,
// 				count: count,
// 				pool: []
// 			});
// 			for (var i = 0; i < count; i++) {
// 				var audio = new Audio();
// 				this.sounds[key][index].pool.push(audio);
// 			}
// 		}, this);
// 	}

// 	play(key: string) {
// 		if (!this.isMuted) {
// 			const sound = this.sounds[key];
// 			const soundData = sound.length > 1 ? sound[Math.floor(Math.random() * sound.length)] : sound[0];
// 			soundData.pool[soundData.tick].play();

// 			if (soundData.tick < soundData.count - 1) {
// 				soundData.tick++
// 			} else {
// 				soundData.tick = 0;
// 			}
// 		}
// 	}

// 	hookUp() {
// 		EventBus.instance.subscribeAll(GameEventKind.GAME_WON, () => {
// 			this.play("coin");
// 		});
// 	}
// }