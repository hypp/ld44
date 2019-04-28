

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

    //Capture the keyboard arrow keys
    this.left = keyboard("ArrowLeft"),
    this.up = keyboard("ArrowUp"),
    this.right = keyboard("ArrowRight"),
    this.down = keyboard("ArrowDown");
    this.space = keyboard(" ");

    this.app = app;

    this.introScene = new PIXI.Container();
    this.introScene.visible = false;
    this.app.stage.addChild(this.introScene);
    this.gameScene = new GameScene(this);
    this.gameScene.visible = true;
    this.app.stage.addChild(this.gameScene);
    this.endScene = new PIXI.Container();
    this.endScene.visible = false;
    this.app.stage.addChild(this.endScene);

    this.sceneState = SceneManager.STATE_GAME;

    this.state = Main.STATE_WAIT;
    this.isShooting = true; // Avoid firing first bullet
    this.bullets = [];

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    //load an image and run the `setup` function when it's done
    PIXI.loader
    .add("resources/roadtiles.png")
    .add("resources/cars.png")
    .add("resources/bullet.png")
    .load(this.setup.bind(this));

    // Load some music
    PIXI.sound.Sound.from({
        url: 'resources/ld44.mp3',
        autoPlay: false,
        loop: true,
        complete: function() {
            console.log('Sound finished');
        }
    });
}

Main.LEVEL_WIDTH = 20;
Main.LEVEL_HEIGHT = 15;
Main.LEVEL_TILE_WIDTH = 48;
Main.LEVEL_TILE_HEIGHT = 48;

SceneManager = {};

SceneManager.STATE_INTRO = 0;
SceneManager.STATE_GAME = 1;
SceneManager.STATE_END = 0;

Main.prototype.gameLoop = function(delta) {

    if (this.sceneState == SceneManager.STATE_INTRO) {
        this.introScene.visible = true;
        this.gameScene.visible = false;
        this.endScene.visible = false;
    } else if (this.sceneState == SceneManager.STATE_GAME) {
        this.introScene.visible = false;
        this.gameScene.visible = true;
        this.endScene.visible = false;

        this.gameScene.gameLoop(delta);

    } else if (this.sceneState == SceneManager.STATE_END) {
        this.introScene.visible = false;
        this.gameScene.visible = false;
        this.endScene.visible = true;
    }

    this.app.renderer.render(this.app.stage);
}

Main.prototype.setup = function() {

    this.gameScene.init();

    this.app.ticker.add(this.gameLoop.bind(this));
}
