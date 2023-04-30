class Character extends rune.display.Sprite {
    constructor(x, y, w, h, img){
        super(x, y, w, h, img);

        this.hitbox.debug = true; 
        this.hitbox.set(0, 2, 32, 26);

        this.speed = 2;
        this.gamepad = null; 
        //init Y position for going back after jump, use platforms/clouds later for check with char?
        this.initY = y;
        this.isJumping = false;
        //velocity for jumping, updates dynamically by (step) when holding down a press(btn)
        this.vel = 0;
        this.gravity = 2;

        this.life = 1;

        this.maxJump = 220;
        this.minJump = 10;

        this.isFalling = false;

        this.jumpHeight = 0;
        this.distance = 0;
    }
    init() {
        super.init();
        this.characterAnimations();        
        this.initEffects();
        this.gamepad = this.gamepads.get(0);
    }
    update(step) {
        super.update(step);
        this.updateInput(step);
        this.updatePosition(step);
        this.updateJump(step);

        if (this.isFalling) {
            this.gravity += .1;
        }   else this.gravity = 2;
    }
    updateGamepad(step) {
        if (this.gamepad.connected) {
            if(this.gamepad.stickLeft) {
                var z = this.x;
                this.x += this.gamepad.stickLeft.x * this.speed;
                this.animation.gotoAndPlay('walking');
                if (z > this.x) {
                    this.flippedX = true;
                } else if (z < this.x) {
                    this.flippedX = false;
                }   else {
                    this.animation.gotoAndPlay('idle');
                }
            }
        //jump like keyboard later
        if (this.gamepad.pressed(0)) {
            console.log('a')
            if (!this.isJumping) {
                console.log(step)
                this.vel += Math.floor(step);
            }
        }
        if (this.gamepad.justReleased(0)) {
            if (!this.isJumping) {
                this.calcStep();
            }
        }
        }
    }
    updateKeyboard(step) {
        if (this.keyboard.pressed('LEFT')) {
            this.x -= this.speed;
            this.animation.gotoAndPlay('walking');
            this.flippedX = true;
        }
        else if (this.keyboard.pressed('RIGHT')) {
            this.x += this.speed;
            this.animation.gotoAndPlay('walking');
            this.flippedX = false;
        }
        else {
            this.animation.gotoAndPlay('idle');
            this.flippedX = false;
        }
        //jump call 
        if (this.keyboard.pressed("SPACE")) {
            if (!this.isJumping) {
                this.vel += Math.floor(step);
            }
        }
        if (this.keyboard.justReleased("SPACE")) {
            if (!this.isJumping) {
                console.log(this.vel)
                this.calcStep();
            }
        }
    }
    calcStep() {
        var effect;
        if (this.vel > 0 && this.vel < 100) {
            this.jumpHeight = 15;
            this.distance = this.minJump;
            effect = 'jump';
        }
        else if (this.vel > 100 && this.vel < 300){
            this.jumpHeight = 30;
            this.distance = 50;
            effect = 'jump';
        }   
        else if (this.vel > 300 && this.vel < 500){
            this.jumpHeight = 80;
            this.distance = 80;
            effect = 'jump_medium';
        }
        else if (this.vel > 500 && this.vel < 700){
            this.jumpHeight = 90;
            this.distance = 120;
            effect = 'jump_medium';
        }
        else if (this.vel > 700 && this.vel < 900){
            this.jumpHeight = 90;
            this.distance = 150;
            effect = 'jump_medium';
        }
        else if (this.vel > 900 && this.vel < 1100){
            this.jumpHeight = 100;
            this.distance = 200;
            effect = 'jump_far';
        }
        else {
            this.jumpHeight = 120;
            this.distance = this.maxJump;
            effect = 'jump_far';
        }
        this.vel = 0;
        this.effects(effect);
    }
    //input update  
    updateInput(step){
        this.updateKeyboard(step);
        this.updateGamepad(step);
    }
    //define character animations
    characterAnimations() {
        this.animation.create('idle', [0,1], 2, true);
        this.animation.create('walking', [2,3,4,5,6], 5, true);
        //animation för jump 
    }
    updatePosition(step) {
        //later check if character is on a cloud or etcetc
        if (this.isJumping) {
            this.y += this.gravity;
            this.isFalling = true;
        } else {
            console.log('on or in.. cloud')
            this.isFalling = false;
        }
    }
    gotHit() {
        if(!this.immortal) {
            this.life -= 1;
            this.immortal = true;
            this.flicker.start(1000, 30, function() {
                this.immortal = false;
            }, this);
        }
    }
    //jumpHeight = sent value for desired - Y ; distance = same but + X
    updateJump() {
        if (this.jumpHeight > 0) {
            this.y -= 12;
            this.jumpHeight -= 10;
        } 
        if (this.distance > 0) {
            this.x += 6;
            this.distance -= 8;
        } 
    }
    initEffects() {
        this.jump = this.application.sounds.sound.get('jump', false);
        this.jump_medium = this.application.sounds.sound.get('jump_medium', false);
        this.jump_far = this.application.sounds.sound.get('jump_far', false);

        this.hit = this.application.sounds.sound.get('hitHurt', false);
    }
    effects(effect) {
        // var jump = this.application.sounds.sound.get('jump', false);
        // var jump_medium = this.application.sounds.sound.get('jump_medium', false);
        // var jump_far = this.application.sounds.sound.get('jump_far', false);

        // var hit = this.application.sounds.sound.get('hitHurt', false);

        if (effect === 'jump_medium') {
            this.jump_medium.play();
        }   else if (effect === 'jump_far') {
            this.jump_far.play();
        }   else if (effect === 'jump') {
            this.jump.play();
        }   else if (effect === 'hit') {
            this.hit.play();
        }
    }
}