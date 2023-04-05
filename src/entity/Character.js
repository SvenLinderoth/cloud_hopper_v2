class Character extends rune.display.Sprite {
    constructor(x, y, w, h, img){
        super(x, y, w, h, img);

        this.speed = 1;
        this.gamepad = null; 
        //init Y position for going back after jump, use platforms/clouds later for check with char?
        this.initY = y;
        this.isJumping = false;
        //velocity for jumping, updates dynamically by (step) when holding down a press(btn)
        this.vel = 0;
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
        if (this.keyboard.justPressed("SPACE")) {
            if (!this.isJumping) {
                console.log('just_press')
                this.vel += Math.floor(step);
            }
        }
        if (this.keyboard.justReleased("SPACE")) {
            if (!this.isJumping) {
                console.log(this.vel)
                console.log('release')
                this.isJumping = true;
                this.calcStep();
            }
        }
    }
    calcStep() {
        if (this.vel > 0 && this.vel < 50) {
            this.y -= 5;
            this.x += 5;
        }
        else if (this.vel > 50 && this.vel < 100) {
            this.y -= 10;
            this.x += 10;
        }
        else if (this.vel > 100 && this.vel < 200) {
            this.y -= 20;
            this.x += 20;
        }
        else if (this.vel > 200 && this.vel < 300) {
            this.y -= 30;
            this.x += 30;
        }
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
    }
    updatePosition(step) {
        //later check if character is on a cloud or etcetc
        if (this.isJumping) {
            if (this.y < this.initY)
            this.y += 1;
        }
        else if (this.y == this.initY) {
            this.isJumping = false;
            console.log('landed')
        }
    }
}