class Cloud_Neutral extends rune.display.Sprite {
    constructor(x, y){
        super(x, y, 32, 32, 'cloud_neutral');

        this.hitbox.debug = true; 
        this.hitbox.set(0, 10, 32, 5)
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
    //RANDOM GENERATION ---------------
    //lägg in i random generator object för olika stages i det objektet
    randomX() {
        var max = 200;
        var min = 20;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomY() {
        var max = 0;
        var min = 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}