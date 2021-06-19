class Collider{
	constructor(position, bounds){
		this.position = position;
		this.bounds = bounds;
	}
	collidePlayer(p){
		if(p.position.x + p.bounds.x > this.position.x && p.position.x < this.position.x + this.bounds.x){
			if(p.position.y + p.bounds.y > this.position.y && p.position.y < this.position.y + this.bounds.y){
				let dT = p.position.y + p.bounds.y - this.position.y;
				let dB = this.position.y + this.bounds.y - p.position.y;
				let dL = p.position.x + p.bounds.x - this.position.x;
				let dR = this.position.x + this.bounds.x - p.position.x;
				
				let min = dT < dB && dT < dL && dT < dR ? dT : dB < dL && dB < dR ? dB : dL < dR ? dL : dR;
				
				if(min == dT) p.position.y -= dT;
				if(min == dB) p.position.y += dB;
				if(min == dL) p.position.x -= dL;
				if(min == dR) p.position.x += dR;
				
				return true;
			}
		}
		return false;
	}
}