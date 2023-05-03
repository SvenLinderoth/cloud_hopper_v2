class Generator_StageOne {
    constructor(minJump, maxJump) {
        this.minJump = minJump;
        this.maxJump = maxJump;

        this.maxEnemies = 1;

        this.shieldOdds = 10;
        this.fallenCloudOdds = 12;
    }
    init() {
        //
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
    randomDuration() {
        const duration = [5000, 6000, 7000, 8000, 9000, 10000];
        const arrInd = Math.floor(Math.random() * duration.length);
  
        return duration[arrInd];
    }
    getEnemy(camera) {
        var enemy = new Cloud_Dangerous(
            (camera.viewport.x + camera.viewport.width + 80),
            this.randomY()
        );
        return enemy;
    }
    //see if player has shield active, or randomise if shield should be generated
    getItem(players_shield) {
        if (Math.floor(Math.random() * this.shieldOdds) === 0 && players_shield === false) {
            return true;
          } else {
            return false;
          }
    }
    fallenCloud() {
        if (Math.floor(Math.random() * this.fallenCloudOdds) === 0) {
            return true;
          } else {
            return false;
          }
    }
}