"use strict";

(function (window) {

    window.esRouter = class extends window.esRouter {
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

                    _this.$u.eA($l, $e => {
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
            _this.$d.scrollToField = function ($e) {
                $e.scrollIntoView();
            };

            //Plugin inject
            _this.plugins.push({
                init: () => {
                    if (_this.options.scroll.enabled) {
                        _this.$d.bindScroll();
                    }
                },
                move: () => {},
                link: $e => {
                    if (_this.options.scroll.enabled) {
                        console.log($e);
                        _this.$d.scrollToField($e);
                    }
                }
            });
        }

    };

})(window);
