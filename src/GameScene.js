/**
 * Created by ZZH on 2016/4/14.
 */

var GameLayer = cc.Layer.extend({
    _tileMap: null,
    _ninja: null,
    _ninjaReplication: [],
    _startPoint: null,
    _mapThings: [],
    _enemyN: 0,
    _killEnemyN: 0,
    _infoLayer: null,
    _failedFlag: false,
    _touchFlag: false,
    ctor: function () {
        this._super();

        var size = cc.winSize;

        var bg = new cc.Sprite(res.Beijing_jpg);
        bg.setPosition(cc.p(0, 0));
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg, 0);

        this.addTouchListener();

        var infoLayer = new InfoLayer();
        this.addChild(infoLayer, 5);
        this._infoLayer = infoLayer;

        this.updateInfoLayer();

        this.loadMap();
        this.scheduleUpdate();

        return true;
    },

    getNinja: function () {
        return this._ninja;
    },

    update: function (dt) {
        this.checkWin();
        this.checkNag();

    },

    // 检测是否成功
    checkWin: function () {
        if (this._killEnemyN >= this._enemyN) {

            this._ninja.unscheduleUpdate();
            this._ninja.stopAllActions();
            for (var i = 0; i < this._ninjaReplication.length; i++) {
                this._ninjaReplication[i].unscheduleUpdate();
                this._ninjaReplication[i].stopAllActions();
            }

            var winLayer = new WinDialog();
            this.addChild(winLayer, 10);
            this.unscheduleUpdate();

            DataHelper.checkMaxLevel();

        }
    },
    // 失败
    failed: function () {

        this._failedFlag = true;
        // 失败弹窗
        var failedDialog = new FailedDialog();
        this.addChild(failedDialog, 10);
    },
    // 更新信息
    updateInfoLayer: function () {
        this._infoLayer.updateInfo();
    },
    // 加载地图
    loadMap: function () {
        //var tileMap = new cc.TMXTiledMap(res.Level1_tmx);
        var tileMap = new cc.TMXTiledMap(res["Level" + DataHelper.getCurrentLevel() + "_tmx"]);
        this.addChild(tileMap, 1);
        this._tileMap = tileMap;
        MapHelper.setMap(tileMap);

        var fenshengFalg = false;

        var ob = tileMap.getObjectGroup("data").getObjects();

        // 首先添加忍者，避免后续RoadGid 值错误
        for (var i = 0; i < ob.length; i++) {
            var obj = ob[i];
            if (obj["name"] === "na") {
                var ninja = new Ninja();
                this.addChild(ninja, 4);
                this._ninja = ninja;
                this._ninja.setPosition(MapHelper.posInWorldARCenter(cc.p(obj["x"], obj["y"])));
                // 设置不可通过的GID值
                MapHelper.setRoadGid(cc.p(obj["x"], obj["y"]));
                break;
            }
        }

        for (var i = 0; i < ob.length; i++) {
            var obj = ob[i];
            var name = obj["name"];
            var node = null;
            if (name.indexOf("nag") != -1) {
                node = new Nag(obj);
                fenshengFalg = true;
            } else if (name.indexOf("dec") != -1) {
                node = new Goods(obj);
            } else if (name.indexOf("emy") != -1) {
                node = new Enemy(obj);
                // 敌人数量数增加
                this._enemyN++;
            } else if (name === "jz") {
                node = new Jz(obj);
            } else if (name === "wl") {
                node = new Wl(obj);
            } else if (name === "tnl") {
                node = new TwoNl(obj);
            } else if (name === "nl") {
                node = new Nl(obj);
            } else if (name === "fnl") {
                node = new FourNl(obj);
            } else if (name === "ntn") {
                node = new Ntn(obj);
            } else if (name === "pt") {
                node = new Pt(obj);
            } else if (name === "nlt") {
                node = new Nlt(obj);
            } else if (name === "bhp") {
                node = new HpEnemy(obj);
                // 敌人数量数增加
                this._enemyN++;
            } else if (name === "bt") {
                node = new BtEnemy(obj);
                // 敌人数量数增加
                this._enemyN++;
            }

            if (node) {
                this.addChild(node, 3);
                this._mapThings.push(node);
            }

        }

        this._ninja.things = this._mapThings;

        // 屏蔽分身按钮
        if (!fenshengFalg && this._infoLayer) {
            this._infoLayer.unEnableFenshengBtn();
        }

        this.updateInfoLayer();

        // 第一次玩此关,弹出提示框
        if (DataHelper.getCurrentLevel() === DataHelper.getMaxLevel()) {
            var tipsLayer = new TipsLayer();
            this.addChild(tipsLayer, 10);
        }

    },
    // 添加分身
    addNag: function () {
        for (var i = 0; i < this._mapThings.length; i++) {
            var t = this._mapThings[i];
            if (t != null && "nag" === t._name) {

                if (t.isIntersectsRectRole(this._ninja)) {
                    continue;
                }
                t.doSelfHit();
                var ninja = new Ninja();
                var tp = t.getPosition();
                ninja.setPosition(tp);
                ninja.setOpacity(127);
                this.addChild(ninja, 4);
                ninja._replicationFalg = true; // 是分身
                this._mapThings[i] = null;
                // this._mapThings.splice(i, 1);
                this._ninjaReplication.push(ninja);
                ninja.things = this._mapThings;

                MusicHelper.playEffect(res.FsShow_mp3);

            }
        }

        // 分身按钮不再可用
        //this._infoLayer.unEnableFenshengBtn();
    },

    checkNag: function () {

        // 检查分身是否与本体重合
        var ninjaP = this._ninja.getPosition();
        for (var i = 0; i < this._ninjaReplication.length; i++) {
            var p = this._ninjaReplication[i].getPosition();
            if (p.x == ninjaP.x && p.y == ninjaP.y) {
                this.removeNag(this._ninjaReplication[i]);
                break;
            }
        }
    },
    // 移除分身
    removeNag: function (nag) {
        for (var i = 0; i < this._ninjaReplication.length; i++) {
            if (this._ninjaReplication[i] === nag) {
                this._ninjaReplication[i].removeFromParent();
                this._ninjaReplication.splice(i, 1);
                break;
            }
        }
    },
    // 点击事件
    addTouchListener: function () {

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded,
            onTouchCancelled: this.onTouchCancelled
        }, this);
    },


    onTouchBegan: function (touch, event) {
        cc.log("onTouchBegan");

        var tag = event.getCurrentTarget();
        if (tag._touchFlag || tag._failedFlag) {
            return;
        }


        var pos = touch.getLocation();
        tag._startPoint = pos;

        return true;
    },
    onTouchMoved: function (touch, event) {

        // cc.log("onTouchMoved");
        var tag = event.getCurrentTarget();

        if (tag._touchFlag || tag._failedFlag) {
            return;
        }


        var pos = touch.getLocation();
        var currentP = cc.p(pos.x - tag._startPoint.x, pos.y - tag._startPoint.y);
        var distance = cc.pDistance(currentP, cc.p(0, 0));

        if (distance < 60) {
            return;
        }

        // 方向
        var dir = null;
        var absX = Math.abs(currentP.x);
        var absY = Math.abs(currentP.y);

        if (absX > absY) {
            if (currentP.x < 0) {
                dir = "left";
            } else {
                dir = "right";
            }
        } else {
            if (currentP.y < 0) {
                dir = "down";
            } else {
                dir = "up";
            }
        }
        //cc.log(dir);
        tag._startPoint = pos;


        if (dir) {
            // 如果有分身，则分身开始移动
            for (var i = 0; i < tag._ninjaReplication.length; i++) {
                tag._ninjaReplication[i].roateAttackMove(dir);
            }
            tag._ninja.roateAttackMove(dir);
        }
    },
    onTouchEnded: function (touch, event) {
        var tag = event.getCurrentTarget();
        tag._touchFlag = false;
    },
    onTouchCancelled: function (touch, event) {
        var tag = event.getCurrentTarget();
        tag._touchFlag = false;
    },
    onExit: function () {

        // 清除内存引用
        this._ninja.removeFromParent();
        this._tileMap.removeFromParent();

        for (var i = 0; i < this._mapThings.length; i++) {
            if (!this._mapThings[i]) {
                continue;
            }
            this._mapThings[i].removeFromParent();
        }
        this._mapThings.length = 0;

        for (var i = 0; i < this._ninjaReplication.length; i++) {
            if (!this._ninjaReplication[i]) {
                continue;
            }
            this._ninjaReplication[i].removeFromParent();
        }

        this._ninjaReplication.length = 0;
        MapHelper.setMap(null);
    }

})


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
