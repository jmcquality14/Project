//gameScreen//
function GameScreen(src, width, height){
	this.width = width;
	this.height = height;
	this.screenImg = new Image( this.width, this.height);
	this.screenImg.src = 'background.png';
}

GameScreen.prototype.render = function(context){
	context.save();
	context.drawImage(this.screenImg, 0, 0, this.width, this.height);
	context.restore();
	console.log("image drawn?");
}