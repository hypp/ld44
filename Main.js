
function Main() {

    //Aliases
    let Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite;

    //Create a Pixi Application
    let app = new Application({ 
        width: 640, 
        height: 480,                       
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
    loader
    .add("resources/roadtiles.png")
    .load(setup);

    //This `setup` function will run when the image has loaded
    function setup() {

        //Create the cat sprite
        let cat = new Sprite(resources["resources/roadtiles.png"].texture);
        cat.x = 196;
        cat.y = 196;
        cat.rotation = 0.5;
        cat.anchor.x = 0.5;
        cat.anchor.y = 0.5;
        
        //Add the cat to the stage
        app.stage.addChild(cat);


        // 20x15
        level = [
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

        roadList = [];

        //Create the `tileset` sprite from the texture
        let baseTexture = PIXI.BaseTexture.fromImage("resources/roadtiles.png");

        for (let y = 0; y < baseTexture.height; y += 32) {
            for (let x = 0; x < baseTexture.width; x += 32) {
                let rectangle = new PIXI.Rectangle(x, y, 32, 32);
                let roadTexture = new PIXI.Texture(baseTexture, rectangle);
        
                roadList.push(roadTexture);
            }
        }

        for (let i = 0; i < 15; i++) {
            let y = i * 32;
            for (let j = 0; j < 20; j++) {
                let x = j*32;
                let idx = i*20+j;
                let tile = level[idx];
                if (tile >= 0) {
                    let roadTexture = roadList[tile];

                    //Create the sprite from the texture
                    let road = new Sprite(roadTexture);
            
                    road.x = x;
                    road.y = y;
            
                    app.stage.addChild(road)
                }
            }    
        }

    }

    this.scroller = new Scroller(this.stage);

    /*
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(
        512,
        384,
        {view:document.getElementById("game-canvas")}
    );

    this.scroller = new Scroller(this.stage);

    PIXI.loader
    .add("resources/roadtiles.png")
    .load(function (stage) {
        cat = new PIXI.Sprite(PIXI.loader.resources["resources/roadtiles.png"].texture);
        stage.addChild(cat);    
    }(this.stage));

    */

    requestAnimationFrame(this.update.bind(this));

}

Main.SCROLL_SPEED = 5;

Main.prototype.update = function() {
    this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
    this.app.renderer.render(this.stage);
    requestAnimationFrame(this.update.bind(this));
};

