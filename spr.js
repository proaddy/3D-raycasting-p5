class Spr {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
    }

    show() {
        fill(255);
        ellipse(this.x, this.y, 5);
    }
}