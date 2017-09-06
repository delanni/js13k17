import ComplexStore from "./complexstore";
import Entity from "./entity";

export type GameEventPredicate = (event: GameEvent) => boolean;
export type GameEventCallback = (event: GameEvent) => void;

export default class EventBus {

    private static _instance: EventBus;

    public static get instance() {
        if (!EventBus._instance) {
            EventBus._instance = new EventBus();
        }
        return EventBus._instance;
    }

    private instantiationTime = Date.now();

    public readonly eventQueues: { [key: number]: GameEvent[] } = {}

    private listenerQueues: { [key: number]: GameEventCallback[] } = {}

    private filteringListeners: ComplexStore<GameEventPredicate, GameEventCallback> = new ComplexStore();

    publish(event: GameEvent) {
        const eventKind = event.kind;

        if (!this.eventQueues[eventKind]) {
            this.eventQueues[eventKind] = [];
        }
        this.eventQueues[eventKind].push(event);

        const listeners = this.listenerQueues[eventKind];
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }

        this.filteringListeners.getEntries().forEach(([predicate, callback]) => {
            if (predicate(event)) {
                callback(event);
            }
        });
    }

    subscribeAll(eventKind: GameEventKind, eventCallback: GameEventCallback) {
        if (!this.listenerQueues[eventKind]) {
            this.listenerQueues[eventKind] = [];
        }
        this.listenerQueues[eventKind].push(eventCallback);
    }

    unsubscribeAll(eventKind: GameEventKind, originalEventCallback: GameEventCallback) {
        const index = this.listenerQueues[eventKind].indexOf(originalEventCallback);
        this.listenerQueues[eventKind].splice(index, 1);
    }

    subscribe(eventFilter: GameEventPredicate, eventCallback: GameEventCallback) {
        this.filteringListeners.put(eventFilter, eventCallback);
    }

    unsubscribe(originalCallback: GameEventCallback) {
        this.filteringListeners.deleteByValue(originalCallback);
    }

    replay() {
        const now = Date.now();
        Object.keys(this.eventQueues).map(k => {
            const queue = this.eventQueues[+k];
            const firstEvent = queue[0];
            setTimeout(() => this.replayEvent(firstEvent, queue.slice(1)), firstEvent.timestamp - this.instantiationTime);
        })
    }

    private replayEvent(event: GameEvent, continueOn: GameEvent[]) {
        if (!event) return;

        const eventKind = event.kind;

        const listeners = this.listenerQueues[eventKind];
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }

        this.filteringListeners.getEntries().forEach(([predicate, callback]) => {
            if (predicate(event)) {
                callback(event);
            }
        });

        if (continueOn.length) {
            const nextEvent = continueOn[0];
            setTimeout(() => this.replayEvent(nextEvent, continueOn.slice(1)), nextEvent.timestamp - event.timestamp)
        }
    }
}

export type GameEvent =
    GGameFinished |
    GPlayerCollision |
    GKeyboardEvent |
    GMouseEvent;

export class GKeyboardEvent {
    timestamp: number;
    kind: GameEventKind.KEYBOARD;
    domEvent: KeyboardEvent;
    eventType: "keydown" | "keyup";
}

export class GMouseEvent {
    timestamp: number;
    kind: GameEventKind.MOUSE;
    domEvent: MouseEvent;
    eventType: "mousedown" | "mouseup";
}

export class GPlayerCollision {
    timestamp: number;
    kind: GameEventKind.PLAYER_COLLISION_ENTER | GameEventKind.PLAYER_COLLISION_LEAVE;
    entity: Entity;
}

export class GGameFinished {
    timestamp: number;
    kind: GameEventKind.GAME_LOST | GameEventKind.GAME_WON;
}

export enum GameEventKind {
    MOUSE,
    KEYBOARD,
    PLAYER_COLLISION_ENTER,
    PLAYER_COLLISION_LEAVE,
    GAME_WON,
    GAME_LOST
}
