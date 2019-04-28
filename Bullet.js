
function Bullet(texture, level, app, obj) {
    let baseTexture = PIXI.Texture.fromImage(texture);
    PIXI.Sprite.call(this, baseTexture);

    this.level = level;
    this.app = app;

    // Copy data from shooter i.e. the players car
    this.x = obj.x;
    this.y = obj.y;
    this.rotation = obj.rotation;
    this.speed = obj.speed*1.5;
    if (this.speed < 0.1) {
        this.speed = 1.0;
    }

    this.vx = 0;
    this.vy = 0;
    this.anchor.set(0.5, 0.5);
    this.angle = 0.0;
    this.isAlive = true;
}

Bullet.prototype = Object.create(PIXI.Sprite.prototype);

Bullet.prototype.my_update = function() {
    // Compensate for texture being rotated
    this.vx = Math.cos(this.rotation - Math.PI/2) * this.speed;
    this.vy = Math.sin(this.rotation - Math.PI/2) * this.speed;

    this.x += this.vx;
    this.y += this.vy;

    let idx = tileIdxFromXY(this.x, this.y);
    tile = this.level[idx];
    if (tile < 0) {
        this.isAlive = false;
    }

    if (this.position.x > this.app.width || this.position.x < 0 ||
        this.position.y > this.app.height || this.position.y < 0) {
            this.isAlive = false;
    }
}
