//Player Class
/** @function Player
  * Constructor to Player Object
  * @param {integer} x - x-coordinate of player
  * @param {integer} y - y-coordinate of player
  */
function Player(x, y, angle){
	this.dead = false;
	this.lives = 3;
	this.score = 0;
	this.x = x;
	this.y = y;
	this.angle = angle; // angle ship is pointing
	this.momentumAngle = angle; // angle ship is traveling
	this.speed = 0;
	this.width = 32;
	this.height = 32;	
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
	this.playerImage.src = "spaceship.png";
}

/** @function 
  * Updates position of Player on canvas
  * @param {double} deltaT - the total change in time
  * @param {double} deltaT - the total change in the anlge
  * @param {double} deltaV - the total change in veloity
  */
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

/** @function render
  * Draws player on canvas
  * @param {canvas} context - canvas being drawn to
  */
Player.prototype.render = function(context){
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	context.drawImage(this.playerImage, -(this.width / 2), -(this.height / 2), this.width ,this.height);
	context.restore();
}