class Ray {
    constructor(pos, angle) {
        angle = (angle + 2 * PI) % (2 * PI);
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle); // formAngle only takes input in radian
    }

    // changing the direction
    // lookAt(x, y) { // making ray point in the direction of input X, Y
    //     this.dir.x = x - this.pos.x;
    //     this.dir.y = y - this.pos.y;
    //     this.dir.normalize();
    // }

    setAngle(angle) {
        this.dir = p5.Vector.fromAngle(angle);
    }

    show() {
        stroke(255);
        push(); // meaning only affect the things inside push() & pop()
        translate(this.pos.x, this.pos.y); // changing the initial position of the elements after translate from 0,0 of canvas to the X, Y of translate
        line(0, 0, this.dir.x*10, this.dir.y*10);
        pop();
    }

    cast(wall) {
        // line segment points
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        // ray point
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x; // position (10, 10) + the direction of the ray (10, 0)
        const y4 = this.pos.y + this.dir.y; // position (10, 10) + the direction of the ray (0, 10)
        // position becomes 20, 20 after addition.

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if(denominator == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4))/denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3))/denominator;
        if( t > 0 && t < 1 && u > 0) {
            const pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        } else {
            return;
        }
    }

    sprcast(spr, dist) {
        // sprite location / circle center
        const x = spr.x;
        const y = spr.y;
        let r = 4;
        
        // ray / infinite line
        // ray origin
        const x1 = this.pos.x;
        const y1 = this.pos.y;
        // ray direction
        const x2 = this.pos.x + this.dir.x;
        const y2 = this.pos.y + this.dir.y;

        let vecab = createVector(x2 - x1, y2 - y1);
        let vecap = createVector(x - x1, y - y1);

        let r2 = ((vecap.x * vecab.x) + (vecap.y * vecab.y)) / ((vecab.x * vecab.x) + (vecab.y * vecab.y));

        let vecam = vecab.mult(r2);
        let vecmp = vecap.sub(vecam);
        
        let d = vecmp.mag()

        if ( d < 0 ) {
            d = d * -1;
        }

        if (dist < 114) {
            r = 1;
        }

        if (d <= r && r2 > 0) {
            const pt = createVector(x, y);
            return pt;
        } else {
            return;
        }
    }
}