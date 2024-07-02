class Particle {
    constructor() {
        this.pos = createVector(); // position of particle
        this.rays = [];
        this.offset = 0;
        for (let a = 0; a < 45; a += 1) { // making arrays of different angles
            this.rays.push(new Ray(this.pos, radians(a)));
        }
        this.front = this.rays[23]; // front vector
    }

    rotate(angle) {
        this.offset += angle;
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].setAngle(radians(i)+this.offset);
        }
    }

    update(move) {  
        if(move>0){
            this.pos.x = this.pos.x + this.front.dir.x;
            this.pos.y = this.pos.y + this.front.dir.y;
        } else {
            this.pos.x = this.pos.x - this.front.dir.x;
            this.pos.y = this.pos.y - this.front.dir.y;
        }
    }

    // Single wall
    // look(wall) {
    //     for (let ray of this.rays) {
    //         const pt = ray.cast(wall);
    //         if (pt) {
    //             line(this.pos.x, this.pos.y, pt.x, pt.y);
    //         }
    //     }
    // }

    // multiple walls
    look(walls) { // make rays which intersect the walls/Boundary
        const scene = []; // basically is the list of distances from particle to wall
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record){
                        record = d;
                        closest = pt;
                    }
                }
            }
            if(closest) {
                stroke(255, 100);
                line(this.pos.x, this.pos.y, closest.x, closest.y); 
            }
            scene[i] = record;
        }
        return scene;
    }

    sprLook(sprs, distance) { // rays to intersect with sprites
        const sprscene = [];
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let intersect = null;
            for (let spr of sprs) {
                const pt = ray.sprcast(spr, distance);
                if(pt) {
                    // const d = p5.Vector.dist(this.pos, pt);
                    sprscene.push(pt);
                } else {
                    sprscene.push(undefined);
                }
                intersect = pt;
            }
            if(intersect) {
                stroke(255, 100);
                line(this.pos.x, this.pos.y, intersect.x, intersect.y);
            }
        }
        return sprscene;
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
        for (let ray of this.rays) {
            ray.show();
        }
    }
}