
function Mid() {
    var midTexture = PIXI.Texture.fromImage("resources/cars.png");
    PIXI.extras.TilingSprite.call(this, midTexture, midTexture.baseTexture.width, midTexture.baseTexture.height);

    this.position.x = 0;
    this.position.y = 128;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    this.viewportX = 0;
}
  
Mid.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

Mid.DELTA_X = 0.64;

Mid.prototype.setViewportX = function(newViewportX) {
  var distanceTravelled = newViewportX - this.viewportX;
  this.viewportX = newViewportX;
  this.tilePosition.x -= (distanceTravelled * Mid.DELTA_X);
};
