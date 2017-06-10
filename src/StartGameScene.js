/**
 * Created by ZZH on 2016/4/12.
 */

var StartGameLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        // 白光的精灵
        var oWhiteLightSp = new cc.Sprite(res.WhiteLight_png);
        oWhiteLightSp.x = Config.SCREEN_W_FROMH/4*3;
        oWhiteLightSp.y = Config.SCREEN_H/2- Config.SCREEN_H_FROMH/16;

        this.addChild(oWhiteLightSp);

        var action = cc.sequence(
            cc.EaseSineIn.create(cc.moveTo(0.3,cc.p(Config.SCREEN_W_FROMH/4,Config.SCREEN_H/2 + Config.SCREEN_W_FROMH/16))),
            cc.fadeOut(0.03),
            cc.callFunc(this._changeScene, this)
        );

        oWhiteLightSp.runAction(action);

        MusicHelper.playEffect(res.Darts_mp3);
        return true;
    },
    /**
     * 进入到主开始界面场景
     * @method _changeScene
     */
    _changeScene:function(){
        cc.director.runScene( new MainMenuScene());
    }
});


var StartGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartGameLayer();
        this.addChild(layer);
    }
});

