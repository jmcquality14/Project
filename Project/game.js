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
var bossFightFlag = false;
var intervalFlag = false;
var level = 1;

//Sprites//
var bullets = [];
var asteroids = [];
var bossBullets = [];
var boss;
var player1 = new Player( WIDTH/4, HEIGHT/2, Math.PI); 
var player2 = new Player((3*WIDTH)/4, HEIGHT/2, 0);

//Screens//
var menuScreen = new GameScreen('logo.png', WIDTH, HEIGHT);
var backgroundScreeen = new GameScreen('background.png', WIDTH, HEIGHT);

//Sounds//
var song = new Sound("upbeat-song.wav");
var bossSong = new Sound("boss_Song.wav");
var laser = new Sound("Laser_Shoot.wav");
var collision = new Sound("Hit_Hurt.wav");
var death = new Sound("Game_Over.wav");

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

function copyInput() {
	player1.priorInput = JSON.parse(JSON.stringify(player1.currentInput));
	player2.priorInput = JSON.parse(JSON.stringify(player2.currentInput));
}

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

function update(elaspedTime){
	if(gameOverFlag) {
		song.pause();
		bossSong.pause();
		if(player1.currentInput.space || player2.currentInput.space) {
			player1 = new Player( WIDTH/4, HEIGHT/2, Math.PI); 
			player2 = new Player((3*WIDTH)/4, HEIGHT/2, 0);
			bullets = [];
			asteroids = [];
			level = 1;
			gameOverFlag = false;
			clearLevelFlag = true;
		}
	} else if (menuFlag) {
		if(player1.currentInput.space || player2.currentInput.space) {
			menuFlag = false;
			clearLevelFlag = true;
		}
	} else if(clearLevelFlag) {
		player1.x = WIDTH/4; player1.y=HEIGHT/2;
		player2.x = (3*WIDTH)/4; player2.y=HEIGHT/2;
		bullets = [];
		if ( (level % 3) == 0 ) {
			song.pause();
			bossSong.play();
			boss = new Boss( WIDTH/2, (1*HEIGHT)/4, 100);
			bossFight = true;
		} else {
			boss = null;
			bossFight = false;
			var numOfAsteroids = level + 4;
			if( asteroids.length < numOfAsteroids){
				for(var i = 0; i < numOfAsteroids; i++){ addAsteroid();}
			}
			bossSong.pause();
			song.play();
		}
	} else { 
		if(player1.currentInput.left){ player1.update(elaspedTime, -0.1, 0);} else if(player1.currentInput.right){ player1.update(elaspedTime, 0.1, 0);}
		if(player1.currentInput.up && !(player1.currentInput.left || player1.currentInput.right) ){ player1.update(elaspedTime, 0, 0.2);} else { player1.update(elaspedTime, 0 , 0); }
		if(player1.currentInput.space && !player1.priorInput.space && !player1.dead) {
			bullets.push(new Bullet(player1.x, player1.y, 2, 0.5, player1.angle, player1));
			laser.play();
		}	
		if(player2.currentInput.left ){ player2.update(elaspedTime, -0.1, 0);} else if(player2.currentInput.right ){ player2.update(elaspedTime, 0.1, 0);}
		if(player2.currentInput.up && !(player2.currentInput.left || player2.currentInput.right)){ player2.update(elaspedTime, 0, 0.2);} else { player2.update( elaspedTime, 0, 0); } 	
		if(player2.currentInput.space && !player2.priorInput.space && !player2.dead) {
			bullets.push(new Bullet(player2.x, player2.y, 2, 0.5, player2.angle, player2));
			laser.play();
		}	
		bullets.forEach(function(bullet, index){
			bullet.update(elaspedTime);
			if(bullet.y < 0 || bullet.y > HEIGHT || bullet.x < 0 || bullet.x > WIDTH){ bullets.splice(index, 1);}
		});
		
		if(bossFight) {
			boss.update(elaspedTime);
			if(!intervalFlag){
				intervalFlag = true;
				setInterval( function(){
					var angle = (15/180)*Math.PI;
					for (var i= 0; i < 5; i++){
						angle += ((30/180)*Math.PI);
						bullets.push(new Bullet(boss.x+100, boss.y, 5, 1, angle, boss));
					} 
				}, 3000);
			}	
			bossBullets.forEach(function(bullet,index){ 
				bullet.update(elaspedTime, index);
				if(bullet.y < 0 || bullet.y > HEIGHT || bullet.x < 0 || bullet.x > WIDTH){ bullets.splice(index, 1);}
			});
			detectBulletBossCollision(boss);
		} else {
			asteroids.forEach(function(asteroid,index){
				asteroid.update(elaspedTime);
				detectAsteroidCollision();
				detectBulletCollision();
			});
			if(asteroids.length <= 0){ 
				level++;
				clearLevelFlag = true;
			}
		}				
		if(!player1.dead){detectPlayerCollision(player1);detectBulletPlayerCollision(player1);}
		if(!player2.dead){detectPlayerCollision(player2);detectBulletPlayerCollision(player2);}
	}
}

function render(Ctx){
	Ctx.beginPath();
	Ctx.clearRect(0, 0, WIDTH, HEIGHT);	
	if( (player1.lives <= 0 && player2.lives <= 0) || gameOverFlag ){
		gameOverFlag = true;
		Ctx.font="20px Georgia";
		if(player1.score > player2.score){
			Ctx.fillText('GAME OVER!  PLAYER 1 WINS!  FINAL SCORE:  ' + player1.score, WIDTH/2 - 175, HEIGHT/2); 
		} else if (player2.score > player1.score){
			Ctx.fillText('GAME OVER!  PLAYER 2 WINS!  FINAL SCORE:  ' + player2.score, WIDTH/2 - 175, HEIGHT/2);
		} else {
			Ctx.fillText('GAME OVER!  TIED SCORE: '+ player2.score, WIDTH/2 - 120, HEIGHT/2);
		}
	} else if (menuFlag) {
		menuScreen.render(Ctx);
		Ctx.font="25px Georgia";
		Ctx.fillText('Press Space to Start', WIDTH/2-75, (3*HEIGHT)/4);
		Ctx.fillStyle = 'white';
	} else if(clearLevelFlag){
		Ctx.font="25px Georgia";
		Ctx.fillText("Level "+level, WIDTH/2 - 40, HEIGHT/2);
		Ctx.fillStyle = 'white';
		setTimeout(function(){ clearLevelFlag = false;}, 3000);		
	} else {
		backgroundScreeen.render(Ctx);
		if(!player1.dead){	player1.render(Ctx);}
		if(!player2.dead){	player2.render(Ctx);}
		bullets.forEach(function(bullet){ bullet.render(Ctx);});		
		if(bossFight){
			boss.render(Ctx);
			bullets.forEach(function(bullet){ bullet.render(Ctx);});
		} else {
			asteroids.forEach(function(asteroid){ asteroid.render(Ctx);});
		}		
		Ctx.fillText("Player 1's Score: "+ player1.score + "        Player 1's Lives: "+ player1.lives +"             Player 2's Score: "+ player2.score + "        Player 2's Lives: "+ player2.lives, 20 , 50);	
		Ctx.fillStyle = 'white';
		Ctx.closePath();
	}
}

function addAsteroid(){
	var x_pos = Math.floor(Math.random() * (WIDTH) );
	if( Math.abs(x_pos - WIDTH/4) <= 100) { x_pos -=100; } 
	else if( Math.abs(x_pos - (3*WIDTH)/4) <= 100) { x_pos +=100; } 
	var y_pos = Math.floor(Math.random() * (HEIGHT) );
	if( Math.abs(y_pos - HEIGHT/2) <= 100) { y_pos +=100; }
	var radius = Math.floor(Math.random() * 10) + (40);	
	var velocity = Math.floor(Math.random()) + 0.1;
	var angle = Math.floor(Math.random() * 360);
	var mass = Math.floor(Math.random() * 100);
	asteroids.push(new Asteroid(x_pos, y_pos, radius, velocity, angle, mass));
}

// detects collision between asteroid and bullet
function detectBulletCollision(){
	for(var j = 0; j < bullets.length; j++){
		for(var i = 0; i < asteroids.length; i++){	
			var tempAsteroid = asteroids[i];			
			var distSquared = Math.pow(tempAsteroid.x - bullets[j].x, 2) + Math.pow(tempAsteroid.y - bullets[j].y, 2);
			if(distSquared <= Math.pow(tempAsteroid.radius + bullets[j].radius,2)){
				bullets[j].owner.score += 10;
				bullets.splice(j, 1);
				asteroids.splice(i,1);
				if(tempAsteroid.radius/2 > 15){
					var tempMass = tempAsteroid.mass/2;
					var tempVelocity = (tempAsteroid.mass*tempAsteroid.velocity) / tempMass;
					asteroids.splice(i, 0, new Asteroid(tempAsteroid.x + (tempAsteroid.radius/2), tempAsteroid.y+(tempAsteroid.radius/2), tempAsteroid.radius/2, tempVelocity, tempAsteroid.angle, tempMass), new Asteroid(tempAsteroid.x-5, tempAsteroid.y-5, tempAsteroid.radius/2, -tempVelocity, tempAsteroid.angle, tempMass));
				} 
				//explosion.play();
				return;
			} 		
		}
	}
}

//detects collision between asteroids
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

//detects collision between player and asteroid
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

//detects collision between a player's bullet and the other player
function detectBulletPlayerCollision(player){
	for(var i = 0; i < bullets.length; i++){
		if(bullets[i].owner != player){
			var rx = bullets[i].x.clamp(player.x, player.x + player.width);
			var ry = bullets[i].y.clamp(player.y, player.y + player.height);
			var distSquared = Math.pow(rx - bullets[i].x, 2) + Math.pow(ry - bullets[i].y, 2); 
			if(distSquared <= Math.pow(bullets[i].radius, 2)){
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

//detects collision between a player's bullet and the other player
function detectBulletBossCollision(boss){ 
	for(var i = 0; i < bullets.length; i++){
		if( bullets[i].owner != boss){
			var rx = bullets[i].x.clamp(boss.x, boss.x + boss.width);
			var ry = bullets[i].y.clamp(boss.y, boss.y + boss.height/2);
			var distSquared = Math.pow(rx - bullets[i].x, 2) + Math.pow(ry - bullets[i].y, 2); 
			if(distSquared <= Math.pow(bullets[i].radius, 2)){
				bullets[i].owner.score += 10;
				bullets.splice(i, 1);
				boss.health -= 1;	
				if(boss.health <= 0){ 
					level++;
					intervalFlag = false;
					clearLevelFlag = true;
					return;
				}
				i=0;			
			} 
		}
	}
}

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
	this.play = function(){	this.sound.play();}
    this.pause = function(){ this.sound.pause();}
}

window.requestAnimationFrame(loop);