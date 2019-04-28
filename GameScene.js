

function GameScene(sceneManager) {
    PIXI.Container.call(this);

    this.sceneManager = sceneManager;
    this.left = sceneManager.left;
    this.right = sceneManager.right;
    this.up = sceneManager.up;
    this.down = sceneManager.down;
    this.space = sceneManager.space;

    this.state = GameScene.STATE_WAIT;
    this.isShooting = true; // Avoid firing first bullet
    this.bullets = [];

}

GameScene.ROTATION_SPEED = 3.6;
GameScene.MAX_FORWARD_SPEED = 2.1;
GameScene.ACCELERATION = 0.1;
GameScene.BULLET_SPEED = GameScene.MAX_FORWARD_SPEED * 1.5;
GameScene.STATE_WAIT = 0;
GameScene.STATE_LAPS = 1;
GameScene.STATE_DONE = 2;


GameScene.prototype = Object.create(PIXI.Container.prototype);

GameScene.prototype.init = function() {

    // 20x15
    this.level = [
        -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1, -1, 2, 1, 1, 1,  1, 3,-1,-1,-1,  2, 1, 3,-1,-1,
        -1,-1,-1,-1,-1, -1, 0,-1,-1,-1, -1, 0,-1,-1,-1,  0,-1, 0,-1,-1,
        -1,-1,-1,-1,-1, -1, 0,-1,-1,-1, -1, 4, 1, 1, 1,  5,-1, 0,-1,-1,

        -1,-1,-1,-1,-1, -1, 0,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1, 0,-1,-1,
        -1,-1,-1,-1,-1, -1, 0,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1, 0,-1,-1,
        -1,-1,-1,-1,-1, -1, 0,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1, 0,-1,-1,
        -1,-1,-1,-1,-1, -1, 4, 1, 3,-1,  2, 1, 1, 1, 1,  1, 1, 5,-1,-1,
        -1, 2, 1, 1, 1,  3,-1,-1, 0,-1,  0,-1,-1,-1,-1, -1,-1,-1,-1,-1,

        -1, 0,-1,-1,-1,  4, 1, 1, 5,-1,  4, 1, 1, 1, 1,  3,-1,-1,-1,-1,
        -1, 0,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1,  0,-1,-1,-1,-1,
        -1, 4, 1, 1, 1,  1, 1, 1, 1, 3, -1, 2, 1, 1, 1,  5,-1,-1,-1,-1,
        -1,-1,-1,-1,-1, -1,-1,-1,-1, 0, -1, 0,-1,-1,-1, -1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1, -1,-1,-1,-1, 4,  1, 5,-1,-1,-1, -1,-1,-1,-1,-1,
    ]

    roadList = tilesFromImage("resources/roadtiles.png", Main.LEVEL_TILE_WIDTH, Main.LEVEL_TILE_HEIGHT);

    for (let i = 0; i < Main.LEVEL_HEIGHT; i++) {
        let y = i * Main.LEVEL_TILE_HEIGHT;
        for (let j = 0; j < Main.LEVEL_WIDTH; j++) {
            let x = j*Main.LEVEL_TILE_WIDTH;
            let idx = i*Main.LEVEL_WIDTH+j;
            let tile = this.level[idx];
            if (tile >= 0) {
                let roadTexture = roadList[tile];

                //Create the sprite from the texture
                let road = new PIXI.Sprite(roadTexture);
        
                road.x = x;
                road.y = y;
        
                this.addChild(road)
            }
        }    
    }


    this.computerCars = []

    carList = tilesFromImage("resources/cars.png", 16, 32);

    this.car = new PlayerCar(carList.slice(0,4));
    this.car.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
    this.car.y = Main.LEVEL_TILE_HEIGHT*4;
    this.car.init(this.level);
    this.car.max_forward_speed = GameScene.MAX_FORWARD_SPEED;
    this.car.rotation_speed = GameScene.ROTATION_SPEED * 0.9;
    this.addChild(this.car)
    this.computerCars.push(this.car);

    for (let i = 0; i < 6; i++) {
        let texture_offset = (i % 2) * 4 + 4
        let computer = new ComputerCar(carList.slice(texture_offset,texture_offset+4)); 
        computer.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
        computer.y = Main.LEVEL_TILE_HEIGHT*4+(i+1)*32; // car heigh = 32
        computer.init(this.level, 0)
        computer.max_forward_speed = GameScene.MAX_FORWARD_SPEED * (Math.random() * 0.3 + 0.7);
        computer.rotation_speed = GameScene.ROTATION_SPEED * (Math.random() * 0.3 + 0.7);
        this.addChild(computer);
        this.computerCars.push(computer);
    }

}

GameScene.prototype.gameLoop = function(delta) {
    if (this.state == GameScene.STATE_WAIT) {
        // TODO count down and red traffic light

        // Wait for player to press key
        if (this.space.isDown) {
            this.state = GameScene.STATE_LAPS;
        } else {
            // Nothing to do
            return;
        }
    }


    if (this.up.isDown) {
        this.car.play()

        this.car.speed += GameScene.ACCELERATION;
        if (this.car.speed > this.car.max_forward_speed) {
            this.car.speed = this.car.max_forward_speed;
        }

        if (this.left.isDown) {
            this.car.angle = mod(this.car.angle - this.car.rotation_speed, 360);
        }
        if (this.right.isDown) {
            this.car.angle = mod(this.car.angle + this.car.rotation_speed, 360);
        }
    
    } else {
        this.car.stop();

        this.car.speed -= 0.1;
        if (this.car.speed < 0.01) {
            this.car.speed = 0;
        }
    }

    if (this.isShooting == false) {
        if (this.space.isDown) {
            this.isShooting = true;

            this.shoot();
        }
    } else {
        if (this.space.isUp) {
            this.isShooting = false;
        }
    }

    this.computerCars.forEach(element => {
        element.my_update();
        if (element.bounding_circle == null) {
        } else {
            this.removeChild(element.bounding_circle);
            element.bounding_circle = null;
        }
    });

    // brute force collision detection
    let radius = 9;
    let radiusSquared = radius*radius;
    let shieldSquared = (radius+2)*(radius+2);
    let expectedDistance = radius+radius;

    let bulletRadius = 2;
    let bulletRadiusSquared = bulletRadius*bulletRadius;

    // Bullet against cars
    // Loop backwards so we can delete old entries
    for(var b = this.bullets.length-1; b >= 0; b--) {
        let bullet = this.bullets[b];
        let hit = false;
        for (let i = this.computerCars.length-1; i >= 0; i-- ) {
            let car = this.computerCars[i];

            if (car == this.car) {
                continue;
            }

            let dx = bullet.x - car.x;
            let dy = bullet.y - car.y;

            let distanceSquared = dx*dx + dy*dy;

            if (distanceSquared < (bulletRadiusSquared + radiusSquared)) {
                hit = true;

                // remove car
                this.computerCars.splice(i,1);
                this.removeChild(car);

                // TODO add explosion

                break;
            }
        }
        if (hit) {
            this.bullets.splice(b,1);
            this.removeChild(bullet);
        }
    }



    // Cars against cars
    for (let i = 0; i < this.computerCars.length; i++) {
        let carA = this.computerCars[i];

        for (let j = i+1; j < this.computerCars.length; j++) {
            let carB = this.computerCars[j];

            let dx = carA.x - carB.x;
            let dy = carA.y - carB.y;

            let distanceSquared = dx*dx + dy*dy;

            if (distanceSquared < (shieldSquared + shieldSquared)) {
                // We have a collision
                if (carB.bounding_circle == null) {    
                    var graphics = new PIXI.Graphics();
                    graphics.lineStyle(1, 0xffffff, 1);
                    graphics.drawCircle(carB.x, carB.y, radius);
                    this.addChild(graphics);
                    carB.bounding_circle = graphics;
                }

                if (carA.bounding_circle == null) {    
                    var graphics = new PIXI.Graphics();
                    graphics.lineStyle(1, 0xffffff, 1);
                    graphics.drawCircle(carA.x, carA.y, radius);
                    this.addChild(graphics);
                    carA.bounding_circle = graphics;
                }
            }

            if (distanceSquared < (radiusSquared + radiusSquared)) {
                // We have a collision
    
                // TODO Add a particle effect here
                // Assume bounding circles have same size
                // Then we only have to dvide by 2
                var cpX = (carA.x + carB.x) / 2;
                var cpY = (carA.y + carB.y) / 2;
                

                var distance = Math.sqrt(distanceSquared);
                var ratio = (expectedDistance - distance) / distance;

                var translateX = dx * 0.5 * ratio;
                var translateY = dy * 0.5 * ratio;

                // Move them apart
                newx = carA.x + translateX;
                newy = carA.y + translateY;
                carA.setPos(newx, newy);

                newx = carB.x - translateX;
                newy = carB.y - translateY;
                carB.setPos(newx, newy);

                var tmp = carB.speed;
                carB.speed = carA.speed;
                carA.speed = tmp;
            }
        }    
    }

    // Loop backwards so we can delete old entries
    for(var b = this.bullets.length-1;b>=0;b--){
        let bullet = this.bullets[b];
        bullet.my_update();

        if (!bullet.isAlive) {
            this.removeChild(bullet);
            this.bullets.splice(b, 1);
        }
    }

}


GameScene.prototype.shoot = function() {

    var bullet = new Bullet("resources/bullet.png", this.level, this.sceneManager.app, this.car);
    this.addChild(bullet);
    this.bullets.push(bullet);
}
