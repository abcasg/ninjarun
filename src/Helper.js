/**
 * Created by ZZH on 2016/4/13.
 */

var MusicHelper = {

    _bMusicFalg: true,  // music play flag.
    setMusicFalg: function (bFlag) {
        this._bMusicFalg = bFlag;
    },
    getMusicFalg: function () {
        return this._bMusicFalg;
    },
    /**
     * Play the background music.
     * @method playMusic
     * @param {String} sMusic the music path.
     * @param {Boolean} bLoopFlag if the music loop play.
     * */
    playMusic: function (sMusic, bLoopFlag) {
        cc.audioEngine.end();
        cc.audioEngine.playMusic(sMusic, bLoopFlag);
    },
    /**
     * Play the effect music.
     * @method playEffect
     * @param {String} sMusic the music path.
     * @param {Boolean} bLoopFlag if the music loop play.
     * */
    playEffect: function (sMusic, bLoopFlag) {
        if (this._bMusicFalg) {
            cc.audioEngine.playEffect(sMusic, bLoopFlag);
        }
    },
    /**
     * Pause the music
     * @method pauseMusic
     * */
    pauseMusic: function () {
        cc.audioEngine.pauseMusic();
        this._bMusicFalg = false;
    },
    /**
     * Resume the music
     * @method resumeMusic
     * */
    resumeMusic: function () {
        cc.audioEngine.resumeMusic();
        this._bMusicFalg = true;
    },
    /**
     * End the music
     * @method endMusic
     * */
    endMusic: function () {
        cc.audioEngine.end();
    }
}
//////////////////////////////////////////////////////////////////////////////////////
var DataHelper = {
    _nCurrentLevel: 1,  // the curent game level
    _nMaxLevel: 1,      // the localStorage rember max level

    init: function () {
        // maxlevel: the storage key ,save the important value.
        var maxlevel = this.getDataByName("maxlevel");

        if (!maxlevel) {
            this.setDataByName("maxlevel", this._nMaxLevel);
        } else {
            this._nMaxLevel = parseInt(maxlevel);
        }

        //this._nMaxLevel = 30;
    },
    addCurrentLevel: function () {
        this._nCurrentLevel++;
        this.checkMaxLevel();
    },
    setCurrentLevel: function (nLevle) {
        this._nCurrentLevel = nLevle;
    },
    getCurrentLevel: function () {
        if (null === this._nCurrentLevel) throw  "this _nCurrentLevel is null!!";
        return this._nCurrentLevel;
    },
    getMaxLevel: function () {
        return this._nMaxLevel;
    },
    setMaxLevel: function (nData) {
        this._nMaxLevel = nData;
        this.flushData();
    },
    /**
     * Chexk the current level if the max level and flush data.
     * @method checkMaxLevel
     * */
    checkMaxLevel: function () {
        if (this._nCurrentLevel > this._nMaxLevel) {
            this._nMaxLevel = this._nCurrentLevel;
            this.flushData();
        }
    },
    /**
     * Storage the data by name key.
     * @method setDataByName
     * @param  {String} sName the key.
     * @param  {obj} oData the storage data obje.
     */
    setDataByName: function (sName, oData) {
        try {
            cc.sys.localStorage.setItem(sName, oData);
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Remove the data by name key.
     * @method removeDataByName
     * @param  {String} sName the key.
     */
    removeDataByName: function (sName) {
        try {
            cc.sys.localStorage.removeItem(sName);
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Remove the data by name key.
     * @method removeDataByName
     * @param  {String} sName the key.
     */
    getDataByName: function (sName) {
        return cc.sys.localStorage.getItem(sName);
    },
    /**
     * flush the storage data.
     * @method flushData
     * */
    flushData: function () {
        this.setDataByName("maxlevel", this._nMaxLevel);
    },
    /**
     * clear the data.
     * @method clearData
     * */
    clearData: function () {
        cc.sys.localStorage.clear();
    }
}
///////////////////////////////////////////////////////////////////////////////////
var AnimateHelper = {

    // init the plist file
    init: function () {
        cc.spriteFrameCache.addSpriteFrames(res.Role_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Emy_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Other1_plist);
        cc.spriteFrameCache.addSpriteFrames(res.Other_plist);

    },
    /**
     * Get the Animation by key name from the animates data file.
     * @method getAnimateByName
     * @param {String} sName the animate key name.
     * @return {Animate} the animate action.
     */
    getAnimateByName: function (sName) {

        // if the animate have saved in the cache ,direct return .
        var oAn = cc.animationCache.getAnimation(sName);
        if (oAn) {
            return cc.animate(oAn);
        }

        if (!AnimatesData[sName]) {
            throw  "not find animatedata!!!";
        }

        // the zero number
        var nFixd = AnimatesData[sName]["FixN"];
        var nPow = null;
        if (nFixd) {
            nPow = Math.pow(10, nFixd);
        }


        // the began sindex
        var nIndex = 1;
        if (AnimatesData[sName]["sindex"]) {
            nIndex = AnimatesData[sName]["sindex"];
        }

        var animFrames = [];
        var str = "";
        for (var i = nIndex; i <= AnimatesData[sName]["total"] + (nIndex - 1); i++) {
            // add the zero count in string
            var strK = "";
            if (nFixd) {
                if (nPow > i) {
                    var n = i.toString().length;
                    for (var k = 0; k < nFixd - n; k++) {
                        strK = strK + "0";
                    }
                }
            }
            str = AnimatesData[sName]["path"] + strK + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        // create the animation
        var animation = new cc.Animation(animFrames, AnimatesData[sName]["delay"]);
        cc.animationCache.addAnimation(animation, sName);
        var animate = cc.animate(cc.animationCache.getAnimation(sName));
        return animate;

    },
    /**
     * Get the Animation by key name from the animates data file and run forever.
     * @method getAnimateByNameForever
     * @param {String} sName the animate key name.
     * @return {Animate} the  animate forever action.
     */
    getAnimateByNameForever: function (sName) {
        return this.getAnimateByName(sName).repeatForever();
    }
}
///////////////////////////////////////////////////////////////////////////////////
var MapHelper = {
    _nRoadGid: -1,  // the tile is allowed move.
    _map: null,
    setMap: function (map) {
        this._map = map;
    },
    /**
     * Convert the node point to the map point.
     * @method posInMap
     * @param {point} oP the node point.
     * @return {point} in the map point.
     */
    posInMap: function (oP) {

        var nMapH = this._map.getMapSize().height * this._map.getTileSize().height;
        var mapPos = this._map.convertToNodeSpace(oP);
        mapPos = cc.p(mapPos.x, nMapH - mapPos.y);

        mapPos = cc.p(parseInt(mapPos.x / this._map.getTileSize().width), parseInt(mapPos.y / this._map.getTileSize().height));
        return mapPos;
    },
    getMap: function () {
        return this._map;
    },

    getReMapWidth: function () {
        return this._map.getTileSize().width * this._map.getMapSize().width;
    },
    getReMapHeight: function () {
        return this._map.getTileSize().height * this._map.getMapSize().height;
    },
    /**
     * Get the point in the map .
     * @method xFromWidIndex
     * @param {point} xP the node point.
     * @return {point} in the map point.
     */
    xFromWidIndex: function (xP) {
        var nTmpx = xP * this._map.getTileSize().width;
        var p = this._map.convertToWorldSpace(cc.p(nTmpx, 0));
        return p.x;
    },
    /**
     * Repair the point in map.
     * @method posInWorldARCenter
     * @param {point} p the node point.
     * @return {point} in the map point.
     */
    posInWorldARCenter: function (p) {
        var mp = this._map.convertToWorldSpace(p);
        return cc.p(mp.x + this._map.getTileSize().width / 2, p.y + this._map.getTileSize().height / 2);
    },
    /**
     * Set the road gid value.
     * @method setRoadGid
     * @param {point} p the node point.
     */
    setRoadGid: function (p) {

        if (!this._map)
            throw new Error(" this._map is NULL!!!");

        var mp = this.posInMap(p);
        this._nRoadGid = this._map.getLayer("map").getTileGIDAt(cc.p(mp.x, mp.y - 1));
    },
    /**
     * Set the tile is road gid value.
     * @method setTileRoadGid
     * @param {point} p the node point.
     */
    setTileRoadGid: function (p) {
        this.setTileGid(this._nRoadGid, p);
    },

    setTileGid: function (gid, p) {

        if (!this._map)
            throw new Error(" this._map is NULL!!!");

        var mapLayer = this._map.getLayer("map");
        var mp = this.posInMap(p);
        mp = cc.p(mp.x, mp.y - 1);
        //var tileGID = mapLayer.getTileGIDAt(mp);
        mapLayer.setTileGID(gid, mp);
    },
    /**
     * Get the tile gid value.
     * @method setTileRoadGid
     * @param {point} p the node point.
     */
    getTileGIDAt: function (p) {

        if (!this._map)
            throw new Error(" this._map is NULL!!!");

        var mapLayer = this._map.getLayer("map");
        var mp = this.posInMap(p);
        mp = cc.p(mp.x, mp.y - 1);

        return mapLayer.getTileGIDAt(mp);
    },
    /**
     * Judge the if is the road.
     * @method isRoad
     * @param {obj} role the obj,this is ninja.
     * @return {boolean} is can through or not.
     */
    isRoad: function (oRole) {
        var p = null;
        var roleP = oRole.getPosition();
        var roleSize = cc.size(63, 63);

        switch (oRole._dir) {
            case "left":
                p = cc.p(roleP.x - roleSize.width / 2, roleP.y);
                break;
            case "down":
                p = cc.p(roleP.x, roleP.y - roleSize.height / 2 + 0.1);
                break;
            case "right":
                p = cc.p(roleP.x + roleSize.width / 2 - 0.1, roleP.y);
                break;
            case "up":
                p = cc.p(roleP.x, roleP.y + roleSize.height / 2);
                break;
        }
        var mapLayer = this._map.getLayer("map");
        var mp = this.posInMap(p);

        // get gid value
        var nTileGID = mapLayer.getTileGIDAt(mp);

        if (nTileGID === this._nRoadGid) {
            return false;
        }
        return true;
    }
}