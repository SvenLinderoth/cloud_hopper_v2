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

    //this.application.sounds finns överallt
    this.playSoundItem = function () {
        var soundEff = this.application.sounds.sound.get('pickupCoin', false);
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
    this.text = new rune.text.BitmapField("Score: " + this.getScore());
    this.text.autoSize = true;
    //--------------------------------------------------------------
    //player obj
    //--------------------------------------------------------------
    this.player = new Character(75, 75, 32, 32, 'renthy');
    this.generator = new Generator_StageOne(this.player.minJump, this.player.maxJump);
    //--------------------------------------------------------------
    //background
    //--------------------------------------------------------------
    this.background = new Background(
        -200,
        -200,
        1280,
        720,
        'graphic_background'
    )
    this.stage.addChild(this.background);
    //--------------------------------------------------------------
    //Grass bottom of background
    //--------------------------------------------------------------
    this.grass = new rune.display.Graphic(
        this.background.x,
        this.background.y + this.background.height,
        1280,
        200,
        'grass2'
    );
    this.stage.addChild(this.grass);
    //--------------------------------------------------------------
    //candy group
    //--------------------------------------------------------------
    this.candyGroup = new rune.display.DisplayGroup(this.stage);
    //--------------------------------------------------------------
    //enemy cloud
    //--------------------------------------------------------------
    this.enemy = new Cloud_Dangerous(
        (this.background.x + this.background.width),
        this.generator.randomY()
    );
    this.enemyGroup = new rune.display.DisplayGroup(this.stage);
    this.enemyGroup.addMember(this.enemy);
    //--------------------------------------------------------------
    //cloud neutral into cloudgroup (use this.cloud methods)
    //--------------------------------------------------------------
    this.cloud = new Cloud_Neutral((this.previousCloudX = 75), 92);
    //--------------------------------------------------------------
    //CLOUD GROUP NEUTRALS; PLAYER CAN MOVE ON
    //--------------------------------------------------------------
    this.cloudGroup = new rune.display.DisplayGroup(this.stage);
    this.cloudGroup.addMember(this.cloud);
    //--------------------------------------------------------------
    //player obj add to stage
    this.stage.addChild(this.player);
    //--------------------------------------------------------------
    //camera on player
    this.cameras.getCameraAt(0).targets.add(this.player);
    //--------------------------------------------------------------
    //music on music (master, music, sound)
    this.music_menu = this.application.sounds.music.get('mainmenu_music_intro', false);
    this.music_menu.volume = .4;
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
    //--------------------------------------------------------------
    //Background 
    //--------------------------------------------------------------
    var camera = this.cameras.getCameraAt(0);
    var background = this.background;
    if (camera.viewport.x + camera.viewport.width >= background.previousX + background.width) {
            var newX = background.previousX + background.width;
            var newY = background.y;
            var newBackground = new Background(
                newX,
                newY,
                1280,
                720,
                'graphic_background'
            );
            this.stage.addChild(newBackground);
            this.background = newBackground;
    }
    if (this.grass.x < camera.viewport.x) {
        this.grass.dispose();
    }
    this.grass = new rune.display.Graphic(
        this.background.x,
        this.background.y + this.background.height,
        1280,
        200,
        'grass2'
    );
    this.stage.addChild(this.grass);
    //--------------------------------------------------------------
    //re render spelare annars går den bakom nästa bakgrund
    //--------------------------------------------------------------
    this.stage.addChild(this.player);
    //--------------------------------------------------------------
    this.text.dispose();
    this.text = new rune.text.BitmapField("Score: " + this.getScore());
    this.text.top = camera.viewport.top + 15;
    this.text.left = camera.viewport.left + 20;
    this.stage.addChild(this.text);
    
    if (this.generator.getEnemy(this.enemyGroup.getMembers().length)) {
        var enemyCloud = new Cloud_Dangerous(
            (camera.viewport.x + camera.viewport.width + 80),
            this.generator.randomY()
        );
        this.enemyGroup.addMember(enemyCloud);
    }
    //--------------------------------------------------------------
    //ENEMY GROUP; RENDER
    //--------------------------------------------------------------
    this.enemyGroup.forEachMember(function(e) {
        this.stage.addChild(e);
        e.x -= e.speed;
        if (e.x < camera.viewport.x) {
            this.enemyGroup.removeMember(e);
            e.dispose();
        }
    },this);
    //--------------------------------------------------------------
    //ENEMY HIT CHECK
    //--------------------------------------------------------------
    if (this.player.hitTestGroup(this.enemyGroup, this.player.gotHit)) {
       this.player.effects('hit');
    };
    //--------------------------------------------------------------
    //cloud gen, candy generate
    //--------------------------------------------------------------
    if (this.cloudGroup.getMembers().length < 10) {
        var cloud = new Cloud_Neutral(this.previousCloudX = (this.previousCloudX + this.generator.randomX()), this.generator.randomY());
        //candy, x, y, value (standard candy = 1)
        //tar alla clouds x och y, och centrerar en godis på toppen av molnet
        var candy = new Candy((cloud.x + 6), (cloud.y - 10), 1);
        this.cloudGroup.addMember(cloud);
        this.candyGroup.addMember(candy);
    } 
    //console.log(this.cloudGroup.getMembers().length)
        this.cloudGroup.forEachMember(function(c) {
            this.stage.addChild(c);
            if (c.x < camera.viewport.x) {
                c.dispose();
            }
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
    
    //--------------------------------------------------------------
    //hittest clouds
    //--------------------------------------------------------------
    if (this.player.hitTestGroup(this.cloudGroup)) {
        //console.log('ON CLOUD')
        this.player.isJumping = false;
    } else {
        this.player.isJumping = true;
    }
    //--------------------------------------------------------------
    //hittest grass, fell to ground = call to game over method later
    //--------------------------------------------------------------
    if (this.grass.hitTestObject(this.player)) {
        if (this.player.y > 570) this.player.gravity = 0;
        console.log('game over, landed on grass');
        console.log('score: ' + this.getScore());

        this.text = new rune.text.BitmapField("Game Over! Score: " + this.getScore());

        this.text.center = camera.viewport.center;
        this.text.y = this.text.y - 30;
    
        this.stage.addChild(this.text);
    }
    //--------------------------------------------------------------
    //--------------------------------------------------------------
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



