/*
esRouter.scroll v1.0.0

Copyright (c) 2016 Felix Rilling

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (window) {

    window.esRouter = function (_window$esRouter) {
        _inherits(_class, _window$esRouter);

        function _class() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, _class);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, options, events));

            var _this = _this2;

            options.scroll = options.scroll || {};
            _this.options.scroll = {
                enabled: options.scroll.enabled
            };

            //hardScroll: options.scroll.hardScroll || false
            _this.$d.bindScroll = function () {
                document.addEventListener("scroll", _this.$d.onScroll);
            };
            _this.$d.onScroll = function (ev) {
                var element = getElementInView(_this.$d.elements.field, window.scrollY),
                    id = element.dataset[_this.$d.built.field[1]];

                if (_this.data.active !== element) {
                    _this.$r.move(id, false);
                }

                function getElementInView($l, y) {
                    var result = $l[0],
                        max = Infinity;

                    _this.$u.eA($l, function ($e) {
                        var val = inView($e, y);

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
                init: function init() {
                    if (_this.options.scroll.enabled) {
                        _this.$d.bindScroll();
                    }
                },
                move: function move() {},
                link: function link($e) {
                    if (_this.options.scroll.enabled) {
                        _this.$d.scrollToField($e);
                    }
                }
            });
            return _this2;
        }

        return _class;
    }(window.esRouter);
})(window);
//# sourceMappingURL=esRouter-es5.scroll.js.map
