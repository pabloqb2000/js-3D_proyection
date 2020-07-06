/**
 * Abstract camera class
 * Contains the definitions of some functions for all cameras
 */
class AbstractCamera {
    /**
     * 
     * @param position Initial position of the camera
     * @param rotation Initial rotation of the camera
     */
    constructor(position, rotation) {
        this.pos = position;
        this.rot = rotation;
        this.axis = this.getAxis();

        this.moveSpeed = 0.1;
        this.rotSpeed = 0.02;
    }

    /**
     * Returns a list of wireframe objects
     * One object for each axis
     */
    getAxis() {
        return  [
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([1,0,0])], [[0,1]], [86, 210, 227]),
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([0,1,0])], [[0,1]], [105, 227, 86]),
            new Wireframe(new Vector([0,0,0]), [new Vector([0,0,0]), new Vector([0,0,1])], [[0,1]], [227, 103, 86])
        ];
    }

    /**
     * First render the axis and then render the given array of objects
     * 
     * @param objects Array of objects to render
     */
    render(objects) {
        // Axis
        for(let a of this.axis) {
            this.draw(a);
        }

        // Objects
        for(let o of objects) {
            this.draw(o);
        }
    }

    /**
     * Gets the proyection of the points of the given object
     * and draws the given object
     * 
     * @param obj 
     */
    draw(obj) {
        // Get proyections
        let proys = obj.points.map(p => {
            // Transform the point to have coordinates relative to this camera 
            let v = p.copy().add(obj.pos).sub(this.pos);
            // Rotate the object acording to the rotation of this camera
            v = this.rotateToView(v);
            // Crop the points behind the camera
            if(cropBtn.active) {
                v = this.crop(v);
            }
            // Proyect the point
            return this.proyect(v);
        })
        // Scale the values
        proys.forEach(p => p.mult(scaleSld.value));
        
        // Draw points
        if(drawPtsBtn.active) {
            strokeWeight(obj.ptThick);
            stroke(obj.ptColor);

            for(let p of proys) {
                point(p.getX(), p.getY());
            }
        }

        // Draw wireframes
        if(obj instanceof Wireframe) {
            strokeWeight(obj.lnThick);
            stroke(obj.lnColor);

            for(let l of obj.lines) {
                let p1 = proys[l[0]];
                let p2 = proys[l[1]];
                line(p1.getX(), p1.getY(), p2.getX(), p2.getY());
            }
        }

        // Draw solid objects
        if(obj instanceof SolidObj) {
            if(drawLnBtn.active) {
                strokeWeight(obj.lnThick);
                stroke(obj.lnColor);
            } else {
                noStroke();
            }
            fill(obj.polColor);

            for(let p of obj.polygons) {
                beginShape();
                for(let i of p) {
                    vertex(proys[i].getX(), proys[i].getY());
                }
                endShape(CLOSE);
            }
        }
    }

    /**
     * Update position and rotation based on user input
     */
    update() {
        // Create 3 axis in the direction the camera is pointing towards
        let u = (new Vector([1,0,0])).mult(this.moveSpeed);
        let v = (new Vector([0,1,0])).mult(this.moveSpeed);
        let w = (new Vector([0,0,1])).mult(this.moveSpeed);
        u.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);
        v.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);
        w.rotate3D(this.rot.getX(), 0).rotate3D(this.rot.getY(), 1).rotate3D(this.rot.getZ(), 2);

        // Remove their y component to make the player stay at the same height

        // Move
        if(keyIsDown(87)) cam.pos.add(v); // W
        //if(keyIsDown(87)) cam.pos.add(new Vector([0,0,this.moveSpeed])); // W
        if(keyIsDown(83)) cam.pos.sub(new Vector([0,0,this.moveSpeed])); // S
        if(keyIsDown(65)) cam.pos.sub(new Vector([this.moveSpeed,0,0])); // A
        if(keyIsDown(68)) cam.pos.add(new Vector([this.moveSpeed,0,0])); // D
        if(keyIsDown(32)) cam.pos.add(new Vector([0,this.moveSpeed,0])); // SPACE
        if(keyIsDown(16)) cam.pos.sub(new Vector([0,this.moveSpeed/2,0])); // SHIFT

        // Rotate
        if(rotBtn.active) {
            this.rot.data[1] += (movedX * this.rotSpeed) % (2*PI);
            this.rot.data[0] = min(max(-PI/2, this.rot.data[0] + movedY*this.rotSpeed), PI/2);
        }
    }

    /**
     * Rotate the objects that are going to be proyected 
     * acording to the rotation of this camera 
     * 
     * @param v Vector to rotate
     */
    rotateToView(v){
        return v.rotate3D(-this.rot.getZ(), 2).rotate3D(-this.rot.getY(), 1).rotate3D(-this.rot.getX(), 0);
    }

    /**
     * If the given vector is behind the camera
     * (if it has a negative z value)
     * sets its coordinates to NaN so that the point
     * is not drawn
     * 
     * @param v 
     */
    crop(v) {
        if(v.getZ() < 0) {
            v.map(() => NaN);
        }
        return v;
    }

    /**
     * Temp
     */
    proyect(p) {
        return new Vector([p.getX()/sqrt(p.getZ()), p.getY()/sqrt(p.getZ())]);///sqrt(p.getZ())
    }
}