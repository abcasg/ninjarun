/**
 * Created by ZZH on 2016/4/23.
 */

var BaseLayer = cc.Layer.extend({

    ctor:function(){
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){
                return true;
            }
        }, this);
        return true;
    },

    popupAction:function(){
        var action = cc.sequence(
            cc.EaseSineInOut.create(cc.scaleTo(0.2, 1.5)),
            cc.EaseBackInOut.create(cc.scaleTo(0.1, 1.3))
        );
       return action;
    }


})
