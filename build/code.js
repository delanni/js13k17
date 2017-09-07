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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntersectionCheckKind; });
/* unused harmony export Polygon */
/* unused harmony export AABB */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);


var PhysicsBody = (function () {
    function PhysicsBody(center, corner, speed, acceleration) {
        if (center === void 0) { center = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](); }
        if (corner === void 0) { corner = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](); }
        if (speed === void 0) { speed = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](); }
        if (acceleration === void 0) { acceleration = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](); }
        this.center = center;
        this.corner = corner;
        this.speed = speed;
        this.acceleration = acceleration;
        this.rotation = 0;
        this.angularSpeed = 0;
        this.friction = 0.006;
    }
    PhysicsBody.prototype.tick = function (ms) {
        this.move(this.speed.multiply(ms));
        this.rotate(this.angularSpeed * ms);
        this.speed.doAdd(this.acceleration.multiply(ms));
        this.speed.doMultiply(1 - this.friction * ms);
        this.limitSpeed();
        this.assertAllValues();
    };
    PhysicsBody.prototype.assertAllValues = function () {
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
    };
    PhysicsBody.prototype.move = function (vector) {
        this.center.doAdd(vector);
    };
    PhysicsBody.prototype.applyAcceleration = function (vector, time) {
        if (time === void 0) { time = 1; }
        this.speed.doAdd(vector.multiply(time));
        this.limitSpeed();
    };
    PhysicsBody.prototype.limitSpeed = function () {
        var mag = this.speed.getMagnitude();
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
    };
    PhysicsBody.prototype.intersects = function (other, kind) {
        var thisAABB = this.getAABB();
        var otherAABB = other.getAABB();
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
    };
    /**
     * Get [Left, Top, Width, Height] array
     * @return An array containing coordinates for [left, top, width, height]
     */
    PhysicsBody.prototype.getLTWH = function () {
        return [
            this.center[0] - this.corner[0],
            this.center[1] - this.corner[1],
            this.corner[0] * 2,
            this.corner[1] * 2
        ];
    };
    PhysicsBody.prototype.getAABB = function () {
        var w = Math.abs(this.corner[0] * 2);
        var h = Math.abs(this.corner[1] * 2);
        var r = this.rotation;
        var sinner = Math.abs(Math.sin(r));
        var kosher = Math.abs(Math.cos(r));
        var width = h * sinner + w * kosher;
        var height = w * sinner + h * kosher;
        return new AABB(this.center.x - width / 2, this.center.y - height / 2, width, height);
    };
    PhysicsBody.prototype.asPolygon = function () {
        var r = this.rotation;
        var w = this.corner[0] * 2;
        var h = this.corner[1] * 2;
        var a = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-w / 2, -h / 2).rotate(r).doAdd(this.center);
        var b = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](w / 2, -h / 2).rotate(r).doAdd(this.center);
        var c = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](w / 2, h / 2).rotate(r).doAdd(this.center);
        var d = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-w / 2, h / 2).rotate(r).doAdd(this.center);
        return new Polygon(a, b, c, d);
    };
    PhysicsBody.prototype.rotate = function (angle) {
        this.rotation += angle;
        return this;
    };
    PhysicsBody.prototype.gravitateTo = function (location, time, gravityStrength) {
        if (gravityStrength === void 0) { gravityStrength = 0.5; }
        var time_ = Math.max(time, 16);
        if (gravityStrength <= 3) {
            this.speed.set(location.subtract(this.center).multiply(time_ / 1000 * gravityStrength));
        }
        else {
            this.center.set(location);
        }
    };
    PhysicsBody.EPSILON = 5e-3;
    PhysicsBody.XLIMIT = 0.5;
    PhysicsBody.YLIMIT = 0.5;
    return PhysicsBody;
}());
/* harmony default export */ __webpack_exports__["b"] = (PhysicsBody);
var IntersectionCheckKind;
(function (IntersectionCheckKind) {
    IntersectionCheckKind[IntersectionCheckKind["AABB"] = 0] = "AABB";
    IntersectionCheckKind[IntersectionCheckKind["ROUND"] = 1] = "ROUND";
    IntersectionCheckKind[IntersectionCheckKind["POLYGON"] = 2] = "POLYGON";
})(IntersectionCheckKind || (IntersectionCheckKind = {}));
var Polygon = (function () {
    function Polygon() {
        var points = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            points[_i] = arguments[_i];
        }
        this.points = points;
    }
    /// Checks if the two polygons are intersecting.
    Polygon.polygonIntersect = function (a, b) {
        var returnValue = true;
        [a, b].forEach(function (polygon) {
            var _loop_1 = function (i1) {
                var i2 = (i1 + 1) % polygon.points.length;
                var p1 = polygon.points[i1];
                var p2 = polygon.points[i2];
                var normal = new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](p2[1] - p1[1], p1[0] - p2[0]);
                var minA = null;
                var maxA = null;
                a.points.forEach(function (p) {
                    var projected = normal[0] * p[0] + normal[1] * p[1];
                    if (minA == null || projected < minA)
                        minA = projected;
                    if (maxA == null || projected > maxA)
                        maxA = projected;
                });
                var minB = null;
                var maxB = null;
                b.points.forEach(function (p) {
                    var projected = normal[0] * p[0] + normal[1] * p[1];
                    if (minB == null || projected < minB)
                        minB = projected;
                    if (maxB == null || projected > maxB)
                        maxB = projected;
                });
                if (maxA < minB || maxB < minA)
                    returnValue = false;
            };
            for (var i1 = 0; i1 < polygon.points.length; i1++) {
                _loop_1(i1);
            }
        });
        return returnValue;
    };
    Polygon.prototype.getNormalAt = function (point) {
        var pointsLength = this.points.length;
        var centroid = this.getCentroid();
        var pointRotation = point.subtract(centroid).toRotation();
        for (var i = 0; i < pointsLength; i++) {
            var thisPoint = this.points[i].subtract(centroid);
            var nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
            if (Polygon.isBetween(thisPoint.toRotation(), pointRotation, nextPoint.toRotation())) {
                return nextPoint.subtract(thisPoint).getNormal();
            }
        }
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    };
    Polygon.prototype.getSideVectorAt = function (point) {
        var pointsLength = this.points.length;
        var centroid = this.getCentroid();
        var pointRotation = point.subtract(centroid).toRotation();
        for (var i = 0; i < pointsLength; i++) {
            var thisPoint = this.points[i].subtract(centroid);
            var nextPoint = this.points[(i + 1) % pointsLength].subtract(centroid);
            if (Polygon.isBetween(thisPoint.toRotation(), pointRotation, nextPoint.toRotation())) {
                return nextPoint.subtract(thisPoint);
            }
        }
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]();
    };
    Polygon.normalizeAngle = function (a) {
        return (a + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    };
    Polygon.isBetween = function (angle1, target, angle2) {
        var n1 = Polygon.normalizeAngle(angle1 - target);
        var n2 = Polygon.normalizeAngle(angle2 - target);
        return n1 <= 0 && 0 <= n2;
    };
    Polygon.prototype.getCentroid = function () {
        var coordinateSum = this.points.reduce(function (accumulator, next) {
            accumulator[0] += next.x;
            accumulator[1] += next.y;
            return accumulator;
        }, [0, 0]);
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](coordinateSum[0] / this.points.length, coordinateSum[1] / this.points.length);
    };
    Polygon.prototype.debugDraw = function (ctx) {
        ctx.fillStyle = "#ff0000";
        this.points.forEach(function (p) { return ctx.fillRect(p.x, p.y, 1, 1); });
    };
    return Polygon;
}());

var AABB = (function () {
    function AABB(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(AABB.prototype, "left", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "top", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "right", {
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "bottom", {
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    AABB.aabbIntersect = function (r1, r2) {
        return !(r2.left > r1.right
            || r2.right < r1.left
            || r2.top > r1.bottom
            || r2.bottom < r1.top);
    };
    AABB.prototype.debugDraw = function (ctx) {
        ctx.strokeStyle = "#6894ca";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
    return AABB;
}());



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Matrix2 */
var Vector2d = (function () {
    function Vector2d(x, y) {
        this[0] = x || 0;
        this[1] = y || 0;
    }
    Object.defineProperty(Vector2d.prototype, "x", {
        get: function () {
            return this[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2d.prototype, "y", {
        get: function () {
            return this[1];
        },
        enumerable: true,
        configurable: true
    });
    Vector2d.random = function (base) {
        if (base === void 0) { base = 1; }
        var x = Math.random() * base - base / 2;
        var y = Math.random() * base - base / 2;
        return new Vector2d(x, y);
    };
    Vector2d.prototype.set = function (loc) {
        this[0] = loc[0];
        this[1] = loc[1];
        return this;
    };
    Vector2d.prototype.add = function (other) {
        return new Vector2d(this[0] + other[0], this[1] + other[1]);
    };
    Vector2d.prototype.doAdd = function (other) {
        this[0] += other[0];
        this[1] += other[1];
        return this;
    };
    Vector2d.prototype.subtract = function (other) {
        return new Vector2d(this[0] - other[0], this[1] - other[1]);
    };
    Vector2d.prototype.doSubtract = function (other) {
        this[0] -= other[0];
        this[1] -= other[1];
        return this;
    };
    Vector2d.prototype.multiply = function (scalar) {
        return new Vector2d(this[0] * scalar, this[1] * scalar);
    };
    Vector2d.prototype.doMultiply = function (scalar) {
        this[0] *= scalar;
        this[1] *= scalar;
        return this;
    };
    Vector2d.prototype.getMagnitude = function () {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    };
    Vector2d.prototype.copy = function () {
        return new Vector2d(this[0], this[1]);
    };
    Vector2d.prototype.normalize = function (scaling) {
        if (scaling === void 0) { scaling = 1; }
        var magnitude = this.getMagnitude();
        if (magnitude === 0) {
            return new Vector2d();
        }
        return this.multiply(1 / magnitude * scaling);
    };
    Vector2d.prototype.doNormalize = function (scaling) {
        if (scaling === void 0) { scaling = 1; }
        return this.set(this.normalize());
    };
    Vector2d.prototype.toRotation = function () {
        return Math.atan2(this[1], this[0]) + Math.PI / 2;
    };
    Vector2d.prototype.isOK = function () {
        return isFinite(this[0]) && isFinite(this[1]);
    };
    Vector2d.prototype.multiplyMatrix = function (matrix) {
        var x = this.x * matrix.m11 + this.y * matrix.m21;
        var y = this.x * matrix.m12 + this.y * matrix.m22;
        return new Vector2d(x, y);
    };
    Vector2d.prototype.getNormal = function () {
        return new Vector2d(this.y, -this.x);
    };
    Vector2d.prototype.rotate = function (tetha) {
        var rotationMatrix = new Matrix2(Math.cos(tetha), Math.sin(tetha), -Math.sin(tetha), Math.cos(tetha));
        return this.multiplyMatrix(rotationMatrix);
    };
    Vector2d.prototype.doRotate = function (tetha) {
        var rotated = this.rotate(tetha);
        this.set(rotated);
        return this;
    };
    Vector2d.prototype.dotProduct = function (otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    };
    Vector2d.prototype.project = function (otherVector) {
        return otherVector.multiply(this.dotProduct(otherVector));
    };
    Vector2d.prototype.debugDraw = function (context, color, size) {
        if (size === void 0) { size = 2; }
        context.fillStyle = color;
        context.fillRect(this.x, this.y, size, size);
    };
    return Vector2d;
}());
/* harmony default export */ __webpack_exports__["a"] = (Vector2d);
var Matrix2 = (function () {
    function Matrix2(m11, m12, m21, m22) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
    }
    return Matrix2;
}());



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export AnimatableDefault */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EntityKind; });
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AnimatableDefault = (function () {
    function AnimatableDefault() {
        this.resources = [];
        this.isAlive = true;
        this.isMarked = false;
    }
    AnimatableDefault.prototype.animate = function (time) {
        if (!this.isAlive)
            return;
        if (this.body) {
            this.body.tick(time);
        }
        this.onAnimate(time);
        if (this.resources) {
            this.resources.forEach(function (e) {
                e.animate(time);
            });
        }
        this.life -= time;
        if (this.life < 0) {
            this.markForRemoval();
        }
    };
    AnimatableDefault.prototype.markForRemoval = function () {
        this.isAlive = false;
        this.isMarked = true;
        this.onRemove();
        if (this.resources) {
            this.resources.length = 0;
        }
    };
    return AnimatableDefault;
}());

var Entity = (function (_super) {
    __extends(Entity, _super);
    function Entity(kind) {
        var _this = _super.call(this) || this;
        _this.resources = [];
        _this.kind = kind;
        _this.isVisible = true;
        _this.life = _this.maxLife = Infinity;
        _this.latestCollisions = [];
        _this.previousCollisions = [];
        return _this;
    }
    Entity.prototype.draw = function (ctx, time) {
    };
    Entity.prototype.collideAction = function (otherEntity, time) {
    };
    Entity.prototype.collides = function (otherEntity, intersectionKind) {
        return this.body.intersects(otherEntity.body, intersectionKind);
    };
    Entity.prototype.applyGravity = function (gravityVector, time) {
    };
    Entity.prototype.collectCollisionChangesAndProgress = function () {
        var _this = this;
        var leavers = this.previousCollisions.filter(function (x) { return _this.latestCollisions.indexOf(x) === -1; });
        var newcomers = this.latestCollisions.filter(function (x) { return _this.previousCollisions.indexOf(x) === -1; });
        this.previousCollisions = this.latestCollisions;
        this.latestCollisions = [];
        return {
            collisionEnter: newcomers,
            collisionLeave: leavers
        };
    };
    Entity.prototype.registerCollision = function (entity) {
        this.latestCollisions.push(entity);
    };
    return Entity;
}(AnimatableDefault));
/* harmony default export */ __webpack_exports__["b"] = (Entity);
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
    EntityKind[EntityKind["FLOOR"] = 7] = "FLOOR";
    EntityKind[EntityKind["ENDPOINT"] = 8] = "ENDPOINT";
    EntityKind[EntityKind["WALL"] = 9] = "WALL";
    EntityKind[EntityKind["CIVILIAN"] = 10] = "CIVILIAN";
    EntityKind[EntityKind["PLAYER"] = 11] = "PLAYER";
})(EntityKind || (EntityKind = {}));


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = randBetween;
/* unused harmony export randBetweenVector */
/* harmony export (immutable) */ __webpack_exports__["d"] = pickRandom;
/* harmony export (immutable) */ __webpack_exports__["c"] = clamp;
/* harmony export (immutable) */ __webpack_exports__["b"] = arrayOf;
/* unused harmony export identity */
/* unused harmony export clone */
/* unused harmony export NumberRange */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Color; });
/* harmony export (immutable) */ __webpack_exports__["f"] = shuffle;
function randBetween(min, max, floorit) {
    if (floorit === void 0) { floorit = false; }
    var n = Math.random() * (max - min) + min;
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
    var array = new Array(size);
    for (var i = 0; i < size; i++) {
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
var NumberRange = (function () {
    function NumberRange(min, max) {
        if (max === void 0) { max = min; }
        this.min = min;
        this.max = max;
    }
    NumberRange.prototype.getRandom = function () {
        return randBetween(this.min, this.max);
    };
    NumberRange.getRandom = function (target) {
        if (target instanceof NumberRange) {
            return target.getRandom();
        }
        else {
            return target;
        }
    };
    return NumberRange;
}());

var Color = (function () {
    function Color(hex) {
        this.hexValue = hex;
    }
    Color.fromRgb = function (r, g, b) {
        throw Error("Dont use this yet");
    };
    Color.prototype.toString = function () {
        return this.hexValue;
    };
    Color.prototype.valueOf = function () {
        return this.hexValue;
    };
    return Color;
}());

function shuffle(array) {
    return array.slice(0).sort(function () { return Math.random() - 0.5; });
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GKeyboardEvent */
/* unused harmony export GMouseEvent */
/* unused harmony export GPlayerCollision */
/* unused harmony export GGameFinished */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameEventKind; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__complexstore__ = __webpack_require__(9);

var EventBus = (function () {
    function EventBus() {
        this.instantiationTime = Date.now();
        this.eventQueues = {};
        this.listenerQueues = {};
        this.filteringListeners = new __WEBPACK_IMPORTED_MODULE_0__complexstore__["a" /* default */]();
    }
    Object.defineProperty(EventBus, "instance", {
        get: function () {
            if (!EventBus._instance) {
                EventBus._instance = new EventBus();
            }
            return EventBus._instance;
        },
        enumerable: true,
        configurable: true
    });
    EventBus.prototype.publish = function (event) {
        var eventKind = event.kind;
        if (!this.eventQueues[eventKind]) {
            this.eventQueues[eventKind] = [];
        }
        this.eventQueues[eventKind].push(event);
        var listeners = this.listenerQueues[eventKind];
        if (listeners) {
            listeners.forEach(function (listener) { return listener(event); });
        }
        this.filteringListeners.getEntries().forEach(function (_a) {
            var predicate = _a[0], callback = _a[1];
            if (predicate(event)) {
                callback(event);
            }
        });
    };
    EventBus.prototype.subscribeAll = function (eventKind, eventCallback) {
        if (!this.listenerQueues[eventKind]) {
            this.listenerQueues[eventKind] = [];
        }
        this.listenerQueues[eventKind].push(eventCallback);
    };
    EventBus.prototype.unsubscribeAll = function (eventKind, originalEventCallback) {
        var index = this.listenerQueues[eventKind].indexOf(originalEventCallback);
        this.listenerQueues[eventKind].splice(index, 1);
    };
    EventBus.prototype.subscribe = function (eventFilter, eventCallback) {
        this.filteringListeners.put(eventFilter, eventCallback);
    };
    EventBus.prototype.unsubscribe = function (originalCallback) {
        this.filteringListeners.deleteByValue(originalCallback);
    };
    EventBus.prototype.replay = function () {
        var _this = this;
        var now = Date.now();
        Object.keys(this.eventQueues).map(function (k) {
            var queue = _this.eventQueues[+k];
            var firstEvent = queue[0];
            setTimeout(function () { return _this.replayEvent(firstEvent, queue.slice(1)); }, firstEvent.timestamp - _this.instantiationTime);
        });
    };
    EventBus.prototype.replayEvent = function (event, continueOn) {
        var _this = this;
        if (!event)
            return;
        var eventKind = event.kind;
        var listeners = this.listenerQueues[eventKind];
        if (listeners) {
            listeners.forEach(function (listener) { return listener(event); });
        }
        this.filteringListeners.getEntries().forEach(function (_a) {
            var predicate = _a[0], callback = _a[1];
            if (predicate(event)) {
                callback(event);
            }
        });
        if (continueOn.length) {
            var nextEvent_1 = continueOn[0];
            setTimeout(function () { return _this.replayEvent(nextEvent_1, continueOn.slice(1)); }, nextEvent_1.timestamp - event.timestamp);
        }
    };
    return EventBus;
}());
/* harmony default export */ __webpack_exports__["b"] = (EventBus);
var GKeyboardEvent = (function () {
    function GKeyboardEvent() {
    }
    return GKeyboardEvent;
}());

var GMouseEvent = (function () {
    function GMouseEvent() {
    }
    return GMouseEvent;
}());

var GPlayerCollision = (function () {
    function GPlayerCollision() {
    }
    return GPlayerCollision;
}());

var GGameFinished = (function () {
    function GGameFinished() {
    }
    return GGameFinished;
}());

var GameEventKind;
(function (GameEventKind) {
    GameEventKind[GameEventKind["MOUSE"] = 0] = "MOUSE";
    GameEventKind[GameEventKind["KEYBOARD"] = 1] = "KEYBOARD";
    GameEventKind[GameEventKind["PLAYER_COLLISION_ENTER"] = 2] = "PLAYER_COLLISION_ENTER";
    GameEventKind[GameEventKind["PLAYER_COLLISION_LEAVE"] = 3] = "PLAYER_COLLISION_LEAVE";
    GameEventKind[GameEventKind["GAME_WON"] = 4] = "GAME_WON";
    GameEventKind[GameEventKind["GAME_LOST"] = 5] = "GAME_LOST";
})(GameEventKind || (GameEventKind = {}));


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MapComponentKind; });
/* unused harmony export MapComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Connector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SpawnPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return Walkway; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return Splitter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return EndPoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Closer; });
/* unused harmony export Wall */
/* unused harmony export Floor */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entity__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physicsbody__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var SCALER = 2;
var WALL_WIDTH = 10;
var MapComponentKind;
(function (MapComponentKind) {
    MapComponentKind[MapComponentKind["SPAWN"] = 0] = "SPAWN";
    MapComponentKind[MapComponentKind["ENDPOINT"] = 1] = "ENDPOINT";
    MapComponentKind[MapComponentKind["HALL"] = 2] = "HALL";
    MapComponentKind[MapComponentKind["SPLITTER"] = 3] = "SPLITTER";
    MapComponentKind[MapComponentKind["CLOSER"] = 4] = "CLOSER";
})(MapComponentKind || (MapComponentKind = {}));
var MapComponent = (function () {
    function MapComponent(kind) {
        this.connectors = [];
        this.entities = [];
        this.walls = [];
        this.isMaterialized = false;
        this.kind = kind;
    }
    MapComponent.prototype.connectTo = function (connectTo) {
        var _this = this;
        this.materialize();
        if (!this.isMaterialized) {
            if (!this.baseConnector) {
                throw Error("This element cannot be connected. Please define the baseConnector");
            }
            else {
                this.baseConnector.owner = this;
            }
            this.connectors.forEach(function (c) { return c.owner = _this; });
            this.isMaterialized = true;
        }
        connectTo.link = this.baseConnector;
        this.baseConnector.link = connectTo;
        this.createWalls();
        this.closeOpenings();
        this.moveToPlace();
    };
    MapComponent.prototype.moveToPlace = function () {
        var connectedBase = this.baseConnector.link;
        if (!connectedBase) {
            return;
        }
        var rotation = connectedBase.rotation;
        var connectedBaseLocation = connectedBase.location.subtract(this.baseConnector.location.copy().rotate(-rotation));
        this.entities.forEach(function (entity) {
            entity.body.rotate(rotation);
            entity.body.center.doRotate(-rotation).doAdd(connectedBaseLocation);
        });
        this.walls.forEach(function (wall) {
            wall.body.rotate(rotation);
            wall.body.center.doRotate(-rotation).doAdd(connectedBaseLocation);
        });
        this.connectors.forEach(function (connector) {
            connector.rotation += rotation;
            connector.location.doRotate(-rotation).doAdd(connectedBaseLocation);
        });
        this.baseConnector.location.set(connectedBase.location);
        this.baseConnector.rotation = connectedBase.rotation;
    };
    MapComponent.prototype.closeOpenings = function () {
        var link = this.baseConnector.link;
        if (!link) {
            return;
        }
        else {
            var halfSize = this.baseConnector.openingWidth / 2;
            var halfOpeningSize = link.openingWidth / 2;
            var baseConnectorY = this.baseConnector.location.y;
            var wallCenterOffset = halfOpeningSize + (halfSize - halfOpeningSize) / 2;
            var leftBlocker = new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-wallCenterOffset, baseConnectorY), halfSize - halfOpeningSize, WALL_WIDTH);
            var rightBlocker = new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](wallCenterOffset, baseConnectorY), halfSize - halfOpeningSize, WALL_WIDTH);
            this.walls.push(leftBlocker, rightBlocker);
        }
    };
    // TODO: optimize with bounding box around the component
    MapComponent.prototype.overlaps = function (otherComponent) {
        if (this.baseConnector.link && this.baseConnector.link.owner === otherComponent)
            return false;
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            for (var _b = 0, _c = otherComponent.entities; _b < _c.length; _b++) {
                var otherEntity = _c[_b];
                if (entity.collides(otherEntity, __WEBPACK_IMPORTED_MODULE_2__physicsbody__["a" /* IntersectionCheckKind */].POLYGON)) {
                    return true;
                }
            }
        }
        return false;
    };
    return MapComponent;
}());

var Connector = (function () {
    function Connector(location, rotation, openingWidth, link, owner) {
        if (link === void 0) { link = null; }
        if (owner === void 0) { owner = null; }
        this.location = location;
        this.rotation = rotation;
        this.openingWidth = openingWidth;
        this.link = link;
        this.owner = owner;
    }
    return Connector;
}());

var SpawnPoint = (function (_super) {
    __extends(SpawnPoint, _super);
    function SpawnPoint(size) {
        var _this = _super.call(this, MapComponentKind.SPAWN) || this;
        _this.size = size * SCALER;
        _this.halfSize = _this.size / 2;
        return _this;
    }
    SpawnPoint.prototype.materialize = function () {
        var base = new Floor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), this.size, this.size, 0);
        this.entities.push(base);
        this.baseConnector = new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, this.halfSize), 0, this.size);
        this.connectors.push(new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -this.halfSize), 0, this.size));
    };
    SpawnPoint.prototype.createWalls = function () {
        this.walls.push(new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.halfSize, 0), WALL_WIDTH, this.size), new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-this.halfSize, 0), WALL_WIDTH, this.size));
    };
    return SpawnPoint;
}(MapComponent));

var Walkway = (function (_super) {
    __extends(Walkway, _super);
    function Walkway(length, width) {
        var _this = _super.call(this, MapComponentKind.HALL) || this;
        _this.length = length * SCALER;
        _this.width = width * SCALER;
        return _this;
    }
    Walkway.prototype.materialize = function () {
        var base = new Floor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), this.width, this.length, 0, "#ccffee");
        this.entities.push(base);
        this.entities.push(new Floor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0 + 30, 0), 5, 5, Math.PI / 4, "#000000"));
        this.baseConnector = new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, this.length / 2), 0, this.width);
        this.connectors.push(new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -this.length / 2), 0, this.width));
    };
    Walkway.prototype.createWalls = function () {
        this.walls.push(new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-this.width / 2, 0), WALL_WIDTH, this.length, 0), new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.width / 2, 0), WALL_WIDTH, this.length, 0));
    };
    return Walkway;
}(MapComponent));

var Splitter = (function (_super) {
    __extends(Splitter, _super);
    function Splitter(size) {
        var _this = _super.call(this, MapComponentKind.SPLITTER) || this;
        _this.size = size * SCALER;
        _this.halfSize = _this.size / 2;
        return _this;
    }
    Splitter.prototype.materialize = function () {
        var base = new Floor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), this.size, this.size, 0, "#fcffae");
        this.entities.push(base);
        this.baseConnector = new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, this.halfSize), 0, this.size);
        this.connectors.push(new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -this.halfSize), 0, this.size), new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-this.halfSize, 0), Math.PI / 2, this.size), new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.halfSize, 0), -Math.PI / 2, this.size));
    };
    Splitter.prototype.createWalls = function () {
    };
    return Splitter;
}(MapComponent));

var EndPoint = (function (_super) {
    __extends(EndPoint, _super);
    function EndPoint(size) {
        var _this = _super.call(this, MapComponentKind.ENDPOINT) || this;
        _this.size = size * SCALER;
        _this.halfSize = _this.size / 2;
        return _this;
    }
    EndPoint.prototype.materialize = function () {
        var base = new Floor(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), this.size, this.size, 0, "#ffeeee");
        base.kind = __WEBPACK_IMPORTED_MODULE_1__entity__["a" /* EntityKind */].ENDPOINT;
        this.entities.push(base);
        this.baseConnector = new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, this.halfSize), 0, this.size);
    };
    EndPoint.prototype.createWalls = function () {
        this.walls.push(new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](this.halfSize, 0), WALL_WIDTH, this.size), new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-this.halfSize, 0), WALL_WIDTH, this.size), new Wall(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, -this.halfSize), this.size, WALL_WIDTH));
    };
    return EndPoint;
}(MapComponent));

var Closer = (function (_super) {
    __extends(Closer, _super);
    function Closer() {
        return _super.call(this, MapComponentKind.CLOSER) || this;
    }
    Closer.prototype.materialize = function () {
        this.baseConnector = new Connector(new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), 0, 0);
    };
    Closer.prototype.createWalls = function () {
    };
    return Closer;
}(MapComponent));

var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(center, width, height, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var _this = _super.call(this, __WEBPACK_IMPORTED_MODULE_1__entity__["a" /* EntityKind */].WALL) || this;
        _this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](width / 2, height / 2)).rotate(rotation);
        return _this;
    }
    Wall.prototype.onAnimate = function (time) {
    };
    Wall.prototype.onRemove = function () {
    };
    Wall.prototype.draw = function (ctx, time) {
        var ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = Wall.WALL_COLOR;
        ctx.fillRect(-w / 2 - 1, -h / 2 - 1, w + 1, h + 1);
        ctx.restore();
    };
    Wall.WALL_COLOR = "#398527";
    return Wall;
}(__WEBPACK_IMPORTED_MODULE_1__entity__["b" /* default */]));

var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(center, width, height, rotation, color) {
        if (color === void 0) { color = Floor.FLOOR_COLOR; }
        var _this = _super.call(this, __WEBPACK_IMPORTED_MODULE_1__entity__["a" /* EntityKind */].FLOOR) || this;
        _this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](width / 2, height / 2)).rotate(rotation);
        _this.color = color;
        return _this;
    }
    Floor.prototype.onAnimate = function (time) {
    };
    Floor.prototype.onRemove = function () {
    };
    Floor.prototype.draw = function (ctx, time) {
        var ltwh = this.body.getLTWH(), l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-w / 2 - 1, -h / 2 - 1, w + 1, h + 1);
        ctx.restore();
    };
    Floor.FLOOR_COLOR = "#e9c5e7";
    return Floor;
}(__WEBPACK_IMPORTED_MODULE_1__entity__["b" /* default */]));



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gamelogic__ = __webpack_require__(7);
// let log = function (...args: any[]) {
// 	document.getElementById("logholder")!.textContent = args.join(", ");
// 	console.log.apply(console, arguments);
// }

var canvas = document.getElementById("mainCanvas");
var gameLogic = new __WEBPACK_IMPORTED_MODULE_0__gamelogic__["a" /* default */](canvas);
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


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__input__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__world__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gameLoop__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__camera__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__entity__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__physicsbody__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__map_components__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__player__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__civilian__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__eventbus__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__map_gamemap__ = __webpack_require__(15);













var GameLogic = (function () {
    function GameLogic(canvas) {
        this.canvas = canvas;
    }
    GameLogic.prototype.init = function () {
        this.setupInputs(this.canvas);
        this.createWorld(this.canvas);
        this.createMap();
        this.createPlayer();
        this.createCivilians();
        this.setupRenderHooks();
        this.setupAnimateHooks();
        this.setupGameLogic();
    };
    GameLogic.prototype.start = function () {
        this.gameLoop.start();
    };
    GameLogic.prototype.setupInputs = function (canvas) {
        this.mouse = new __WEBPACK_IMPORTED_MODULE_0__input__["b" /* Mouse */](canvas);
        this.keyboard = new __WEBPACK_IMPORTED_MODULE_0__input__["a" /* Keyboard */]();
    };
    GameLogic.prototype.createWorld = function (canvas) {
        var _this = this;
        this.world = new __WEBPACK_IMPORTED_MODULE_1__world__["a" /* default */]();
        this.gameLoop = new __WEBPACK_IMPORTED_MODULE_2__gameLoop__["a" /* default */](canvas);
        this.camera = new __WEBPACK_IMPORTED_MODULE_3__camera__["a" /* Camera */]();
        this.world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].PLAYER, __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].WALL, __WEBPACK_IMPORTED_MODULE_5__physicsbody__["a" /* IntersectionCheckKind */].POLYGON);
        this.world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].PLAYER, __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].CIVILIAN, __WEBPACK_IMPORTED_MODULE_5__physicsbody__["a" /* IntersectionCheckKind */].POLYGON, true);
        this.world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].PLAYER, __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].ENDPOINT, __WEBPACK_IMPORTED_MODULE_5__physicsbody__["a" /* IntersectionCheckKind */].POLYGON);
        this.world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].CIVILIAN, __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].WALL, __WEBPACK_IMPORTED_MODULE_5__physicsbody__["a" /* IntersectionCheckKind */].POLYGON);
        setTimeout(function () {
            _this.world.addCollisionPair(__WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].CIVILIAN, __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].CIVILIAN, __WEBPACK_IMPORTED_MODULE_5__physicsbody__["a" /* IntersectionCheckKind */].ROUND);
        }, 2000);
    };
    GameLogic.prototype.createMap = function () {
        var _this = this;
        var mapGenerator = new __WEBPACK_IMPORTED_MODULE_12__map_gamemap__["a" /* MapGenerator */]();
        this.map = mapGenerator.generateMap(new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](0, 0), 10);
        this.spawnPoint = this.map.spawn;
        this.world.addEntities(this.spawnPoint.entities.concat(this.spawnPoint.walls));
        this.map.components.forEach(function (component) {
            _this.world.addEntities(component.entities);
            _this.world.addEntities(component.walls);
        });
    };
    GameLogic.prototype.createPlayer = function () {
        this.player = new __WEBPACK_IMPORTED_MODULE_8__player__["a" /* Player */](this.spawnPoint.entities[0].body.center.copy(), 10, new __WEBPACK_IMPORTED_MODULE_10__utils__["a" /* Color */]("#03ff30"));
        this.world.addEntity(this.player);
        this.camera.target = this.player.body;
    };
    GameLogic.prototype.createCivilians = function () {
        this.civilians = this.map.components.filter(function (x) { return x.kind === __WEBPACK_IMPORTED_MODULE_7__map_components__["d" /* MapComponentKind */].SPLITTER; }).map(function (splitter) {
            return Object(__WEBPACK_IMPORTED_MODULE_10__utils__["b" /* arrayOf */])(20, function (i) { return new __WEBPACK_IMPORTED_MODULE_9__civilian__["a" /* Civilian */](splitter.entities[0].body.center.copy(), 10, __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */].random(), new __WEBPACK_IMPORTED_MODULE_10__utils__["a" /* Color */]("#383983")); });
        }).reduce(function (a, b) { return a.concat(b); });
        this.world.addEntities(this.civilians);
    };
    GameLogic.prototype.setupRenderHooks = function () {
        var _this = this;
        this.gameLoop.addRenderCallback(function (time, context) {
            // Render from the camera
            context.save();
            var translation = _this.camera.getTranslation();
            context.translate(translation[0], translation[1]);
            context.rotate(_this.camera.getRotation());
            _this.world.render(context, time, _this.camera);
            context.restore();
        });
    };
    GameLogic.prototype.setupAnimateHooks = function () {
        var _this = this;
        var readDirectionFromKeyboard = function () {
            var direction = new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](0, 0);
            if (_this.keyboard.getKey(__WEBPACK_IMPORTED_MODULE_0__input__["a" /* Keyboard */].KEY.W)) {
                direction.doAdd(new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](0, -1));
            }
            if (_this.keyboard.getKey(__WEBPACK_IMPORTED_MODULE_0__input__["a" /* Keyboard */].KEY.S)) {
                direction.doAdd(new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](0, 1));
            }
            if (_this.keyboard.getKey(__WEBPACK_IMPORTED_MODULE_0__input__["a" /* Keyboard */].KEY.A)) {
                direction.doAdd(new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](-1, 0));
            }
            if (_this.keyboard.getKey(__WEBPACK_IMPORTED_MODULE_0__input__["a" /* Keyboard */].KEY.D)) {
                direction.doAdd(new __WEBPACK_IMPORTED_MODULE_6__vector__["a" /* default */](1, 0));
            }
            return direction;
        };
        this.gameLoop.addAnimateCallback(function (time) {
            _this.world.animate(time);
            _this.camera.animate(time);
        });
        this.gameLoop.addAnimateCallback(function (n) {
            var direction = readDirectionFromKeyboard();
            _this.player.move(direction.normalize(), n);
        });
    };
    GameLogic.prototype.setupGameLogic = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_11__eventbus__["b" /* default */].instance.subscribeAll(__WEBPACK_IMPORTED_MODULE_11__eventbus__["a" /* GameEventKind */].PLAYER_COLLISION_ENTER, function (collisionEvent) {
            if (collisionEvent.entity.kind === __WEBPACK_IMPORTED_MODULE_4__entity__["a" /* EntityKind */].ENDPOINT) {
                _this.player.color = new __WEBPACK_IMPORTED_MODULE_10__utils__["a" /* Color */]("#0000ff");
                __WEBPACK_IMPORTED_MODULE_11__eventbus__["b" /* default */].instance.publish({
                    timestamp: Date.now(),
                    kind: __WEBPACK_IMPORTED_MODULE_11__eventbus__["a" /* GameEventKind */].GAME_WON
                });
            }
        });
    };
    return GameLogic;
}());
/* harmony default export */ __webpack_exports__["a"] = (GameLogic);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Keyboard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Mouse; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__eventbus__ = __webpack_require__(4);

var Keyboard = (function () {
    function Keyboard(element) {
        var _this = this;
        this.keys = {};
        this.listeners = {};
        this.onceListeners = {};
        (element || window).addEventListener("keydown", function (keyboardEvent) {
            __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.publish({
                timestamp: Date.now(),
                kind: __WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].KEYBOARD,
                domEvent: keyboardEvent,
                eventType: "keydown"
            });
        }, false);
        (element || window).addEventListener("keyup", function (keyboardEvent) {
            __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.publish({
                timestamp: Date.now(),
                kind: __WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].KEYBOARD,
                domEvent: keyboardEvent,
                eventType: "keyup"
            });
        }, false);
        __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.subscribeAll(__WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].KEYBOARD, function (event) {
            if (event.eventType === "keydown") {
                _this.setKey(event.domEvent);
            }
            else if (event.eventType === "keyup") {
                _this.unsetKey(event.domEvent);
            }
        });
    }
    Keyboard.prototype.getKey = function (keyCode) {
        return this.keys[keyCode];
    };
    Keyboard.prototype.getKeys = function () {
        var _this = this;
        return Object.keys(this.keys).reduce(function (a, next) {
            if (_this.keys[+next])
                a.push(+next);
            return a;
        }, []);
    };
    Keyboard.prototype.on = function (key, eventHandler) {
        this.listeners[key] = eventHandler;
    };
    Keyboard.prototype.once = function (key, eventHandler) {
        this.onceListeners[key] = eventHandler;
    };
    Keyboard.prototype.setKey = function (event) {
        var key = event.keyCode;
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
    };
    Keyboard.prototype.unsetKey = function (event) {
        var key = event.keyCode;
        this.keys[key] = false;
    };
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
    return Keyboard;
}());

var Mouse = (function () {
    function Mouse(element) {
        var _this = this;
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
        // (element || window).addEventListener("mousedown", this.setKey.bind(this), false);
        // (element || window).addEventListener("mouseup", this.unsetKey.bind(this), false);
        (element || window).addEventListener("mousedown", function (mouseEvent) {
            __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.publish({
                timestamp: Date.now(),
                kind: __WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].MOUSE,
                domEvent: mouseEvent,
                eventType: "mousedown"
            });
        }, false);
        (element || window).addEventListener("mouseup", function (mouseEvent) {
            __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.publish({
                timestamp: Date.now(),
                kind: __WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].MOUSE,
                domEvent: mouseEvent,
                eventType: "mouseup"
            });
        }, false);
        (element || window).oncontextmenu = function (ev) {
            return false;
        };
        __WEBPACK_IMPORTED_MODULE_0__eventbus__["b" /* default */].instance.subscribeAll(__WEBPACK_IMPORTED_MODULE_0__eventbus__["a" /* GameEventKind */].MOUSE, function (event) {
            if (event.eventType === "mousedown") {
                _this.setKey(event.domEvent);
            }
            else if (event.eventType === "mouseup") {
                _this.unsetKey(event.domEvent);
            }
        });
    }
    Mouse.prototype.move = function (event) {
        var _this = this;
        this.x = event.offsetX / this._scaleX;
        this.y = event.offsetY / this._scaleY;
        this.moveListeners.forEach(function (f) { return f(event, _this.x, _this.y); });
    };
    Mouse.prototype.onClick = function (key, handler) {
        this.listeners[key] = handler;
    };
    Mouse.prototype.onceClick = function (key, handler) {
        this.onceListeners[key] = handler;
    };
    Mouse.prototype.setKey = function (event) {
        var key = event.button;
        var scaledX = event.x / this._scaleX;
        var scaledY = event.y / this._scaleY;
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
    };
    Mouse.prototype.unsetKey = function (event) {
        var key = event.button;
        this.keys[key] = false;
    };
    Mouse.prototype.getKey = function (key) {
        return this.keys[key];
    };
    Mouse.prototype.getKeys = function () {
        var _this = this;
        return Object.keys(this.keys).reduce(function (a, next) {
            if (_this.keys[+next]) {
                a.push(+next);
            }
            return a;
        }, []);
    };
    return Mouse;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var ComplexStore = (function () {
    function ComplexStore() {
        this.keyList = [];
        this.valueList = [];
    }
    ComplexStore.prototype.put = function (key, value) {
        this.keyList.push(key);
        this.valueList.push(value);
    };
    ComplexStore.prototype.contains = function (key) {
        return this.keyList.indexOf(key) >= 0;
    };
    ComplexStore.prototype.containsValue = function (value) {
        return this.valueList.indexOf(value) >= 0;
    };
    ComplexStore.prototype.get = function (key) {
        var index = this.keyList.indexOf(key);
        return this.valueList[index];
    };
    ComplexStore.prototype.getByValue = function (value) {
        var index = this.valueList.indexOf(value);
        return this.keyList[index];
    };
    ComplexStore.prototype.getEntries = function () {
        var entries = [];
        for (var i = 0; i < this.keyList.length; i++) {
            entries.push([this.keyList[i], this.valueList[i]]);
        }
        return entries;
    };
    ComplexStore.prototype.delete = function (key) {
        var index = this.keyList.indexOf(key);
        if (index) {
            this.keyList.splice(index, 1);
            this.valueList.splice(index, 1);
            return true;
        }
        return false;
    };
    ComplexStore.prototype.deleteByValue = function (value) {
        var index = this.valueList.indexOf(value);
        if (index) {
            this.keyList.splice(index, 1);
            this.valueList.splice(index, 1);
            return true;
        }
        return false;
    };
    ComplexStore.prototype.clear = function () {
        this.keyList = [];
        this.valueList = [];
    };
    return ComplexStore;
}());
/* harmony default export */ __webpack_exports__["a"] = (ComplexStore);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physicsbody__ = __webpack_require__(0);


var World = (function () {
    function World() {
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
    World.prototype.render = function (ctx, time, camera) {
        var _this = this;
        Object.keys(this.entityGroups).forEach(function (entityGroupKey_) {
            var entityGroupKey = +entityGroupKey_;
            if (entityGroupKey === 0) {
                return;
            }
            var entityGroup = _this.entityGroups[entityGroupKey];
            entityGroup.forEach(function (entity) {
                if (entity.isVisible && entity.body.intersects(camera.body, __WEBPACK_IMPORTED_MODULE_1__physicsbody__["a" /* IntersectionCheckKind */].AABB)) {
                    entity.draw(ctx, time);
                }
            });
        });
    };
    ;
    World.prototype.animate = function (time) {
        this.roundCount++;
        this.resolveCollisions(time);
        this.entityGroups[__WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].ABSTRACT].forEach(function (entity) {
            if (entity.isAlive) {
                entity.animate(time);
            }
            // entity.applyGravity(this.gravity, time);
        });
    };
    ;
    World.prototype.clear = function () {
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
    };
    ;
    World.prototype.resolveCollisions = function (time) {
        var _this = this;
        this.colliders.forEach(function (collisionPair) {
            var freeEntityKind = collisionPair[0];
            var collidedEntityKind = collisionPair[1];
            var intersectionCheckKind = collisionPair[2];
            var isMutual = collisionPair[3];
            var freeEntities = _this.entityGroups[freeEntityKind];
            var collidedEntities = _this.entityGroups[collidedEntityKind];
            if (!freeEntities || !collidedEntities) {
                return;
            }
            for (var i = 0; i < freeEntities.length; i++) {
                var freeEntity = freeEntities[i];
                if (freeEntity.isMarked || !freeEntity.isAlive) {
                    continue;
                }
                for (var j = 0; j < collidedEntities.length; j++) {
                    var collidedEntity = collidedEntities[j];
                    if (collidedEntity.isMarked || !collidedEntity.isAlive || collidedEntity == freeEntity) {
                        continue;
                    }
                    if (freeEntity.collides(collidedEntity, intersectionCheckKind)) {
                        freeEntity.collideAction(collidedEntity, time);
                        if (isMutual) {
                            collidedEntity.collideAction(freeEntity, time);
                        }
                    }
                }
            }
        });
    };
    World.prototype.addCollisionPair = function (freeEntity, collidedEntity, intersectionCheckKind, isMutual) {
        if (isMutual === void 0) { isMutual = false; }
        this.colliders.push([freeEntity, collidedEntity, intersectionCheckKind, isMutual]);
    };
    World.prototype.addEntities = function (entities, entityKindOverride) {
        var _this = this;
        entities.forEach(function (entity) { return _this.addEntity(entity, entityKindOverride); });
    };
    World.prototype.addEntity = function (entity, entityKindOverride) {
        this.entityGroups[__WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].ABSTRACT].push(entity);
        var entityGroup = this.entityGroups[entityKindOverride || entity.kind];
        if (!entityGroup) {
            this.entityGroups[entityKindOverride || entity.kind] = [];
            entityGroup = this.entityGroups[entityKindOverride || entity.kind];
        }
        entityGroup.push(entity);
    };
    return World;
}());
/* harmony default export */ __webpack_exports__["a"] = (World);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var GameLoop = (function () {
    function GameLoop(canvas) {
        // SETUP LOOP+FUNCTIONS
        this.animateListeners = [];
        this.renderListeners = [];
        this.timeFactor = 1;
        this.isRunning = false;
        this.canvas = canvas;
        var ctx = canvas.getContext("2d");
        this.stats = {
            totalFrameTime: 0,
            renderTime: 0,
            animateTime: 0,
            fps: []
        };
        if (ctx === null) {
            throw new Error("Failed to retrieve canvas context.");
        }
        else {
            this.ctx = ctx;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
        }
    }
    GameLoop.prototype.r = function (callback) {
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
    };
    GameLoop.prototype.render = function (time) {
        var _this = this;
        this.ctx.save();
        this.ctx.fillStyle = "#323892";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.renderListeners.forEach(function (renderListener) { return renderListener(time, _this.ctx); });
    };
    GameLoop.prototype.animate = function (time) {
        this.animateListeners.forEach(function (animateListener) { return animateListener(time); });
    };
    GameLoop.prototype.gameLoop = function (n) {
        var _this = this;
        var nx = n || ((this.lastTime || 0) + 1000 / 60);
        if (!this.lastTime) {
            this.lastTime = nx;
            this.r(this.boundGameLoop);
            return;
        }
        var time = Math.min((nx - this.lastTime), 70) * this.timeFactor;
        if (this.isRunning) {
            this.r(this.boundGameLoop);
        }
        this.stats.animateTime = measure(function () { return _this.animate(time); });
        this.stats.renderTime = measure(function () { return _this.render(time); });
        this.stats.totalFrameTime = time;
        this.stats.fps.push((1000 / time) | 0);
        this.lastTime = nx;
    };
    GameLoop.prototype.start = function () {
        var _this = this;
        this.boundGameLoop = this.gameLoop.bind(this);
        this.isRunning = true;
        this.boundGameLoop(0);
        var interval = setInterval(function () {
            if (_this.isRunning) {
                console.log(_this.stats);
            }
            else {
                clearInterval(interval);
            }
        }, 5000);
    };
    GameLoop.prototype.stop = function () {
        this.isRunning = false;
    };
    GameLoop.prototype.addRenderCallback = function (callback) {
        this.renderListeners.push(callback);
    };
    GameLoop.prototype.addAnimateCallback = function (callback) {
        this.animateListeners.push(callback);
    };
    return GameLoop;
}());
/* harmony default export */ __webpack_exports__["a"] = (GameLoop);
var now = performance ? performance.now.bind(performance) : Date.now.bind(Date);
function measure(fn) {
    var start = now();
    fn();
    return now() - start;
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Camera; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__physicsbody__ = __webpack_require__(0);


var Camera = (function () {
    // zoom: number = 1; // not easy lol
    function Camera() {
        this.target = null;
        this.body = new __WEBPACK_IMPORTED_MODULE_1__physicsbody__["b" /* default */](new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](0, 0), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](640 / 2, 480 / 2), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */]());
    }
    Camera.prototype.getTranslation = function () {
        var ltwh = this.body.getLTWH();
        return new __WEBPACK_IMPORTED_MODULE_0__vector__["a" /* default */](-ltwh[0], -ltwh[1]);
    };
    Camera.prototype.getRotation = function () {
        return -this.body.rotation;
    };
    Camera.prototype.animate = function (time) {
        if (this.target !== null) {
            this.body.gravitateTo(this.target.center, time, .25);
        }
        this.body.tick(time);
    };
    return Camera;
}());



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Player; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physicsbody__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__eventbus__ = __webpack_require__(4);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





var Player = (function (_super) {
    __extends(Player, _super);
    function Player(center, size, color) {
        var _this = _super.call(this, __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].PLAYER) || this;
        _this.hasControl = true;
        _this.color = color;
        _this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](size / 2, size / 2));
        _this.restitution = .3;
        return _this;
    }
    Player.prototype.draw = function (ctx, time) {
        var ltwh = this.body.getLTWH();
        var l = ltwh[0], t = ltwh[1], w = ltwh[2], h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
        ctx.restore();
        this.body.getAABB().debugDraw(ctx);
        this.body.asPolygon().debugDraw(ctx);
    };
    Player.prototype.onAnimate = function (time) {
        if (this.body.speed.getMagnitude() !== 0) {
            this.body.rotation = this.body.speed.toRotation();
        }
        var collisions = this.collectCollisionChangesAndProgress();
        collisions.collisionEnter.forEach(function (x) {
            __WEBPACK_IMPORTED_MODULE_4__eventbus__["b" /* default */].instance.publish({
                kind: __WEBPACK_IMPORTED_MODULE_4__eventbus__["a" /* GameEventKind */].PLAYER_COLLISION_ENTER,
                timestamp: Date.now(),
                entity: x
            });
        });
        collisions.collisionLeave.forEach(function (x) {
            __WEBPACK_IMPORTED_MODULE_4__eventbus__["b" /* default */].instance.publish({
                kind: __WEBPACK_IMPORTED_MODULE_4__eventbus__["a" /* GameEventKind */].PLAYER_COLLISION_LEAVE,
                timestamp: Date.now(),
                entity: x
            });
        });
    };
    Player.prototype.onRemove = function () {
    };
    Player.prototype.collideAction = function (otherEntity, time) {
        var _this = this;
        this.registerCollision(otherEntity);
        if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].WALL) {
            this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#de8228");
            var wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
            var projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
            this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(Player.PLAYER_SPEED_FACTOR * time)));
            this.hasControl = false;
            setTimeout(function () { _this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#39fa93"); _this.hasControl = true; }, 300);
        }
        else if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].CIVILIAN) {
            this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#de8228");
            var connectionVector = otherEntity.body.center.subtract(this.body.center);
            this.body.speed.doAdd(connectionVector.multiply(-0.005));
            this.hasControl = false;
            setTimeout(function () { _this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#39fa93"); _this.hasControl = true; }, 200);
        }
    };
    Player.prototype.move = function (direction, time) {
        if (this.hasControl) {
            this.body.applyAcceleration(direction.normalize(Player.PLAYER_SPEED_FACTOR), time);
        }
    };
    Player.PLAYER_SPEED_FACTOR = 0.001;
    return Player;
}(__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* default */]));



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Civilian; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vector__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__physicsbody__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(3);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var Civilian = (function (_super) {
    __extends(Civilian, _super);
    function Civilian(center, size, moveDirection, color) {
        var _this = _super.call(this, __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].CIVILIAN) || this;
        _this.moveSpeedFactor = Math.random() * 0.0005 + 0.0003;
        // this.color = color;
        _this.color = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* Color */]("#00" + Math.floor(_this.moveSpeedFactor * 1e4).toString(16) + "000");
        _this.body = new __WEBPACK_IMPORTED_MODULE_2__physicsbody__["b" /* default */](center, new __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */](size / 2, size / 2));
        _this.restitution = .3;
        _this.moveDirection = moveDirection;
        _this.personalSpaceRadius = size * 1.5;
        return _this;
    }
    Civilian.prototype.draw = function (ctx, time) {
        var ltwh = this.body.getLTWH();
        var l = ltwh[0], t = ltwh[1], w = ltwh[2] * 1.3, h = ltwh[3];
        ctx.save();
        ctx.translate(l + w / 2, t + h / 2);
        ctx.rotate(this.body.rotation);
        ctx.fillStyle = this.color.toString();
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.fillRect(-w / 2, -h / 2 - 10, w / 2, h / 2);
        ctx.restore();
    };
    Civilian.prototype.onAnimate = function (time) {
        if (this.body.speed.getMagnitude() !== 0) {
            this.body.rotation = this.body.speed.toRotation();
        }
        this.body.applyAcceleration(this.moveDirection.normalize(this.moveSpeedFactor), time);
    };
    Civilian.prototype.collideAction = function (otherEntity, time) {
        if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].WALL) {
            var wallSideVector = otherEntity.body.asPolygon().getSideVectorAt(this.body.center).normalize();
            var projectedSpeedVector = wallSideVector.multiply(this.body.speed.dotProduct(wallSideVector));
            this.body.speed.set(projectedSpeedVector.add(wallSideVector.getNormal().doMultiply(this.moveSpeedFactor * time * 2)));
            this.moveDirection = __WEBPACK_IMPORTED_MODULE_1__vector__["a" /* default */].random();
        }
        else if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].CIVILIAN) {
            var connectionVector = this.body.center.subtract(otherEntity.body.center);
            this.body.applyAcceleration(connectionVector, 1 / connectionVector.getMagnitude() * 0.01);
        }
        else if (otherEntity.kind === __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* EntityKind */].PLAYER) {
            var connectionVector = otherEntity.body.center.subtract(this.body.center);
            // this.body.speed.doMultiply(0);
            this.body.speed.doAdd(connectionVector.multiply(-0.005));
        }
    };
    Civilian.prototype.collides = function (otherEntity, intersectionKind) {
        if (intersectionKind === __WEBPACK_IMPORTED_MODULE_2__physicsbody__["a" /* IntersectionCheckKind */].ROUND) {
            var distance = this.body.center.subtract(otherEntity.body.center).getMagnitude();
            return distance < (this.personalSpaceRadius + otherEntity.body.corner.getMagnitude());
        }
        else {
            return _super.prototype.collides.call(this, otherEntity, intersectionKind);
        }
    };
    Civilian.prototype.onRemove = function () {
    };
    return Civilian;
}(__WEBPACK_IMPORTED_MODULE_0__entity__["b" /* default */]));



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapGenerator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(3);


var MapGenerator = (function () {
    function MapGenerator() {
    }
    MapGenerator.prototype.generateMap = function (center, difficulty) {
        var spawn = this.makeFoundations(center);
        var mainPath = this.generateMainPath(spawn, difficulty);
        var finalMap = this.decorateAndFinish(mainPath);
        return {
            spawn: spawn,
            end: finalMap.filter(function (x) { return x.kind === __WEBPACK_IMPORTED_MODULE_0__components__["d" /* MapComponentKind */].ENDPOINT; })[0],
            components: finalMap
        };
    };
    MapGenerator.prototype.makeFoundations = function (center) {
        var base = new __WEBPACK_IMPORTED_MODULE_0__components__["b" /* Connector */](center.copy(), 0, 0, null);
        var spawn = new __WEBPACK_IMPORTED_MODULE_0__components__["e" /* SpawnPoint */](30);
        spawn.connectTo(base);
        return spawn;
    };
    MapGenerator.prototype.generateMainPath = function (spawn, difficulty) {
        var components = [spawn];
        var freeConnectors = spawn.connectors.slice();
        while (true) {
            var nextConnector = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* pickRandom */])(freeConnectors);
            freeConnectors.splice(freeConnectors.indexOf(nextConnector), 1);
            if (!nextConnector) {
                // throw new Error("Oops, potato");
                return components;
            }
            var pick = Math.random();
            if (pick < 0.6) {
                var walkway = new __WEBPACK_IMPORTED_MODULE_0__components__["g" /* Walkway */](Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* randBetween */])(30, 200, true), Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* randBetween */])(20, 200, true));
                if (MapGenerator.tryConnect(walkway, nextConnector, components)) {
                    components.push(walkway);
                    freeConnectors.push.apply(freeConnectors, walkway.connectors);
                    if (MapGenerator.depth(walkway) == difficulty) {
                        break;
                    }
                }
                else {
                    var closer = MapGenerator.tryCloseConnector(nextConnector);
                    components.push(closer);
                }
            }
            else {
                var splitter = new __WEBPACK_IMPORTED_MODULE_0__components__["f" /* Splitter */](Object(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* randBetween */])(30, 200, true));
                if (MapGenerator.tryConnect(splitter, nextConnector, components)) {
                    components.push(splitter);
                    freeConnectors.push.apply(freeConnectors, Object(__WEBPACK_IMPORTED_MODULE_1__utils__["f" /* shuffle */])(splitter.connectors));
                    if (MapGenerator.depth(splitter) == difficulty) {
                        break;
                    }
                }
                else {
                    var closer = MapGenerator.tryCloseConnector(nextConnector);
                    components.push(closer);
                }
            }
        }
        var lastConnector = freeConnectors.pop();
        var end = new __WEBPACK_IMPORTED_MODULE_0__components__["c" /* EndPoint */](30);
        end.connectTo(lastConnector);
        return components.concat(end);
    };
    MapGenerator.depth = function (mapComponent) {
        var component = mapComponent;
        var depth = 0;
        while (component.baseConnector.link && component.baseConnector.link.owner) {
            component = component.baseConnector.link.owner;
            depth++;
        }
        return depth;
    };
    MapGenerator.tryConnect = function (component, nextConnector, existingComponents) {
        component.connectTo(nextConnector);
        if (existingComponents.some(function (c) { return component.overlaps(c); })) {
            nextConnector.link = null;
            component.baseConnector.link = null;
            return false;
        }
        else {
            return true;
        }
    };
    MapGenerator.tryCloseConnector = function (connector) {
        var closer = new __WEBPACK_IMPORTED_MODULE_0__components__["a" /* Closer */]();
        closer.connectTo(connector);
        return closer;
    };
    MapGenerator.prototype.decorateAndFinish = function (mainPath) {
        var closers = mainPath.reduce(function (closers, nextComponent) {
            var unclosedConnectors = nextComponent.connectors.filter(function (x) { return !x.link; });
            var nextClosers = unclosedConnectors.map(function (connector) {
                var c = new __WEBPACK_IMPORTED_MODULE_0__components__["a" /* Closer */]();
                c.connectTo(connector);
                return c;
            });
            return closers.concat(nextClosers);
        }, []);
        return mainPath.concat(closers);
    };
    return MapGenerator;
}());



/***/ })
/******/ ]);
//# sourceMappingURL=code.js.map