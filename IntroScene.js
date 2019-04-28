
function IntroScene(sceneManager) {
    PIXI.Container.call(this);

    this.sceneManager = sceneManager;
    this.space = sceneManager.space;

}


IntroScene.prototype = Object.create(PIXI.Container.prototype);

IntroScene.prototype.init = function() {

    let style = new PIXI.TextStyle({
        dropShadow: true,
        fill: "#56904f",
        fontSize: 64,
        stroke: "#fffb00"
    });
    let y = 0;
    let text1 = new PIXI.Text('Your life is currency', style);
    text1.y = y;
    y += text1.height;
    this.addChild(text1);

    style = new PIXI.TextStyle({
        fontSize: 12,
        fill: "#ff9300"
    });
    let text2 = new PIXI.Text('An entry for Ludum Dare 44 by Mathias Olsson', style);   
    text2.y = y;
    y += text2.height; 
    this.addChild(text2);

    let msgs = [
        "",
        "In the not to distant future, all major currencies have failed.",
        "Dollars are worthless, British Pounds are not even worth the paper it is printed on,",
        "and other currencies like the Yen and the Euro are but a memory.",
        "Alternative currencies like Personal Identifiable Data and Bitcoin have also collapsed.",
        "",
        "But money does not matter only LIFE!",
        "",
        "The life of you and others are put at risk in a racing game.",
        "The only survivor receives fame and glory!",
        "",
        "You drive the red car and can shoot blood clots.",
        "Shoot too many and you loose your life; your currency.",
        "Shoot too few and you loose the game.",
        "",
        "Controls: Space to start, Space to shoot, Up for speed, Left/Right to steer."
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

IntroScene.prototype.gameLoop = function(delta) {
    if (this.space.isDown) {
        this.sceneManager.next();
    }
}
