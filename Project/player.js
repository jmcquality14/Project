//Player Class//
function Player(src, x, y, angle){
	this.dead = false;
	this.lives = 100;
	this.score = 0;
	this.x = x;
	this.y = y;
	this.angle = angle; // angle ship is pointing
	this.momentumAngle = angle; // angle ship is traveling
	this.speed = 0;
	this.width = 30;
	this.height = 30;	
	this.currentInput = {
		space: false,
		up: false,
		left: false,
		right: false,
	}
	this.priorInput = {
		space: false,
		up: false,
		left: false,
		right: false,
	}	
	this.playerImage = new Image();
	this.playerImage.src = src;
}

Player.prototype.update= function(deltaT, deltaTheta, velocity){
	
	if(velocity != 0 && (this.angle == this.momentumAngle)) {
		this.speed = velocity;
	} else {
		this.speed *= 0.98;
	}	
	
	if(this.speed <= 0.02 && this.speed >= -0.02){
		this.speed = 0;
		this.angle += deltaTheta;
		this.momentumAngle = this.angle;
	} else {
		this.angle += deltaTheta;
	}
	
	var x_vector = this.speed*Math.cos(this.momentumAngle);
	var y_vector = this.speed*Math.sin(this.momentumAngle);
	
	this.x += deltaT*x_vector;
	this.y += deltaT*y_vector;
	
	if(this.y < -this.height/2){ this.y = HEIGHT; }
	if(this.y > HEIGHT+(this.height/2)){ this.y = 0; }
	if(this.x < -this.width/2){ this.x = WIDTH; }
	if(this.x > WIDTH+(this.width/2)){ this.x = 0; }
}

Player.prototype.render = function(context){
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	context.drawImage(this.playerImage, -(this.width / 2), -(this.height / 2), this.width ,this.height);
	context.restore();
}