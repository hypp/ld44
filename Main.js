

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

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    //load an image and run the `setup` function when it's done
    PIXI.loader
    .add("resources/roadtiles.png")
    .add("resources/cars.png")
    .load(this.setup.bind(this));

}

Main.SCROLL_SPEED = 5;
Main.ROTATION_SPEED = 3;
Main.MAX_FORWARD_SPEED = 2.1;
Main.LEVEL_WIDTH = 20;
Main.LEVEL_HEIGHT = 15;
Main.LEVEL_TILE_WIDTH = 40;
Main.LEVEL_TILE_HEIGHT = 40;

Main.prototype.update = function() {
    //this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
    this.app.renderer.render(this.stage);
};

Main.prototype.gameLoop = function(delta) {

    if (this.up.isDown) {
        this.car.play()

        this.car.speed += 1.15;
        if (this.car.speed > Main.MAX_FORWARD_SPEED) {
            this.car.speed = Main.MAX_FORWARD_SPEED;
        }

        if (this.left.isDown) {
            this.car.angle = mod(this.car.angle - Main.ROTATION_SPEED / delta, 360);
        }
        if (this.right.isDown) {
            this.car.angle = mod(this.car.angle + Main.ROTATION_SPEED / delta, 360);
        }
    
    } else {
        this.car.stop();

        this.car.speed -= 0.1;
        if (this.car.speed < 0.01) {
            this.car.speed = 0;
        }
    }

    this.car.rotation = this.car.angle * Math.PI / 180.0;

    // compensate for tiling being in the wrong direction
    this.car.vx = Math.cos(this.car.rotation - Math.PI/2) * this.car.speed;
    this.car.vy = Math.sin(this.car.rotation - Math.PI/2) * this.car.speed;

    newx = this.car.x + this.car.vx;
    newy = this.car.y + this.car.vy;

    current_tile_x = Math.floor(this.car.x / Main.LEVEL_TILE_WIDTH);
    current_tile_y = Math.floor(this.car.y / Main.LEVEL_TILE_HEIGHT);

    new_tile_x = Math.floor(newx / Main.LEVEL_TILE_WIDTH);
    new_tile_y = Math.floor(newy / Main.LEVEL_TILE_HEIGHT);

    if (new_tile_x == current_tile_x && new_tile_y == current_tile_y) {
        // Safe to allow both
        this.car.x = newx;
        this.car.y = newy;
    } else if (new_tile_x != current_tile_x && new_tile_y != current_tile_y) {
        // Both have changed, never allowed, diagonal movement
        // Edge case
    } else {
        if (new_tile_x == current_tile_x) {
            // Safe to allow x
            this.car.x = newx;
        } else if (new_tile_y == current_tile_y) {
            // Safe to allow y
            this.car.y = newy;
        } 

        // We must still check!
        idx = new_tile_y*Main.LEVEL_WIDTH+new_tile_x;
        tile = this.level[idx];
        if (tile >= 0) {
            this.car.x = newx;
            this.car.y = newy;
        }    
    }
    
    this.computer1.update();
    this.computer2.update();


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


    carList = tilesFromImage("resources/cars.png", 16, 32);

    this.car = new PIXI.extras.AnimatedSprite(carList.slice(0,4));
    this.car.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
    this.car.y = Main.LEVEL_TILE_HEIGHT*5;
    this.car.speed = 0;
    this.car.vx = 0;
    this.car.vy = 0;
    this.car.anchor.set(0.5, 0.5);
    this.car.angle = 0.0;
    this.app.stage.addChild(this.car)

    this.computer1 = new ComputerCar(carList.slice(4,8));
    this.computer1.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
    this.computer1.y = Main.LEVEL_TILE_HEIGHT*6;
    this.computer1.init(this.level, 0)
    this.app.stage.addChild(this.computer1)

    this.computer2 = new ComputerCar(carList.slice(8,12));
    this.computer2.x = Main.LEVEL_TILE_WIDTH*6+Main.LEVEL_TILE_WIDTH/2;
    this.computer2.y = Main.LEVEL_TILE_HEIGHT*7;
    this.computer2.init(this.level, 0);
    this.app.stage.addChild(this.computer2)

    //Capture the keyboard arrow keys
    this.left = keyboard("ArrowLeft"),
    this.up = keyboard("ArrowUp"),
    this.right = keyboard("ArrowRight"),
    this.down = keyboard("ArrowDown");

    this.app.ticker.add(this.gameLoop.bind(this));
}
