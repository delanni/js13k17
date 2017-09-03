/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Vector2d {
    constructor(x, y) {
        this[0] = x || 0;
        this[1] = y || 0;
    }
    get x() {
        return this[0];
    }
    get y() {
        return this[1];
    }
    static random(base = 1) {
        const x = Math.random() * base - base / 2;
        const y = Math.random() * base - base / 2;
        return new Vector2d(x, y);
    }
    set(loc) {
        this[0] = loc[0];
        this[1] = loc[1];
        return this;
    }
    add(other) {
        return new Vector2d(this[0] + other[0], this[1] + other[1]);
    }
    doAdd(other) {
        this[0] += other[0];
        this[1] += other[1];
        return this;
    }
    subtract(other) {
        return new Vector2d(this[0] - other[0], this[1] - other[1]);
    }
    doSubtract(other) {
        this[0] -= other[0];
        this[1] -= other[1];
        return this;
    }
    multiply(scalar) {
        return new Vector2d(this[0] * scalar, this[1] * scalar);
    }
    doMultiply(scalar) {
        this[0] *= scalar;
        this[1] *= scalar;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    }
    copy() {
        return new Vector2d(this[0], this[1]);
    }
    normalize(scaling = 1) {
        const magnitude = this.getMagnitude();
        if (magnitude === 0) {
            return new Vector2d();
        }
        return this.multiply(1 / magnitude * scaling);
    }
    toRotation() {
        return Math.atan2(this[1], this[0]) + Math.PI / 2;
    }
    isOK() {
        return isFinite(this[0]) && isFinite(this[1]);
    }
    multiplyMatrix(matrix) {
        const x = this.x * matrix.m11 + this.y * matrix.m21;
        const y = this.x * matrix.m12 + this.y * matrix.m22;
        return new Vector2d(x, y);
    }
    getNormal() {
        return new Vector2d(this.y, -this.x);
    }
    rotate(tetha) {
        const rotationMatrix = new Matrix2(Math.cos(tetha), Math.sin(tetha), -Math.sin(tetha), Math.cos(tetha));
        return this.multiplyMatrix(rotationMatrix);
    }
    dotProduct(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vector2d;

class Matrix2 {
    constructor(m11, m12, m21, m22) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
    }
}
/* unused harmony export Matrix2 */



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EntityKind; });
class AnimatableDefault {
    constructor() {
        this.resources = [];
        this.isAlive = true;
        this.isMarked = false;
    }
    animate(world, time) {
        if (!this.isAlive)
            return;
        if (this.body) {
            this.body.tick(time);
        }
        this.onAnimate(world, time);
        if (this.resources) {
            this.resources.forEach((e) => {
                e.animate(world, time);
            });
        }
        this.life -= time;
        if (this.life < 0) {
            this.markForRemoval();
        }
    }
    markForRemoval() {
        this.isAlive = false;
        this.isMarked = true;
        this.onRemove();
        if (this.resources) {
            this.resources.length = 0;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AnimatableDefault;

class Entity extends AnimatableDefault {
    constructor(kind, world) {
        super();
        this.resources = [];
        this.world = world;
        this.kind = kind;
        this.isVisible = true;
        this.life = this.maxLife = Infinity;
    }
    draw(ctx, world, time) {
    }
    collideAction(otherEntity, time) {
    }
    applyGravity(gravityVector, time) {
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Entity;

var EntityKind;
(function (EntityKind) {
    EntityKind[EntityKind["ABSTRACT"] = 0] = "ABSTRACT";
    EntityKind[EntityKind["PROJECTILE"] = 1] = "PROJECTILE";
    EntityKind[EntityKind["EMITTER"] = 2] = "EMITTER";
    // REUSABLES
    EntityKind[EntityKind["PARTICLE"] = 3] = "PARTICLE";
    EntityKind[EntityKind["BUBBLE"] = 4] = "BUBBLE";
    EntityKind[EntityKind["COLLECTIBLE"] = 5] = "COLLECTIBLE";
    // ETC
    EntityKind[EntityKind["SPRITE"] = 6] = "SPRITE";
    EntityKind[EntityKind["WALL"] = 7] = "WALL";
    EntityKind[EntityKind["PLAYER"] = 8] = "PLAYER";
})(EntityKind || (EntityKind = {}));


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntersectionCheckKind; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);


class PhysicsBody {
    constructor(center = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](), corner = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](), speed = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](), acceleration = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]()) {
        this.center = center;
        this.corner = corner;
        this.speed = speed;
        this.acceleration = acceleration;
        this.rotation = 0;
        this.angularSpeed = 0;
        this.friction = 0.006;
    }
    tick(ms) {
        this.move(this.speed.multiply(ms));
        this.rotate(this.angularSpeed * ms);
        this.speed.doAdd(this.acceleration.multiply(ms));
        this.speed.doMultiply(1 - this.friction * ms);
        this.limitSpeed();
        this.assertAllValues();
    }
    assertAllValues() {
        if (!this.acceleration.isOK()) {
            alert("Acceleration is not ok");
            throw Error("Acceleration is not ok");
        }
        if (!this.speed.isOK()) {
            alert("Speed is not ok");
            throw Error("Speed is not OK");
        }
        if (!this.center.isOK()) {
            alert("Center is not OK");
            throw Error("Center is not OK");
        }
    }
    move(vector) {
        this.center.doAdd(vector);
    }
    applyAcceleration(vector, time) {
        this.speed.doAdd(vector.multiply(time));
        this.limitSpeed();
    }
    limitSpeed() {
        let mag = this.speed.getMagnitude();
        if (mag != 0) {
            if (mag < PhysicsBody.EPSILON) {
                this.speed.doMultiply(0);
            }
            else {
                if (Math.abs(this.speed[0]) > PhysicsBody.XLIMIT) {
                    this.speed[0] = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* clamp */])(this.speed[0], -PhysicsBody.XLIMIT, PhysicsBody.XLIMIT);
                }
                if (Math.abs(this.speed[1]) > PhysicsBody.YLIMIT) {
                    this.speed[1] = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* clamp */])(this.speed[1], -PhysicsBody.YLIMIT, PhysicsBody.YLIMIT);
                }
            }
        }
        if (Math.abs(this.angularSpeed) < PhysicsBody.EPSILON)
            this.angularSpeed = 0;
    }
    intersects(other, kind) {
        const thisAABB = this.getAABB();
        const otherAABB = other.getAABB();
        if (kind === IntersectionCheckKind.ROUND) {
            return this.center.subtract(other.center).getMagnitude() < (this.corner.getMagnitude() + other.corner.getMagnitude());
        }
        else {
            if (AABB.aabbIntersect(thisAABB, otherAABB)) {
                if (kind === IntersectionCheckKind.AABB) {
                    return true;
                }
                else if (kind === IntersectionCheckKind.POLYGON) {
                    return Polygon.polygonIntersect(this.asPolygon(), other.asPolygon());
                }
                else {
                    throw new Error("Not implemented intersection check kind");
                }
            }
            else {
                return false;
            }
        }
    }
    /**
     * Get [Left, Top, Width, Height] array
     * @return An array containing coordinates for [left, top, width, height]
     */
    getLTWH() {
        return [
            this.center[0] - this.corner[0],
            this.center[1] - this.corner[1],
            this.corner[0] * 2,
            this.corner[1] * 2
        ];
    }
    getAABB() {
        const w = Math.abs(this.corner[0] * 2);
        const h = Math.abs(this.corner[1] * 2);
        const r = this.rotation;
        const sinner = Math.abs(Math.sin(r));
        const kosher = Math.abs(Math.cos(r));
        const width = h * sinner + w * kosher;
        const height = w * sinner + h * kosher;
        return new AABB(this.center.x - width / 2, this.center.y - height / 2, width, height);
    }
    asPolygon() {
        const r = this.rotation;
        const w = this.corner[0] * 2;
        const h = this.corner[1] * 2;
        const a = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-w / 2, -h / 2).rotate(r).doAdd(this.center);
        const b = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](w / 2, -h / 2).rotate(r).doAdd(this.center);
        const c = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](w / 2, h / 2).rotate(r).doAdd(this.center);
        const d = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-w / 2, h / 2).rotate(r).doAdd(this.center);
        return new Polygon(a, b, c, d);
    }
    rotate(angle) {
        this.rotation += angle;
        return this;
    }
    gravitateTo(location, time, gravityStrength = 0.5) {
        const time_ = Math.max(time, 16);
        if (gravityStrength <= 3) {
            this.speed.set(location.subtract(this.center).multiply(time_ / 1000 * gravityStrength));
        }
        else {
            this.center.set(location);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = PhysicsBody;

PhysicsBody.EPSILON = 5e-3;
PhysicsBody.XLIMIT = 0.5;
PhysicsBody.YLIMIT = 0.5;
var IntersectionCheckKind;
(function (IntersectionCheckKind) {
    IntersectionCheckKind[IntersectionCheckKind["AABB"] = 0] = "AABB";
    IntersectionCheckKind[IntersectionCheckKind["ROUND"] = 1] = "ROUND";
    IntersectionCheckKind[IntersectionCheckKind["POLYGON"] = 2] = "POLYGON";
})(IntersectionCheckKind || (IntersectionCheckKind = {}));
class Polygon {
    constructor(...points) {
        this.points = points;
    }
    /// Checks if the two polygons are intersecting.
    static polygonIntersect(a, b) {
        let returnValue = true;
        [a, b].forEach(polygon => {
            for (let i1 = 0; i1 < polygon.points.length; i1++) {
                let i2 = (i1 + 1) % polygon.points.length;
                let p1 = polygon.points[i1];
                let p2 = polygon.points[i2];
                let normal = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](p2[1] - p1[1], p1[0] - p2[0]);
                let minA = null;
                let maxA = null;
                a.points.forEach(p => {
                    var projected = normal[0] * p[0] + normal[1] * p[1];
                    if (minA == null || projected < minA)
                        minA = projected;
                    if (maxA == null || projected > maxA)
                        maxA = projected;
                });
                let minB = null;
                let maxB = null;
                b.points.forEach(p => {
                    var projected = normal[0] * p[0] + normal[1] * p[1];
                    if (minB == null || projected < minB)
                        minB = projected;
                    if (maxB == null || projected > maxB)
                        maxB = projected;
                });
                if (maxA < minB || maxB < minA)
                    returnValue = false;
            }
        });
        return returnValue;
    }
    getNormalAt(point) {
        const pointsLength = this.points.length;
        const centroid = this.getCentroid();
        const pointRotation = point.subtract(centroid).toRotation();
        for (let i = 0; i < pointsLength; i++) {
            const thisPoint = this.points[i].subtract(centroid);
            const nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
            if (Polygon.isBetween(thisPoint.toRotation(), pointRotation, nextPoint.toRotation())) {
                return nextPoint.subtract(thisPoint).getNormal();
            }
        }
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    }
    getSideVectorAt(point) {
        const pointsLength = this.points.length;
        const centroid = this.getCentroid();
        const pointRotation = point.subtract(centroid).toRotation();
        for (let i = 0; i < pointsLength; i++) {
            const thisPoint = this.points[i].subtract(centroid);
            const nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
            if (Polygon.isBetween(thisPoint.toRotation(), pointRotation, nextPoint.toRotation())) {
                return nextPoint.subtract(thisPoint);
            }
        }
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    }
    static normalizeAngle(a) {
        return (a + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    }
    static isBetween(angle1, target, angle2) {
        const n1 = Polygon.normalizeAngle(angle1 - target);
        const n2 = Polygon.normalizeAngle(angle2 - target);
        return n1 <= 0 && 0 <= n2;
    }
    getCentroid() {
        const coordinateSum = this.points.reduce((accumulator, next) => {
            accumulator[0] += next.x;
            accumulator[1] += next.y;
            return accumulator;
        }, [0, 0]);
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](coordinateSum[0] / this.points.length, coordinateSum[1] / this.points.length);
    }
    debugDraw(ctx) {
        ctx.fillStyle = "#ff0000";
        this.points.forEach(p => ctx.fillRect(p.x, p.y, 1, 1));
    }
}
/* unused harmony export Polygon */

class AABB {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }
    get right() {
        return this.x + this.width;
    }
    get bottom() {
        return this.y + this.height;
    }
    static aabbIntersect(r1, r2) {
        return !(r2.left > r1.right
            || r2.right < r1.left
            || r2.top > r1.bottom
            || r2.bottom < r1.top);
    }
    debugDraw(ctx) {
        ctx.strokeStyle = "#6894ca";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
/* unused harmony export AABB */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export randBetween */
/* unused harmony export randBetweenVector */
/* unused harmony export pickRandom */
/* harmony export (immutable) */ __webpack_exports__["c"] = clamp;
/* harmony export (immutable) */ __webpack_exports__["b"] = arrayOf;
/* unused harmony export identity */
/* unused harmony export clone */
function randBetween(min, max, floorit = false) {
    let n = Math.random() * (max - min) + min;
    return floorit ? Math.floor(n) : n;
}
function randBetweenVector(arrayOrVector) {
    return randBetween(arrayOrVector[0], arrayOrVector[1]);
}
function pickRandom(array) {
    return array[randBetween(0, array.length, true)];
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function arrayOf(size, filler) {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
        array[i] = filler(i);
    }
    return array;
}
// export function maxInrange<T>(array: T[], from:number, to:number) {
// 	if (from >= 0 && to <= this.length && from < to) return Math.max.apply(null, this.slice(from, to));
// 	return NaN;
// }
// Array.prototype.random = function() {
// 	if (this.length <= 1) return this[0] || null;
// 	return this[randBetween(0, this.length, 1)];
// };
//
// Array.prototype.copy = function() {
// 	if (this.length == 2)
// 		return new Vector2d(this[0], this[1]);
// 	return this.slice();
// }
function identity(e) {
    return e;
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
class NumberRange {
    constructor(min, max = min) {
        this.min = min;
        this.max = max;
    }
    getRandom() {
        return randBetween(this.min, this.max);
    }
    static getRandom(target) {
        if (target instanceof NumberRange) {
            return target.getRandom();
        }
        else {
            return target;
        }
    }
}
/* unused harmony export NumberRange */

class Color {
    constructor(hex) {
        this.hexValue = hex;
    }
    static fromRgb(r, g, b) {
        throw Error("Dont use this yet");
    }
    toString() {
        return this.hexValue;
    }
    valueOf() {
        return this.hexValue;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Color;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameLoop__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__input__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__world__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__camera__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__player__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__civilian__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__gamemap__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__entity__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__physicsbody__ = __webpack_require__(2);











let log = function (...args) {
    document.getElementById("logholder").textContent = args.join(", ");
    console.log.apply(console, arguments);
};
let canvas = document.getElementById("mainCanvas");
let mouse = new __WEBPACK_IMPORTED_MODULE_1__input__["b" /* Mouse */](canvas);
let keyboard = new __WEBPACK_IMPORTED_MODULE_1__input__["a" /* Keyboard */]();
let gameLoop = new __WEBPACK_IMPORTED_MODULE_0__gameLoop__["a" /* default */](canvas);
let world = new __WEBPACK_IMPORTED_MODULE_2__world__["a" /* default */]();
let camera = new __WEBPACK_IMPORTED_MODULE_5__camera__["a" /* Camera */]();
window["world"] = world;
const player = new __WEBPACK_IMPORTED_MODULE_6__player__["a" /* Player */](world, new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](0, 0), 10, new __WEBPACK_IMPORTED_MODULE_4__utils__["a" /* Color */]("#03ff30"));
const civilians = Object(__WEBPACK_IMPORTED_MODULE_4__utils__["b" /* arrayOf */])(50, (i) => new __WEBPACK_IMPORTED_MODULE_7__civilian__["a" /* Civilian */](world, new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](Math.random() * 640 - 320, Math.random() * 100), 10, new __WEBPACK_IMPORTED_MODULE_4__utils__["a" /* Color */]("#da92df")));
const walls = Object(__WEBPACK_IMPORTED_MODULE_4__utils__["b" /* arrayOf */])(5, i => new __WEBPACK_IMPORTED_MODULE_8__gamemap__["a" /* Wall */](world, __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */].random(400), Math.random() * 20, Math.random() * 500, Math.random() * Math.PI));
// const walls = [new Wall(world, new Vector2d(100, 100), 300, 100, 0)];
world.addEntity(player);
world.addEntities(civilians);
world.addEntities(walls);
world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_9__entity__["b" /* EntityKind */].PLAYER, __WEBPACK_IMPORTED_MODULE_9__entity__["b" /* EntityKind */].WALL, __WEBPACK_IMPORTED_MODULE_10__physicsbody__["a" /* IntersectionCheckKind */].POLYGON);
camera.target = player.body;
gameLoop.addAnimateCallback(time => {
    world.animate(time);
    camera.animate(time);
});
gameLoop.addAnimateCallback((n) => {
    const direction = readDirectionFromKeyboard();
    player.body.applyAcceleration(direction.normalize(__WEBPACK_IMPORTED_MODULE_6__player__["a" /* Player */].PLAYER_SPEED_FACTOR), n);
});
gameLoop.addRenderCallback(function (time, context) {
    if (keyboard.getKey(220 /* \ */)) {
        // Render without camera
        context.save();
        world.render(context, time);
        context.strokeRect.apply(context, camera.body.getLTWH());
        context.restore();
    }
    else {
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
    const direction = new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](0, 0);
    if (keyboard.getKey(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* Keyboard */].KEY.W)) {
        direction.doAdd(new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](0, -1));
    }
    if (keyboard.getKey(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* Keyboard */].KEY.S)) {
        direction.doAdd(new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](0, 1));
    }
    if (keyboard.getKey(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* Keyboard */].KEY.A)) {
        direction.doAdd(new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](-1, 0));
    }
    if (keyboard.getKey(__WEBPACK_IMPORTED_MODULE_1__input__["a" /* Keyboard */].KEY.D)) {
        direction.doAdd(new __WEBPACK_IMPORTED_MODULE_3__vector__["a" /* default */](1, 0));
    }
    return direction;
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GameLoop {
    constructor(canvas) {
        // SETUP LOOP+FUNCTIONS
        this.animateListeners = [];
        this.renderListeners = [];
        this.timeFactor = 1;
        this.isRunning = false;
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Failed to retrieve canvas context.");
        }
        else {
            this.ctx = ctx;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
        }
    }
    r(callback) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(callback);
        }
        else if (window.webkitRequestAnimationFrame) {
            window.webkitRequestAnimationFrame(callback);
        }
        else if (window.mozRequestAnimationFrame) {
            window.mozRequestAnimationFrame(callback);
        }
        else {
            window.setTimeout(callback, 1000 / 60, 1000 / 60);
        }
    }
    // Mouse.init(canvas);
    // Keyboard.init();
    render(time) {
        this.ctx.save();
        this.ctx.fillStyle = "#323892";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.renderListeners.forEach(renderListener => renderListener(time, this.ctx));
    }
    animate(time) {
        this.animateListeners.forEach(animateListener => animateListener(time));
    }
    gameLoop(n) {
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
    start() {
        this.boundGameLoop = this.gameLoop.bind(this);
        this.isRunning = true;
        this.boundGameLoop(0);
    }
    stop() {
        this.isRunning = false;
    }
    addRenderCallback(callback) {
        this.renderListeners.push(callback);
    }
    addAnimateCallback(callback) {
        this.animateListeners.push(callback);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameLoop;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Keyboard {
    constructor(element) {
        this.keys = {};
        this.listeners = {};
        this.onceListeners = {};
        (element || window).addEventListener("keydown", this.setKey.bind(this), false);
        (element || window).addEventListener("keyup", this.unsetKey.bind(this), false);
    }
    getKey(keyCode) {
        return this.keys[keyCode];
    }
    getKeys() {
        return Object.keys(this.keys).reduce((a, next) => {
            if (this.keys[+next])
                a.push(+next);
            return a;
        }, []);
    }
    on(key, eventHandler) {
        this.listeners[key] = eventHandler;
    }
    once(key, eventHandler) {
        this.onceListeners[key] = eventHandler;
    }
    setKey(event) {
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
    unsetKey(event) {
        let key = event.keyCode;
        this.keys[key] = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Keyboard;

Keyboard.KEY = {
    W: "W".charCodeAt(0),
    S: "S".charCodeAt(0),
    A: "A".charCodeAt(0),
    D: "D".charCodeAt(0),
    I: "I".charCodeAt(0),
    K: "K".charCodeAt(0),
    J: "J".charCodeAt(0),
    L: "L".charCodeAt(0),
    SPACE: " ".charCodeAt(0)
};
class Mouse {
    constructor(element) {
        this.keys = {};
        this.listeners = {};
        this.onceListeners = {};
        this.moveListeners = [];
        this.x = 0;
        this.y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._scaleX = element ? element.offsetWidth / element.width : 1;
        this._scaleY = element ? element.offsetHeight / element.height : 1;
        (element || window).addEventListener("mousemove", this.move.bind(this), false);
        (element || window).addEventListener("mousedown", this.setKey.bind(this), false);
        (element || window).addEventListener("mouseup", this.unsetKey.bind(this), false);
        (element || window).oncontextmenu = function (ev) {
            return false;
        };
    }
    move(event) {
        this.x = event.offsetX / this._scaleX;
        this.y = event.offsetY / this._scaleY;
        this.moveListeners.forEach(f => f(event, this.x, this.y));
    }
    onClick(key, handler) {
        this.listeners[key] = handler;
    }
    onceClick(key, handler) {
        this.onceListeners[key] = handler;
    }
    setKey(event) {
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
    unsetKey(event) {
        let key = event.button;
        this.keys[key] = false;
    }
    getKey(key) {
        return this.keys[key];
    }
    getKeys() {
        return Object.keys(this.keys).reduce((a, next) => {
            if (this.keys[+next]) {
                a.push(+next);
            }
            return a;
        }, []);
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Mouse;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);

class World {
    constructor() {
        // this.gravity = new Vector2d(0, 1e-3);
        this.entityGroups = {
            0: []
        };
        this.roundCount = 0;
        this.colliders = [];
        this.pool = {};
        // this.pool[EntityKind.PARTICLE] = [];
        // this.pool[EntityKind.BUBBLE] = [];
        // this.pool[EntityKind.COLLECTIBLE] = [];
        World.instance = this;
    }
    render(ctx, time) {
        Object.keys(this.entityGroups).forEach((entityGroupKey_) => {
            const entityGroupKey = +entityGroupKey_;
            if (entityGroupKey === 0) {
                return;
            }
            const entityGroup = this.entityGroups[entityGroupKey];
            entityGroup.forEach(entity => {
                if (entity.isVisible) {
                    entity.draw(ctx, this, time);
                }
            });
        });
    }
    ;
    animate(time) {
        this.roundCount++;
        this.resolveCollisions(time);
        this.entityGroups[__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].ABSTRACT].forEach(entity => {
            if (entity.isAlive) {
                entity.animate(this, time);
            }
            // entity.applyGravity(this.gravity, time);
        });
    }
    ;
    clear() {
        // this.containers.forEach((egName: EntityGroupName) => {
        // 	let entityGroup = this[egName];
        // 	if (this.containers.indexOf(egName) < 3) {
        // 		this[egName] = entityGroup.filter((en) => {
        // 			if (en && en.isMarked) {
        // 				if (en.kind >= 90) {
        // 					this.pool[en.kind].push(en);
        // 				}
        // 				return false;
        // 			}
        // 			return true;
        // 		});
        // 	} else {
        // 		this[egName] = entityGroup.filter((en) => {
        // 			return !(en && en.isMarked);
        // 		});
        // 	}
        // });
    }
    ;
    resolveCollisions(time) {
        this.colliders.forEach((collisionPair) => {
            const freeEntityKind = collisionPair[0];
            const collidedEntityKind = collisionPair[1];
            const intersectionCheckKind = collisionPair[2];
            const isMutual = collisionPair[3];
            const freeEntities = this.entityGroups[freeEntityKind];
            const collidedEntities = this.entityGroups[collidedEntityKind];
            for (let i = 0; i < freeEntities.length; i++) {
                const freeEntity = freeEntities[i];
                if (freeEntity.isMarked || !freeEntity.isAlive) {
                    continue;
                }
                for (let j = 0; j < collidedEntities.length; j++) {
                    const collidedEntity = collidedEntities[j];
                    if (collidedEntity.isMarked || !collidedEntity.isAlive) {
                        continue;
                    }
                    if (freeEntity.body.intersects(collidedEntity.body, intersectionCheckKind)) {
                        freeEntity.collideAction(collidedEntity, time);
                        if (isMutual) {
                            collidedEntity.collideAction(freeEntity, time);
                        }
                    }
                }
            }
        });
    }
    addCollisionPair(freeEntity, collidedEntity, intersectionCheckKind, isMutual = false) {
        this.colliders.push([freeEntity, collidedEntity, intersectionCheckKind, isMutual]);
    }
    addEntities(entities, entityKindOverride) {
        entities.forEach(entity => this.addEntity(entity, entityKindOverride));
    }
    addEntity(entity, entityKindOverride) {
        this.entityGroups[__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].ABSTRACT].push(entity);
        let entityGroup = this.entityGroups[entityKindOverride || entity.kind];
        if (!entityGroup) {
            this.entityGroups[entityKindOverride || entity.kind] = [];
            entityGroup = this.entityGroups[entityKindOverride || entity.kind];
        }
        entityGroup.push(entity);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = World;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physicsbody__ = __webpack_require__(2);


class Camera {
    // zoom: number = 1; // not easy lol
    constructor() {
        this.target = null;
        this.body = new __WEBPACK_IMPORTED_MODULE_1__physicsbody__["b" /* default */](new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](640 / 2, 480 / 2), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]());
    }
    getTranslation() {
        const ltwh = this.body.getLTWH();
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-ltwh[0], -ltwh[1]);
    }
    getRotation() {
        return -this.body.rotation;
    }
    animate(time) {
        if (this.target !== null) {
            this.body.gravitateTo(this.target.center, time, .25);
        }
        this.body.tick(time);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Camera;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physicsbody__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(3);




class Player extends __WEBPACK_IMPORTED_MODULE_0__entity__["c" /* default */] {
    constructor(world, center, size, color) {
        super(__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].PLAYER, world);
        this.color = color;
        this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](size / 2, size / 2));
        this.restitution = .3;
    }
    draw(ctx, world, time) {
        const ltwh = this.body.getLTWH();
        const l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
        ctx.restore();
        this.body.getAABB().debugDraw(ctx);
        this.body.asPolygon().debugDraw(ctx);
    }
    onAnimate(world, time) {
        if (this.body.speed.getMagnitude() !== 0) {
            this.body.rotation = this.body.speed.toRotation();
        }
    }
    onRemove() {
    }
    collideAction(otherEntity, time) {
        this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#de8228");
        setTimeout(() => { this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#39fa93"); }, 100);
        if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].WALL) {
            const wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
            const projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
            this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(Player.PLAYER_SPEED_FACTOR * time)));
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;

Player.PLAYER_SPEED_FACTOR = 0.001;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physicsbody__ = __webpack_require__(2);



class Civilian extends __WEBPACK_IMPORTED_MODULE_0__entity__["c" /* default */] {
    constructor(world, center, size, color) {
        super(__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].PLAYER, world);
        this.moveSpeedFactor = Math.random() * 0.001;
        this.color = color;
        this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](size / 2, size / 2));
        this.restitution = .3;
    }
    draw(ctx, world, time) {
        const ltwh = this.body.getLTWH();
        const l = ltwh[0], t = ltwh[1], w = ltwh[2] * 1.3, h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
        ctx.restore();
    }
    onAnimate(world, time) {
        if (this.body.speed.getMagnitude() !== 0) {
            this.body.rotation = this.body.speed.toRotation();
        }
        this.body.applyAcceleration(new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](0, this.moveSpeedFactor), time);
    }
    onRemove() {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Civilian;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physicsbody__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vector__ = __webpack_require__(0);



class GameMap extends __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* AnimatableDefault */] {
    draw(ctx, world, time) {
        if (this.isVisible) {
            this.segments.forEach(segment => {
                segment.draw(ctx, world, time);
            });
        }
    }
    onAnimate(world, time) {
    }
    onRemove() {
    }
}
/* unused harmony export GameMap */

class GameMapSegment extends __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* AnimatableDefault */] {
    draw(ctx, world, time) {
        if (this.isVisible) {
            this.elements.forEach(element => {
                element.draw(ctx, world, time);
            });
        }
    }
    onAnimate(world, time) {
    }
    onRemove() {
    }
}
/* unused harmony export GameMapSegment */

class Wall extends __WEBPACK_IMPORTED_MODULE_0__entity__["c" /* default */] {
    constructor(world, center, width, height, rotation) {
        super(__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* EntityKind */].WALL, world);
        this.body = new __WEBPACK_IMPORTED_MODULE_1__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_2__vector__["a" /* default */](width / 2, height / 2)).rotate(rotation);
    }
    onAnimate(world, time) {
    }
    onRemove() {
    }
    draw(ctx, world, time) {
        let ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = Wall.WALL_COLOR;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
        this.body.getAABB().debugDraw(ctx);
        this.body.asPolygon().debugDraw(ctx);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Wall;

Wall.WALL_COLOR = "#398527";


/***/ })
/******/ ]);
//# sourceMappingURL=code.js.map