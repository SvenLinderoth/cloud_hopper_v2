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
    //--------------------------------------------------------------
    // var text = new rune.text.BitmapField("Hello World!");
    // text.autoSize = true;
    // text.center = this.application.screen.center;
    // this.stage.addChild(text);
    //--------------------------------------------------------------
    //enemy cloud
    this.enemy = new Cloud_Dangerous(250, 75);
    this.enemyGroup = new rune.display.DisplayGroup(this.stage);
    this.enemyGroup.addMember(this.enemy);

    //LIFE
    this.heart = new Heart(200, 75);
    this.stage.addChild(this.heart);
    this.heart.hitbox.debug = true;

    //cloud neutral into cloudgroup (use this.cloud methods)
    this.cloud = new Cloud_Neutral((this.previousCloudX = 75), 92);
    //CLOUD GROUP NEUTRALS; PLAYER CAN MOVE ON
    this.cloudGroup = new rune.display.DisplayGroup(this.stage);
    this.cloudGroup.addMember(this.cloud);
    
    //player obj
    this.player = new Character(75, 75, 32, 32, 'renthy');
    this.stage.addChild(this.player);
    //camera on player
    this.cameras.getCameraAt(0).targets.add(this.player);

    //music on music (master, music, sound)
    this.music_menu = this.application.sounds.music.get('mainmenu_music_intro', true);
    this.music_menu.volume = .4;
    this.music_menu.play();

     //music on music (master, music, sound)
     this.player_dmg_electric = this.application.sounds.sound.get('electric_shock', true);
     this.player_dmg_electric.volume = .4;
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

    //ENEMY GROUP; RENDER
    this.enemyGroup.forEachMember(function(e) {
        this.stage.addChild(e);
    },this);
    //ENEMY HIT CHECK
    if (this.player.hitTestGroup(this.enemyGroup, this.player.gotHit)) {
       this.player_dmg_electric.play(false);
    };
    //HITTING GOOD ITEM
    if (this.player.hitTestObject(this.heart)) {
        this.player.life = this.player.life + this.heart.value;
        console.log(this.player.life)
        this.heart.y -= 5;
    //this.stage.removeChild(this.heart);
        this.heart.value = 0;
    }

    //CLOUD GENERATOR -- FIX
    if (this.cloud.generateCloud(this.player.x, this.cloudGroup)) {
        //generate random places the clouds will spawn
        //fixa i generateCloud method något random generate, just nu endast om där är mindre än 4 clouds
        var cloud = new Cloud_Neutral(this.previousCloudX = (this.previousCloudX + 100), 92);
        this.cloudGroup.addMember(cloud);

        this.cloudGroup.forEachMember(function(c) {
            this.stage.addChild(c);
        }, this);
    }
    if (this.player.hitTestGroup(this.cloudGroup)) {
        //console.log('ON CLOUD')
        this.player.isJumping = false;
    } else {
        //this.player.y += this.player.gravity + 1;
        this.player.isJumping = true;
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