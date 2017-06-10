/**
 * Created by ZZH on 2016/4/14.
 */

var Goods = cc.Sprite.extend({
    _die: false,
    _name: null,
    _pro: null,
    dir: ["up", "down", "left", "right"],
    // pro:属性值
    ctor: function (pro) {

        var fixdN = AnimatesData[pro["name"]]["FixN"];
        var sindexN = AnimatesData[pro["name"]]["sindex"];
        // 如果有带格式
        var str = "";
        if (fixdN) {
            for (var i = 0; i < fixdN - 1; i++) {
                str = str + "0";
            }
        }
        var indexN = 1;
        if (sindexN) {
            indexN = sindexN;
        }

        this._super("#" + AnimatesData[pro["name"]]["path"] + str + indexN + ".png");
        this._name = pro["name"];
        this._pro = pro;
        //cc.log("khghkhgk :" + pro["name"]);
        var tileMap = MapHelper.getMap();
        if (pro["any"] === "0") {
            this.setAnchorPoint(cc.p(0.5, tileMap.getTileSize().height / 2 / this.getContentSize().height));
        } else if (pro["any"] === "1") {
            this.setAnchorPoint(cc.p(0.5, 1 - tileMap.getTileSize().height / 2 / this.getContentSize().height));
        }

        this.setPosition(MapHelper.posInWorldARCenter(cc.p(pro["x"], pro["y"])));
        this.runAction(AnimateHelper.getAnimateByNameForever(this._name));

        return true;
    },
    notRectIntersectsRect: function () {
    },
    getHitRect: function () {
        var p = this.getPosition();
        var mapTileSize = MapHelper.getMap().getTileSize();
        return cc.rect(p.x - mapTileSize.width / 2 + 2, p.y - mapTileSize.height / 2 + 2, mapTileSize.width - 4, mapTileSize.height - 4);
    },
    doHit: function (role) {

        if (this._die) {
            return;
        }

        this.stopAllActions();

        this.runAction(AnimateHelper.getAnimateByName(this._name + "_die"));
        //cc.log("doHit");

        this._die = true;

        MusicHelper.playEffect(res.Darts_mp3);
        if (this._name == "dec_yuantong" || this._name == "dec_godeng" || this._name == "dec_badeng")//这三种灯的时候
        {
            MusicHelper.playEffect(res.Fall_mp3);
        }
    },
    isDie: function () {
        return this._die;
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
    getDirByRoate: function (roate) {
        if (roate < 0) {
            roate = 360 + roate;
        }
        if (0 == roate) {
            return "up";
        } else if (180 == roate) {
            return "down"
        } else if (270 == roate) {
            return "left"
        } else if (90 == roate) {
            return "right"
        }
    },
    getRoateByName: function (name) {
        var roate = 0;
        switch (name) {
            case "up":
                roate = 0;
                break;
            case "down":
                roate = 180;
                break;
            case "left":
                roate = 270;
                break;
            case "right":
                roate = 90;
                break;
            default:
                roate = 0;
                break
        }
        return roate;
    },
    getRoateByIndex: function (index) {
        return this.getRoateByName(this.dir[index]);
    },
    setThingRoate: function (index) {
        var index = parseInt(this._pro["dir"]) - 1;
        this.setRotation(this.getRoateByIndex(index));
    },
    doThing: function () {
        return null;
    },
    setSelfRoate: function () {

    }

})

// 分身
var Nag = Goods.extend({
    ctor: function (pro) {
        this._super(pro);
    },
    doHit: function (role) {
    },
    doSelfHit: function () {
        this.stopAllActions();
        var action = cc.sequence(
            AnimateHelper.getAnimateByName(this._name + "_die"),
            cc.callFunc(function () {
                this.removeFromParent();
            }, this)
        );
        this.runAction(action);
    },
    // 判断是不是与主角矩形相交
    isIntersectsRectRole: function (role) {
        var thingRect = this.getHitRect();
        var niijaRect = role.getBoundBox();

        return cc.rectIntersectsRect(thingRect, niijaRect);
    }
})

// 卷轴
var Jz = Goods.extend({
    ctor: function (pro) {
        this._super(pro);
    },
    doHit: function (role) {
        this.getParent()._failedFlag = true;
        this.stopAllActions();
        this.getParent().getNinja().killSelf();
        this.removeFromParent();

        this._die = true;
    }
})

// 摇杆
var Nlt = Goods.extend({
    _licSp: null,
    _killState: false,
    _alwaysKillFalg: false, // 记录是否直在碰撞
    nldir: null,
    _changDirFlag: false, // 记录方向是否改变
    _licSpRoate: 0,
    _roate: 0,
    ctor: function (pro) {
        this._super(pro);
        this._licSp = new cc.Sprite(res.Kaiguan_png);
        this._licSp.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height / 2 + 8));
        this._licSp.setAnchorPoint(cc.p(0.5, 0.2));
        this.addChild(this._licSp, 10);

        var index1 = parseInt(this._pro["dir"]) - 1;
        var index2 = parseInt(this._pro["dir1"]) - 1;

        this._roate = this.getRoateByIndex(index1);
        this._licSpRoate = this.getRoateByIndex(index2);

        this.setRotation(this._roate);
        this._licSp.setRotation(this._licSpRoate - this._roate);

    },
    doHit: function (role) {
        // 不是分身
        //if (role._replicationFalg) {
        //    return;
        //}
        if (!role.isAnimateMoved()) {
            this._alwaysKillFalg = true;
        }

        // 避免矩形相交，多次受伤
        if (this._killState) {
            return;
        }
        this._killState = true;
        role.addIntersectsThing(this);

        this.roateNail(role);

    },
    // 旋转所有摇杆
    roateAllLicSp: function (role, roate) {
        for (var i = 0; i < role.things.length; i++) {
            if (!role.things[i]) {
                continue;
            }
            if (role.things[i]._name == "nlt") {
                role.things[i].roateLicSp(role);
            }
        }
    },
    roateLicSp: function (role) {
        this._licSp.stopAllActions();
        this._licSp.runAction(cc.rotateTo(0.2, this.getRoateByName(role.getDir()) - this.getRotation()));

    },
    roateNail: function (role) {
        var rotate = this.getRoateByName(role.getDir());
        var tmp = rotate - this._licSpRoate;
        this._licSpRoate = rotate;
        var thinges = role.things;
        for (var i = 0; i < thinges.length; i++) {
            if (!thinges[i]) {
                continue;
            }
            thinges[i].setSelfRoate(tmp);
        }
        this.roateAllLicSp(role, tmp);
    },
    // 不相交
    notRectIntersectsRect: function (role) {

        if (this._alwaysKillFalg) {
            this.roateNail(role);
        }
        this._alwaysKillFalg = false;
        this._killState = false;
    }
})

// 炸弹
var Ntn = Goods.extend({
    ctor: function (pro) {
        this._super(pro);
        // 设置为可通行
        MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));
        this.setRotation(0);
        return true;
    },
    doHit: function (role) {
        if (this._die) {
            return;
        }
        this.stopAllActions();
        this.runAction(cc.sequence(AnimateHelper.getAnimateByName(this._name + "_die"), cc.callFunc(function () {
            this.removeFromParent();
        }, this)));
        role.die();
        this._die = true;

        MusicHelper.playEffect(res.Ntnbom_mp3);
    }
})

// 箭头
var Pt = Goods.extend({
    _state: false,
    ctor: function (pro) {
        this._super(pro);
        // 设置为可通行
        MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));
        this.setThingRoate();
        return true;
    },
    getHitRect: function (role) {
        if (this._die) {
            return null;
        }
        var p = this.getPosition();
        var offxy = 0.1;
        return cc.rect(p.x - offxy, p.y - offxy, offxy * 2, offxy * 2);
    },
    doHit: function (role) {
        if (this._state) {
            return;
        }
        this._state = true;

        // 添加到相交物体中
        role.addIntersectsThing(this);
        role.setPosition(this.getPosition());
        if (!this._pro["dir"]) {
            role.setDir("up");
        } else {
            role.setDir(this.dir[parseInt(this._pro["dir"]) - 1]);
        }
    },
    // 不相交
    notRectIntersectsRect: function () {
        this._state = false;
    },
})

// 钉子
var Nl = Goods.extend({
    nldir: "up",
    fannldir: "down",
    _roate: 0,
    ctor: function (pro) {
        this._super(pro);

        if (pro["dir"]) {
            var index = parseInt(pro["dir"]) - 1;
            this.nldir = this.dir[index];
            this._roate = this.getRoateByIndex(index);
            this.setRotation(this._roate);
            this.fannldir = this.getOppositeDirByName(this.nldir);

        }

    },
    getHitRect: function (role) {

        if (this._die) {
            return null;
        }

        if (role.getDir() !== this.fannldir) {
            return null;
        }
        var p = this.getPosition();
        var mapTileSize = MapHelper.getMap().getTileSize();
        var rect = null;
        var addValue = 2;
        // 根据钉子的方向来决定碰撞矩形
        switch (this.nldir) {
            case "up":
                rect = cc.rect(p.x - mapTileSize.width / 2, p.y + addValue, mapTileSize.width, mapTileSize.height / 2);
                break;
            case "down":
                rect = cc.rect(p.x - mapTileSize.width / 2, p.y - mapTileSize.height / 2 - addValue, mapTileSize.width, mapTileSize.height / 2);
                break;
            case "left":
                rect = cc.rect(p.x - mapTileSize.width / 2 - addValue, p.y - mapTileSize.height / 2, mapTileSize.width / 2, mapTileSize.height);
                break;
            case "right":
                rect = cc.rect(p.x + addValue, p.y - mapTileSize.height / 2, mapTileSize.width / 2, mapTileSize.height);
                break;
        }
        return rect;
    },
    doHit: function (role) {
        if (this._die) {
            return;
        }
        role.die();
    },
    // 旋转
    setSelfRoate: function (rotate) {
        this.stopAllActions();
        this._roate = this._roate + rotate;
        this._roate = parseInt(this._roate % 360);
        this.runAction(cc.rotateTo(0.2, this._roate));
        this.nldir = this.getDirByRoate(this._roate);
        this.fannldir = this.getOppositeDirByName(this.nldir);
        cc.log("this._roate: " + this._roate + "this.nldir :" + this.nldir);
    }
})

// 双面钉子
var TwoNl = Goods.extend({
    nldir: "up",
    fannldir: "down",
    _roate: 0,
    selfGid: 0,
    ctor: function (pro) {
        this._super(pro);
        // 设置为可通行
        //MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));
        this._selfGid = MapHelper.getTileGIDAt(cc.p(this._pro["x"], this._pro["y"]));
        if (pro["dir"]) {
            var index = parseInt(pro["dir"]) - 1;
            this.nldir = this.dir[index];
            this._roate = this.getRoateByIndex(index);
            this.setRotation(this._roate);
            this.fannldir = this.getOppositeDirByName(this.nldir);

        }
        return true;
    },
    getHitRect: function (role) {

        // 跟忍者不在同一方向或相对方向上，当成砖块来处理
        if (!(role.getDir() === this.nldir || role.getDir() === this.fannldir)) {
            // 设置为不可通行
            MapHelper.setTileGid(this._selfGid, cc.p(this._pro["x"], this._pro["y"]));
            var p = this.getPosition();
            var mapTileSize = MapHelper.getMap().getTileSize();
            return cc.rect(p.x - mapTileSize.width / 2 + 2, p.y - mapTileSize.height / 2 + 2, mapTileSize.width - 4, mapTileSize.height - 4);
        } else {
            // 设置为可通行
            MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));
            var rect = null;
            var addValue = 0;
            var p = this.getPosition();
            var mapTileSize = MapHelper.getMap().getTileSize();
            if (this.nldir === "up" || this.nldir === "down") {
                rect = cc.rect(p.x - mapTileSize.width / 2, p.y - mapTileSize.height / 2 - addValue,
                    mapTileSize.width, mapTileSize.height + addValue * 2);
            } else if (this.nldir === "left" || this.nldir === "right") {
                rect = cc.rect(p.x - mapTileSize.width / 2 - addValue, p.y - mapTileSize.height / 2,
                    mapTileSize.width + addValue * 2, mapTileSize.height);
            }
            return rect;
        }

    },
    doHit: function (role) {
        if (this._die) {
            return;
        }

        var dir = role.getDir();
        // 不在一条直线上
        if (!(dir === this.nldir || dir === this.fannldir)) {
            return null;
        }

        role.die();
        this._die = true;
    },
    setSelfRoate: function (rotate) {
        this.stopAllActions();
        this._roate = this._roate + rotate;
        this._roate = parseInt(this._roate % 360);
        this.runAction(cc.rotateTo(0.2, this._roate));
        this.nldir = this.getDirByRoate(this._roate);
        this.fannldir = this.getOppositeDirByName(this.nldir);

    }
})

// 四面钉子
var FourNl = Goods.extend({
    ctor: function (pro) {
        this._super(pro);
        // 设置为可通行
        MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));
        return true;
    },
    doHit: function (role) {
        if (this._die) {
            return;
        }
        role.die();
        this._die = true;
    },
    setSelfRoate: function (rotate) {
        this.stopAllActions();
        this.runAction(cc.rotateTo(0.2, this.getRotation() + 180));
    }
})
// 墙
var Wl = Goods.extend({
    _attackN: 0,    // 接触的次数
    _selfGid: 0,
    ctor: function (pro) {
        this._super(pro);
    },
    doHit: function (role) {
        if (!role.isAnimateMoved()) {
            return null;
        }
        // 第一次接触
        if (this._attackN === 0) {
            this._attackN++;
            // role.stopMove();

            // 目的是移动的时候有一个停顿的时刻，解决直接穿过墙
            //this.getParent()._touchFlag = true;
            //this.scheduleOnce(function () {
            //    this.getParent()._touchFlag = false;
            //}.bind(this), 0.2);
        }
        // 第二次接触
        else if (this._attackN === 1) {
            this._die = true;
            this.stopAllActions();
            var action = cc.sequence(
                AnimateHelper.getAnimateByName(this._name + "_die"), cc.callFunc(function () {
                    this.removeFromParent();
                }, this)
            );
            this.runAction(action);
            // 设置为可通行
            MapHelper.setTileRoadGid(cc.p(this._pro["x"], this._pro["y"]));

            MusicHelper.playEffect(res.Wallbom_mp3);
        }

    },
    getHitRect: function (role) {

        if (this._die) {
            return null;
        }

        var p = this.getPosition();
        var mapTileSize = MapHelper.getMap().getTileSize();
        var rect = null;
        var addValue = 2;

        // 离开的时候改变矩形框的大小
        if (this._attackN === 1) {
            return cc.rect(p.x - mapTileSize.width / 2 - addValue, p.y - mapTileSize.height / 2 - addValue,
                mapTileSize.width + addValue * 2, mapTileSize.height + addValue * 2);
        }
        // 根据忍者的相对移动方向来改变触发事件的矩形框
        switch (role.getDir()) {
            case "up":
                rect = cc.rect(p.x - mapTileSize.width / 2, p.y - mapTileSize.height / 2 - addValue, mapTileSize.width, mapTileSize.height / 2);
                break;
            case "down":
                rect = cc.rect(p.x - mapTileSize.width / 2, p.y + addValue, mapTileSize.width, mapTileSize.height / 2);
                break;
            case "left":
                rect = cc.rect(p.x + addValue, p.y - mapTileSize.height / 2, mapTileSize.width / 2, mapTileSize.height)
                break;
            case "right":
                rect = cc.rect(p.x - mapTileSize.width / 2 - addValue, p.y - mapTileSize.height / 2, mapTileSize.width / 2, mapTileSize.height);
                break;
        }
        return rect;
    }
    //,
    //doThing: function () {
    //    return function (obj) {
    //
    //        obj.stopMove();
    //        return false;
    //    }.bind(this);
    //}
})

//////////////////////////////////////////////////////////////////////////////////////////////
var Enemy = cc.Sprite.extend({
    _name: null,
    _min: null,
    _max: null,
    _speed: null,
    _flipX: null,
    _fly: false,
    ctor: function (pro) {
        this._super("#" + AnimatesData[pro["name"]]["path"] + "1.png");
        this._name = pro["name"];

        this._min = MapHelper.xFromWidIndex(parseInt(pro["min"]));
        this._max = MapHelper.xFromWidIndex(parseInt(pro["max"]));

        this._speed = -parseFloat(pro["speed"]);

        this._flipX = parseInt(pro["flipX"]);

        // 上下运动
        this._fly = parseInt(pro["fly"]);

        var h = MapHelper.getMap().getMapSize().height - 1;
        if (this._fly === 1) {
            this._max = MapHelper.xFromWidIndex(h - parseInt(pro["min"]));
            this._min = MapHelper.xFromWidIndex(h - parseInt(pro["max"]));
        }


        if (this._flipX) {
            this.setFlippedX(true);
            this._speed = -this._speed;
        }
        this.scheduleUpdate();

        this.setPosition(MapHelper.posInWorldARCenter(cc.p(pro["x"], pro["y"])));

        this.palyStateAction();
        return true;
    },
    palyStateAction: function () {
        this.runAction(AnimateHelper.getAnimateByNameForever(this._name + "_run"));
    },
    getHitRect: function () {
        var p = this.getPosition();
        var mapTileSize = MapHelper.getMap().getTileSize();
        return cc.rect(p.x - mapTileSize.width / 2 + 2, p.y - mapTileSize.height / 2 + 2, mapTileSize.width - 4, mapTileSize.height - 4);
    },
    update: function (dt) {

        if (this._die) {
            return;
        }

        if (!this._speed) {
            return;
        }

        var mapTileSize = MapHelper.getMap().getTileSize();
        var ep = this.getPosition();

        if (this._fly === 1) {
            // 从上到下
            if (ep.y - mapTileSize.height / 2 > this._max) {
                this._speed = -this._speed;
                //this.setFlippedX(false);
            }
            // 从下到上
            else if (ep.y - mapTileSize.height / 2 < this._min) {
                this._speed = -this._speed;
                // this.setFlippedX(true);
            }

            this.setPosition(cc.p(ep.x, ep.y + this._speed));
        } else {
            // 从左到右
            if (ep.x - mapTileSize.width / 2 > this._max) {
                this._speed = -this._speed;
                this.setFlippedX(false);
            }
            // 从右到左
            else if (ep.x - mapTileSize.width / 2 < this._min) {
                this._speed = -this._speed;
                this.setFlippedX(true);
            }

            this.setPosition(cc.p(ep.x + this._speed, ep.y));

        }


    },
    setSelfRoate: function (role) {
    },
    notRectIntersectsRect: function () {
    },
    // 受到攻击时的白光
    whiteLight: function () {
        var sp = new cc.Sprite(res.Baiguang_png);
        var arr = [true, false];
        var bol = arr[Math.floor(Math.random() * arr.length)];

        if (bol) {
            sp.setFlippedX(true);
        }


        var action = cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            sp.removeFromParent();
        }, sp));
        var size = this.getContentSize();
        sp.setPosition(cc.p(size.width / 2, size.height / 2));
        sp.setScale(0.4);
        sp.runAction(action);
        this.addChild(sp);
    },

    doHit: function (role) {

        if (this._die) {
            return;
        }

        this.whiteLight();

        this.stopAllActions();
        if (this._fly === 1) {
            this.runAction(cc.sequence(AnimateHelper.getAnimateByName("emy_die"), cc.callFunc(
                function () {
                    this.setVisible(false);
                }, this
            )))

        } else {
            this.runAction(AnimateHelper.getAnimateByName("emy_die"));
        }

        if (this.getParent()) {
            this.getParent()._killEnemyN++;
            this.getParent().updateInfoLayer();
        }

        this._die = true;

        MusicHelper.playEffect(res.Killemy_mp3);

    },
    isDie: function () {
        return this._die;
    },
    doThing: function () {
        return null;
    }
})

// 羊
var BtEnemy = Enemy.extend({
        _killN: 0,  // 受伤次数
        _role: null, // 保存忍者对象
        ctor: function (pro) {
            this._super(pro);

            this._role = [];
            return true;
        },
        palyStateAction: function () {
            this.runAction(AnimateHelper.getAnimateByNameForever(this._name));
        },
        doHit: function (role, mustDie) {

            if (this._die) {
                return;
            }
            // 如果在角色数组中，则不再受伤
            for (var i = 0; i < this._role.length; i++) {
                if (this._role[i] === role) {
                    return;
                }
            }
            this._role.push(role);

            this.whiteLight();
            this._killN++;
            // 添加到相交物体中
            role.addIntersectsThing(this);
            cc.log("_replicationFalg:" + role._replicationFalg);
            // 同时受伤两次时死亡
            if (this._killN >= 2 || mustDie) {
                this.stopAllActions();
                this.runAction(AnimateHelper.getAnimateByName("emy_die"));
                if (this.getParent()) {
                    this.getParent()._killEnemyN++;
                    this.getParent().updateInfoLayer();
                }
                this._die = true;
                MusicHelper.playEffect(res.Killemy_mp3);
            }


        },
        // 不相交
        notRectIntersectsRect: function (role) {
            this._killN = 0;
            // 移除角色
            for (var i = 0; i < this._role.length; i++) {
                if (this._role[i] === role) {
                    this._role.splice(i, 1);
                    break;
                }
            }
        }
    }
)

// 牛
var HpEnemy = Enemy.extend({

    _hpbar: null,
    _addper: null,
    _killvalue: null,
    _hp: null,
    _killState: false,
    ctor: function (pro) {
        this._super(pro);

        this._hp = parseFloat(pro["hp"]);
        this._killvalue = parseFloat(pro["kill"]);
        this._addper = parseFloat(pro["addper"]);

        // 血量条
        this._hpbar = new ccui.LoadingBar();
        //loadingBar.setName("LoadingBar");
        this._hpbar.loadTexture(res.Hp_png);
        this._hpbar.setPercent(this._hp);
        this._hpbar.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height + 5));
        this.addChild(this._hpbar);

        this.schedule(this.addHp, 0.7);
        return true;
    },
    addHp: function () {
        this._hpbar.setPercent((this._hpbar.getPercent() / 100 * this._hp + this._addper) / this._hp * 100);
    },
    palyStateAction: function () {
        this.runAction(AnimateHelper.getAnimateByNameForever(this._name));
    },
    doHit: function (role, mustDie) {

        if (this._die) {
            return;
        }
        // 避免矩形相交，多次受伤
        if (this._killState) {
            return;
        }
        // 受伤状态
        this._killState = true;
        this.whiteLight();
        role.addIntersectsThing(this);
        this._hpbar.setPercent((this._hpbar.getPercent() / 100 * this._hp - this._killvalue) / this._hp * 100);
        // this._die = true;

        var hp = this._hpbar.getPercent() / 100 * this._hp;

        // 死亡
        if (hp <= 0 || mustDie) {
            this.unscheduleAllCallbacks();
            this.stopAllActions();
            this._die = true;
            // this.runAction(AnimateHelper.getAnimateByName("emy_die"));
            MusicHelper.playEffect(res.Killemy_mp3);
            if (mustDie) {
                this._hpbar.removeFromParent();
                this.runAction(AnimateHelper.getAnimateByName("emy_die"));
                this.getParent()._killEnemyN++;
                this.getParent().updateInfoLayer();
            } else {
                this.playDie();
            }
        }

    },
    playDie: function () {
        var gameLayer = this.getParent();

        var layer = new BaseLayer();
        var bg = new cc.Sprite(res.ZiSha_png);
        bg.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        layer.addChild(bg, 1);

        var sp = new cc.Sprite();
        var action = cc.sequence(cc.delayTime(0.5), AnimateHelper.getAnimateByName("boss_die"), cc.callFunc(function () {
            this.getParent().removeChildByTag(123);
            this.runAction(AnimateHelper.getAnimateByName("emy_die"));
            this.getParent()._killEnemyN++;
            this.getParent().updateInfoLayer();

        }, this));
        sp.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 + 70));
        sp.setAnchorPoint(cc.p(0.5, 0.5));
        sp.runAction(action);
        layer.addChild(sp, 2);

        gameLayer.addChild(layer, 10, 123);
    },
    // 不相交
    notRectIntersectsRect: function () {
        this._killState = false;
    }
})

