


function Far(texture, width, height) {
  var farTexture = PIXI.Texture.fromImage("resources/roadtiles.png");
  PIXI.extras.TilingSprite.call(this, farTexture, farTexture.baseTexture.width, farTexture.baseTexture.height);

  this.position.x = 0;
  this.position.y = 0;
  this.tilePosition.x = 0;
  this.tilePosition.y = 0;
}
  
  Far.prototype = Object.create(PIXI.extras.TilingSprite.prototype);

  Far.prototype.update = function() {
    this.tilePosition.x -= 0.128;
  };
  