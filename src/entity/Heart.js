class Heart extends rune.display.Sprite {
    constructor(x, y){
        super(x, y, 16, 16, 'heart');
        this.value = 1;
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