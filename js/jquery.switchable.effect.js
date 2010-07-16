/*
 * Switchable effect Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 */
(function($) {

    var Effects;

    var DISPLAY = 'display';
    var BLOCK = 'block';

    var OPACITY = 'opacity';

    var ZINDEX = 'z-index';
    var POSITION = 'position';
    var RELATIVE = 'relative';
    var ABSOLUTE = 'absolute';

    var SCROLLX = 'scrollx';
    var SCROLLY = 'scrolly';

    var NONE = 'none';
    var FADE = 'fade';
    var LINER = 'liner';
    var SWING = 'swing';

    var Switchable = $.able.Switchable;

    $.extend($.fn.switchable.defaults, {
        /**
         * @cfg String effect
         * 默认为none，即只是显示隐藏，目前支持的特效为scrollx、scrolly、fade或者自己直接传入特效函数。
         */
        effect: 'none',

        /**
         * @cfg Number duration 
         * 默认为.5，动画的时长。
         */
        duration: 0.5,

        /**
         * @cfg String easing
         * 默认为liner，即线性的。
         */
        easing: LINER
    });

    /**
     * 定义效果集
     */
    Switchable.Effects = {

        // 最朴素的显示/隐藏效果
        none: function(fromPanels, toPanels, callback) {
            $.each(fromPanels, function() {
                $(this).hide(); 
            });
            $.each(toPanels, function() {
                $(this).show(); 
            });
            callback();
        },

        // 淡隐淡现效果
        fade: function(fromPanels, toPanels, callback) {
            if(fromPanels.length !== 1) {
                return; //fade effect only supports step == 1.
            }
            var self = this, config = self.config,
                fromPanel = fromPanels[0], toPanel = toPanels[0];
            if (self.$anim) self.$anim.clearQueue();

            // 首先显示下一张
            $(toPanel).css(OPACITY, 1);

            // 动画切换
            self.$anim = $(fromPanel).animate({
                opacity: 0,
                duration: config.duration,
                easing: config.easing
            }, function() {
                self.$anim = null; // free

                // 切换 z-index
                $(toPanel).css(ZINDEX, 9);
                $(fromPanel).css(ZINDEX, 1);
                callback();
            });
        },

        // 水平/垂直滚动效果
        scroll: function(fromPanels, toPanels, callback, index) {
            var self = this, config = self.config,
                isX = config.effect === SCROLLX,
                diff = self.viewSize[isX ? 0 : 1] * index,
                attributes = {};

            attributes[isX ? 'left' : 'top'] = -diff;
            $.extend(attributes, {
                duration: config.duration,
                easing: config.easing
            });

            if (self.$anim) self.$anim.clearQueue();

            self.$anim = self.$panels.parent().animate(attributes, function() {
                self.$anim = null; // free
                callback();
            });
        }
        
    };
    Effects = Switchable.Effects;
    Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;

    Switchable.Plugins.push({
        name: 'effect',

        /**
         * 根据 effect, 调整初始状态
         */
        _init: function(host) {
            var config = host.config,
                effect = config.effect,
                $panels = host.$panels,
                step = config.step,
                activeIndex = host.activeIndex,
                fromIndex = activeIndex * step,
                toIndex = fromIndex + step - 1,
                panelLength = $panels.length;

            // 1. 获取高宽
            host.viewSize = [
                config.viewSize[0] || $panels.outerWidth() * step,
                config.viewSize[1] || $panels.outerHeight()* step
            ];
            // 注：所有 panel 的尺寸应该相同
            //    最好指定第一个 panel 的 width 和 height，因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对

            // 2. 初始化 panels 样式
            if (effect !== NONE) { // effect = scrollx, scrolly, fade
                // 这些特效需要将 panels 都显示出来
                $panels.css(DISPLAY, BLOCK);

                switch (effect) {

                    // 如果是滚动效果
                    case SCROLLX:
                    case SCROLLY:
                        // 设置定位信息，为滚动效果做铺垫
                        $panels.parent().css('position', ABSOLUTE);
                        $panels.parent().parent().css('position', RELATIVE); // 注：content 的父级不一定是 container

                        // 水平排列
                        if (effect === SCROLLX) {
                            $panels.css('float', 'left');

                            // 设置最大宽度，以保证有空间让 panels 水平排布
                            $panels.parent().css('width', host.viewSize[0] * host.viewLength + 'px');
                        }
                        break;

                    // 如果是透明效果，则初始化透明
                    case FADE:
                        $panels.each(function(index) {
                            $(this).css({
                                opacity: (index >= fromIndex && index <= toIndex) ? 1 : 0,
                                position: ABSOLUTE,
                                zIndex: (index >= fromIndex && index <= toIndex) ? 9 : 1
                            });        
                        });
                        break;
                }
            }

            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
            //    nav 的 cls 由 CSS 指定
        }
    });

    /**
     * 覆盖切换方法
     */
    $.extend(Switchable.prototype, {
        /**
         * 切换视图
         */
        _switchView: function(fromPanels, toPanels, index) {
            var self = this, config = self.config,
                effect = config.effect,
                fn = $.isFunction(effect) ? effect : Effects[effect];

            fn.call(self, fromPanels, toPanels, function() {}, index);
        }
    });
})(jQuery);
