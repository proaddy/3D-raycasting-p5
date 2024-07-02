// game
let walls=[];
let ray;

// player
let player;
let sprite;

// sprite
let sprList = [];
let smileyImg;
let smiley;
let enemyImg;
let corsairImg;
let corsair;

let spriteWallList = [];

// output scene width & height
let sceneW = 600;
let sceneH = 600;

// levels
let levels;
let levelData;
let level = 1;

// calculations
let PTP; // player to point
let intersectCount = 0; // how many rays intersect with sprite


// collision
let wallCrossProduct = [];
let copyCrossProduct = [];

function updateLevel(){
    player.pos.x = 30;
    player.pos.y = 150;
    level += 1;
    walls = walls.slice(-4);
    levelData = levels[`level${level}`];

    for ( let i = 0; i < levelData.length; i++) {
        const x1 = levelData[i][0];
        const y1 = levelData[i][1];
        const x2 = levelData[i][2];
        const y2 = levelData[i][3];
        walls.push(new Boundary(x1, y1, x2, y2));
    }

    for ( let i = 0; i < walls.length; i++) {
        wallCrossProduct[i] = 0;
        copyCrossProduct[i] = 0
    }
}

function preload() {
    levels = loadJSON('levels.json');
    smileyImg = loadImage('/img/smiley.png');
    enemyImg = loadImage('/img/enemy.png');
    corsairImg = loadImage('/img/corsair1.png')
}
    
function setup(){
    // canvas size (x, y);
    createCanvas(1200, 600);
    angleMode(DEGREES);

    // loading level data into array
    levelData = levels[`level${level}`];

    // making sprite walls
    for ( let i = 0; i < 45; i++) {
        spriteWallList.push(new Sprite());
    }

    // loading walls
    for ( let i = 0; i < levelData.length; i++) {
        const x1 = levelData[i][0];
        const y1 = levelData[i][1];
        const x2 = levelData[i][2];
        const y2 = levelData[i][3];
        walls.push(new Boundary(x1, y1, x2, y2));
    }

    // walls for the outerline of the canvas
    walls.push(new Boundary(0, 0, sceneW, 0));
    walls.push(new Boundary(0, 0, 0, sceneH));
    walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
    walls.push(new Boundary(0, sceneH, sceneW, sceneH));


    // define objects
    player = new Particle();
    sprite = new Spr();
    
    // list of sprites for 2d map
    sprList.push(sprite);

    sprite.x = 330;
    sprite.y = 570;
    
    player.pos.x = 320;
    player.pos.y = 560;

    // collision data
    for ( let i = 0; i < walls.length; i++) {
        wallCrossProduct[i] = 0;
        copyCrossProduct[i] = 0
    }
    
    // sprite images
    smiley = new Sprite(); // sprite appreance on scene
    corsair = new Sprite();

    // update sprite image
    smiley.image = smileyImg;

    // list of sprite images
    spriteWallList.push(smiley);
}

function draw(){
    // Movements
    if (keyIsDown(UP_ARROW)) {
        player.update(1);
    } else if (keyIsDown(DOWN_ARROW)) {
        player.update(-1)
    } else if (keyIsDown(LEFT_ARROW)) {
        player.rotate(-0.01);
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.rotate(0.01);
    }

    // drawing sky
    background(0);
    fill(186, 221, 247)
    rect(600, 0, 1200, 300);

    // drawing ground
    fill(138, 98, 90);
    rect(600, 300, 1200, 600);

    // collision code
    let A, B, P, AB, AP;
    for(let i=0; i < walls.length; i++) {
        A = createVector(walls[i].a.x, walls[i].a.y);
        B = createVector(walls[i].b.x, walls[i].b.y);
        P = createVector(player.pos.x, player.pos.y);
        AB = createVector(A.x - B.x, A.y - B.y);
        AP = createVector(A.x - P.x, A.y - P.y);

        let H1 = AP.dot(AB);
        let H2 = AB.dot(AB);
        let R = H1/H2;

        if (R > 0 && R < 1) {
            wallCrossProduct[i] = AB.cross(AP);
            if(copyCrossProduct.length === 0) {
                copyCrossProduct = [...wallCrossProduct];
            }
            if(Math.sign(copyCrossProduct[i].z) !== Math.sign(wallCrossProduct[i].z)) {
                player.pos.x = player.pos.x - player.front.dir.x*3;
                player.pos.y = player.pos.y - player.front.dir.y*3;
                copyCrossProduct[i] = wallCrossProduct[i];
            }
        }
    }

    // show
    for (let wall of walls){
        wall.show();
    }

    player.show();
    sprite.show();
    
    PTP = createVector(sprite.x - player.pos.x, sprite.y - player.pos.y);


    const scene = player.look(walls);
    const sprScene = player.sprLook(sprList, PTP.mag());
    const w = sceneW/scene.length;
    
    // to hide sprite outside the FOV
    intersectCount = 0;
    for (let i = 0; i < sprScene.length; i++) {
        if (sprScene[i] === undefined) {} 
        else {
            intersectCount += 1;
        }
    }    

    push();
    translate(sceneW-5, 0); // meaning the scene will start from left to right;
    for (let i = 0; i < scene.length; i++) {
        noStroke();
        const sceneSquare = scene[i]*scene[i];
        const widthSquare = sceneW * sceneW;
        const b = map(sceneSquare, 0, widthSquare, 244, 0); // grayscale color
        
        const h = (sceneH * (230 - 200)) / (2 * tan(60/2) * scene[i] * cos(i - (scene.length/2)));
        // h = swh * (mwh - mph) / 2 * tan(θ/2) * d // formula to calculate the height of rectangle for viewport to remove the fisheye effect, multiply the denominator by cos(i - (scene.length/2))
        // swh: Screen Wall Height, mwh: Measured Wall Height, mph: Measured Player Height, tan(θ/2): tan of only half viewing vertical angle, d: distance from player to wall
        
        // fill(b); // color of boundary
        // rectMode(CENTER); // meaning draw them from center and go upward and downward
        // rect(i * w + w, sceneH/2, w+1, h); // creating rectangles with the data received  

        // making walls using sprites
        spriteWallList[i].width = w;
        spriteWallList[i].height = h;
        spriteWallList[i].x = (i * w + w) + 595;
        spriteWallList[i].y = sceneH/2;
        spriteWallList[i].color = b;

        if (intersectCount !== 0) {
            if (sprScene[i] !== undefined) {
                // update sprite based on movement and appreance based on FOV
                const imgSize = ((sceneH * 30) / PTP.mag())/50;
                smiley.image.scale = imgSize > 2.5 ? 2.6 : imgSize;
                smiley.image.offset.x = -15;
                smiley.x = i * w + w + (sceneW-5); 
                smiley.y = sceneH/2;
            }
        } else {
            smiley.x = 5000;
        }
    }
    pop();
    corsair.image = corsairImg;
    corsair.image.scale = 0.4;
    corsair.x = 900;
    corsair.y = 300;

    // udpate level
    // if(dist(player.pos.x, player.pos.y, sprite.pos.x, sprite.pos.y) < 20) {
    //     alert("sprite Reached");
    //     updateLevel(); 
    // }
}