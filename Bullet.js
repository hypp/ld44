
function Bullet(texture, level, app) {
    let baseTexture = PIXI.Texture.fromImage(texture);
    PIXI.Sprite.call(this, baseTexture);

    this.level = level;
    this.app = app;

    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.anchor.set(0.5, 0.5);
    this.angle = 0.0;
    this.isAlive = true;

}

Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.my_update = function() {
    // Compensate for texture being rotated
    this.x += Math.cos(this.rotation - Math.PI/2) * this.speed;
    this.y += Math.sin(this.rotation - Math.PI/2) * this.speed;

    if (this.position.x > this.app.width || this.position.x < 0 ||
        this.position.y > this.app.height || this.position.y < 0) {
            this.isAlive = false;
    }
}
