

// Calculate index into level array from x and y coordinates
function tileIdxFromXY(x,y) {
    let tile_x = Math.floor(x / Main.LEVEL_TILE_WIDTH);
    let tile_y = Math.floor(y / Main.LEVEL_TILE_HEIGHT);
    let idx = tile_y*Main.LEVEL_WIDTH+tile_x;
    return idx;
}

// Calculate x and y coordinate from index into level array
function xyFromTileIdx(idx) {
    let x = Math.floor(idx % Main.LEVEL_WIDTH)*Main.LEVEL_TILE_WIDTH + Main.LEVEL_TILE_WIDTH/2;
    let y = Math.floor(idx / Main.LEVEL_WIDTH)*Main.LEVEL_TILE_HEIGHT + Main.LEVEL_TILE_HEIGHT/2;

    return [x,y];
}

// Check if idx is a valid, used by buildPath
function checkIdx(idx, previousIdx, level) {
    if (idx > level.length) {
        return false;
    }

    if (idx == previousIdx) {
        return false;
    }

    let tile = level[idx];
    if (tile < 0) {
        return false;
    }

    return true;
}

// build a path that a car should follow
function buildPath(x, y, level) {
    let start_idx = tileIdxFromXY(x,y);
    let xy = xyFromTileIdx(start_idx);
    let start_x = xy[0];
    let start_y = xy[1];

    path = [];
    current_idx = start_idx;
    previous_idx = -1;

    i = level.length;
    do {
        let up_idx = current_idx - Main.LEVEL_WIDTH;
        let down_idx = current_idx + Main.LEVEL_WIDTH;
        let left_idx = current_idx - 1;
        let right_idx = current_idx + 1;

        if (checkIdx(up_idx, previous_idx, level)) {
                // Up is ok
                path.push(up_idx);
                previous_idx = current_idx;
                current_idx = up_idx
        } else if (checkIdx(down_idx, previous_idx, level)) {
            // Up is ok
            path.push(down_idx);
            previous_idx = current_idx;
            current_idx = down_idx
        } else if (checkIdx(left_idx, previous_idx, level)) {
            // Up is ok
            path.push(left_idx);
            previous_idx = current_idx;
            current_idx = left_idx
        } else if (checkIdx(right_idx, previous_idx, level)) {
            // Up is ok
            path.push(right_idx);
            previous_idx = current_idx;
            current_idx = right_idx
        } else {
            console.log("Failed to find a valid path")
        }

        i -= 1;
        if (i < 0) {
            break;
        }
    } while (current_idx != start_idx);

    return path;
}



function ComputerCar(textures) {
    PIXI.extras.AnimatedSprite.call(this, textures);

    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.anchor.set(0.5, 0.5);
    this.angle = 0.0;

    this.health = 3;

    this.stop();
}

ComputerCar.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);


// x and y must have valid values before calling this
ComputerCar.prototype.init = function(level, target) {
    this.level = level;
    this.target = 0;

    this.path = buildPath(this.x, this.y, this.level);
}

ComputerCar.prototype.my_update = function() {

    if (this.speed > 0) {
        this.play();
    }

    this.speed += GameScene.ACCELERATION;
    if (this.speed > this.max_forward_speed) {
        this.speed = this.max_forward_speed;
    }

    let target_idx = this.path[this.target];
    let current_idx = tileIdxFromXY(this.x, this.y);
    if (target_idx == current_idx) {
        // next target
        this.target = (this.target + 1) % this.path.length; 
    }

    target_idx = this.path[this.target];
    let xy = xyFromTileIdx(target_idx);
    let target_x = xy[0];
    let target_y = xy[1];

    // compensate for tile being in the wrong direction
    let target_angle = (Math.atan2(target_y - this.y, target_x - this.x) + Math.PI/2) * 180 / Math.PI;
    let delta_angle = target_angle - this.angle;
    if (delta_angle < -180) {
        delta_angle += 360
    }
    if (delta_angle >= 360) {
        delta_angle -= 360;
    }

    if (delta_angle < -0.5) {
        this.angle = mod(this.angle - this.rotation_speed, 360);
    }
    if (delta_angle > 0.5) {
        this.angle = mod(this.angle + this.rotation_speed, 360);
    }

    this.rotation = this.angle * Math.PI / 180.0;

    this.vx = Math.cos(this.rotation - Math.PI/2) * this.speed;
    this.vy = Math.sin(this.rotation - Math.PI/2) * this.speed;

    newx = this.x + this.vx;
    newy = this.y + this.vy;

    this.setPos(newx, newy);
}

// Set x or y, if the do not move into forbidden tile
// TODO this is same as PlayerCar.setPos
ComputerCar.prototype.setPos = function(newx, newy) {
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
