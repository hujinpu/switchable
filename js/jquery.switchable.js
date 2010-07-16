/*
 * Switchable jQuery Plugin
 * @author: Jinpu Hu <jinpu.hu@qunar.com>
 */
(function($) {

	var doc = document;
	var DOT = '.';
	var EVENT_BEFORE_SWITCH = 'beforeSwitch';
	var EVENT_SWITCH = 'switch';
	var EVENT_AFTER_SWITCH = 'afterSwitch';
	var CLASSPREFIX = 'able-switchable-';

    // Namspace able.Switchable
    $.extend({
        able: {
            Switchable: Switchable
        }
    });

	SP = Switchable.prototype;
    Switchable.Plugins = [];

    // Class Switchable
	function Switchable($container, config) {
		var self = this; // Switchable Class Instance
		self.config = $.extend({}, $.fn.switchable.defaults, config || {});
		self.$container = $container;
		self._init();
	};


    // Extend Switchable prototype
	$.extend(SP, {
		_init: function() {
			var self = this,
			config = self.config;

            self.activeIndex = config.activeIndex;

            self.$evtBDObject = $('<div />');

			self._parseStructure();

			if (config.hasTriggers) self._bindTriggers();

			$.each(Switchable.Plugins, function() {
				this._init(self);
			});
		},

		_parseStructure: function() {
			var self = this,
			$container = self.$container,
			config = self.config;

            switch (config.type) {
                case 0:
                    self.$triggers = $container.find(DOT + config.navCls).children();
                    self.$panels = $container.find(DOT + config.contentCls).children();
                    break;

                case 1:
                    self.$triggers = $container.find(DOT + config.triggerCls);
                    self.$panels = $container.find(DOT + config.panelCls);
                    break;
            }
            self.viewLength = self.$panels.length / config.step;
        }, 
        
        _bindTriggers: function() {
            var self = this, config = self.config,
            $triggers = self.$triggers, events = config.events;

            $triggers.each(function(index, trigger) {
                if ($.inArray('click', events) !== -1) {
                    $(trigger).click(function(evt) {
                        if (self.activeIndex === index) return self;
                        if (self.switchTimer) clearTimeout(self.switchTimer);
                        self.switchTimer = setTimeout(function() {
                            self.switchTo(index);
                        }, config.delay * 1000);

                        evt.stopPropagation();
                    }); 
                }    

                if ($.inArray('hover', events) !== -1) {
                    $(trigger).hover(function(evt) {
                        if (self.activeIndex === index) return self;
                        if (self.switchTimer) clearTimeout(self.switchTimer);
                        self.switchTimer = setTimeout(function() {
                            self.switchTo(index);
                        }, config.delay * 1000);
                    }, function(evt) {
                        if (self.switchTimer) clearTimeout(self.switchTimer);
                        evt.stopPropagation();
                    }); 
                }    
            });
        },

        beforeSwitch: function(fn) {
            if ($.isFunction(fn)) this.$evtBDObject.bind(EVENT_BEFORE_SWITCH, fn);
        },

        afterSwitch: function(fn) {
            if ($.isFunction(fn)) this.$evtBDObject.bind(EVENT_AFTER_SWITCH, fn);
        },

        switchTo: function(index) {
            var self = this, config = self.config,
            triggers = $.makeArray(self.$triggers), panels = $.makeArray(self.$panels),
            activeIndex = self.activeIndex,
            step = config.step,
            fromIndex = activeIndex * step,
            toIndex = index * step;

            self.$evtBDObject.trigger(EVENT_BEFORE_SWITCH, [index]);

            if (config.hasTriggers) {
                self._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            self._switchView(
                panels.slice(fromIndex, fromIndex + step),
                panels.slice(toIndex, toIndex + step),
                index);

            // update activeIndex
            self.activeIndex = index;

            self.$evtBDObject.trigger(EVENT_AFTER_SWITCH, [index]);
        },

        /**
         * 切换到上一视图
         */
        prev: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex > 0 ? activeIndex - 1 : self.viewLength - 1);
        },

        /**
         * 切换到下一视图
         */
        next: function() {
            var self = this, activeIndex = self.activeIndex;
            self.switchTo(activeIndex < self.viewLength - 1 ? activeIndex + 1 : 0/*, FORWARD*/);
        },

        _switchTrigger: function(fromTrigger, toTrigger) {
        
            var activeTriggerCls = this.config.activeTriggerCls;

            if (fromTrigger) $(fromTrigger).removeClass(activeTriggerCls);
            $(toTrigger).addClass(activeTriggerCls);
        },

        _switchView: function(fromPanels, toPanels, index) {
            // 最简单的切换效果：直接隐藏/显示
            $.each(fromPanels, function() {
                $(this).hide(); 
            });
            $.each(toPanels, function() {
                $(this).show(); 
            });
        }
	}); // EOF Switchable prototype extend

    $.fn.switchable = function(config) {
        var $self = this;

        // 维系Switchable对象将来可以访问
        var switchables = $self.data('switchables');
        $self.data('switchables', switchables ? switchables : []);

        return $self.each(function() {
            $self.data('switchables').push(new Switchable($(this), config));
        });
    };

	$.fn.switchable.defaults = {

        /**
         * @cfg Number type 
         * 默认为0。
 
         * type为0，则通过navCls和contentCls来获取triggers和panels；

         * type为1，则通过triggerCls和panelCls来获取triggers和panels；
         */
        type: 0,

        /**
         * @cfg String navCls
         * 默认为able-switchable-nav，通过此类获取触发条件的容器，比如1 2 3 4 5的列表，这个class应该设置到ul或者ol上面，而不是每个触发条件li上面。
         */
        navCls: CLASSPREFIX + 'nav',

        /**
         * @cfg String contentCls
         * 默认为able-switchable-content，通过此类获取显示内容的容器，但不是具体的内容面板。
         */
        contentCls: CLASSPREFIX + 'content',

        /**
         * @cfg String triggerCls 
         * 默认为able-switchable-trigger，通过此类获取具体的触发条件，此情况下，一般触发条件不在同一个容器。
         */
		triggerCls: CLASSPREFIX + 'trigger',

        /**
         * @cfg String panelCls 
         * 默认为able-switchable-panel，通过此类获取具体的显示内容面板，此情况下，一般内容面板不在同一个容器。
         */
		panelCls: CLASSPREFIX + 'panel',

        /**
         * @cfg Boolean hasTriggers
         * 默认为true，是否有可见的触发条件。
         */
		hasTriggers: true,

        /**
         * @cfg Number activeIndex
         * 默认为0，初始时被激活的索引。
         */
		activeIndex: 0,

        /**
         * @cfg String activeTriggerCls 
         * 默认为active，被激活时的css样式名。
         */
		activeTriggerCls: 'active',

        /**
         * @cfg Array events
         * 默认为['click', 'hover']，触发条件事件响应数组，目前支持click和hover。
         */
        events: ['click', 'hover'],

        /**
         * @cfg Number step 
         * 默认为1，一次切换的内容面板数。
         */
        step: 1,

        /**
         * @cfg Number delay
         * 默认为.1，延迟执行切换的时间间隔。
         */
        delay: 0.1,

        /**
         * @cfg Array viewSize
         * 一般自动设置，除非自己需要控制显示内容面板的[宽, 高]，如果[680]、[320, 150]。
         */
        viewSize: []
	};
})(jQuery);
