/**
 * Created by ZZH on 2016/4/12.
 */

var LevelLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

        var size = cc.winSize;

        var bg = new cc.Sprite(res.H3_png);
        bg.attr({
            anchorX : 0,
            anchorY : 0
        })

        this.addChild(bg,1);

        var bgSize = bg.getContentSize();

        var levelLogo = new cc.Sprite(res.LevelLogo_png);
        levelLogo.x = bgSize.width/2;
        levelLogo.y = bgSize.height -40;
        bg.addChild(levelLogo,1);

        var originP = cc.p(60,480);

        var lockN = DataHelper.getMaxLevel();

        for (var i = 0; i< 5;i++){
            for(var j=0 ;j< 6;j++){
                var n = j + i*6 +1;
                // 是否锁住
                if(lockN >= n)
                {
                    var bnt = new ccui.Button(res.Xg1_png,res.Xg1_png);
                    bnt.setPressedActionEnabled(false);
                    bnt.x=originP.x + j*80;
                    bnt.y=originP.y - i*80;
                    bnt.number = n;
                    bnt.addTouchEventListener(this.callback ,this);
                    bg.addChild(bnt,1);

                    var label = new cc.LabelAtlas(""+(j + i*6 +1),res.Suzi1_png,15,22,'0');
                    label.setPosition(cc.p(bnt.x - label.width/2,bnt.y - label.height/2));
                    bg.addChild(label,2);

                }else{

                    var lock = new cc.Sprite(res.Xg2_png);
                    lock.x=originP.x + j*80;
                    lock.y=originP.y - i*80;
                    bg.addChild(lock,2);
                }

            }
        }

        // 隐藏选关界面
        var backBtn = new ccui.Button(res.BackBtn_png,res.BackBtn_png);
        backBtn.x = bgSize.width/2;
        backBtn.y = 75;
        backBtn.addTouchEventListener(function(sender, type){
            if(ccui.Widget.TOUCH_ENDED == type){
                // 显示按钮
                //this.getParent().getParent().getParent().start.runAction(cc.fadeIn(0.3));
                //this.getParent().getParent().getParent().sound.runAction(cc.fadeIn(0.3));
                MusicHelper.playEffect(res.Click_mp3);
                var parent =  this.getParent().getParent().getParent();
                parent.start.runAction(cc.sequence(cc.callFunc(function(){
                    parent.start.setVisible(true);
                },parent),cc.fadeIn(0.3)));
                parent.sound.runAction(cc.sequence(cc.callFunc(function(){
                    parent.sound.setVisible(true);
                },parent),cc.fadeIn(0.3)));

                parent.start.setTouchEnabled(true);
                parent.sound.setTouchEnabled(true);
                // 移除level层
                this.getParent().getParent().removeFromParent();

            }
        } ,this);
        bg.addChild(backBtn,2);

        return true;
    },
    callback:function(sender, type){
        switch (type){
            case ccui.Widget.TOUCH_BEGAN:
                var xg3Sprite = new cc.Sprite(res.Xg3_png);
                xg3Sprite.x = xg3Sprite.width/2 +2;
                xg3Sprite.y = xg3Sprite.height/2 +2;
                sender.addChild(xg3Sprite,1,111);

                MusicHelper.playEffect(res.Click_mp3);
                cc.log(""+ sender.number);
                // 记录关卡
                DataHelper.setCurrentLevel(sender.number);
                cc.director.runScene(new GameScene());
                MusicHelper.playMusic(res.Gamebg_mp3,true);

                break;
            case ccui.Widget.TOUCH_ENDED:
                sender.getChildByTag(111).removeFromParent();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                sender.getChildByTag(111).removeFromParent();
                break;
        }
    }

})
