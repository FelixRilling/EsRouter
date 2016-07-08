"use strict";

(function (window) {

    class esRouterScroll extends window.esRouter {
        constructor(options = {}, events = {}, scroll = {}) {
            super(options, events);
            let _this = this;

            _this.options.scroll = {
                enabled: scroll.enabled || true,
                hardScroll: scroll.hardScroll || false
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

                    for (let i = 0; i < $l.length; i++) {
                        let val = inView($l[i], y);

                        if (val < max) {
                            result = $l[i];
                            max = val;
                        }
                    }

                    return result;

                    function inView($e, y) {
                        return Math.abs($e.getClientRects()[0].top);
                    }
                }
            };
        }
        init() {
            this.$r.init();
            this.$d.bindScroll();
            return this;
        }
    }

    window.esRouterScroll = esRouterScroll;
})(window);
