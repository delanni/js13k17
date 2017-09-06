// let log = function (...args: any[]) {
// 	document.getElementById("logholder")!.textContent = args.join(", ");
// 	console.log.apply(console, arguments);
// }

import GameLogic from "./gamelogic";

let canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const gameLogic = new GameLogic(canvas);

gameLogic.init();

gameLogic.start();

// keyboard.on("T".charCodeAt(0), () => {
// 	EventBus.instance.replay();
// });

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