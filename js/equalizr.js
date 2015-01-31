(function($) {
    var Equalizr = window.Equalizr || {};

    Equalizr = function(element, settings) {
        var self = this,
            defaults = {
                rangeEntries: [[0, 99999]],
                targetSelector: '.box'
            },
            elem = $(element);

        this.options = $.extend({}, defaults, settings);

        this.elem = elem;
        this.targetBox = elem.find(this.options.targetSelector);

        this.watchImageLoad(elem, this.update);

        $(window).on('resize',function() {
            self.update();
        });
        this.update();
    };

    Equalizr.prototype.watchImageLoad = function(elem) {
        var self = this,
            images = elem.find('img'),
            length = images.length;

        if (length === 0) {
            self.update();
            return;
        }

        // IE fix
        if (window.attachEvent) {
            var timeTotal = 5, timeCount = 0;
            var timer = setInterval(function() {
                timeCount++;
                self.update();
                if (timeCount == timeTotal) {
                    clearInterval(timer);
                }
            }, 500);
        }

        images.one("load", function() {
            length--;
            if (length === 0) {
                self.update();
            }

        }).each(function() {
            if (this.complete) {
                $(this).trigger("load");
            }
        });
    };

    Equalizr.prototype.update = function() {
        this.targetBox.css('height', 'auto');
        if (this.checkRange(this.elem)) {
            this.equalize();
        }
    };

    Equalizr.prototype.checkRange = function() {
        var docWidth = document.documentElement.clientWidth;

        function isValueInRange(value, rangeEntries) {
            var range, i;
            for (i = 0; i < rangeEntries.length; i++) {
                range = rangeEntries[i];
                if (value >= range[0] && value <= range[1]) {
                    return true;
                }
            }
            return false;
        }

        if (isValueInRange(docWidth, this.options.rangeEntries)) {
            return true;
        }
    };

    Equalizr.prototype.equalize = function() {
        var a = [ ],
            targetBox = this.targetBox;
        targetBox.each(function() {
            a.push($(this).height());
        }).css('height', Math.max.apply(Math, a));

    };

    $.fn.equalizeBoxes = function(settings) {
        return this.each(function(index, element){
            new Equalizr(element, settings);
        })
    };



}(jQuery));



