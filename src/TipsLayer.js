/**
 * Created by ZZH on 2016/4/15.
 */

var TipsLayer = cc.Layer.extend({

    _tipbg: null,
    // helpTexN : 帮助图片下标
    ctor: function () {

        this._super();
        var bg = new cc.LayerColor(cc.color(0, 0, 0, 125));
        this.addChild(bg, 1);

        var tipbg = new cc.Sprite(res.Help_bj_png);
        tipbg.setPosition(cc.p(Config.SCREEN_W_FROMH / 2, Config.SCREEN_H_FROMH / 2));
        this.addChild(tipbg, 2);
        this._tipbg = tipbg

        var helpTexN = DataHelper.getCurrentLevel();
        if (helpTexN >= 13) {
            helpTexN = 13;
        }
        var tip = new cc.Sprite("res/help_text_" + helpTexN + ".png");
        tip.setPosition(cc.p(tipbg.getContentSize().width / 2, tipbg.getContentSize().height / 2));
        tipbg.addChild(tip, 2);

        if (AnimatesData["help_" + helpTexN]) {

            var sp = new cc.Sprite();
            sp.runAction(AnimateHelper.getAnimateByNameForever("help_" + helpTexN));
            var p = null;
            if (helpTexN == 1) {
                p = cc.p((Config.SCREEN_W_FROMH - 122) / 2 - 90 , Config.SCREEN_H / 2 + 32);
            }
            else if (helpTexN >= 13) {
                p = cc.p((Config.SCREEN_W_FROMH - 122) / 2 - 90, Config.SCREEN_H / 2 + 40);
            }
            else if (helpTexN == 2) {
                p = cc.p((Config.SCREEN_W_FROMH - 122) / 2 + 111 + 80, Config.SCREEN_H / 2 + 100);

            } else if (helpTexN == 4 || helpTexN == 5 || helpTexN == 9 || helpTexN == 10 || helpTexN == 11 || helpTexN == 12) {
                p = cc.p((Config.SCREEN_W_FROMH - 122) / 2 + 60, Config.SCREEN_H / 2 + 76);
            }
            p = tipbg.convertToNodeSpace(p);
            sp.setPosition(p);
            tipbg.addChild(sp, 3);
        }
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                this.removeFromParent();
                return true;
            }.bind(this),
        }, this);

        this.runScale();

        return true;
    },

    runScale: function () {

        this._tipbg.stopAllActions();
        this._tipbg.setScale(0.1);
        var action = cc.sequence(
            cc.EaseSineInOut.create(cc.scaleTo(0.2, 1.5)),
            cc.EaseSineInOut.create(cc.scaleTo(0.1, 1.3))
        );

        this._tipbg.runAction(action);

    }
})