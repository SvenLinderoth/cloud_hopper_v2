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

    // score private
    var score = 0;
    //set and return score
    this.setScore = function (points) {
        score += points;
    }
    this.getScore = function () {
        return score;
    }
    this.playSoundJump = function () {
        var soundEff = this.application.sounds.sound.get('jump_chant_medium', true);
        soundEff.play();
    }
    this.playSoundJumpLong = function () {
        var soundEff = this.application.sounds.sound.get('jump_chant_far', true);
        soundEff.play();
    }
    this.playSoundItem = function () {
        var soundEff = this.application.sounds.sound.get('LIFE_UP', true);
        soundEff.play();
    }
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
    
    //background
    var background = new rune.display.Graphic(
        -200,
        -200,
        2200,
        1400,
        'background_test_clouds'
    )
    this.stage.addChild(background);
    //candy group
    this.candyGroup = new rune.display.DisplayGroup(this.stage);

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

    this.generator = new Generator_StageOne(this.player.minJump, this.player.maxJump);

    //music on music (master, music, sound)
    this.music_menu = this.application.sounds.music.get('mainmenu_music_intro', true);
    this.music_menu.volume = .4;
    //this.music_menu.play();

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
       this.player_dmg_electric.play();
    };
    //HITTING GOOD ITEM
    if (this.player.hitTestObject(this.heart)) {
        this.player.life = this.player.life + this.heart.value;
        console.log(this.player.life)
        this.heart.y -= 5;
    //this.stage.removeChild(this.heart);
        this.heart.value = 0;
    }
    //cloud gen, candy generate
    var cloud = new Cloud_Neutral(this.previousCloudX = (this.previousCloudX + this.generator.randomX()), this.generator.randomY());
    //candy, x, y, value (standard candy = 1)
    //tar alla clouds x och y, och centrerar en godis på toppen av molnet
    var candy = new Candy((cloud.x + 6), (cloud.y - 10), 1);
    this.cloudGroup.addMember(cloud);
    this.candyGroup.addMember(candy);

        this.cloudGroup.forEachMember(function(c) {
            this.stage.addChild(c);
        }, this);
        this.candyGroup.forEachMember(function(c) {
            this.stage.addChild(c);
            if (this.player.hitTestObject(c)) { 
                this.setScore(c.value);
                //ta bort aktuell candy som tas
                c.value = 0;
                c.dispose();
                c = null;
                this.playSoundItem();
            }
        }, this);

    if (this.player.hitTestGroup(this.cloudGroup)) {
        //console.log('ON CLOUD')
        this.player.isJumping = false;
    } else {
        this.player.isJumping = true;
    }
    if (this.player.justJumped && this.player.longJump) {
        this.playSoundJumpLong();
        this.player.longJump = false;
        this.player.justJumped = false;
    } else if (this.player.justJumped) {
        this.playSoundJump();
        this.player.justJumped = false;
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



