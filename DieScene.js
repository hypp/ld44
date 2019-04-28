
function DieScene(sceneManager) {
    PIXI.Container.call(this);

    this.sceneManager = sceneManager;
    this.space = sceneManager.space;

}


DieScene.prototype = Object.create(PIXI.Container.prototype);

DieScene.prototype.init = function() {

    let style = new PIXI.TextStyle({
        dropShadow: true,
        fill: "#56904f",
        fontSize: 64,
        stroke: "#fffb00"
    });
    let y = 0;
    let text1 = new PIXI.Text('The End', style);
    text1.y = y;
    y += text1.height;
    this.addChild(text1);

    style = new PIXI.TextStyle({
        fontSize: 12,
        fill: "#ff9300"
    });
    let text2 = new PIXI.Text('', style);   
    text2.y = y;
    y += text2.height; 
    this.addChild(text2);

    let msgs = [
        "",
        "Bad for you! You died in the racing game.",
        "",
        "Money does not matter only LIFE!",
        "",
        "Please reload page to try again."
    ];

    style = new PIXI.TextStyle({
        fontSize: 14,
        fill: "#56904f"
    });

    msgs.forEach(element => {
        let txt = new PIXI.Text(element, style);
        txt.y = y;
        y += txt.height;
        this.addChild(txt);
    });

}


DieScene.prototype.gameLoop = function() {

}
