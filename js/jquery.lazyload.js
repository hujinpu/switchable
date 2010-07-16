(function($) {

    function _loadImgSrc(img, flag) {
        var data_src = img.getAttribute(flag);

        if (data_src && img.src != data_src) {
            img.src = data_src;
            img.removeAttribute(flag);
        }
    };

	$.extend({
		loadCustomLazyData: function(containers, type, flag) {

            var $imgs;

			$.each(containers, function() {
				switch (type) {
				case 'textarea-data':
                    // TODO 通过textarea延迟加载内容(图片，网页html，脚本)
					break;
				default:
					if (this.nodeName === 'IMG') { // 本身就是图片
						$imgs = $(this);
					} else {
                        $imgs = $(this).find('img');
					}
                    $imgs.each(function() {
                        _loadImgSrc(this, flag);
                    });
				}
			});
		}
	});
})(jQuery);
