class Player{
	constructor(position, bounds, color){
		this.position = position;
		this.bounds = bounds;
		this.color = color;
		this.currentTile = null;
		this.movesAvailable = -1;
		this.turnFinished = false;
		this.turnStarted = false;
		this.canRoll = false;
		this.moveBack = false;
		this.skipTurn = false;
		this.coins = 0;
		this.lastMovement = new Vector2(0, 0);
		this.skinVariant = Math.floor(Math.random() * 5);
	}
	
	move(delta, bounds){
		this.position.Add(delta);
		this.position.x = clamp(this.position.x, 0, bounds.x - this.bounds.x);
		this.position.y = clamp(this.position.y, 0, bounds.y - this.bounds.x);
		this.lastMovement = delta;
	}
	draw(ctx){
		let p = this.position;
		let b = this.bounds;
		let stripe = false;
		switch(this.skinVariant){
			case 0:
				ctx.fillStyle = this.color;
				ctx.fillRect(p.x, p.y, b.x, b.y);
				ctx.fillStyle = "black";
				ctx.fillRect(p.x, p.y, b.x/2, b.y/2);
				ctx.fillRect(p.x + b.y/2, p.y + b.y/2, b.x/2, b.y/2);
			break;
			case 1:
				ctx.fillStyle = this.color;
				ctx.fillRect(p.x, p.y, b.x, b.y);
			break;
			case 2:
				for(let i = 0; i < b.x; i++){
					ctx.fillStyle = stripe ? "black" : this.color;
					ctx.fillRect(p.x + i, p.y, 1, b.y);
					stripe = !stripe;
				}
			break;
			case 3:
				for(let i = 0; i < b.y; i++){
					ctx.fillStyle = stripe ? "black" : this.color;
					ctx.fillRect(p.x, p.y + i, b.x, 1);
					stripe = !stripe;
				}
			break;
			case 4:
				for(let y = 0; y < b.y; y++){
					for(let x = 0; x < b.x; x++){
						ctx.fillStyle = stripe ? "black" : this.color;
						ctx.fillRect(p.x + x, p.y + y, 1, 1);
						stripe = !stripe;
					}
				}
			break;
		}
	}
}