(function($) {

    function _loadImgSrc(img, type) {
        var data_src = img.getAttribute(type);

        if (data_src && img.src != data_src) {
            img.src = data_src;
            img.removeAttribute(type);
        }
    };

    $.extend({
        loadCustomLazyData: function(containers, type) {

            var $imgs;

            $.each(containers, function() {
                switch (type) {
                case 'data-textarea':
                    // TODO 通过textarea延迟加载内容(图片，网页html，脚本)
                    break;
                default:
                    if (this.nodeName === 'IMG') { // 本身就是图片
                        $imgs = $(this);
                    } else {
                        $imgs = $(this).find('img');
                    }
                    $imgs.each(function() {
                        _loadImgSrc(this, type);
                    });
                }
            });
        }
    });
})(jQuery);
