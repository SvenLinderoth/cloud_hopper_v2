class Candy extends rune.display.Sprite {
    constructor(x, y, value){
        super(x, y, 16, 16, 'lollipopv1');
        this.value = value;
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
        this.animation.create('idle', [0,1,2,3], 4, true);
    }
}