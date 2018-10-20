//asteroid Class//
/** @function asteroid
  * Constructor to asteroid Object
  ** @param {integer} x - x-coordinate of asteroid
  * @param {integer} y - y-coordinate of asteroid
  * @param {integer} radius - radius of asteroid
  * @param {integer} velocity - velocity of asteroid
  * @param {integer} angle - angle of trajectory
  * @param {integer} mass - mass of asteroid
  */
function Asteroid(x, y, radius, velocity, angle, mass){
	this.x = x;
	this.y = y;	
	this.radius = radius;
	this.velocity = velocity;
	this.mass = mass;
	this.angle = angle;
	this.x_vector = velocity*Math.sin(angle); 
	this.y_vector = velocity*Math.cos(angle);
	this.asteroidImage = new Image();
	this.asteroidImage.src = "asteroid.png";
}

/** @function update
  * Updates position of asteroid on board
  * @param {double} deltaT - the total change in time  
  */
Asteroid.prototype.update = function(deltaT){
	this.x += deltaT * this.x_vector;
	this.y += deltaT * this.y_vector;
	
	if(this.y < -32){ this.y = HEIGHT; }
	if(this.y > HEIGHT+32){ this.y = 0; }
	if(this.x < -32){ this.x = WIDTH; }
	if(this.x > WIDTH+32){ this.x = 0; }	
}

/** @function render
  * Draws asteroid on canvas
  * @param {canvas} context - canvas being drawn to 
  */
Asteroid.prototype.render = function(context){
	//context.beginPath();
	//context.fillStyle = 'red'
	//context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	//context.fill();
	//context.closePath();  
	context.save();
	context.drawImage(this.asteroidImage, this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius);
	context.restore();
}