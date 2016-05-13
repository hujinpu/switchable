/*
 * Switchable autoplay Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 */
(function($) {
    var Switchable = $.able.Switchable;
    var SP = Switchable.prototype;

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
    var AP = {
        name: 'autoplay',

        _init: function(host) {
            var that = this;
            var config = host.config;
            if (!config.autoplay) return;

            // 鼠标悬停，停止自动播放
            if (config.pauseOnHover) {

                host.$container.hover(function(evt) {
                    that._stop(host)
                }, function(evt) {
                    // because target can be child of evt set container
                    if (evt.currentTarget !== evt.target && host.$container.has(evt.target).length === 0) return;
                      that._play(host);
                });
            }

            that._play(host);
        },
        _play : function(host){
             // 设置自动播放
            host.autoplayTimer = setInterval(function() {
                host.switchTo(host.activeIndex < host.viewLength - 1 ? host.activeIndex + 1 : 0);
            }, host.config.interval * 1000, true);
        },
        _stop : function(host){
            if (host.autoplayTimer) clearInterval(host.autoplayTimer);
        }
    };
    Switchable.Plugins.push(AP);
    $.extend(SP, {
        /**
         * 增加autoPlay start 和 stop方法
         */
        start : function() {
            if (!this.config.autoplay) return;
            AP._play(this);
        },
        stop : function() {
            if (!this.config.autoplay) return;
            AP._stop(this);
        }
    });
})(jQuery);
