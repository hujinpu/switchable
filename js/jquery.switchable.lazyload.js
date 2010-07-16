/*
 * Switchable lazyload Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 * depend on jquery.lazyload.js
 */
(function($) {
    var IMG_SRC = 'img-src', TEXTAREA_DATA = 'textarea-data', LAZYDATAFLAG = 'lazyload-src',
        EVENT_BEFORE_SWITCH = 'beforeSwitch';

    $.extend($.fn.switchable.defaults, {
        /**
         * @cfg Boolean lazyload
         * 默认为false，即不延迟加载。
         */
        lazyload: false,

        /**
         * @cfg String lazyDataType 
         * 默认为img-src，目前支持图片延迟加载，将来支持文本数据和脚步延迟加载。
         */
        lazyDataType: IMG_SRC, // or textarea-data

        /**
         * @cfg String lazyDataFlag
         * 默认为lazyload-src，通过指定的html自定义属性获取真实数据
         */
        lazyDataFlag: LAZYDATAFLAG
    });

    var Switchable = $.able.Switchable;

    Switchable.Plugins.push({
        name: 'lazyload',

        _init: function(host) {
            var config = host.config;
            if (!config.lazyload) return;

            var panels = $.makeArray(host.$panels);
            var type = config.lazyDataType, flag = config.lazyDataFlag;

            host.$evtBDObject.bind(EVENT_BEFORE_SWITCH, loadLazyData);

            /**
             * 加载延迟数据
             */
            function loadLazyData(evt, index) {
                var step = config.step,
                    begin = index * step,
                    end = begin + step;

                $.loadCustomLazyData(panels.slice(begin, end), type, flag);

                if (isAllDone()) {
                    host.$evtBDObject.unbind(EVENT_BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * 是否都已加载完成
             */
            function isAllDone() {
                var $imgs, isDone = true; 

                if (type === IMG_SRC) {

                    $imgs = panels[0].nodeName == 'IMG' ? host.$panels : host.$panels.find('img');

                    $imgs.each(function() {
                        if (this.getAttribute(flag)) {
                            isDone = false;
                            return false;
                        }
                    
                    });
                }
                // TODO textarea

                return isDone;
            }
        }
    });

})(jQuery);
