//Player Class
/** @function Player
  * Constructor to Player Object
  * @param {integer} x - x-coordinate of player
  * @param {integer} y - y-coordinate of player
  */
function Player(x, y, angle){
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.dead = false;
	this.lives = 3;
	this.score = 0;
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
	this.img = document.getElementById('spaceship');
}

/** @function 
  * Updates position of Player on canvas
  * @param {double} deltaT - the total change in time
  * @param {double} deltaT - the total change in the anlge
  * @param {double} deltaV - the total change in veloity
  */
Player.prototype.update= function(deltaT, deltaTheta, deltaV){
	
	this.angle += deltaTheta;
	var x_vector = deltaV*Math.cos(this.angle);
	var y_vector = deltaV*Math.sin(this.angle);
	
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
	context.drawImage(this.img, -(this.width / 2), -(this.height / 2), this.width ,this.height);
	context.restore();
}