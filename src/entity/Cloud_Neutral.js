class Cloud_Neutral extends rune.display.Sprite {
    constructor(x, y){
        super(x, y, 32, 32, 'cloud_neutral');

        this.hitbox.debug = true; 
        this.hitbox.set(0, 10, 32, 20)
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
    generateCloud(playerX, clouds) {
        var x = 0;
        clouds.forEachMember(function(c) {
            x++;
        },this) 
        if (x < 4) return true;
    }
}