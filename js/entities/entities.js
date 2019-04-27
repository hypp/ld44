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

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // define a basic walking animation (using all frames)
        this.addAnimation("walk",  [0, 1, 2, 3]);

        // define a standing animation (using the first frame)
        this.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.setCurrentAnimation("stand");
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

        var car = 4+(~~(Math.random() * 2)) * 4;

        // define a basic walking animation (using all frames)
        this.addAnimation("walk",  [car+0, car+1, car+2, car+3]);

        // define a standing animation (using the first frame)
        this.addAnimation("stand",  [car+0]);

        // set the standing animation as default
        this.setCurrentAnimation("stand");
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