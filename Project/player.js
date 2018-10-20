//Player Class
/** @function Player
  * Constructor to Player Object
  * @param {integer} x - x-coordinate of player
  * @param {integer} y - y-coordinate of player
  */
function Player(x, y){
	this.x = x;
	this.y = y;
	this.lives = 3;
	this.dead = false;
	this.score = 0;
	this.angle = 0;
	this.width = 32;
	this.length = 32;	
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
	
	if(this.y < -40){ this.y = HEIGHT; }
	if(this.y > HEIGHT+40){ this.y = 0; }
	if(this.x < -40){ this.x = WIDTH; }
	if(this.x > WIDTH+40){ this.x = 0; }
}

/** @function render
  * Draws player on canvas
  * @param {canvas} context - canvas being drawn to
  */
Player.prototype.render = function(context){
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.angle);
	//context.fillStyle = 'white';
	//context.fillRect(-(this.width / 2), -(this.length / 2), this.width ,this.length);
	context.drawImage(this.img, -(this.width / 2), -(this.length / 2), this.width ,this.length);
	context.restore();
}