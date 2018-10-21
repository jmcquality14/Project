//Boss Class//
function Boss(x, y, health){
	this.x = x;
	this.y = y;	
	this.width = 200;
	this.height = 150;
	this.health = health;
    this.speed = 0.2
	this.bossImage = new Image();
	this.bossImage.src = "ghostBoss.png";
}

Boss.prototype.update = function(deltaT){
	if( this.x <= this.width/2 + 25 )
		this.speed *= -1;
	else if ( this.x >= WIDTH - this.width - this.width/2) {
		this.speed *= -1;
	}
	this.x += deltaT * this.speed;
}

Boss.prototype.render = function(context){	
	context.save();
	context.drawImage(this.bossImage, this.x, this.y-(this.height/2), this.width, this.height);
	context.restore();
	
}