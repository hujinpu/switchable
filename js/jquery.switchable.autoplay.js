/*
 * Switchable autoplay Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 */
(function($) {
    var Switchable = $.able.Switchable;

    $.extend($.fn.switchable.defaults, {

        /**
         * @cfg Boolean autoplay
         * 默认为false，不自动播放。
         */
        autoplay: false,

        /**
         * @cfg Number interval
         * 默认为3，自动播放间隔时间。
         */
        interval: 3,

        /**
         * @cfg Boolean pauseOnHover
         * 默认为true，鼠标悬停在容器上是否暂停自动播放
         */
        pauseOnHover: true
    });

    Switchable.Plugins.push({
        name: 'autoplay',

        _init: function(host) {
            var config = host.config;
            if (!config.autoplay) return;

            // 鼠标悬停，停止自动播放
            if (config.pauseOnHover) {

                host.$container.hover(function(evt) {
                    host.paused = true;
                }, function(evt) {
                    // setTimeout interval 是为了确保自动播放的间隔不会小于间隔时间
                    if (evt.currentTarget !== evt.target) return;
                    setTimeout(function() {
                        host.paused = false;
                    }, config.interval * 1000);
                });
            }

            // 设置自动播放
            host.autoplayTimer = setInterval(function() {
                if (host.paused) return;
                host.switchTo(host.activeIndex < host.viewLength - 1 ? host.activeIndex + 1 : 0);
            }, config.interval * 1000, true);
        }
    });
})(jQuery);
