/**
 * Returns a cube of the given length
 * 
 * @param l Size of the cube edges
 */
function genCube(l=1) {
	// Manually add cube
	return new SolidObj(new Vector([0,0,0]), [
		new Vector([l,l,l]),
		new Vector([l,l,-l]),
		new Vector([l,-l,l]),
		new Vector([l,-l,-l]),
		new Vector([-l,l,l]),
		new Vector([-l,l,-l]),
		new Vector([-l,-l,l]),
		new Vector([-l,-l,-l])],
		[
			[0,1,3,2],
			[0,2,6,4],
			[0,1,5,4],
			[4,5,7,6],
			[1,3,7,5],
			[2,3,7,6]
		]
		);
}


/**
 * Returns a plot of a given 2D function in 3D 
 * 
 * @param f Should take 2 real numbers and return another real number
 * @param w Width of the function
 * @param h Height of the function (really the length occupaid in the z axis)
 * @param hres Number of points to distribute along the height axis
 * @param wres Number of points to distribute along the width axis
 */
function genFunc(f=(x,y) => x*x-y*y, w=2, h=2, hres=15, wres=15) {
	let pts = [], pols = [];
	for(let i = 0; i<=wres; i++) {
		for(let j = 0; j<=hres; j++) {
			let x = -w/2 + i*w/wres;
			let y = -h/2 + j*h/hres;
			pts.push(new Vector([x, f(x,y), y]));

			if(i<wres && j<hres) {
				pols.push([i*(wres+1) + j, i*(wres+1) + j + 1, (i+1)*(wres+1) + j + 1, (i+1)*(wres+1) + j]);
			}
		}
	}

	return new SolidObj(new Vector([0,0,0]), pts, pols);
}

/**
 * Generates a circle by rotating the given vector in the given axis n times
 * returns a wireframe object
 * 
 * @param axis Axis to rotate around
 * @param start Vector to rotate
 * @param n Times the vector should be rotated
 * @param end True to close the end point back to the start
 */
function genCircle(axis=1, start=new Vector([1,0,0]), n=16, end=true) {
    return new Wireframe(new Vector([0,0,0]), 
        Array(n).fill().map((_,i) => start.copy().rotate(i/n*2*PI)),
        Array(n-1).fill().map((_,i) => [i,i+1]).concat(end ? [[n-1,0]] : [])
    );
}

/**
 * Returns a cylinder along the given axis of the given radious and length
 * 
 * @param axis Axis for the cylinder
 * @param r Radious of the cylinder
 * @param n Points along the top and bottom faces
 * @param len Length of the cylinder
 * @param faces True to make the top and bottom faces of the cylinder
 */
function genCyl(axis=1, r=1, n=32, len=3, faces=true) {
	return extrude(genCircle(axis, axis==1 ? new Vector([r,0,0]) : new Vector([0,r,0]), n),
					axis, len, faces);
}

/**
 * Extrudes the given wireframe along the given axis by the given length
 * and returns a solid object
 * 
 * @param wireframe Wireframe to be extruded
 * @param axis Number or vector describing the axis to extrude along
 * @param len Length to be extruded
 * @param faces True to build top and bottom faces
 */
function extrude(wireframe, axis=1, len=3, faces=true) {
	let v = axis;
	if(!(axis instanceof Vector)) {
		v = new Vector([0,0,0]);
		v.set((axis+1)%3, 1);
	}
	v = v.mult(len/2);

	let pts = wireframe.points.map((p) => p.copy().sub(v))
				.concat(wireframe.points.map((p) => p.copy().add(v)));
	
	let pols = [];
	let n = wireframe.points.length;
	for(let i = 0; i < n - 1; i++) {
		pols.push([i, i+1, n+i+1, n+i]);
	}
	pols.push([0,n-1, 2*n-1, n]);

	if(faces) {
		pols.push(Array(n).fill().map((_,i) => i));
		pols.push(Array(n).fill().map((_,i) => i+n));
	}

	return new SolidObj(new Vector([0,0,0]), pts, pols);
}

function genDef() {
	return genCube();
}
