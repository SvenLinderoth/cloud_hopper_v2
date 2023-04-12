class Generator_StageOne {
    constructor(minJump, maxJump) {
        this.minJump = minJump;
        this.maxJump = maxJump;
    }
    init() {

    }
    randomX() {
        var max = this.maxJump;
        var min = this.minJump;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomY() {
        var max = 0;
        var min = 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}