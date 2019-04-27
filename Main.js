
function Main() {

    //Aliases
    let Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite;

    //Create a Pixi Application
    let app = new Application({ 
        width: 256, 
        height: 256,                       
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

