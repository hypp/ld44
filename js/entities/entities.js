/**
 * Player Entity
 */
game.PlayerEntity = me.Sprite.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Sprite, 'init', [x, y , settings]);

        // max walking & jumping speed
        //this.body.setMaxVelocity(3, 15);
        //this.body.setFriction(0.4, 0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        //this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);

        // define a standing animation (using the first frame)
        //this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        //this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) {

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return this._super(me.Sprite, 'update', [dt]);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

game.ComputerEntity = me.Sprite.extend({
    init : function (x, y, settings) {
        // call the constructor
        this._super(me.Sprite, 'init', [x, y , settings]);
    }
  });