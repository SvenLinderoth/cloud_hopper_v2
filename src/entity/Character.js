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

        this.life = 2;

        this.maxJump = 300;
        this.minJump = 10;

        this.justJumped = false;
        this.longJump = false;
    }
    init() {
        super.init();
        this.characterAnimations();
        this.gamepad = this.gamepads.get(0);
    }
    update(step) {
        super.update(step);
        this.updateInput(step);
        this.updatePosition(step);
    }
    updateGamepad() {
        if (this.gamepad.connected) {
            if(this.gamepad.stickLeft) {
                this.x += this.gamepad.stickLeft.x * this.speed;
            }
        //jump like keyboard later
        if (this.gamepad.pressed("A")) {
                //jump 
            };
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
                //console.log(step);
                //console.log('just_press')
                this.vel += Math.floor(step);
            }
        }
        if (this.keyboard.justReleased("SPACE")) {
            if (!this.isJumping) {
                console.log(this.vel)
                //console.log('release')
                this.calcStep();
                this.justJumped = true;
            }
        }
    }
    calcStep() {
        var height = 0;
        var distance = 0;
        if (this.vel > 0 && this.vel < 100) {
            height = 10;
            distance = 20;
        }
        else if (this.vel > 100 && this.vel < 300){
            height = 30;
            distance = 50;
        }   
        else if (this.vel > 300 && this.vel < 500){
            height = 80;
            distance = 120;
        }
        else if (this.vel > 500 && this.vel < 700){
            height = 90;
            distance = 160;
        }
        else if (this.vel > 700 && this.vel < 900){
            height = 90;
            distance = 200;
        }
        else if (this.vel > 900 && this.vel < 1100){
            height = 100;
            distance = 240;
            this.longJump = true;
        }
        else {
            height = 120;
            distance = this.maxJump;
            this.longJump = true;
        }
        this.updateJump(height, distance);
        this.vel = 0;
        //this.keyboard.reset();
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
        } else {
            console.log('on or in.. cloud')
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
    //height = sent value for desired - Y ; distance = same but + X
    updateJump(height, distance) {
        var a = 0;
        var b = 0;
        do {
            this.y -= .2;
            a += .2;
        } while (a < height);
        
        do {
            this.x += .5;
            b += .5;
        }   while (b < distance);
    }
}