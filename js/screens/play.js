game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // load a level
        me.levelDirector.loadLevel("level1");

        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");  
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.W, "up");  
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.S, "down");  
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindkey(me.input.KEY.LEFT);
        me.input.unbindkey(me.input.KEY.A);
        me.input.unbindkey(me.input.KEY.RIGHT);
        me.input.unbindkey(me.input.KEY.D);
        me.input.unbindkey(me.input.KEY.UP);
        me.input.unbindkey(me.input.KEY.W);
        me.input.unbindkey(me.input.KEY.DOWN);
        me.input.unbindkey(me.input.KEY.S);

        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
