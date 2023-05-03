class Menu extends rune.scene.Scene {
    constructor() {
        super();

        this.m_menu = null;
    }

    init() {
        super.init();

        this.m_menu = new rune.ui.VTMenu();
        this.m_menu.onSelect(this.selectMenuOption, this);
        this.m_menu.add('Start');
        this.m_menu.add('High Score');
        this.m_menu.add('How to Play');
        this.m_menu.add('Exit');

        this.m_menu.center = this.cameras.getCameraAt(0).viewport.center;

        this.stage.addChild(this.m_menu);

        this.background_music = this.application.sounds.music.get('main_menu_cloudhop', false);
        this.background_music.volume = .5;
        this.background_music.play();

        this.sound = this.application.sounds.sound.get('blipSelect', true);
        this.sound.volume = .7;
        this.sound_select = this.application.sounds.sound.get('menu_select', true);
    }

    update(step) {
        super.update(step); 
        this.updateInput(step);
    }

    dispose() {
        super.dispose();
    }

    updateInput(step) {
        if (this.keyboard.justPressed('UP') || this.keyboard.justPressed('W') || this.gamepads.justPressed(12)) {
            this.m_menu.up();
            this.sound.play();
        } 

        if( this.keyboard.justPressed('DOWN') || this.keyboard.justPressed('S') || this.gamepads.justPressed(13)) {
            this.m_menu.down();
            this.sound.play();
        } 

        if( this.keyboard.justPressed('ENTER') || this.keyboard.justPressed('SPACE') || this.gamepads.justPressed(0) || this.gamepads.justPressed(15)) {
            this.m_menu.select();
            this.sound_select.play();
        } 

    }

    selectMenuOption(options) {
        switch (options.text) {
            case 'Start':
                this.application.scenes.load([new cloud_hop.scene.Game()]);
                break;

            case 'High Score': 
                //scene for highscore 
                break;
            
            case 'How to Play':
                //scene for instructions
                break;
            
            case 'Exit':
                //quit app
                break;
        }
    }
}
cloud_hop.scene.Menu = Menu;