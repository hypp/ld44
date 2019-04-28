
function PlayerCar(textures) {
    PIXI.extras.AnimatedSprite.call(this, textures);

    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.anchor.set(0.5, 0.5);
    this.angle = 0.0;
}

PlayerCar.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);


// x and y must have valid values before calling this
PlayerCar.prototype.init = function(level) {
    this.level = level;

}

PlayerCar.prototype.my_update = function() {
    this.rotation = this.angle * Math.PI / 180.0;

    // compensate for tile being in the wrong direction
    this.vx = Math.cos(this.rotation - Math.PI/2) * this.speed;
    this.vy = Math.sin(this.rotation - Math.PI/2) * this.speed;

    newx = this.x + this.vx;
    newy = this.y + this.vy;

    this.setPos(newx, newy);

}

// Set x or y, if we do not move into forbidden tile
PlayerCar.prototype.setPos = function(newx, newy) {
    current_tile_x = Math.floor(this.x / Main.LEVEL_TILE_WIDTH);
    current_tile_y = Math.floor(this.y / Main.LEVEL_TILE_HEIGHT);

    new_tile_x = Math.floor(newx / Main.LEVEL_TILE_WIDTH);
    new_tile_y = Math.floor(newy / Main.LEVEL_TILE_HEIGHT);

    if (new_tile_x == current_tile_x && new_tile_y == current_tile_y) {
        // Safe to allow both
        this.x = newx;
        this.y = newy;
    } else if (new_tile_x != current_tile_x && new_tile_y != current_tile_y) {
        // Both have changed, never allowed, diagonal movement
        // Edge case
    } else {
        if (new_tile_x == current_tile_x) {
            // Safe to allow x
            this.x = newx;
        } else if (new_tile_y == current_tile_y) {
            // Safe to allow y
            this.y = newy;
        } 

        // We must still check!
        idx = new_tile_y*Main.LEVEL_WIDTH+new_tile_x;
        tile = this.level[idx];
        if (tile >= 0) {
            this.x = newx;
            this.y = newy;
        }    
    }
}
