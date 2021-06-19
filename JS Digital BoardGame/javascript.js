document.onkeydown = keyDownEvent;
document.onkeyup = keyUpEvent;
document.onmousemove = mouseMoveEvent;

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

let playerCount = window.prompt("Player Count", "2");
let maxRounds = window.prompt("Max Rounds", "40") * playerCount;

//let players = [new Player(new Vector2(10, 10), new Vector2(50, 50), "rgb(128,0,0)"), new Player(new Vector2(200, 100), new Vector2(50, 50), "rgb(0,128,0)"), new Player(new Vector2(50, 50), new Vector2(50, 50), "rgb(0,0,128)")];
let gameColliders = [
	new Collider(new Vector2(0, 0), new Vector2(150, 350)),
	new Collider(new Vector2(150, 0), new Vector2(1200, 50)),
	new Collider(new Vector2(200, 100), new Vector2(300, 200)),
	new Collider(new Vector2(500, 100), new Vector2(350, 100)),
	new Collider(new Vector2(1150, 50), new Vector2(50, 650)),
	new Collider(new Vector2(1000, 700), new Vector2(200, 200)),
	new Collider(new Vector2(0, 850), new Vector2(1000, 50)),
	new Collider(new Vector2(0, 350), new Vector2(50, 500)),
	new Collider(new Vector2(100, 400), new Vector2(200, 400)),
	new Collider(new Vector2(200, 300), new Vector2(100, 100)),
	new Collider(new Vector2(350, 650), new Vector2(250, 150)),
	new Collider(new Vector2(600, 750), new Vector2(200, 50)),
	new Collider(new Vector2(350, 350), new Vector2(150, 250)),
	new Collider(new Vector2(500, 450), new Vector2(250, 150)),
	new Collider(new Vector2(650, 550), new Vector2(300, 150)),
	new Collider(new Vector2(850, 700), new Vector2(100, 100)),
	new Collider(new Vector2(550, 250), new Vector2(350, 150)),
	new Collider(new Vector2(800, 400), new Vector2(100, 100)),
	new Collider(new Vector2(1000, 500), new Vector2(100, 150)),
	new Collider(new Vector2(900, 100), new Vector2(200, 400))
];

let numberSegments =
[
	"1110111", // 0
	"0010010", // 1
	"1011101", // 2
	"1011011", // 3
	"0111010", // 4
	"1101011", // 5
	"1101111", // 6
	"1010010", // 7
	"1111111", // 8
	"1111011"  // 9
];

let players = [];
let currentPlayerIndex = 0;
let currentPlayer;
let mousePos = new Vector2(0, 0);
let action = false;

let currentKeys = [];

const mapWidth = 1200;
const mapHeight = 900;
const screenWidth = 800;
const screenHeight = 600;
const FPS = 30;
const scale = 4;
const moveSpeed = 3; //default 3
const pixSize = 2;

let lastFrame = new Date().getTime();
let deltaTime = 0;

let coin = new Image(); coin.src = /*"Coin.png";//*/"Coin Wireframe.png";
let dice = new Image(); dice.src = /*"Dice.png";//*/"Dice Wireframe.png";
let rounds = new Image(); rounds.src = "Rounds Wireframe.png";
let pressSpace = new Image(); pressSpace.src = "Press Space.png";
let background = new Image(); background.src = "background.png"

preGameSetup();
gameLoop();

function preGameSetup(){
	for(let i = 0; i < playerCount; i++){
		let pX = 62;//Math.floor(Math.random() * 1150);
		let pY = 812;//Math.floor(Math.random() * 850);
		let r = Math.floor(Math.random() * 255), g = Math.floor(Math.random() * 255), b = Math.floor(Math.random() * 255);
		players[i] = new Player(new Vector2(pX, pY), new Vector2(25, 25), "rgb("+r+","+g+","+b+")");
		players[i].currentTile = gameTiles[0];
		players[i].movesAvailable = -1;
	}
	players[0].canRoll = true;
}

function gameLoop(){
	
	let currentFrame = new Date().getTime();
	deltaTime = currentFrame - lastFrame;
	
	currentPlayer = players[currentPlayerIndex];
	
	if(deltaTime >= 1000/FPS){
		
		if(maxRounds <= 0){
			alert(getFinalResults());
			return;
		}
		
		//FRAME START
		ctx.save();
		ctx.scale(scale, scale);
		
		if(currentPlayer.skipTurn && !currentPlayer.turnStarted){
			currentPlayer.skipTurn = false;
			incrementPlayer();
		}
		if(currentPlayer.canRoll && action){ //getKeyState(" ")
			currentPlayer.turnStarted = true;
			currentPlayer.canRoll = false;
			currentPlayer.movesAvailable = rollDice();
		}
		
		if(currentPlayer.turnFinished && action) incrementPlayer(); //getKeyState(" ")
		
		//INPUT
		if(getKeyState("ArrowLeft") || getKeyState("a") && !currentPlayer.canRoll) currentPlayer.move(new Vector2(-moveSpeed, 0), new Vector2(mapWidth, mapHeight));
		if(getKeyState("ArrowRight") || getKeyState("d") && !currentPlayer.canRoll) currentPlayer.move(new Vector2( moveSpeed, 0), new Vector2(mapWidth, mapHeight));
		if(getKeyState("ArrowUp") || getKeyState("w") && !currentPlayer.canRoll) currentPlayer.move(new Vector2(0, -moveSpeed), new Vector2(mapWidth, mapHeight));
		if(getKeyState("ArrowDown") || getKeyState("s") && !currentPlayer.canRoll) currentPlayer.move(new Vector2(0,  moveSpeed), new Vector2(mapWidth, mapHeight));
		
		//COLLISIONS
		for(let i = 0; i < gameColliders.length; i++){
			let coll = gameColliders[i];
			coll.collidePlayer(currentPlayer);
		}
		
		let tile = getTileFromPosition(currentPlayer.position);
		let nextTiles = getTilesFromIds(currentPlayer.currentTile.nextID);
		
		for(let i = 0; i < gameTiles.length; i++){
			if(!currentPlayer.moveBack){
				if(gameTiles[i] != currentPlayer.currentTile){
					if(currentPlayer.movesAvailable > 0){
						if(!nextTiles.includes(gameTiles[i])) gameTiles[i].collidePlayer(currentPlayer);
					}
					else gameTiles[i].collidePlayer(currentPlayer);
				}
			} else {
				if(nextTiles.includes(gameTiles[i])) gameTiles[i].collidePlayer(currentPlayer);
			}
		}
		
		//CAMERA TRANSLATE
		let offX = -1 * currentPlayer.position.x + (mapWidth/8)+(-162/scale) - currentPlayer.bounds.x/2;
		let offY = -1 * currentPlayer.position.y + (mapHeight/8)+(-112/scale) - currentPlayer.bounds.y/2;
		
		if(offX > 0) offX = 0;
		else if(offX < (-1*mapWidth) + ((1/scale)*screenWidth)) offX = (-1*mapWidth) + ((1/scale)*screenWidth);
		if(offY > 0) offY = 0;
		else if(offY < (-1*mapHeight) + ((1/scale)*screenHeight)) offY = (-1*mapHeight) + ((1/scale)*screenHeight);
		ctx.translate(offX,offY);
		
		//CODE
		ctx.drawImage(background, 0, 0);
		
		if(tile.checkFullOverlap(currentPlayer)){
			if(currentPlayer.currentTile != tile) currentPlayer.movesAvailable--;
			if(currentPlayer.movesAvailable == 0 && currentPlayer.moveBack) currentPlayer.moveBack = false;
			currentPlayer.currentTile = tile;
		}
		
		if(currentPlayer.movesAvailable == 0){
			switch(currentPlayer.currentTile.type){
				case "E":
				currentPlayer.coins++;
				break;
				case "R":
				getReward();
				break;
				case "Q":
				getMystery();
				break;
				case "P":
				getPunishment();
				break;
			}
			if(!currentPlayer.moveBack && currentPlayer.movesAvailable <= 0){
				currentPlayer.turnFinished = true;
				currentPlayer.movesAvailable = -1;
			}
		}
		
		for(let i = 0; i < playerCount; i++){
			players[i].draw(ctx);
		}
		
		drawUI(offX, offY);
		
		//FINAL
		lastFrame = new Date().getTime();
		action = false;
		ctx.restore();
	}
	
	requestAnimationFrame(gameLoop);
}

function getFinalResults(){
	let result = "";
	for(let i = 0; i < playerCount; i++){
		result += "Player " + (i+1) + ": " + players[i].coins + "\r\n";
	}
	return result;
}
function getMystery(){
	let option = Math.floor(Math.random() * 9);
	
	switch(option){
		case 0:
			currentPlayer.coins += 2;
		break;
		case 1:
			currentPlayer.coins += 3;
		break;
		case 2:
			currentPlayer.movesAvailable = 2;
			currentPlayer.turnFinished = false;
		break;
		case 3:
			currentPlayer.movesAvailable = 3;
			currentPlayer.turnFinished = false;
		break;
		case 4:
			currentPlayer.coins -= 2;
		break;
		case 5:
			currentPlayer.coins -= 3;
		break;
		case 6:
			currentPlayer.movesAvailable = 2;
			currentPlayer.moveBack = true;
			currentPlayer.turnFinished = false;
		break;
		case 7:
			currentPlayer.movesAvailable = 3;
			currentPlayer.moveBack = true;
			currentPlayer.turnFinished = false;
		break;
		case 8:
			currentPlayer.skipTurn = true;
		break;
	}
	if(currentPlayer.coins < 0) currentPlayer.coins = 0;
}
function getReward(){
	let option = Math.floor(Math.random() * 4);
	
	switch(option){
		case 0:
			currentPlayer.coins += 2;
		break;
		case 1:
			currentPlayer.coins += 3;
		break;
		case 2:
			currentPlayer.movesAvailable = 2;
			currentPlayer.turnFinished = false;
		break;
		case 3:
			currentPlayer.movesAvailable = 3;
			currentPlayer.turnFinished = false;
		break;
	}
}
function getPunishment(){
	let option = Math.floor(Math.random() * 4);
	
	switch(option){
		case 0:
			currentPlayer.movesAvailable = 1;
			currentPlayer.turnFinished = false;
			currentPlayer.moveBack = true;
		break;
		case 1:
			currentPlayer.movesAvailable = 2;
			currentPlayer.turnFinished = false;
			currentPlayer.moveBack = true;
		break;
		case 2:
			currentPlayer.coins -= 1;
		break;
		case 3:
			currentPlayer.skipTurn = true;
		break;
	}
	if(currentPlayer.coins < 0) currentPlayer.coins = 0;
}
function drawUI(offX, offY){
	ctx.drawImage(coin, -offX, -offY-3, 32, 32);
	ctx.drawImage(dice, -offX, -offY+23, 32, 32);
	ctx.drawImage(rounds, -offX, -offY+53, 32, 32);
	
	for(let i = 0; i < currentPlayer.coins.toString().length; i++){
		let digit = currentPlayer.coins.toString()[i];
		let posX = -offX + 32 + (i*6*pixSize);
		let posY = -offY + 4;
		drawDigit(digit, posX, posY, pixSize);
	}
	
	if(currentPlayer.movesAvailable != -1){
		for(let i = 0; i < currentPlayer.movesAvailable.toString().length; i++){
			let digit = currentPlayer.movesAvailable.toString()[i];
			let posX = -offX + 32 + (i*6*pixSize);
			let posY = -offY + 30;
			drawDigit(digit, posX, posY, pixSize);
		}
	} else {
		if(currentPlayer.turnFinished){
			drawDigit(0, -offX + 32, -offY + 30, pixSize);
		} else ctx.drawImage(pressSpace, -offX + 31, -offY + 30, 118, 18);
	}
	for(let i = 0; i < maxRounds.toString().length; i++){
		let digit = maxRounds.toString()[i];
		let posX = -offX + 32 + (i*6*pixSize);
		let posY = -offY + 61;
		drawDigit(digit, posX, posY, pixSize);
	}
}
function drawDigit(num, posX, posY, pixSize){
	let segs = numberSegments[num];
	
	ctx.fillStyle = "white";
	if(segs[0] == "1") { ctx.fillRect(posX+1*pixSize, posY,            3*pixSize, 1*pixSize); }
	if(segs[1] == "1") { ctx.fillRect(posX,           posY+1*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[2] == "1") { ctx.fillRect(posX+4*pixSize, posY+1*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[3] == "1") { ctx.fillRect(posX+1*pixSize, posY+4*pixSize,  3*pixSize, 1*pixSize); }
	if(segs[4] == "1") { ctx.fillRect(posX,           posY+5*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[5] == "1") { ctx.fillRect(posX+4*pixSize, posY+5*pixSize,  1*pixSize, 3*pixSize); }
	if(segs[6] == "1") { ctx.fillRect(posX+1*pixSize, posY+8*pixSize,  3*pixSize, 1*pixSize); }
}
function getKeyState(key){
	return currentKeys.includes(key);
}
function incrementPlayer(){
	currentPlayerIndex = currentPlayerIndex + 1 >= playerCount ? 0 : currentPlayerIndex + 1;
	currentPlayer = players[currentPlayerIndex];
	currentPlayer.turnFinished = false;
	currentPlayer.turnStarted = false;
	currentPlayer.canRoll = true;
	maxRounds--;
}
function clamp(val, min, max){
	return val < min ? min : val > max ? max : val;
}
function getTilesFromIds(ids){
	let tiles = [];
	for(let i = 0; i < gameTiles.length; i++){
		if(ids.includes(gameTiles[i].orderID)) tiles.push(gameTiles[i]);
	}
	return tiles;
}
function getTileFromPosition(pos){
	let tilePos = new Vector2(pos.x - (pos.x % 50), pos.y - (pos.y % 50));
	for(let i = 0; i < gameTiles.length; i++){
		if(tilePos.Equals(gameTiles[i].position)) return gameTiles[i];
	}
}
function rollDice(){
	let roll1 = Math.floor(Math.random() * 6) + 1;
	return roll1;
}

function keyDownEvent(e){
	if(e.key == " ") action = true;
	if(!currentKeys.includes(e.key)){
		currentKeys.push(e.key);
	}
}
function keyUpEvent(e){
	if(currentKeys.includes(e.key)){
		let i = currentKeys.indexOf(e.key);
		currentKeys.splice(i, 1);
	}
}
function mouseMoveEvent(e){
	mousePos = new Vector2(e.pageX, e.pageY);
}