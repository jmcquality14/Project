//Bullet Class//
function Bullet(x, y, radius, velocity, angle, owner){
	this.x = x;
	this.y = y+1;
	this.owner = owner;
	this.radius = radius;
	this.velocity = velocity;
	this.angle = angle;
}

Bullet.prototype.update = function(deltaT) {
	var x_vector = this.velocity*Math.cos(this.angle);
	var y_vector = this.velocity*Math.sin(this.angle);
	this.x += deltaT * x_vector;
	this.y += deltaT * y_vector;
}

Bullet.prototype.render = function(context){
	context.beginPath();
	context.fillStyle = 'white'
	context.arc(this.x + this.radius, this.y - this.radius, 2*this.radius, 0, 2*Math.PI);
	context.fill();
	context.closePath();
}