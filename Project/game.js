//Screen Dimensions//
const WIDTH = 1080;
const HEIGHT = 720;

//Screen//
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

//BackBuffer//
var backBuffer = document.createElement('canvas');
var backBufferCtx = screen.getContext('2d');
backBuffer.height = HEIGHT;
backBuffer.width = WIDTH;

//Global Variables//
var start = null;
var menuFlag = true;
var clearLevelFlag = false;
var gameOverFlag = false;
var level = 1;

//Sprites//
var bullets = [];
var asteroids = [];
var player1 = new Player( WIDTH/4, HEIGHT/2, Math.PI); 
var player2 = new Player((3*WIDTH)/4, HEIGHT/2, 0);

//Images//
var menuScreen = new GameScreen('background.png', WIDTH, HEIGHT);

//Sounds//
var laser = new Sound("Laser_Shoot.wav");
var collision = new Sound("Hit_Hurt.wav");
var death = new Sound("Game_Over.wav");
var explosion = new Sound("Explosion.wav");

/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function player1handleKeydown(event) {
	switch(event.key){
		case ' ':
			player1.currentInput.space = true;
			break;
		case 'w':
			player1.currentInput.up = true;
			break;
		case 'a':
			player1.currentInput.left = true;
			break;
		case 'd':
			player1.currentInput.right = true;
			break;		
	}
}
window.addEventListener('keydown', player1handleKeydown ); 

function player2handleKeydown(event) {
	switch(event.key){
		case 'Enter':
			player2.currentInput.space = true;
			break;
		case 'i':
			player2.currentInput.up = true;
			break;
		case 'j':
			player2.currentInput.left = true;
			break;
		case 'l':
			player2.currentInput.right = true;
			break;			
	}
}
window.addEventListener('keydown', player2handleKeydown );


/** @function handleKeyup
  * Event handler for keyup events
  * @param {KeyEvent} event - the keyup event
  */
function player1handleKeyup(event) {
	switch(event.key){
		case ' ':
			player1.currentInput.space = false;
			break;
		case 'w':
			player1.currentInput.up = false;
			break;
		case 'a':
			player1.currentInput.left = false;
			break;
		case 'd':
			player1.currentInput.right = false;
			break;		
	}
}  
window.addEventListener('keyup', player1handleKeyup );

function player2handleKeyup(event) {
	switch(event.key){
		case 'Enter':
			player2.currentInput.space = false;
			break;
		case 'i':
			player2.currentInput.up = false;
			break;
		case 'j':
			player2.currentInput.left = false;
			break;
		case 'l':
			player2.currentInput.right = false;
			break;			
	}
}  
window.addEventListener('keyup', player2handleKeyup );

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
	player1.priorInput = JSON.parse(JSON.stringify(player1.currentInput));
	player2.priorInput = JSON.parse(JSON.stringify(player2.currentInput));
}

function gameStateMachine(gameState) {
	switch(gameState){
		case 0:
			console.log("in state machine");
			menuScreen.render(backBufferCtx);
			screenCtx.drawImage(backBuffer, WIDTH, HEIGHT);
			break;
		case 1:
			console.log("test loop");
			break;
		case 2:
			console.log("test Gameover");
			break;
	}	
}

/** @function loop
  * The main game loop
  * @param {DomHighResTimestamp} timestamp - the current system time
  */
function loop(timestamp){	
	if(!start) {
		start = timestamp;		
	}
	var elaspedTime = timestamp - start;
	start = timestamp;
	update(elaspedTime);
	render(backBufferCtx);
	screenCtx.drawImage(backBuffer, 0, 0);
	copyInput();
	window.requestAnimationFrame(loop);
}

/** @function update
  * Updates the game's state
  * @param {double} elapsedTime - the amount of time elapsed between frames
  */
function update(elaspedTime){
	if(gameOverFlag) {
		if(player1.currentInput.space || player2.currentInput.space) {
			player1 = new Player( WIDTH/4, HEIGHT/2, Math.PI); 
			player2 = new Player((3*WIDTH)/4, HEIGHT/2, 0);
			bullets = [];
			asteroids = [];
			gameOverFlag = false;
			clearLevelFlag = true;
		}
	} else if (menuFlag) {
		if(player1.currentInput.space || player2.currentInput.space) {
			menuFlag = false;
			clearLevelFlag = true;
		}
	} else if(clearLevelFlag) {
		if(!player1.dead) { player1.x = WIDTH/4; player1.y=HEIGHT/2; };
		if(!player2.dead) { player2.x = (3*WIDTH)/4; player2.y=HEIGHT/2; };
		var numOfAsteroids = level + 4;
		if( asteroids.length < numOfAsteroids){
			for(var i = 0; i < numOfAsteroids; i++){ addAsteroid();}
		}
	} else { 
		if(player1.currentInput.left){ player1.update(elaspedTime, -0.05, 0);} else if(player1.currentInput.right){ player1.update(elaspedTime, 0.05, 0);}
		if(player1.currentInput.up && !(player1.currentInput.left || player1.currentInput.right) ){ player1.update(elaspedTime, 0, 0.2);} else { player1.update(elaspedTime, 0 , 0); }
		if(player1.currentInput.space && !player1.priorInput.space && !player1.dead) {
			bullets.push(new Bullet(player1.x, player1.y, 2, 0.5, player1.angle, player1));
			laser.play();
		}	
		if(player2.currentInput.left ){ player2.update(elaspedTime, -0.05, 0);} else if(player2.currentInput.right ){ player2.update(elaspedTime, 0.05, 0);}
		if(player2.currentInput.up && !(player2.currentInput.left || player2.currentInput.right)){ player2.update(elaspedTime, 0, 0.2);} else { player2.update( elaspedTime, 0, 0); } 	
		if(player2.currentInput.space && !player2.priorInput.space && !player2.dead) {
			bullets.push(new Bullet(player2.x, player2.y, 2, 0.5, player2.angle, player2));
			laser.play();
		}
		asteroids.forEach(function(asteroid,index){
			asteroid.update(elaspedTime);
		});
		bullets.forEach(function(bullet, index){
			bullet.update(elaspedTime);
			if(bullet.y < 0 || bullet.y > HEIGHT || bullet.x < 0 || bullet.x > WIDTH){ bullets.splice(index, 1);}
		});
		if(!player1.dead){detectPlayerCollision(player1);detectBulletPlayerCollision(player1);}
		if(!player2.dead){detectPlayerCollision(player2);detectBulletPlayerCollision(player2);}
		detectAsteroidCollision()
		detectBulletCollision();
	}
}

/** @function render
  * Renders the game into the canvas
  * @param {} Ctx - context that render is drawing to.
  */
function render(Ctx){
	Ctx.beginPath();
	Ctx.clearRect(0, 0, WIDTH, HEIGHT);	
	if( (player1.lives <= 0 && player2.lives <= 0) || gameOverFlag ){
		gameOverFlag = true;
		if(player1.score > player2.score){
			Ctx.fillText('GAME OVER!  PLAYER1 WINS!  FINAL SCORE:  ' + player1.score, WIDTH/2 - 145, HEIGHT/2); 
		} else if (player2.score > player1.score){
			Ctx.fillText('GAME OVER!  PLAYER2 WINS!  FINAL SCORE:  ' + player2.score, WIDTH/2 - 145, HEIGHT/2);
		} else {
			Ctx.fillText('GAME OVER!  TIED SCORE: '+ player2.score, WIDTH/2 - 120, HEIGHT/2);
		}
	} else if (menuFlag) {
		menuScreen.render(Ctx);
		Ctx.fillText('Press Space to Start', WIDTH/2-40, HEIGHT/2);
		Ctx.fillStyle = 'white';
	} else if(clearLevelFlag){
		Ctx.fillText("Level "+level, WIDTH/2, HEIGHT/2);
		Ctx.fillStyle = 'white';
		setTimeout(function(){ clearLevelFlag = false;}, 3000);		
	} else {
		menuScreen.render(Ctx);
		if(!player1.dead){	player1.render(Ctx);}
		if(!player2.dead){	player2.render(Ctx);}
		bullets.forEach(function(bullet){ bullet.render(Ctx);});
		asteroids.forEach(function(asteroid){ asteroid.render(Ctx);});
		Ctx.fillText("Player 1's Score: "+ player1.score + "        Player 1's Lives: "+ player1.lives +"                Player 2's Score: "+ player2.score + "        Player 2's Lives: "+ player2.lives, 20 , 50);	
		Ctx.fillStyle = 'white';
		Ctx.closePath();
		if(asteroids.length == 0){ 
			level++;
			clearLevelFlag = true;
		}
		
	}
}

/** @function addAsteroid
  * Constructs a new asteroid object and randomly assigns it a position on the canvas. Then adds asteroid to
  * array of asteroids.
  */
function addAsteroid(){
	var x_pos = Math.floor(Math.random() * (WIDTH) );
	if( Math.abs(x_pos - WIDTH/2) <= 100) { x_pos +=100; } 
	var y_pos = Math.floor(Math.random() * (HEIGHT) );
	if( Math.abs(y_pos - HEIGHT/2) <= 100) { y_pos +=100; }
	var radius = Math.floor(Math.random() * 10) + (level*10);	
	var velocity = Math.floor(Math.random()) + 0.1;
	var angle = Math.floor(Math.random() * 360);
	var mass = Math.floor(Math.random() * 100);
	asteroids.push(new Asteroid(x_pos, y_pos, radius, velocity, angle, mass));
}

/** @function detectCollision
  * Detects a collision between a player's bullet and an asteroid. Removes bullet and asteroid from
  * screen if their is a collision detected.
  */
function detectBulletCollision(){
	for(var j = 0; j < bullets.length; j++){
		for(var i = 0; i < asteroids.length; i++){	
			var tempAsteroid = asteroids[i];			
			var distSquared = Math.pow(tempAsteroid.x - bullets[j].x, 2) + Math.pow(tempAsteroid.y - bullets[j].y, 2);
			if(distSquared <= Math.pow(tempAsteroid.radius + bullets[j].radius,2)){
				bullets[j].owner.score += 10;
				bullets.splice(j, 1);
				asteroids.splice(i,1);
				if(tempAsteroid.radius > 10){
					var tempMass = tempAsteroid.mass/2;
					var tempVelocity = (tempAsteroid.mass*tempAsteroid.velocity) / tempMass;
					asteroids.splice(i, 0, new Asteroid(tempAsteroid.x+5, tempAsteroid.y+5, tempAsteroid.radius/2, tempVelocity, tempAsteroid.angle, tempMass), new Asteroid(tempAsteroid.x-5, tempAsteroid.y-5, tempAsteroid.radius/2, -tempVelocity, tempAsteroid.angle, tempMass));
				} 
				explosion.play();
				return;
			} 		
		}
	}
}

/** @function detectAsteroidCollision
  * Detects a collision between two asteroids. Asteroids deflect off of one another.
  */
function detectAsteroidCollision(){
	for(var i = 0; i < asteroids.length-1; i++){	
		for(var j = i+1; j < asteroids.length; j++){
			var distSquared = Math.pow(asteroids[i].x - asteroids[j].x, 2) + Math.pow(asteroids[i].y - asteroids[j].y, 2);
			if(distSquared <= Math.pow(asteroids[i].radius + asteroids[j].radius,2)){	
				var thetai = asteroids[i].angle;
				var thetaj = asteroids[j].angle;
				var phi = Math.atan2(asteroids[j].y - asteroids[i].y, asteroids[j].x - asteroids[i].x);
				var massi = asteroids[i].mass;
				var massj = asteroids[j].mass;
				var velocityi = asteroids[i].velocity;
				var velocityj = asteroids[j].velocity;
				var dxi = (velocityi * Math.cos(thetai - phi) * (massi-massj) + 2*massj*velocityj*Math.cos(thetaj - phi)) / (massi+massj) * Math.cos(phi) + velocityi*Math.sin(thetai-phi) * Math.cos(phi+Math.PI/2);
				var dyi = (velocityi * Math.cos(thetai - phi) * (massi-massj) + 2*massj*velocityj*Math.cos(thetaj - phi)) / (massi+massj) * Math.sin(phi) + velocityi*Math.sin(thetai-phi) * Math.sin(phi+Math.PI/2);
				var dxj = (velocityj * Math.cos(thetaj - phi) * (massj-massi) + 2*massi*velocityi*Math.cos(thetai - phi)) / (massi+massj) * Math.cos(phi) + velocityj*Math.sin(thetaj-phi) * Math.cos(phi+Math.PI/2);
                var dyj = (velocityj * Math.cos(thetaj - phi) * (massj-massi) + 2*massi*velocityi*Math.cos(thetai - phi)) / (massi+massj) * Math.sin(phi) + velocityj*Math.sin(thetaj-phi) * Math.sin(phi+Math.PI/2);
				asteroids[i].x_vector = dxi;
				asteroids[i].y_vector = dyi;
				asteroids[j].x_vector = dxj;
				asteroids[j].y_vector = dyj;
			}
		}
	}
}

/** @function detectPlayerCollision
  * Detects a collision between a player and an asteroid. Removes player and asteroid from
  * screen and decrements player's number of lives by one.
  */
function detectPlayerCollision(player){
	for(var i = 0; i < asteroids.length; i++){
		var rx = asteroids[i].x.clamp(player.x, player.x + player.width);
		var ry = asteroids[i].y.clamp(player.y, player.y + player.height);
		var distSquared = Math.pow(rx - asteroids[i].x, 2) + Math.pow(ry - asteroids[i].y, 2); 
		if(distSquared <= Math.pow(asteroids[i].radius, 2)){
			console.log('Collision!');
			asteroids.splice(i, 1);
			player.lives -= 1;	
			player.dead = true;
			if(player.lives > 0){
				setTimeout(function(){	player.dead = false;}, 2000);
			}
			collision.play();
			i=0;			
		} 
	}
}

function detectBulletPlayerCollision(player){
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].owner != player){
			var rx = bullets[i].x.clamp(player.x, player.x + player.width);
			var ry = bullets[i].y.clamp(player.y, player.y + player.height);
			var distSquared = Math.pow(rx - bullets[i].x, 2) + Math.pow(ry - bullets[i].y, 2); 
			if(distSquared <= Math.pow(bullets[i].radius, 2)){
				console.log('Collision!');
				bullets.splice(i, 1);
				player.lives -= 1;	
				player.dead = true;
				if(player.lives > 0){
					setTimeout(function(){	player.dead = false;}, 2000);
				}
				collision.play();
				i=0;			
			} 
		}
	}
}

/** @function clamp
  * Clamps the x and y coordinates of a circle to bounds defined by the sides of a rectangle
  * @Param {integer} min - The lower boundary
  * @Param {integer} max - The upper boundary
  * @returns A number between min and max
  */
Number.prototype.clamp = function(min, max) {	
  return Math.min(Math.max(this, min), max);
};

//Sound Class//
function Sound(src){
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
	this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

window.requestAnimationFrame(loop);