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
            // Proyect the point
            return this.proyect(v);
        })
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
        // Move
        if(keyIsDown(87)) cam.pos.add(new Vector([0,0,0.1])); // W
        if(keyIsDown(83)) cam.pos.sub(new Vector([0,0,0.1]));// S
        if(keyIsDown(65)) cam.pos.sub(new Vector([0.1,0,0])); // A
        if(keyIsDown(68)) cam.pos.add(new Vector([0.1,0,0])); // D
        if(keyIsDown(38)) cam.pos.add(new Vector([0,0.1,0])); // UP ARROW
        if(keyIsDown(40)) cam.pos.sub(new Vector([0,0.1,0])); // DOWN ARROW
    }

    /**
     * Temp
     */
    proyect(p) {
        return new Vector([p.getX(), p.getY()]);
    }
}