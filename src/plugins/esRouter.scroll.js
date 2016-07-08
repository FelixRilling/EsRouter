"use strict";

(function (window) {
    class esRouter extends window.esRouter {
        constructor(options = {}, events = {}, scroll = {}) {
            super();
            let _this = this;

            _this.options.scroll = {
                enabled: scroll.enabled || true,
                hardScroll: scroll.hardScroll || false
            };

            _this.$d.bindScroll = function () {
                document.addEventListener("scroll", _this.$d.scroll);
            };
            _this.$d.scroll = function () {
                console.log("!!!");
            };
        }
        init() {
            this.$r.init();
            this.$d.bindScroll();
            return this;
        }
    }

    window.esRouter = esRouter;
})(window);
