//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * 
 * Game scene.
 */
cloud_hop.scene.Game = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

cloud_hop.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
cloud_hop.scene.Game.prototype.constructor = cloud_hop.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
cloud_hop.scene.Game.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);
    // var text = new rune.text.BitmapField("Hello World!");
    // text.autoSize = true;
    // text.center = this.application.screen.center;
    // this.stage.addChild(text);

    //enemy cloud
    this.enemy = new Cloud_Dangerous(150, 75);
    this.stage.addChild(this.enemy);
    //this.enemy.hitbox.set(0,0,32,32)
    this.enemy.hitbox.debug = true;
    //LIFE
    this.heart = new Heart(200, 75);
    this.stage.addChild(this.heart);
    this.heart.hitbox.debug = true;

    //player obj
    this.player = new Character(75, 75, 32, 32, 'renthy');
    this.stage.addChild(this.player);
    //this.player.hitbox.set(0,0,32,32);
    this.player.hitbox.debug = true; 

    //camera on player
    this.cameras.getCameraAt(0).targets.add(this.player);

    //music on music (master, music, sound)
    this.music_menu = this.application.sounds.music.get('mainmenu_music_intro', true);
    this.music_menu.volume = .4;
    this.music_menu.play();
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
cloud_hop.scene.Game.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);
    if (this.player.hitTestObject(this.enemy, this.player.gotHit));

    if (this.player.hitTestObject(this.heart)) {
        this.player.life = this.player.life + this.heart.value;
        console.log(this.player.life)
        this.heart.y -= 5;

        this.heart.value = 0;
        //?
        //this.heart=null
        //this.stage.removeChild(this.heart);
    }

};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
cloud_hop.scene.Game.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};