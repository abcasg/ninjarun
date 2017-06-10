/**
 * Created by ZZH on 2016/4/15.
 */
// 游戏侧边的竖条界面
var InfoLayer = cc.Layer.extend({

    fenshengBtn:null,
    zhuyeBtn:null,
    chonglaiBtn:null,
    shengyinBtn:null,
    bangzhuBtn:null,
    musicFalg:false,
    killLabel:null,
    ctor:function(){

        this._super();

        var uidiban = new cc.Sprite(res.UIdiban_png);
        uidiban.setAnchorPoint(cc.p(0,0));
        uidiban.setPosition(cc.p(cc.winSize.width - uidiban.getContentSize().width,0));
        this.addChild(uidiban);

        var uidibanSize = uidiban.getContentSize();
        var levelSp = new cc.Sprite(res.Guanqian_png);
        levelSp.setPosition(cc.p(uidibanSize.width/2+ 10 ,uidibanSize.height - levelSp.getContentSize().height/2 - 15));
        uidiban.addChild(levelSp);

        var offY = -5;

        var levelbg = new cc.Sprite(res.Shuzhibanzi_png);
        levelbg.setPosition(cc.p(levelSp.getPositionX(),levelSp.getPositionY() - levelSp.getContentSize().width/2 -  offY));
        uidiban.addChild(levelbg);

        var levelLabel = new cc.LabelAtlas(""+DataHelper.getCurrentLevel(),res.Xiegang_shuzhi_png,22,22,'/');
        levelLabel.setAnchorPoint(cc.p(0.5,0.5));
        levelLabel.setPosition(cc.p(levelbg.getContentSize().width/2,levelbg.getContentSize().height/2));
        levelbg.addChild(levelLabel);

        var killSp = new cc.Sprite(res.Jisha_png);
        killSp.setPosition(cc.p(levelbg.getPositionX(),levelbg.getPositionY() - levelbg.getContentSize().width/2 -  offY));
        uidiban.addChild(killSp);

        var killbg = new cc.Sprite(res.Shuzhibanzi_png);
        killbg.setPosition(cc.p(killSp.getPositionX(),killSp.getPositionY() - killSp.getContentSize().width/2 -  offY));
        uidiban.addChild(killbg);

        var killLabel = new cc.LabelAtlas("0/8",res.Xiegang_shuzhi_png,22,22,'/');
        killLabel.setAnchorPoint(cc.p(0.5,0.5));
        killLabel.setPosition(cc.p(killbg.getContentSize().width/2,killbg.getContentSize().height/2));
        killbg.addChild(killLabel);
        this.killLabel = killLabel;

        var btnoffY = 40;

        var fenshengBtn = new ccui.Button(res.Fenshen_png,res.Fenshen_png,"");
        fenshengBtn.setPressedActionEnabled(true);
        fenshengBtn.setPosition(cc.p(killbg.getPositionX(),killbg.getPositionY() - killbg.getContentSize().width/2 -  15));
        fenshengBtn.addTouchEventListener(this.callback,this);
        uidiban.addChild(fenshengBtn);

        var zhuyeBtn = new ccui.Button(res.Zhuye_png,res.Zhuye_png,"");
        zhuyeBtn.setPressedActionEnabled(true);
        zhuyeBtn.setPosition(cc.p(fenshengBtn.getPositionX(),fenshengBtn.getPositionY() - fenshengBtn.getContentSize().width/2 -  btnoffY));
        zhuyeBtn.addTouchEventListener(this.callback,this);
        uidiban.addChild(zhuyeBtn);

        var chonglaiBtn = new ccui.Button(res.Chonglai_png,res.Chonglai_png,"");
        chonglaiBtn.setPressedActionEnabled(true);
        chonglaiBtn.setPosition(cc.p(zhuyeBtn.getPositionX(),zhuyeBtn.getPositionY() - zhuyeBtn.getContentSize().width/2 -  btnoffY));
        chonglaiBtn.addTouchEventListener(this.callback,this);
        uidiban.addChild(chonglaiBtn);

        var shengyinBtn = new ccui.Button(res.Shengyin_kai_png,res.Shengyin_kai_png,"");
        shengyinBtn.setPressedActionEnabled(true);
        shengyinBtn.setPosition(cc.p(chonglaiBtn.getPositionX(),chonglaiBtn.getPositionY() - chonglaiBtn.getContentSize().width/2 -  btnoffY));
        shengyinBtn.addTouchEventListener(this.callback,this);
        uidiban.addChild(shengyinBtn);

        var bangzhuBtn = new ccui.Button(res.Bangzhu_png,res.Bangzhu_png,"");
        bangzhuBtn.setPressedActionEnabled(true);
        bangzhuBtn.setPosition(cc.p(shengyinBtn.getPositionX(),shengyinBtn.getPositionY() - shengyinBtn.getContentSize().width/2 -  btnoffY));
        bangzhuBtn.addTouchEventListener(this.callback,this);
        uidiban.addChild(bangzhuBtn);

        this.fenshengBtn = fenshengBtn;
        this.bangzhuBtn  = bangzhuBtn;
        this.chonglaiBtn = chonglaiBtn;
        this.shengyinBtn = shengyinBtn;
        this.zhuyeBtn    = zhuyeBtn;

        this.musicFalg = MusicHelper.getMusicFalg();
        this.musicUse();


        return true;
    },
    musicUse:function(){
        if (this.musicFalg) {
            this.shengyinBtn.loadTextureNormal(res.Shengyin_kai_png);
            this.musicFalg = false;
            MusicHelper.resumeMusic();
        } else {
            this.shengyinBtn.loadTextureNormal(res.Shengyin_guan_png);
            this.musicFalg = true;
            MusicHelper.pauseMusic();
        }
    },
    unEnableFenshengBtn:function(){
        this.fenshengBtn.setColor(cc.color(120,120,120));
        this.fenshengBtn.setTouchEnabled(false);
    },
    updateInfo:function(){

        var parent = this.getParent();

        this.killLabel.setString(""+ parent._killEnemyN +"/"+parent._enemyN);

    },
    callback:function(sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_ENDED:

                MusicHelper.playEffect(res.Click_mp3);
                if (sender == this.chonglaiBtn) {
                    cc.director.runScene(new GameScene());
                }
                //////////////////
                else if (sender == this.shengyinBtn) {
                    this.musicUse();
                   // this.musicFalg = !this.musicFalg;
                }
                //////////////////
                else if (sender == this.bangzhuBtn) {
                    var tipsLayer = new TipsLayer();
                    // var tipsLayer = new WinDialog();
                    this.addChild(tipsLayer,10);
                }
                ///////////////////
                else if(sender == this.zhuyeBtn){
                    cc.director.runScene(new MainMenuScene());
                }
                ///////////////////
                else if(sender == this.fenshengBtn){
                    this.getParent().addNag();
                }
        }
    }
})