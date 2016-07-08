"use strict";

(function (window) {
    let baseClass = window.esRouter;

    class esRouter extends baseClass {
        constructor(options = {}, events = {}) {
            super(options, events);
            let _this = this;

            options.scroll = options.scroll || {};
            _this.options.scroll = {
                enabled: options.scroll.enabled,
                //hardScroll: options.scroll.hardScroll || false
            };

            _this.$d.bindScroll = function () {
                document.addEventListener("scroll", _this.$d.onScroll);
            };
            _this.$d.onScroll = function (ev) {
                let element = getElementInView(_this.$d.elements.field, window.scrollY),
                    id = element.dataset[_this.$d.built.field[1]];

                if (_this.data.active !== element) {
                    _this.$r.move(id, false);
                }

                function getElementInView($l, y) {
                    let result = $l[0],
                        max = Infinity;

                    _this.$u.each($l, $e => {
                        let val = inView($e, y);

                        if (val < max) {
                            result = $e;
                            max = val;
                        }
                    });

                    return result;

                    function inView($e, y) {
                        return Math.abs($e.getClientRects()[0].top);
                    }
                }
            };
            //Plugin inject
            _this.plugins.push(function () {
                if (_this.options.scroll.enabled) {
                    _this.$d.bindScroll();
                }
            });
        }

    }

    window.esRouter = esRouter;
})(window);
