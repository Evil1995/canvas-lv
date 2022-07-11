export default class Vector3{
  constructor(x,y,z){
    this.x = x;
		this.y = y;
		this.z = z;
  }
  *[ Symbol.iterator ]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}
  clone() {
		return new this.constructor( this.x, this.y, this.z );
	}
  applyMatrix4( m ) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}

}