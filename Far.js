


function Far(texture, width, height) {
  var farTexture = PIXI.Texture.fromImage("resources/roadtiles.png");
  PIXI.extras.TilingSprite.call(this, farTexture, farTexture.baseTexture.width, farTexture.baseTexture.height);

  this.position.x = 0;
  this.position.y = 0;
  this.tilePosition.x = 0;
  this.tilePosition.y = 0;

  this.viewportX = 0;
}
  
Far.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

Far.DELTA_X = 0.128;

Far.prototype.setViewportX = function(newViewportX) {
  var distanceTravelled = newViewportX - this.viewportX;
  this.viewportX = newViewportX;
  this.tilePosition.x -= (distanceTravelled * Far.DELTA_X);
};

