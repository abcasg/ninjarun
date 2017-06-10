/**
 * Created by ZZH on 2016/4/12.
 */

var MainMenuLayer = cc.Layer.extend({

    soundFlag: false,  // 声音标记
    start: null,
    sound: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        var bg = new cc.Sprite(res.Bg_jpg);
        bg.x = size.width / 2;
        bg.y = size.height / 2;
        this.addChild(bg);

        var gamelogo = new cc.Sprite(res.GameLogo_png);
        gamelogo.anchorY = 0;
        gamelogo.x = size.width / 2;
        gamelogo.y = size.height / 2 + 100;
        this.addChild(gamelogo);

        var start = new ccui.Button(res.Start_png, res.Start_png, "");
        start.setPressedActionEnabled(true);
        start.anchorX = 1;
        start.anchorY = 0;
        start.x = size.width - 60;
        start.y = 65;
        start.addTouchEventListener(this.callback, this);
        this.addChild(start);
        this.start = start;

        var sound = new ccui.Button(res.Sound_png, res.Sound_png, "");
        sound.setPressedActionEnabled(true);
        sound.anchorY = 0;
        sound.x = 90;
        sound.y = 75;
        sound.addTouchEventListener(this.callback, this);
        this.addChild(sound);
        this.sound = sound;

        //////////////////////////////////////
        AnimateHelper.init();
        DataHelper.init();

        MusicHelper.playMusic(res.Menubg_mp3, true);
        return true;
    },
    musicUse: function () {
        if (this.soundFlag) {
            this.sound.loadTextureNormal(res.Sound_png);
            this.soundFlag = false;
            MusicHelper.resumeMusic();

        } else {
            this.sound.loadTextureNormal(res.SoundNo_png);
            this.soundFlag = true;
            MusicHelper.pauseMusic();
        }
    },
    callback: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                MusicHelper.playEffect(res.Click_mp3);
                // 进入选关界面
                if (sender === this.start) {
                    this.addLevelLayer();
                }
                if (sender === this.sound) {
                    this.musicUse();
                }
                break;
        }

    },

    addLevelLayer: function () {

        var action = cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(function () {
                var dropDialog = new DropDialog();
                this.addChild(dropDialog, 2);

                this.start.setVisible(false);
            }, this)
        );

        this.start.runAction(action);
        this.sound.runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
            this.sound.setVisible(false);
        }, this)));

        this.start.setTouchEnabled(false);
        this.sound.setTouchEnabled(false);
    }
});


var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});

