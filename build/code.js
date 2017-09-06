!function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=5)}([function(t,e,n){"use strict";var i=function(){function t(t,e){this[0]=t||0,this[1]=e||0}return Object.defineProperty(t.prototype,"x",{get:function(){return this[0]},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"y",{get:function(){return this[1]},enumerable:!0,configurable:!0}),t.random=function(e){return void 0===e&&(e=1),new t(Math.random()*e-e/2,Math.random()*e-e/2)},t.prototype.set=function(t){return this[0]=t[0],this[1]=t[1],this},t.prototype.add=function(e){return new t(this[0]+e[0],this[1]+e[1])},t.prototype.doAdd=function(t){return this[0]+=t[0],this[1]+=t[1],this},t.prototype.subtract=function(e){return new t(this[0]-e[0],this[1]-e[1])},t.prototype.doSubtract=function(t){return this[0]-=t[0],this[1]-=t[1],this},t.prototype.multiply=function(e){return new t(this[0]*e,this[1]*e)},t.prototype.doMultiply=function(t){return this[0]*=t,this[1]*=t,this},t.prototype.getMagnitude=function(){return Math.sqrt(this[0]*this[0]+this[1]*this[1])},t.prototype.copy=function(){return new t(this[0],this[1])},t.prototype.normalize=function(e){void 0===e&&(e=1);var n=this.getMagnitude();return 0===n?new t:this.multiply(1/n*e)},t.prototype.toRotation=function(){return Math.atan2(this[1],this[0])+Math.PI/2},t.prototype.isOK=function(){return isFinite(this[0])&&isFinite(this[1])},t.prototype.multiplyMatrix=function(e){return new t(this.x*e.m11+this.y*e.m21,this.x*e.m12+this.y*e.m22)},t.prototype.getNormal=function(){return new t(this.y,-this.x)},t.prototype.rotate=function(t){var e=new o(Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t));return this.multiplyMatrix(e)},t.prototype.doRotate=function(t){var e=this.rotate(t);return this.set(e),this},t.prototype.dotProduct=function(t){return this.x*t.x+this.y*t.y},t.prototype.debugDraw=function(t,e,n){void 0===n&&(n=2),t.fillStyle=e,t.fillRect(this.x,this.y,n,n)},t}();e.a=i;var o=function(){function t(t,e,n,i){this.m11=t,this.m12=e,this.m21=n,this.m22=i}return t}()},function(t,e,n){"use strict";n.d(e,"a",function(){return s});var i=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),o=function(){function t(){this.resources=[],this.isAlive=!0,this.isMarked=!1}return t.prototype.animate=function(t){this.isAlive&&(this.body&&this.body.tick(t),this.onAnimate(t),this.resources&&this.resources.forEach(function(e){e.animate(t)}),this.life-=t,this.life<0&&this.markForRemoval())},t.prototype.markForRemoval=function(){this.isAlive=!1,this.isMarked=!0,this.onRemove(),this.resources&&(this.resources.length=0)},t}(),r=function(t){function e(e){var n=t.call(this)||this;return n.resources=[],n.kind=e,n.isVisible=!0,n.life=n.maxLife=1/0,n}return i(e,t),e.prototype.draw=function(t,e){},e.prototype.collideAction=function(t,e){},e.prototype.applyGravity=function(t,e){},e}(o);e.b=r;var s;!function(t){t[t.ABSTRACT=0]="ABSTRACT",t[t.PROJECTILE=1]="PROJECTILE",t[t.EMITTER=2]="EMITTER",t[t.PARTICLE=3]="PARTICLE",t[t.BUBBLE=4]="BUBBLE",t[t.COLLECTIBLE=5]="COLLECTIBLE",t[t.SPRITE=6]="SPRITE",t[t.FLOOR=7]="FLOOR",t[t.WALL=8]="WALL",t[t.CIVILIAN=9]="CIVILIAN",t[t.PLAYER=10]="PLAYER"}(s||(s={}))},function(t,e,n){"use strict";n.d(e,"a",function(){return s});var i=n(0),o=n(3),r=function(){function t(t,e,n,o){void 0===t&&(t=new i.a),void 0===e&&(e=new i.a),void 0===n&&(n=new i.a),void 0===o&&(o=new i.a),this.center=t,this.corner=e,this.speed=n,this.acceleration=o,this.rotation=0,this.angularSpeed=0,this.friction=.006}return t.prototype.tick=function(t){this.move(this.speed.multiply(t)),this.rotate(this.angularSpeed*t),this.speed.doAdd(this.acceleration.multiply(t)),this.speed.doMultiply(1-this.friction*t),this.limitSpeed(),this.assertAllValues()},t.prototype.assertAllValues=function(){if(!this.acceleration.isOK())throw alert("Acceleration is not ok"),Error("Acceleration is not ok");if(!this.speed.isOK())throw alert("Speed is not ok"),Error("Speed is not OK");if(!this.center.isOK())throw alert("Center is not OK"),Error("Center is not OK")},t.prototype.move=function(t){this.center.doAdd(t)},t.prototype.applyAcceleration=function(t,e){void 0===e&&(e=1),this.speed.doAdd(t.multiply(e)),this.limitSpeed()},t.prototype.limitSpeed=function(){var e=this.speed.getMagnitude();0!=e&&(e<t.EPSILON?this.speed.doMultiply(0):(Math.abs(this.speed[0])>t.XLIMIT&&(this.speed[0]=Object(o.c)(this.speed[0],-t.XLIMIT,t.XLIMIT)),Math.abs(this.speed[1])>t.YLIMIT&&(this.speed[1]=Object(o.c)(this.speed[1],-t.YLIMIT,t.YLIMIT)))),Math.abs(this.angularSpeed)<t.EPSILON&&(this.angularSpeed=0)},t.prototype.intersects=function(t,e){var n=this.getAABB(),i=t.getAABB();if(e===s.ROUND)return this.center.subtract(t.center).getMagnitude()<this.corner.getMagnitude()+t.corner.getMagnitude();if(c.aabbIntersect(n,i)){if(e===s.AABB)return!0;if(e===s.POLYGON)return a.polygonIntersect(this.asPolygon(),t.asPolygon());throw new Error("Not implemented intersection check kind")}return!1},t.prototype.getLTWH=function(){return[this.center[0]-this.corner[0],this.center[1]-this.corner[1],2*this.corner[0],2*this.corner[1]]},t.prototype.getAABB=function(){var t=Math.abs(2*this.corner[0]),e=Math.abs(2*this.corner[1]),n=this.rotation,i=Math.abs(Math.sin(n)),o=Math.abs(Math.cos(n)),r=e*i+t*o,s=t*i+e*o;return new c(this.center.x-r/2,this.center.y-s/2,r,s)},t.prototype.asPolygon=function(){var t=this.rotation,e=2*this.corner[0],n=2*this.corner[1],o=new i.a(-e/2,-n/2).rotate(t).doAdd(this.center),r=new i.a(e/2,-n/2).rotate(t).doAdd(this.center),s=new i.a(e/2,n/2).rotate(t).doAdd(this.center),c=new i.a(-e/2,n/2).rotate(t).doAdd(this.center);return new a(o,r,s,c)},t.prototype.rotate=function(t){return this.rotation+=t,this},t.prototype.gravitateTo=function(t,e,n){void 0===n&&(n=.5);var i=Math.max(e,16);n<=3?this.speed.set(t.subtract(this.center).multiply(i/1e3*n)):this.center.set(t)},t.EPSILON=.005,t.XLIMIT=.5,t.YLIMIT=.5,t}();e.b=r;var s;!function(t){t[t.AABB=0]="AABB",t[t.ROUND=1]="ROUND",t[t.POLYGON=2]="POLYGON"}(s||(s={}));var a=function(){function t(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.points=t}return t.polygonIntersect=function(t,e){var n=!0;return[t,e].forEach(function(o){for(var r=0;r<o.points.length;r++)!function(r){var s=(r+1)%o.points.length,a=o.points[r],c=o.points[s],u=new i.a(c[1]-a[1],a[0]-c[0]),h=null,p=null;t.points.forEach(function(t){var e=u[0]*t[0]+u[1]*t[1];(null==h||e<h)&&(h=e),(null==p||e>p)&&(p=e)});var l=null,f=null;e.points.forEach(function(t){var e=u[0]*t[0]+u[1]*t[1];(null==l||e<l)&&(l=e),(null==f||e>f)&&(f=e)}),(p<l||f<h)&&(n=!1)}(r)}),n},t.prototype.getNormalAt=function(e){for(var n=this.points.length,o=this.getCentroid(),r=e.subtract(o).toRotation(),s=0;s<n;s++){var a=this.points[s].subtract(o),c=this.points[(s+1)%n].subtract(o);if(t.isBetween(a.toRotation(),r,c.toRotation()))return c.subtract(a).getNormal()}return new i.a},t.prototype.getSideVectorAt=function(e){for(var n=this.points.length,o=this.getCentroid(),r=e.subtract(o).toRotation(),s=0;s<n;s++){var a=this.points[s].subtract(o),c=this.points[(s+1)%n].subtract(o);if(t.isBetween(a.toRotation(),r,c.toRotation()))return c.subtract(a)}return new i.a},t.normalizeAngle=function(t){return(t+3*Math.PI)%(2*Math.PI)-Math.PI},t.isBetween=function(e,n,i){var o=t.normalizeAngle(e-n),r=t.normalizeAngle(i-n);return o<=0&&0<=r},t.prototype.getCentroid=function(){var t=this.points.reduce(function(t,e){return t[0]+=e.x,t[1]+=e.y,t},[0,0]);return new i.a(t[0]/this.points.length,t[1]/this.points.length)},t.prototype.debugDraw=function(t){t.fillStyle="#ff0000",this.points.forEach(function(e){return t.fillRect(e.x,e.y,1,1)})},t}(),c=function(){function t(t,e,n,i){this.x=t,this.y=e,this.width=n,this.height=i}return Object.defineProperty(t.prototype,"left",{get:function(){return this.x},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"top",{get:function(){return this.y},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"right",{get:function(){return this.x+this.width},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"bottom",{get:function(){return this.y+this.height},enumerable:!0,configurable:!0}),t.aabbIntersect=function(t,e){return!(e.left>t.right||e.right<t.left||e.top>t.bottom||e.bottom<t.top)},t.prototype.debugDraw=function(t){t.strokeStyle="#6894ca",t.strokeRect(this.x,this.y,this.width,this.height)},t}()},function(t,e,n){"use strict";function i(t,e,n){void 0===n&&(n=!1);var i=Math.random()*(e-t)+t;return n?Math.floor(i):i}function o(t,e,n){return Math.min(Math.max(t,e),n)}function r(t,e){for(var n=new Array(t),i=0;i<t;i++)n[i]=e(i);return n}e.c=o,e.b=r,n.d(e,"a",function(){return s});var s=(function(){function t(t,e){void 0===e&&(e=t),this.min=t,this.max=e}t.prototype.getRandom=function(){return i(this.min,this.max)},t.getRandom=function(e){return e instanceof t?e.getRandom():e}}(),function(){function t(t){this.hexValue=t}return t.fromRgb=function(t,e,n){throw Error("Dont use this yet")},t.prototype.toString=function(){return this.hexValue},t.prototype.valueOf=function(){return this.hexValue},t}())},function(t,e,n){"use strict";n.d(e,"a",function(){return r});var i=n(8),o=function(){function t(){this.instantiationTime=Date.now(),this.eventQueues={},this.listenerQueues={},this.filteringListeners=new i.a}return Object.defineProperty(t,"instance",{get:function(){return t._instance||(t._instance=new t),t._instance},enumerable:!0,configurable:!0}),t.prototype.publish=function(t){var e=t.kind;this.eventQueues[e]||(this.eventQueues[e]=[]),this.eventQueues[e].push(t);var n=this.listenerQueues[e];n&&n.forEach(function(e){return e(t)}),this.filteringListeners.getEntries().forEach(function(e){var n=e[0],i=e[1];n(t)&&i(t)})},t.prototype.subscribeAll=function(t,e){this.listenerQueues[t]||(this.listenerQueues[t]=[]),this.listenerQueues[t].push(e)},t.prototype.unsubscribeAll=function(t,e){var n=this.listenerQueues[t].indexOf(e);this.listenerQueues[t].splice(n,1)},t.prototype.subscribe=function(t,e){this.filteringListeners.put(t,e)},t.prototype.unsubscribe=function(t){this.filteringListeners.deleteByValue(t)},t.prototype.replay=function(){var t=this;Date.now();Object.keys(this.eventQueues).map(function(e){var n=t.eventQueues[+e],i=n[0];setTimeout(function(){return t.replayEvent(i,n.slice(1))},i.timestamp-t.instantiationTime)})},t.prototype.replayEvent=function(t,e){var n=this;if(t){var i=t.kind,o=this.listenerQueues[i];if(o&&o.forEach(function(e){return e(t)}),this.filteringListeners.getEntries().forEach(function(e){var n=e[0],i=e[1];n(t)&&i(t)}),e.length){var r=e[0];setTimeout(function(){return n.replayEvent(r,e.slice(1))},r.timestamp-t.timestamp)}}},t}();e.b=o;var r;(function(){function t(){}})(),function(){function t(){}}();!function(t){t[t.MOUSE=0]="MOUSE",t[t.KEYBOARD=1]="KEYBOARD"}(r||(r={}))},function(t,e,n){"use strict";function i(){var t=new a.a(0,0);return w.getKey(r.a.KEY.W)&&t.doAdd(new a.a(0,-1)),w.getKey(r.a.KEY.S)&&t.doAdd(new a.a(0,1)),w.getKey(r.a.KEY.A)&&t.doAdd(new a.a(-1,0)),w.getKey(r.a.KEY.D)&&t.doAdd(new a.a(1,0)),t}Object.defineProperty(e,"__esModule",{value:!0});var o=n(6),r=n(7),s=n(9),a=n(0),c=n(3),u=n(10),h=n(11),p=n(12),l=n(1),f=n(2),d=n(13),y=n(4),v=document.getElementById("mainCanvas"),w=(new r.b(v),new r.a),b=new o.a(v),m=new s.a,g=new u.a;window.world=m,m.addCollisionPair(l.a.PLAYER,l.a.WALL,f.a.POLYGON),m.addCollisionPair(l.a.CIVILIAN,l.a.WALL,f.a.POLYGON);var A=new d.b(new a.a(0,0),0,0,null),L=new d.d;L.connectTo(A),m.addEntities(L.entities);var E=new d.f(200,90);E.connectTo(L.connectors[0]);var O=new d.e(100);O.connectTo(E.connectors[0]);var R=new d.a;R.connectTo(O.connectors[0]);var k=new d.a;k.connectTo(O.connectors[1]);var S=new d.f(100,30);S.connectTo(O.connectors[2]);var C=new d.c;C.connectTo(S.connectors[0]),[L,E,O,S,R,k,C].forEach(function(t){return m.addEntities(t.entities.concat(t.walls))});var T=new h.a(L.entities[0].body.center.copy(),10,new c.a("#03ff30"));m.addEntity(T),g.target=T.body;var I=Object(c.b)(50,function(t){return new p.a(L.entities[0].body.center.copy(),10,a.a.random(),new c.a("#da92df"))});m.addEntities(I),b.addAnimateCallback(function(t){m.animate(t),g.animate(t)}),b.addAnimateCallback(function(t){var e=i();T.move(e.normalize(t))}),b.addRenderCallback(function(t,e){if(w.getKey(220))e.save(),m.render(e,t),e.strokeRect.apply(e,g.body.getLTWH()),e.restore();else{e.save();var n=g.getTranslation();e.translate(n[0],n[1]),e.rotate(g.getRotation()),m.render(e,t),e.restore()}}),w.on("T".charCodeAt(0),function(){y.b.instance.replay()}),b.start()},function(t,e,n){"use strict";var i=function(){function t(t){this.animateListeners=[],this.renderListeners=[],this.timeFactor=1,this.isRunning=!1,this.canvas=t;var e=t.getContext("2d");if(null===e)throw new Error("Failed to retrieve canvas context.");this.ctx=e,this.ctx.webkitImageSmoothingEnabled=!1,this.ctx.imageSmoothingEnabled=!1}return t.prototype.r=function(t){window.requestAnimationFrame?window.requestAnimationFrame(t):window.webkitRequestAnimationFrame?window.webkitRequestAnimationFrame(t):window.mozRequestAnimationFrame?window.mozRequestAnimationFrame(t):window.setTimeout(t,1e3/60,1e3/60)},t.prototype.render=function(t){var e=this;this.ctx.save(),this.ctx.fillStyle="#323892",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.restore(),this.renderListeners.forEach(function(n){return n(t,e.ctx)})},t.prototype.animate=function(t){this.animateListeners.forEach(function(e){return e(t)})},t.prototype.gameLoop=function(t){var e=t||(this.lastTime||0)+1e3/60;if(!this.lastTime)return this.lastTime=e,void this.r(this.boundGameLoop);var n=Math.min(e-this.lastTime,70)*this.timeFactor;this.isRunning&&this.r(this.boundGameLoop),this.animate(n),this.render(n),this.lastTime=e},t.prototype.start=function(){this.boundGameLoop=this.gameLoop.bind(this),this.isRunning=!0,this.boundGameLoop(0)},t.prototype.stop=function(){this.isRunning=!1},t.prototype.addRenderCallback=function(t){this.renderListeners.push(t)},t.prototype.addAnimateCallback=function(t){this.animateListeners.push(t)},t}();e.a=i},function(t,e,n){"use strict";n.d(e,"a",function(){return o}),n.d(e,"b",function(){return r});var i=n(4),o=function(){function t(t){var e=this;this.keys={},this.listeners={},this.onceListeners={},(t||window).addEventListener("keydown",function(t){i.b.instance.publish({timestamp:Date.now(),kind:i.a.KEYBOARD,domEvent:t,eventType:"keydown"})},!1),(t||window).addEventListener("keyup",function(t){i.b.instance.publish({timestamp:Date.now(),kind:i.a.KEYBOARD,domEvent:t,eventType:"keyup"})},!1),i.b.instance.subscribeAll(i.a.KEYBOARD,function(t){"keydown"===t.eventType?e.setKey(t.domEvent):"keyup"===t.eventType&&e.unsetKey(t.domEvent)})}return t.prototype.getKey=function(t){return this.keys[t]},t.prototype.getKeys=function(){var t=this;return Object.keys(this.keys).reduce(function(e,n){return t.keys[+n]&&e.push(+n),e},[])},t.prototype.on=function(t,e){this.listeners[t]=e},t.prototype.once=function(t,e){this.onceListeners[t]=e},t.prototype.setKey=function(t){var e=t.keyCode;this.keys[e]||(this.keys[e]=!0,this.listeners[e]&&this.listeners[e](t),this.onceListeners[e]&&(this.onceListeners[e](t),delete this.onceListeners[e]))},t.prototype.unsetKey=function(t){var e=t.keyCode;this.keys[e]=!1},t.KEY={W:"W".charCodeAt(0),S:"S".charCodeAt(0),A:"A".charCodeAt(0),D:"D".charCodeAt(0),I:"I".charCodeAt(0),K:"K".charCodeAt(0),J:"J".charCodeAt(0),L:"L".charCodeAt(0),SPACE:" ".charCodeAt(0)},t}(),r=function(){function t(t){var e=this;this.keys={},this.listeners={},this.onceListeners={},this.moveListeners=[],this.x=0,this.y=0,this._scaleX=1,this._scaleY=1,this._scaleX=t?t.offsetWidth/t.width:1,this._scaleY=t?t.offsetHeight/t.height:1,(t||window).addEventListener("mousemove",this.move.bind(this),!1),(t||window).addEventListener("mousedown",function(t){i.b.instance.publish({timestamp:Date.now(),kind:i.a.MOUSE,domEvent:t,eventType:"mousedown"})},!1),(t||window).addEventListener("mouseup",function(t){i.b.instance.publish({timestamp:Date.now(),kind:i.a.MOUSE,domEvent:t,eventType:"mouseup"})},!1),(t||window).oncontextmenu=function(t){return!1},i.b.instance.subscribeAll(i.a.MOUSE,function(t){"mousedown"===t.eventType?e.setKey(t.domEvent):"mouseup"===t.eventType&&e.unsetKey(t.domEvent)})}return t.prototype.move=function(t){var e=this;this.x=t.offsetX/this._scaleX,this.y=t.offsetY/this._scaleY,this.moveListeners.forEach(function(n){return n(t,e.x,e.y)})},t.prototype.onClick=function(t,e){this.listeners[t]=e},t.prototype.onceClick=function(t,e){this.onceListeners[t]=e},t.prototype.setKey=function(t){var e=t.button,n=t.x/this._scaleX,i=t.y/this._scaleY;this.keys[e]||(this.keys[e]=!0,this.listeners[e]&&this.listeners[e](t,n,i),this.onceListeners[e]&&(this.onceListeners[e](t,n,i),delete this.onceListeners[e]))},t.prototype.unsetKey=function(t){var e=t.button;this.keys[e]=!1},t.prototype.getKey=function(t){return this.keys[t]},t.prototype.getKeys=function(){var t=this;return Object.keys(this.keys).reduce(function(e,n){return t.keys[+n]&&e.push(+n),e},[])},t}()},function(t,e,n){"use strict";var i=function(){function t(){this.keyList=[],this.valueList=[]}return t.prototype.put=function(t,e){this.keyList.push(t),this.valueList.push(e)},t.prototype.contains=function(t){return this.keyList.indexOf(t)>=0},t.prototype.containsValue=function(t){return this.valueList.indexOf(t)>=0},t.prototype.get=function(t){var e=this.keyList.indexOf(t);return this.valueList[e]},t.prototype.getByValue=function(t){var e=this.valueList.indexOf(t);return this.keyList[e]},t.prototype.getEntries=function(){for(var t=[],e=0;e<this.keyList.length;e++)t.push([this.keyList[e],this.valueList[e]]);return t},t.prototype.delete=function(t){var e=this.keyList.indexOf(t);return!!e&&(this.keyList.splice(e,1),this.valueList.splice(e,1),!0)},t.prototype.deleteByValue=function(t){var e=this.valueList.indexOf(t);return!!e&&(this.keyList.splice(e,1),this.valueList.splice(e,1),!0)},t.prototype.clear=function(){this.keyList=[],this.valueList=[]},t}();e.a=i},function(t,e,n){"use strict";var i=n(1),o=function(){function t(){this.entityGroups={0:[]},this.roundCount=0,this.colliders=[],this.pool={},t.instance=this}return t.prototype.render=function(t,e){var n=this;Object.keys(this.entityGroups).forEach(function(i){var o=+i;if(0!==o){n.entityGroups[o].forEach(function(n){n.isVisible&&n.draw(t,e)})}})},t.prototype.animate=function(t){this.roundCount++,this.resolveCollisions(t),this.entityGroups[i.a.ABSTRACT].forEach(function(e){e.isAlive&&e.animate(t)})},t.prototype.clear=function(){},t.prototype.resolveCollisions=function(t){var e=this;this.colliders.forEach(function(n){var i=n[0],o=n[1],r=n[2],s=n[3],a=e.entityGroups[i],c=e.entityGroups[o];if(a&&c)for(var u=0;u<a.length;u++){var h=a[u];if(!h.isMarked&&h.isAlive)for(var p=0;p<c.length;p++){var l=c[p];!l.isMarked&&l.isAlive&&(h.body.intersects(l.body,r)&&(h.collideAction(l,t),s&&l.collideAction(h,t)))}}})},t.prototype.addCollisionPair=function(t,e,n,i){void 0===i&&(i=!1),this.colliders.push([t,e,n,i])},t.prototype.addEntities=function(t,e){var n=this;t.forEach(function(t){return n.addEntity(t,e)})},t.prototype.addEntity=function(t,e){this.entityGroups[i.a.ABSTRACT].push(t);var n=this.entityGroups[e||t.kind];n||(this.entityGroups[e||t.kind]=[],n=this.entityGroups[e||t.kind]),n.push(t)},t}();e.a=o},function(t,e,n){"use strict";n.d(e,"a",function(){return r});var i=n(0),o=n(2),r=function(){function t(){this.target=null,this.body=new o.b(new i.a(0,0),new i.a(320,240),new i.a,new i.a)}return t.prototype.getTranslation=function(){var t=this.body.getLTWH();return new i.a(-t[0],-t[1])},t.prototype.getRotation=function(){return-this.body.rotation},t.prototype.animate=function(t){null!==this.target&&this.body.gravitateTo(this.target.center,t,.25),this.body.tick(t)},t}()},function(t,e,n){"use strict";n.d(e,"a",function(){return c});var i=n(1),o=n(0),r=n(2),s=n(3),a=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),c=function(t){function e(e,n,s){var a=t.call(this,i.a.PLAYER)||this;return a.hasControl=!0,a.color=s,a.body=new r.b(e,new o.a(n/2,n/2)),a.restitution=.3,a}return a(e,t),e.prototype.draw=function(t,e){var n=this.body.getLTWH(),i=n[0],o=n[1],r=n[2],s=n[3];t.save(),t.translate(i+r/2,o+s/2),t.rotate(this.body.rotation),t.fillStyle=this.color.toString(),t.fillRect(-r/2,-s/2,r,s),t.fillRect(-r/2,-s/2-10,r/2,s/2),t.restore(),this.body.getAABB().debugDraw(t),this.body.asPolygon().debugDraw(t)},e.prototype.onAnimate=function(t){0!==this.body.speed.getMagnitude()&&(this.body.rotation=this.body.speed.toRotation())},e.prototype.onRemove=function(){},e.prototype.collideAction=function(t,n){var o=this;if(this.color=new s.a("#de8228"),setTimeout(function(){o.color=new s.a("#39fa93"),o.hasControl=!0},300),t.kind===i.a.WALL){var r=t.body.asPolygon().getSideVectorAt(this.body.center).normalize(),a=r.multiply(this.body.speed.dotProduct(r));this.body.speed.set(a.add(r.getNormal().doMultiply(e.PLAYER_SPEED_FACTOR*n))),this.hasControl=!1}},e.prototype.move=function(t){this.hasControl&&this.body.applyAcceleration(t.multiply(e.PLAYER_SPEED_FACTOR))},e.PLAYER_SPEED_FACTOR=.001,e}(i.b)},function(t,e,n){"use strict";n.d(e,"a",function(){return a});var i=n(1),o=n(0),r=n(2),s=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),a=function(t){function e(e,n,s,a){var c=t.call(this,i.a.CIVILIAN)||this;return c.moveSpeedFactor=.001*Math.random(),c.color=a,c.body=new r.b(e,new o.a(n/2,n/2)),c.restitution=.3,c.moveDirection=s,c}return s(e,t),e.prototype.draw=function(t,e){var n=this.body.getLTWH(),i=n[0],o=n[1],r=1.3*n[2],s=n[3];t.save(),t.translate(i+r/2,o+s/2),t.rotate(this.body.rotation),t.fillStyle=this.color.toString(),t.fillRect(-r/2,-s/2,r,s),t.fillRect(-r/2,-s/2-10,r/2,s/2),t.restore()},e.prototype.onAnimate=function(t){0!==this.body.speed.getMagnitude()&&(this.body.rotation=this.body.speed.toRotation()),this.body.applyAcceleration(this.moveDirection.normalize(this.moveSpeedFactor),t)},e.prototype.collideAction=function(t,e){if(t.kind===i.a.WALL){var n=t.body.asPolygon().getSideVectorAt(this.body.center).normalize(),r=n.multiply(this.body.speed.dotProduct(n));this.body.speed.set(r.add(n.getNormal().doMultiply(this.moveSpeedFactor*e*2))),this.moveDirection=o.a.random()}},e.prototype.onRemove=function(){},e}(i.b)},function(t,e,n){"use strict";n.d(e,"b",function(){return u}),n.d(e,"d",function(){return h}),n.d(e,"f",function(){return p}),n.d(e,"e",function(){return l}),n.d(e,"c",function(){return f}),n.d(e,"a",function(){return d});var i=n(0),o=n(1),r=n(2),s=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),a=3,c=function(){function t(){this.connectors=[],this.entities=[],this.walls=[],this.isMaterialized=!1}return t.prototype.connectTo=function(t){if(this.materialize(t),!this.baseConnector)throw Error("This element cannot be connected. Please define the baseConnector");t.link=this.baseConnector,this.baseConnector.link=t,this.isMaterialized=!0,this.createWalls(),this.closeOpenings(),this.moveToPlace()},t.prototype.moveToPlace=function(){var t=this.baseConnector.link;if(t){var e=t.rotation,n=t.location.subtract(this.baseConnector.location.copy().rotate(-e));this.entities.forEach(function(t){t.body.rotate(e),t.body.center.doRotate(-e).doAdd(n)}),this.walls.forEach(function(t){t.body.rotate(e),t.body.center.doRotate(-e).doAdd(n)}),this.connectors.forEach(function(t){t.rotation+=e,t.location.doRotate(-e).doAdd(n)}),this.baseConnector.location.set(t.location),this.baseConnector.rotation=t.rotation}},t.prototype.closeOpenings=function(){var t=this.baseConnector.link;if(t){var e=this.baseConnector.openingWidth/2,n=t.openingWidth/2,o=this.baseConnector.location.y,r=n+(e-n)/2,s=new y(new i.a(-r,o),e-n,10),a=new y(new i.a(r,o),e-n,10);this.walls.push(s,a)}},t}(),u=function(){function t(t,e,n,i){void 0===i&&(i=null),this.location=t,this.rotation=e,this.openingWidth=n,this.link=i}return t}(),h=function(t){function e(){var n=null!==t&&t.apply(this,arguments)||this;return n.halfSize=e.SIZE/2,n}return s(e,t),e.prototype.materialize=function(t){var n=new v(new i.a(0,0),e.SIZE,e.SIZE,0);this.entities.push(n),this.baseConnector=new u(new i.a(0,this.halfSize),0,e.SIZE),this.connectors.push(new u(new i.a(0,-this.halfSize),0,e.SIZE))},e.prototype.createWalls=function(){this.walls.push(new y(new i.a(this.halfSize,0),10,e.SIZE),new y(new i.a(-this.halfSize,0),10,e.SIZE))},e.SIZE=60*a,e}(c),p=function(t){function e(e,n){var i=t.call(this)||this;return i.length=e*a,i.width=n*a,i}return s(e,t),e.prototype.materialize=function(t){var e=new v(new i.a(0,0),this.width,this.length,0,"#ccffee");this.entities.push(e),this.entities.push(new v(new i.a(30,0),5,5,Math.PI/4,"#000000")),this.baseConnector=new u(new i.a(0,this.length/2),0,this.width),this.connectors.push(new u(new i.a(0,-this.length/2),0,this.width))},e.prototype.createWalls=function(){this.walls.push(new y(new i.a(-this.width/2,0),10,this.length,0),new y(new i.a(this.width/2,0),10,this.length,0))},e}(c),l=function(t){function e(e){var n=t.call(this)||this;return n.size=e*a,n.halfSize=n.size/2,n}return s(e,t),e.prototype.materialize=function(t){var e=new v(new i.a(0,0),this.size,this.size,0,"#fcffae");this.entities.push(e),this.baseConnector=new u(new i.a(0,this.halfSize),0,this.size),this.connectors.push(new u(new i.a(0,-this.halfSize),0,this.size),new u(new i.a(-this.halfSize,0),Math.PI/2,this.size),new u(new i.a(this.halfSize,0),-Math.PI/2,this.size))},e.prototype.createWalls=function(){},e}(c),f=function(t){function e(){var n=null!==t&&t.apply(this,arguments)||this;return n.halfSize=e.SIZE/2,n}return s(e,t),e.prototype.materialize=function(t){var n=new v(new i.a(0,0),e.SIZE,e.SIZE,0,"#ffeeee");this.entities.push(n),this.baseConnector=new u(new i.a(0,this.halfSize),0,e.SIZE)},e.prototype.createWalls=function(){this.walls.push(new y(new i.a(this.halfSize,0),10,e.SIZE),new y(new i.a(-this.halfSize,0),10,e.SIZE),new y(new i.a(0,-this.halfSize),e.SIZE,10))},e.SIZE=60*a,e}(c),d=function(t){function e(){return t.call(this)||this}return s(e,t),e.prototype.materialize=function(t){this.baseConnector=new u(new i.a(0,0),0,0)},e.prototype.createWalls=function(){},e}(c),y=function(t){function e(e,n,s,a){void 0===a&&(a=0);var c=t.call(this,o.a.WALL)||this;return c.body=new r.b(e,new i.a(n/2,s/2)).rotate(a),c}return s(e,t),e.prototype.onAnimate=function(t){},e.prototype.onRemove=function(){},e.prototype.draw=function(t,n){var i=this.body.getLTWH(),o=i[0],r=i[1],s=i[2],a=i[3];t.save(),t.translate(o+s/2,r+a/2),t.rotate(this.body.rotation),t.fillStyle=e.WALL_COLOR,t.fillRect(-s/2-1,-a/2-1,s+1,a+1),t.restore(),this.body.getAABB().debugDraw(t),this.body.asPolygon().debugDraw(t)},e.WALL_COLOR="#398527",e}(o.b),v=function(t){function e(n,s,a,c,u){void 0===u&&(u=e.FLOOR_COLOR);var h=t.call(this,o.a.FLOOR)||this;return h.body=new r.b(n,new i.a(s/2,a/2)).rotate(c),h.color=u,h}return s(e,t),e.prototype.onAnimate=function(t){},e.prototype.onRemove=function(){},e.prototype.draw=function(t,e){var n=this.body.getLTWH(),i=n[0],o=n[1],r=n[2],s=n[3];t.save(),t.translate(i+r/2,o+s/2),t.rotate(this.body.rotation),t.fillStyle=this.color,t.fillRect(-r/2-1,-s/2-1,r+1,s+1),t.restore()},e.FLOOR_COLOR="#e9c5e7",e}(o.b)}]);
//# sourceMappingURL=code.js.map