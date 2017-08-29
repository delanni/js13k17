// var Bubble = (function(_super) {
// 	__extends(Bubble,_super);
//
// 	function Bubble(center,size,color,life,shrink, fill){
// 		this.fill.apply(this, arguments);
// 		this.fillIt = fill;
// 	}
//
// 	Bubble.kind = EntityKind.BUBBLE;
//
// 	Bubble.prototype.fill = function(center,size,color,life,shrink){
// 		this.kind = EntityKind.BUBBLE;
// 		this.color = color;
// 		this.body = new PhysicsBody(center,new Vector2d(size/2,size/2));
// 		this.life = this.maxLife = life || 300;
// 		this.gravityFactor = 1;
// 		this.shrinkage = (shrink?(size/2)/this.life:0)*shrink;
// 	}
//
// 	Bubble.prototype.draw = function(ctx, world, time) {
// 		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2],h=ltwh[3];
// 		ctx.save();
// 		ctx.tr(l+w/2,t+h/2);
// 		ctx.beginPath();
// 		ctx.arc(0,0 ,this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
// 		if(this.fillIt){
// 			ctx.fillStyle = this.color;
// 			ctx.fill();
// 		} else {
// 		    ctx.strokeStyle = this.color;
// 			ctx.stroke();
// 		}
// 		ctx.restore();
// 	};
//
// 	Bubble.prototype.onAnimate = function(world,time) {
// 		if(time<this.life){
// 			this.body.corner.doAdd([this.shrinkage*time,this.shrinkage*time]);
// 		} else {
// 			this.collideGround();
// 		}
// 	};
//
// 	Bubble.prototype.applyGravity = function(gravityVector,time){
// 		this.body.applyAcceleration(gravityVector.multiply(this.gravityFactor),time);
// 	};
//
// 	Bubble.prototype.collideGround = function (other){
// 		this.markForRemoval();
// 		new Explosion({
// 			colors:[this.color],
// 			shrink:1,
// 			count:[5,7],
// 			strength:.15,
// 			offset: new Vector2d(0,-0.1),
// 			center: this.body.center,
// 			gravityFactor :1,
// 			life:200
// 		}).fire(this.body.center,World.instance);
// 	};
//
// 	return Bubble;
// })(Entity);

// var Collectible = (function(_super){
// 	__extends(Collectible,_super);
//
// 	function Collectible(center,size,color, particleType){
// 		this.fill.apply(this, arguments);
// 		this.fillIt = true;
// 	}
//
// 	Collectible.kind = EntityKind.COLLECTIBLE;
//
// 	Collectible.prototype.fill = function(center,size,color,particleType, draw){
// 		this.kind = EntityKind.COLLECTIBLE;
// 		this.color = color;
// 		this.body = new PhysicsBody(center,new Vector2d(size/2,size/2));
// 		this.gravityFactor = 0;
// 		this.shrinkage = 0;
// 		this.triggerDistance = 50;
// 		this.draw = draw || particleType.prototype.draw;
// 	};
//
// 	Collectible.prototype.onAnimate = function(world,time){
// 		var player = parrot;
// 		var dist = player.body.center.subtract(this.body.center).getMagnitude();
// 		if (dist < 8){
// 			this.collideAction(player);
// 			this.markForRemoval();
// 		}
// 		else if (dist<this.triggerDistance){
// 			this.body.gravitateTo(parrot.body.center,time);
// 		} else if (dist>500 && this.kind!=-666){
// 			this.markForRemoval();
// 		}
// 	};
//
// 	Collectible.prototype.collideAction = function(){
// 		aa.play("coin");
//         addPoints(5);
//     }
//
// 	return Collectible;
// })(Entity);

// var Target = (function(_super){
// 	__extends(Target,_super);
//
// 	function Target(spritesheet,center,kind){
// 		var animations = [[15,16,2,1e3,[kind*30,12]]]
// 		 _super.call(this,spritesheet, center, 16,15,animations);
// 		 this.kind = kind;
// 		 this.color = [F,W,P,T][kind][2];
// 	}
//
// 	Target.prototype.onRemove = function(){
// 			var cx = new Collectible(this.body.center, 4, this.color || T[0], Bubble);
//             world.addEntity(cx,World.NO_COLLISION, World.FOREGROUND);
// 		}
//
// 	return Target;
// })(SpriteEntity);

// var GroundEntity = (function(){
// 	function GroundEntity(groundheight,width,height){
// 		this.isVisible = true;
// 		this.isCollisionAware = true;
// 		this.groundheight = groundheight;
// 		this.color = P[2];
// 		this.width = width || 160;
// 		this.height = height || 144;
// 	}
//
// 	GroundEntity.prototype.draw = function(ctx, world) {
// 		ctx.save();
// 	    ctx.fillStyle = this.color;
// 		ctx.beginPath();
// 		ctx.moveTo(-300, this.height);
// 		ctx.lineTo(-300,this.height-this.groundheight);
// 		ctx.lineTo(this.width,this.height-this.groundheight);
// 		ctx.lineTo(this.width+1,this.height);
// 		ctx.closePath();
// 		ctx.fill();
// 		ctx.restore();
// 	};
//
// 	GroundEntity.prototype.animate = noop;
//
// 	GroundEntity.prototype.collidesWith = function(body){
// 		var ltwh = body.getLTWH();
// 		//var max = this.heightmap.maxInRange(clamp(ltwh[0],0,this.width), clamp(ltwh[0]+ltwh[2],0,this.width));
// 		var max = this.groundheight;
// 		if (max+ltwh[1]+ltwh[3]>this.height) return true;
// 		return false;
// 	};
//
// 	return GroundEntity;
// })();