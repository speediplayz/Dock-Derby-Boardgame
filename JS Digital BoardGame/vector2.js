class Vector2{
	
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.CalculatePolar();
	}
	
	CalculatePolar(){
		this.len = Math.sqrt((this.x*this.x) + (this.y*this.y));
		this.theta = Math.atan2(this.y, this.x);
	}
	
	CalculateCartesian(){
		this.x = this.len * Math.cos(this.theta);
		this.y = this.len * Math.sin(this.theta);
	}
	
	SetCartesian(x, y){
		this.x = x;
		this.y = y;
		this.CalculatePolar();
	}
	
	SetPolar(len, theta){
		this.len = len;
		this.theta = theta;
		this.CalculateCartesian();
	}
	
	Rotate(theta){
		this.theta += theta;
		this.CalculateCartesian();
	}
	
	Extend(len){
		this.len += len;
		this.CalculateCartesian();
	}
	
	Clone(){
		return new Vector2(this.x, this.y);
	}
	
	Equals(v1){
		return (this.x == v1.x && this.y == v1.y);
	}
	
	Distance(to){
		return Math.sqrt((to.x-this.x)*(to.x-this.x)+(to.y-this.y)*(to.y-this.y));
	}
	
	Multiply(scale){
		this.len *= scale;
		this.CalculateCartesian();
	}
	
	Normalize(){
		this.len = 1;
		CalculateCartesian();
	}
	
	Translate(x, y){
		this.x += x;
		this.y += y;
		this.CalculatePolar();
	}
	
	Add(v1){
		this.x += v1.x;
		this.y += v1.y;
		this.CalculatePolar();
	}
	
	Subtract(v1){
		this.x -= v1.x;
		this.y -= v1.y;
		this.CalculatePolar();
	}
	
	toString(){
		return `x: ${this.x} y: ${this.y} len: ${this.len} theta: ${this.theta}`;
	}
	
	//Vector3 Functions
	
	static Dot(v1, v2){
		return (v1.x*v2.x)+(v1.y*v2.y);
	}
	
	static Normalized(v1){
		return Vector2.FromPolar(1, v1.theta);
	}
	
	static FromPolar(len, theta){
		return new Vector2(len * Math.cos(theta), len * Math.sin(theta));
	}
	
	static Add(v1, v2){
		return new Vector2(v1.x+v2.x, v1.y+v2.y);
	}
	
	static Subtract(v1, v2){
		return new Vector2(v1.x-v2.x, v1.y-v2.y);
	}
	
	static Distance(v1, v2){
		return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y));
	}
	
	static Multiply(v1, scale){
		return new Vector2(v1.x*scale, v1.y*scale);
	}
}