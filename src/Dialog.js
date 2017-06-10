/**
 * Created by ZZH on 2016/4/12.
 */

var DropDialog = cc.Layer.extend({
    bg: null,
    bottom: null,
    stencil: null,
    ctor: function (levelLayer) {
        this._super();

        var size = cc.winSize;

        var top = new cc.Sprite(res.H_png);
        var bottom = new cc.Sprite(res.H2_png);

        top.attr({
            x: size.width / 2,
            y: Config.SCREEN_H - 6
        })

        bottom.attr({
            x: size.width / 2,
            y: top.getPositionY() - bottom.getContentSize().height
        })
        this.bottom = bottom;

        var levelLayer = new LevelLayer();
        levelLayer.attr({
            anchorX: 0,
            anchorY: 0

        })

        this.bg = levelLayer;

        this.addChild(top, 1);
        this.addChild(bottom, 1);
        // this.addChild(bg);

        this.scheduleUpdate();
        this.dropDown();
        return true
    },
    update: function (dt) {
        // 同步
        this.bottom.y = this.stencil.getPosition().y;
    },
    dropDown: function (dt) {

        // 剪裁节点
        var clipper = new cc.ClippingNode();
        clipper.width = 523;
        clipper.height = 604;
        clipper.anchorX = 0.5;
        clipper.anchorY = 0;

        var size = cc.winSize;

        clipper.x = size.width / 2;
        clipper.y = 0;

        this.addChild(clipper);

        // 模板
        var stencil = new cc.DrawNode();
        stencil.anchorX = 0;
        stencil.anchorY = 0;
        var rectangle = [cc.p(0, 0), cc.p(clipper.width, 0),
            cc.p(clipper.width, clipper.height),
            cc.p(0, clipper.height)];

        var white = cc.color(255, 255, 255, 255);
        stencil.drawPoly(rectangle, white, 1, white);

        stencil.x = 0;
        stencil.y = this.bottom.getPosition().y;

        clipper.stencil = stencil;

        // 添加底板
        clipper.addChild(this.bg);

        // 下拉
        stencil.runAction(cc.moveTo(0.7, cc.p(0, 0)));
        // this.bottom.runAction(cc.moveTo(0.9,cc.p(size.width/2,0)));
        this.stencil = stencil;
    }

})

//////////////////////////////////////////////////////////////////////////////////////

var WinDialog = BaseLayer.extend({
    _tanchuang: null,
    _againBtn: null,
    _nextBtn: null,
    ctor: function () {
        this._super();

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 125));
        this.addChild(bg, 1);

        var tanchuang = new cc.Sprite(res.Tanchuang_diban_png);
        tanchuang.setPosition(cc.p(Config.SCREEN_W_FROMH / 2, Config.SCREEN_H_FROMH / 2));
        this.addChild(tanchuang, 2);
        this._tanchuang = tanchuang

        var tSize = tanchuang.getContentSize();

        var offW = 20;
        var offH = 10;
        var nextBtn = new ccui.Button(res.Nextbtn_png, res.Nextbtn_png, "");
        nextBtn.setPressedActionEnabled(true);
        nextBtn.setPosition(cc.p(tSize.width / 2 + offW + nextBtn.getContentSize().width / 2, tSize.height / 2 + nextBtn.getContentSize().height / 2 + offH));
        nextBtn.addTouchEventListener(this.callback, this);
        tanchuang.addChild(nextBtn);
        this._nextBtn = nextBtn;

        var againBtn = new ccui.Button(res.Againbtn_png, res.Againbtn_png, "");
        againBtn.setPressedActionEnabled(true);
        againBtn.setPosition(cc.p(tSize.width / 2 + offW + againBtn.getContentSize().width / 2, tSize.height / 2 - againBtn.getContentSize().height / 2 - offH));
        againBtn.addTouchEventListener(this.callback, this);
        tanchuang.addChild(againBtn);
        this._againBtn = againBtn;

        var roleSp = new cc.Sprite("#tanchuangrenzhedonghua-50001.png");
        roleSp.setPosition(cc.p(roleSp.getContentSize().width / 2, roleSp.getContentSize().height / 2 + 30));
        tanchuang.addChild(roleSp);

        tanchuang.setScale(0.1);
        tanchuang.runAction(this.popupAction());
        roleSp.runAction(AnimateHelper.getAnimateByName("na_tc"));

        MusicHelper.playEffect(res.Win_mp3);
        return true;

    },
    callback: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                MusicHelper.playEffect(res.Click_mp3);
                // 重来
                if (sender === this._againBtn) {
                    cc.director.runScene(new GameScene());
                } else if (sender === this._nextBtn) {
                    cc.log("next game~~~~~~~~~~~~");
                    DataHelper.addCurrentLevel();
                    cc.director.runScene(new GameScene());
                }
                break;
        }
    }

})

///////////////////////////////////////////////////////////////////////////
// 失败
var FailedDialog = BaseLayer.extend({

    _againBtn: null,
    _backBtn: null,
    ctor: function () {
        this._super();

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 125));
        this.addChild(bg, 1);

        var tanchuang = new cc.Sprite(res.Tanchuang_diban_png);
        tanchuang.setPosition(cc.p(Config.SCREEN_W_FROMH / 2, Config.SCREEN_H_FROMH / 2));
        this.addChild(tanchuang, 2);

        var tSize = tanchuang.getContentSize();

        var failedLogo = new cc.Sprite(res.FailedLogo_png);
        failedLogo.setPosition(cc.p(tSize.width / 2, tSize.height - failedLogo.getContentSize().height));
        tanchuang.addChild(failedLogo);

        var againBtn = new ccui.Button(res.Againbtn_png, res.Againbtn_png, "");
        againBtn.setPressedActionEnabled(true);
        againBtn.setPosition(cc.p(tSize.width / 2, tSize.height / 2));
        againBtn.addTouchEventListener(this.callback, this);
        tanchuang.addChild(againBtn);
        this._againBtn = againBtn;

        var backBtn = new ccui.Button(res.BackBtn_png, res.BackBtn_png, "");
        backBtn.setPressedActionEnabled(true);
        backBtn.setPosition(cc.p(tSize.width / 2, tSize.height / 2 - backBtn.getContentSize().height - 10));
        backBtn.addTouchEventListener(this.callback, this);
        tanchuang.addChild(backBtn);
        this._backBtn = backBtn;

        tanchuang.setScale(0.1);
        tanchuang.runAction(this.popupAction());

        MusicHelper.playEffect(res.Faild_mp3);
        return true;
    },
    callback: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                MusicHelper.playEffect(res.Click_mp3);
                if (sender === this._againBtn) {
                    cc.director.runScene(new GameScene());
                } else if (sender === this._backBtn) {
                    cc.director.runScene(new MainMenuScene());
                }
                break;
        }
    }

})