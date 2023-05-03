class Character extends rune.display.Sprite {
    constructor(x, y, w, h, img){
        super(x, y, w, h, img);

        //this.hitbox.debug = true; 
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

        this.shield = false;

        this.ducking = false;
        this.walking = false;
        this.loadingJump = false;
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
        this.currentAnimation(step);

        if (this.isFalling) {
            this.gravity += .1;
        }   else this.gravity = 2;
    }
    updateGamepad(step) {
        if (this.gamepad.connected) {
            if(this.gamepad.stickLeft) {
                var z = this.x;
                this.x += this.gamepad.stickLeft.x * this.speed;
                //this.animation.gotoAndPlay('walking');
                if (z > this.x) {
                    this.flippedX = true;
                    this.walking = true;
                } else if (z < this.x) {
                    this.flippedX = false;
                    this.walking = true;
                } else if (this.gamepad.stickLeft.y < 0) {
                    this.ducking = true;
                    this.hitbox.set(0, 16, 32, 13);
                    this.walking = false;
                    //this.animation.gotoAndPlay('duck');
                }
                else {
                    this.walking = false;
                    this.flippedX = false;
                    this.hitbox.set(0, 2, 32, 26);
                    this.ducking = false;
                }
            }
        //jump like keyboard later
        if (this.gamepad.pressed(0) && this.ducking === false) {
            if (!this.isJumping) {
                this.vel += Math.floor(step);
                this.walking = false;
                this.flippedX = false;
                this.loadingJump = true;
            }
        }
        if (this.gamepad.justReleased(0) && this.ducking === false) {
            if (!this.isJumping) {
                this.walking = false;
                this.calcStep();
                this.flippedX = false;
                this.isJumping = true;
                this.loadingJump = false;
            }
        }
        }
    }
    currentAnimation(step) {
        if (this.walking) {
            this.animation.gotoAndPlay('walking');
        }  
        else if (this.isJumping) {
            this.animation.gotoAndPlay('jump');
        }
        else if (this.loadingJump) {
            this.animation.gotoAndPlay('loading_jump');
        }
        else if (this.ducking) {
            this.animation.gotoAndPlay('duck');
        }
        else {
            this.animation.gotoAndPlay('idle');
        }
    }
    updateKeyboard(step) {
        if (this.keyboard.pressed('LEFT')) {
            this.walking = true;
            this.x -= this.speed;
            this.flippedX = true;
        }
        else if (this.keyboard.pressed('RIGHT')) {
            this.walking = true;
            this.x += this.speed;
            this.flippedX = false;
        }
        else if (this.keyboard.pressed("SPACE") && this.ducking === false) {
            if (!this.isJumping) {
                this.walking = false;
                this.vel += Math.floor(step);
                this.flippedX = false;
                this.loadingJump = true;
            }
        } 
        else if (this.keyboard.justReleased("SPACE") && this.ducking === false) {
            if (!this.isJumping) {
                this.walking = false;
                this.calcStep();
                this.flippedX = false;
                this.isJumping = true;
                this.loadingJump = false;
            } 
        }
        //duck mechanic
        else if (this.keyboard.pressed('DOWN')) {
            this.walking = false;
            this.hitbox.set(0, 16, 32, 13);
            //this.animation.gotoAndPlay('duck');
            this.ducking = true;
        } 
        else {
            this.walking = false;
            //this.animation.gotoAndPlay('idle');
            this.flippedX = false;
            this.hitbox.set(0, 2, 32, 26);
            this.ducking = false;
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

        this.animation.create('jump', [8], 1, true);
        this.animation.create('loading_jump', [9, 10], 2, false);
        this.animation.create('duck', [14], 1, false);
    }
    updatePosition(step) {
        //later check if character is on a cloud or etcetc
        if (this.isJumping) {
            this.y += this.gravity;
            this.isFalling = true;
            //this.animation.gotoAndPlay('inAir');
        } else {
            console.log('on or in.. cloud')
            this.isFalling = false;
        }
    }
    //jumpHeight = sent value for desired - Y ; distance = same but + X
    //need jumpforce distanceforce split because of difference in distance, 
    //(if higher, weird with same as low when +5 på Y)
    updateJump() {
        const jumpForce = this.jumpHeight / 5;
        const distanceForce = this.distance / 8;
        // Jumping
        if (this.jumpHeight > 0) {
            this.y -= jumpForce;
            this.jumpHeight -= jumpForce;
            if (this.jumpHeight <= 0) {
                this.jumpHeight = 0;
                this.isJumping = false;
            }
            if (this.distance > 0) {
                this.x += distanceForce;
                this.distance -= distanceForce;
            }
        }
    }
    gotHit() {
        this.flicker.start(2000, 30, function() {
            console.log('hit')
        }, this);
    }
    initEffects() {
        this.jump = this.application.sounds.sound.get('jump', false);
        this.jump_medium = this.application.sounds.sound.get('jump_medium', false);
        this.jump_far = this.application.sounds.sound.get('jump_far', false);
        this.power_up = this.application.sounds.sound.get('power_up', false);

        this.hit = this.application.sounds.sound.get('hitHurt', false);
    }
    effects(effect) {
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