

// proper modulo
function mod(n, m) {
    return ((n % m) + m) % m;
}


// Utility function to split png into tiles
function tilesFromImage(img, width, height) {
    let tiles = [];

    //Create the `tileset` sprite from the texture
    let baseTexture = PIXI.BaseTexture.fromImage(img);

    for (let y = 0; y < baseTexture.height; y += height) {
        for (let x = 0; x < baseTexture.width; x += width) {
            let rectangle = new PIXI.Rectangle(x, y, width, height);
            let texture = new PIXI.Texture(baseTexture, rectangle);
    
            tiles.push(texture);
        }
    }

    return tiles;
}

// Utility function for keyboard
function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
}

function Main() {

    //Create a Pixi Application
    let app = new PIXI.Application({ 
        width: Main.LEVEL_TILE_WIDTH*Main.LEVEL_WIDTH, 
        height: Main.LEVEL_TILE_HEIGHT*Main.LEVEL_HEIGHT,                       
        antialias: true, 
        transparent: false, 
        resolution: 1
    }
    );

    this.app = app
    this.stage = this.app.stage
    this.state = Main.STATE_WAIT;

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    //load an image and run the `setup` function when it's done
    PIXI.loader
    .add("resources/roadtiles.png")
    .add("resources/cars.png")
    .load(this.setup.bind(this));

}

Main.SCROLL_SPEED = 5;
Main.ROTATION_SPEED = 3.6;
Main.MAX_FORWARD_SPEED = 2.1;
Main.LEVEL_WIDTH = 20;
Main.LEVEL_HEIGHT = 15;
Main.LEVEL_TILE_WIDTH = 40;
Main.LEVEL_TILE_HEIGHT = 40;

Main.STATE_WAIT = 0;
Main.STATE_LAPS = 1;
Main.STATE_DONE = 2;


Main.prototype.update = function() {
    //this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
    this.app.renderer.render(this.stage);
};

Main.prototype.gameLoop = function(delta) {

    if (this.state == Main.STATE_WAIT) {
        // TODO count down and red traffic light

        // Wait for player to press key
        if (this.space.isDown) {
            this.state = Main.STATE_LAPS;
        } else {
            // Nothing to do
            return;
        }
    }


    if (this.up.isDown) {
        this.car.play()

        if (this.car.speed > this.car.max_forward_speed) {
            // If we gained speed from some other means
            // typically collision
            this.car.speed -= 0.1;
        } else {
            this.car.speed += 1.15;
            if (this.car.speed > this.car.max_forward_speed) {
                this.car.speed = this.car.max_forward_speed;
            }
        }

        if (this.left.isDown) {
            this.car.angle = mod(this.car.angle - this.car.rotation_speed / delta, 360);
        }
        if (this.right.isDown) {
            this.car.angle = mod(this.car.angle + this.car.rotation_speed / delta, 360);
        }
    
    } else {
        this.car.stop();

        this.car.speed -= 0.1;
        if (this.car.speed < 0.01) {
            this.car.speed = 0;
        }
    }

    this.computerCars.forEach(element => {
        element.update();
        if (element.bounding_circle == null) {
        } else {
            this.stage.removeChild(element.bounding_circle);
            element.bounding_circle = null;
        }
    });

    // brute force collision detection
    let radius = 8;
    let radiusSquared = radius*radius;

    for (let i = 0; i < this.computerCars.length; i++) {
        let carA = this.computerCars[i];

        for (let j = i+1; j < this.computerCars.length; j++) {
            let carB = this.computerCars[j];

            let dx = carA.x - carB.x;
            let dy = carA.y - carB.y;

            let distanceSquared = dx*dx + dy*dy;
            if (distanceSquared < (radiusSquared + radiusSquared)) {
                // We have a collision

                if (carB.bounding_circle == null) {    
                    var graphics = new PIXI.Graphics();
                    graphics.lineStyle(1, 0xffffff, 1);
                    graphics.drawCircle(carB.x, carB.y, radius);
                    this.stage.addChild(graphics);
                    carB.bounding_circle = graphics;
                }

                if (carA.bounding_circle == null) {    
                    var graphics = new PIXI.Graphics();
                    graphics.lineStyle(1, 0xffffff, 1);
                    graphics.drawCircle(carA.x, carA.y, radius);
                    this.stage.addChild(graphics);
                    carA.bounding_circle = graphics;
                }

                // TODO Add a particle effect here
                // Assume bounding circles have same size
                // Then we only have to dvide by 2
                var cpX = (carA.x + carB.x) / 2;
                var cpY = (carA.y + carB.y) / 2;

                var distance = Math.sqrt(distanceSquared);
                var ratio = distance / (radiusSquared);

                // Move them apart
                carA.x -= distance * ratio * 0.5;
                carA.y -= distance * ratio * 0.5;

                carB.x += distance * ratio * 0.5;
                carB.y += distance * ratio * 0.5;
   
//                let tmp = carB.speed;
//                carB.speed = carA.speed;
//                carA.speed = tmp;

            }
        }    
    }

    this.update();
}

Main.prototype.setup = function() {
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
        
                this.app.stage.addChild(road)
            }
        }    
    }


    this.computerCars = []

    carList = tilesFromImage("resources/cars.png", 16, 32);

    this.car = new PlayerCar(carList.slice(0,4));
    this.car.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
    this.car.y = Main.LEVEL_TILE_HEIGHT*4;
    this.car.init(this.level);
    this.car.max_forward_speed = Main.MAX_FORWARD_SPEED * 0.8;
    this.car.rotation_speed = Main.ROTATION_SPEED * 0.8;
    this.app.stage.addChild(this.car)
    this.computerCars.push(this.car);

    for (let i = 0; i < 4; i++) {
        let texture_offset = (i % 2) * 4 + 4
        let computer = new ComputerCar(carList.slice(texture_offset,texture_offset+4)); 
        computer.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
        computer.y = Main.LEVEL_TILE_HEIGHT*(5+i);
        computer.init(this.level, 0)
        computer.max_forward_speed = Main.MAX_FORWARD_SPEED * (Math.random() * 0.1 + 0.9);
        computer.rotation_speed = Main.ROTATION_SPEED * (Math.random() * 0.1 + 0.9);
        this.app.stage.addChild(computer);
        this.computerCars.push(computer);
    }

    //Capture the keyboard arrow keys
    this.left = keyboard("ArrowLeft"),
    this.up = keyboard("ArrowUp"),
    this.right = keyboard("ArrowRight"),
    this.down = keyboard("ArrowDown");
    this.space = keyboard(" ");

    this.app.ticker.add(this.gameLoop.bind(this));
}
