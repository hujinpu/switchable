/*
 * Switchable lazyload Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 * depend on jquery.lazyload.js
 */
(function($) {
    var DATA_TEXTAREA = 'data-textarea', DATA_IMG = 'data-img',
        EVENT_BEFORE_SWITCH = 'beforeSwitch';

    $.extend($.fn.switchable.defaults, {
        /**
         * @cfg Boolean lazyload
         * 默认为false，即不延迟加载。
         */
        lazyload: false,

        /**
         * @cfg String lazyDataType 
         * 默认为data-img，目前支持图片延迟加载，将来支持文本数据和脚步延迟加载。
         */
        lazyDataType: DATA_IMG // or DATA_TEXTAREA

    });

    var Switchable = $.able.Switchable;

    Switchable.Plugins.push({
        name: 'lazyload',

        _init: function(host) {
            var config = host.config;
            if (!config.lazyload) return;

            var panels = $.makeArray(host.$panels);
            var type = config.lazyDataType;

            host.$evtBDObject.bind(EVENT_BEFORE_SWITCH, loadLazyData);

            /**
             * 加载延迟数据
             */
            function loadLazyData(evt, index) {
                var step = config.step,
                    begin = index * step,
                    end = begin + step;

                $.loadCustomLazyData(panels.slice(begin, end), type);

                if (isAllDone()) {
                    host.$evtBDObject.unbind(EVENT_BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * 是否都已加载完成
             */
            function isAllDone() {
                var $imgs, isDone = true; 

                if (type === DATA_IMG) {

                    $imgs = panels[0].nodeName == 'IMG' ? host.$panels : host.$panels.find('img');

                    $imgs.each(function() {
                        if (this.getAttribute(type)) {
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
