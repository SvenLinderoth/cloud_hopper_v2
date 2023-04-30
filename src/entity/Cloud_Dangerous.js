class Cloud_Dangerous extends rune.display.Sprite {
    constructor(x, y){
        super(x, y, 32, 32, 'cloud_dangerous');

        this.speed = 1;
        //this.hitbox.set(0,0,32,32)
        this.hitbox.debug = true;
    }
    init() {
        super.init();
        this.characterAnimations();
    }
    update(step) {
        super.update(step);
        this.animation.gotoAndPlay('idle');
    }
    characterAnimations() {
        this.animation.create('idle', [0,1,2,3,4,5], 6, true);
    }
}