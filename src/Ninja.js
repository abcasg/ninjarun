/**
 * Created by ZZH on 2016/4/14.
 */

var Ninja = cc.Sprite.extend({

    _speed: null,   // 速度
    _isAnimateMoved: false, // 是否在移动
    _dir: null,     // 方向
    _preDir: null,  // 之前方向
    _replicationFalg: false,
    _die: false,
    _IntersectsThing: null, // 相交的物体
    things: null,
    killAllEnemyFalg: false, // 杀掉所有敌人
    ctor: function () {
        this._super("#na_normal_1.png");
        this._IntersectsThing = [];
        this._speed = Config.ROLE_MOVE_SPEED;
        var tileMap = MapHelper.getMap();
        this.setAnchorPoint(cc.p(0.5, (tileMap.getTileSize().height / 2) / this.getContentSize().height));

        this.runAction(AnimateHelper.getAnimateByNameForever("na_normal"));
        this.scheduleUpdate();

        return true;
    },
    setDir: function (dir) {
        this._dir = dir;
    },
    getDir: function () {
        return this._dir;
    },
    // 检查碰撞物品
    checkHit: function () {

        if (this.things) {
            for (var i = 0; i < this.things.length; i++) {
                var t = this.things[i];
                if (!t) {
                    continue;
                }

                var thingRect = t.getHitRect(this);
                var niijaRect = this.getBoundBox();

                if ((null == thingRect) || (null == niijaRect)) {
                    continue;
                }

                if (t.isDie()) {
                    continue;
                }

                // 是否相交
                var contain = cc.rectIntersectsRect(thingRect, niijaRect);

                if (!contain) {
                    // 在相交的物体数组中才会调用 notRectIntersectsRect 回调
                    for (var k = 0; k < this._IntersectsThing.length; k++) {
                        if (this._IntersectsThing[k] === t) {
                            t.notRectIntersectsRect(this);
                            this._IntersectsThing.splice(k, 1);
                            break;
                        }
                    }
                }

                var eName = t._name;
                if (contain || (this.killAllEnemyFalg && (eName.indexOf("emy") != -1 || eName == "bhp" || eName == "bt"))) {
                    if (this.killAllEnemyFalg) {
                        t.doHit(this, true);
                    } else {
                        t.doHit(this);
                    }

                    // 回调完成特定的事件
                    var callFun = t.doThing();
                    if (callFun) {
                        var flag = callFun(this);
                    }
                }

            }
        }

        // 检查分身是否与分身重合
        if (this._replicationFalg) {
            var ninjaReplication = this.getParent()._ninjaReplication;
            for (var i = 0; i < ninjaReplication.length; i++) {
                if (this === ninjaReplication[i]) {
                    continue;
                }
                var p1 = this.getPosition();
                var p2 = ninjaReplication[i].getPosition();
                if (p1.x === p2.x && p1.y === p2.y && !ninjaReplication[i]._die && !this._die) {
                    ninjaReplication[i].die();
                    this.die();

                }
            }
        }
    },
    // 添加相交的物体
    addIntersectsThing: function (obj) {
        this._IntersectsThing.push(obj);
    },


    // 自杀
    killSelf: function () {
        var gameLayer = this.getParent();

        var layer = new BaseLayer();
        var bg = new cc.Sprite(res.ZiSha_png);
        bg.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        layer.addChild(bg, 1);

        var sp = new cc.Sprite("#jz_1.png");
        var action = cc.sequence(cc.delayTime(0.5), AnimateHelper.getAnimateByName("jz_die"), cc.callFunc(function () {
            this.killAllEnemy();

        }, this));
        sp.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 120));
        sp.setAnchorPoint(cc.p(0.5, 0));

        var action2 = cc.sequence(cc.delayTime(1.8), cc.callFunc(function () {
            MusicHelper.playEffect(res.Killself_mp3);
        }, this));

        sp.runAction(cc.spawn(action, action2));
        layer.addChild(sp, 2);
        gameLayer.addChild(layer, 10, 123);

    },
    // 是否在一条直线上
    isLine: function (p) {
        var mp = MapHelper.posInMap(p);
        var np = MapHelper.posInMap(this.getPosition());

        if ((mp.x == np.x) || (mp.y == np.y)) {
            return true;
        }

        return false;
    },


    killAllEnemy: function () {
        this.killAllEnemyFalg = true;
        this.getParent().removeChildByTag(123);
        this.getParent()._failedFlag = false;
    },

    getBoundBox: function () {
        var p = this.getPosition();
        var mapTileSize = MapHelper.getMap().getTileSize();
        return cc.rect(p.x - mapTileSize.width / 2 + 2.0, p.y - mapTileSize.height / 2 + 2.0, mapTileSize.width - 4.0, mapTileSize.height - 4.0);
    },
    checkRoad: function () {

        if (this._dir && MapHelper.isRoad(this)) {

            switch (this._dir) {
                case "left":
                    this.setRotation(90);
                    break;
                case "right":
                    this.setRotation(-90);
                    break;
                case "up":
                    this.setRotation(180);
                    break;
                case "down":
                    this.setRotation(0);
                    break;
            }
            this.stopMove();

            return true;
        }

        return false;

    },
    // 死亡
    die: function () {

        if (!this._replicationFalg) {
            this.getParent()._failedFlag = true;
        }
        this._die = true;
        this.stopMove();
        this.unscheduleUpdate();
        this.stopAllActions();


        this.setScale(1.5);
        var action = cc.sequence(AnimateHelper.getAnimateByName("na_die"), cc.callFunc(function () {
            // 如果不是分身
            if (!this._replicationFalg) {
                this.getParent().failed();
            }
            if (this._replicationFalg) {
                this.getParent().removeNag(this);
            }
            this.removeFromParent();
        }, this));
        this.runAction(action);

        if (!this._replicationFalg) {
            MusicHelper.playEffect(res.Nadie_mp3);
        }
    },
    stopMove: function () {
        this._dir = null;
        this._isAnimateMoved = false;
        this.stopAllActions();
        this.runAction(AnimateHelper.getAnimateByNameForever("na_normal"));
    },
    update: function (dt) {
        //this.checkRoad();
        this.checkHit();
        this.updatePosition();

    },
    setAnimateMoved: function (b) {
        this._isAnimateMoved = b;
    },
    isAnimateMoved: function () {
        return this._isAnimateMoved;
    },
    // 旋转的移动
    roateAttackMove: function (dir) {

        if (this._die) {
            return;
        }
        // 在移动时，不可再移动
        if (this._isAnimateMoved) {
            return;
        }

        if (this.checkRoad()) {
            return;
        }

        this._dir = dir;
        this.addRunAsh(dir);
        this._preDir = dir;

        this._isAnimateMoved = true;

        this.stopAllActions();
        var action = AnimateHelper.getAnimateByNameForever("na_run");

        this.runAction(action);

        MusicHelper.playEffect(res.Narun_mp3);
    },
    // 获取相反反向
    getOppositeDirByName: function (name) {
        switch (name) {
            case "up":
                return "down";
            case "down":
                return "up";
            case "left":
                return "right";
            case "right":
                return "left";
        }

    },
    // 添加灰
    addRunAsh: function (dir) {

        // 如果当前方向不跟要移动方向一样
        if (this._preDir) {
            if (!( this.getOppositeDirByName(this._preDir) == dir)) {
                return;
            }
        }

        this.getParent().removeChildByTag(788);
        var ash = new cc.Sprite();
        var size = this.getContentSize();
        var p = this.getPosition();
        this.getParent().addChild(ash, this.getZOrder(), 788);

        var pp = cc.p(0, 0);
        switch (dir) {
            case "left":
                pp = cc.p(p.x + size.width / 2, p.y);
                ash.setRotation(270);
                break;
            case "right":
                pp = cc.p(p.x - size.width / 2, p.y);
                ash.setRotation(90);
                break;
            case "up":
                pp = cc.p(p.x, p.y - size.height / 2);
                ash.setRotation(0);
                break;
            case "down":
                pp = cc.p(p.x, p.y + size.height / 2);
                ash.setRotation(180);
                break;
        }
        ash.setPosition(pp);
        ash.runAction(
            cc.sequence(
                AnimateHelper.getAnimateByName("na_hui"),
                cc.callFunc(function () {
                    ash.removeFromParent()
                }, ash)))
    },

    updatePosition: function () {
        //开始位置移动更新
        if (this._isAnimateMoved && this._dir && !this.checkRoad()) {
            switch (this._dir) {
                case "left":
                    this._speed = -Config.ROLE_MOVE_SPEED;
                    this.x = this.x + this._speed;
                    break;
                case "right":
                    this._speed = Config.ROLE_MOVE_SPEED;
                    this.x = this.x + this._speed;
                    break;
                case "down":
                    this._speed = -Config.ROLE_MOVE_SPEED;
                    this.y = this.y + this._speed;
                    break;
                case "up":
                    this._speed = Config.ROLE_MOVE_SPEED;
                    this.y = this.y + this._speed;
                    break;

            }
        }

    },
    onExit: function () {
        cc.log("ninija onExit");
        this._IntersectsThing.length = 0;
    }

})

