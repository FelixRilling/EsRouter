/*
esRouter v1.0.0

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    var _location = window.location;

    window.esRouter = function () {
        function _class(options, events) {
            _classCallCheck(this, _class);

            /*##############/
            / Construct Router
            /###############*/
            var _this = this;
            _this.events = {
                before: events.before,
                done: events.done,
                fail: events.fail,
                always: events.always
            };

            _this.options = {
                ajax: options.ajax || false,
                log: options.log || false
            };

            _this.slug = {
                preSlash: options.slug.preSlash || false, //prepend slash?
                postSlash: options.slug.postSlash || false, //append slash?
                urlFragmentInitator: typeof options.slug.urlFragmentInitator === "string" ? options.slug.urlFragmentInitator : "#",
                urlFragmentAppend: typeof options.slug.urlFragmentAppend === "string" ? options.slug.urlFragmentAppend : ""
            };
            _this.slug.built = (_this.slug.preSlash ? "/" : "") + _this.slug.urlFragmentInitator + _this.slug.urlFragmentAppend;

            options.dataAttr = options.dataAttr || {};
            _this.dom = {
                getElements: function getElements(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        var attr = _this.dom.dataAttr.buildAttr(_this.dom.dataAttr.corePrefix, _this.dom.dataAttr[arr[i]]);
                        _this.dom.dataAttr.built[arr[i]] = attr;
                        _this.dom.elements[arr[i]] = document.querySelectorAll("[" + attr[0] + "]") || [];
                        if (!_this.isDefined(_this.dom.elements[arr[i]])) {
                            _this.log(1, 0, 1, _this.dom.elements[attr[0]]);
                        }
                    }
                },
                dataAttr: {

                    buildAttr: function buildAttr(pre, attr) {
                        return [buildDomAttr(pre, attr), buildDataSet(pre, attr)];

                        function buildDomAttr(pre, attr) {
                            return "data-" + pre + "-" + attr;
                        }

                        function buildDataSet(pre, attr) {
                            return pre + attr[0].toUpperCase() + attr.substr(1);
                        }
                    },
                    types: ["field", "fieldDefault", "link", "pagination", "source"],
                    corePrefix: options.dataAttr.corePrefix || "router", //Core of the data-router attribute
                    field: options.dataAttr.field || "section", // #coreprefix#-#field# => data-router-field
                    fieldDefault: options.dataAttr.fieldDefault || "default",
                    link: options.dataAttr.link || "href",
                    pagination: options.dataAttr.pagination || "pagin",
                    source: options.dataAttr.pagination || "src",
                    built: {}
                },
                elements: {}

            };

            _this.data = {
                active: null,
                activeId: null,
                defaultId: null,
                index: 0
            };
        }

        //Initialize & move to url slug


        _createClass(_class, [{
            key: "init",
            value: function init() {
                var _this = this;
                _this.dom.getElements(_this.dom.dataAttr.types);
                setDefault();
                bindEvents();

                function setDefault() {
                    if (!_this.isDefined(_this.dom.elements.field)) {
                        _this.log(0, 0, 0, _this);
                    }
                    if (_this.isDefined(_this.dom.elements.fieldDefault)) {
                        _this.data.defaultId = _this.dom.elements.fieldDefault[0].dataset[_this.dom.dataAttr.built.field[1]];
                        var slug = _this.slugGet();
                        _this.moveTo(slug);
                    } else {
                        _this.log(0, 0, 0, _this);
                    }
                }

                function bindEvents() {
                    _this.each(_this.dom.elements.link, function (link) {
                        link.addEventListener("click", function (ev) {
                            _this.moveTo(ev.target.dataset[_this.dom.dataAttr.built.link[1]]);
                        });
                    });
                    _this.each(_this.dom.elements.pagination, function (pagin) {
                        pagin.addEventListener("click", function (ev) {
                            _this.moveBy(parseInt(ev.target.dataset[_this.dom.dataAttr.built.pagination[1]]));
                        });
                    });
                }
            }

            /*##############/
            / Main routing functions
            /###############*/

        }, {
            key: "moveTo",
            value: function moveTo(id, recursive) {
                var _this = this;
                _this.callback(_this.events.before, [id, _this]);
                var success = toggleActivefield(id);

                if (success) {
                    _this.slugSet(_this.data.activeId);
                    if (_this.options.ajax) {
                        _this.getAJAX(_this.data.active.dataset[_this.dom.dataAttr.built.source[1]], function (responseText) {
                            _this.data.active.innerHTML = responseText;
                            _this.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this, responseText]);
                        });
                    } else {
                        _this.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                    }
                } else {
                    //if not found revert to default
                    if (!recursive) {
                        _this.log(1, 1, 0, id);
                        _this.moveTo(_this.data.defaultId, true);
                    } else {
                        _this.callback(_this.events.fail, [id, _this]);
                        _this.log(0, 1, 1, this);
                    }
                }
                _this.callback(_this.events.always, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                return success;

                function toggleActivefield(id) {
                    var newfield = _this.findData(_this.dom.elements.field, _this.dom.dataAttr.built.field[1], id);

                    if (_this.isDefined(newfield)) {
                        _this.data.activeId = id;
                        _this.data.active = newfield;
                        _this.data.index = _this.getCurrentIndex();
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }, {
            key: "moveBy",
            value: function moveBy(val) {
                var _this = this,
                    index = _this.data.index;
                if (_this.isDefined(_this.dom.elements.field[index + val])) {
                    return _this.moveTo(_this.dom.elements.field[index + val].dataset[_this.dom.dataAttr.built.field[1]]);
                } else {
                    _this.log(2, 1, 0, val);
                    return false;
                }
            }
        }, {
            key: "moveForward",
            value: function moveForward() {
                return this.moveBy(1);
            }
        }, {
            key: "moveBackward",
            value: function moveBackward() {
                return this.moveBy(-1);
            }

            /*##############/
            / Slug functions
            /###############*/

        }, {
            key: "slugGet",
            value: function slugGet(recursive) {
                var _this = this;
                if (_location.href.lastIndexOf(this.slug.built) > -1) {
                    return _location.href.substr(_location.href.lastIndexOf(_this.slug.built) + _this.slug.built.length + (_this.slug.preSlash ? 1 : 0));
                } else {
                    //Only recurse once, error after that
                    if (!recursive) {
                        _this.slugInit(_this.data.defaultId);
                        return _this.slugGet(true);
                    } else {
                        _this.log(1, 1, 1, this);
                    }
                }
            }
        }, {
            key: "slugSet",
            value: function slugSet(id) {
                _location.href = _location.href.substr(0, _location.href.lastIndexOf(this.slug.built) + this.slug.built.length) + id;
            }
        }, {
            key: "slugInit",
            value: function slugInit(id) {
                _location.href = _location.href + this.slug.built + id;
            }

            /*##############/
            / Utility functions
            /###############*/

        }, {
            key: "getCurrentIndex",
            value: function getCurrentIndex() {
                var _this = this;
                return _this.getElementIndex(_this.dom.elements.field, _this.data.active);
            }
        }, {
            key: "getElementIndex",
            value: function getElementIndex(nodelist, node) {
                var result = void 0;
                this.each(nodelist, function (x, i) {
                    if (x === node) {
                        result = i;
                    }
                });
                return result;
            }
        }, {
            key: "findData",
            value: function findData(node, data, val) {
                var result = void 0;
                this.each(node, function (x) {
                    if (x.dataset[data] === val) {
                        result = x;
                    }
                });
                return result;
            }
        }, {
            key: "each",
            value: function each(arr, fn) {
                for (var i = 0; i < arr.length; i++) {
                    fn(arr[i], i);
                }
            }
        }, {
            key: "getAJAX",
            value: function getAJAX(url, fn) {
                var _this2 = this;

                var xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function (data) {
                    fn(data.target.response);
                });
                xhr.addEventListener("error", function (data) {
                    _this2.log(1, 3, 0, xhr);
                });
                xhr.open("GET", url);
                xhr.send();
            }
        }, {
            key: "callback",
            value: function callback(fn, args) {
                if (typeof fn === "function") {
                    fn.apply(this, args);
                }
            }
        }, {
            key: "isDefined",
            value: function isDefined(val) {
                return typeof val !== "undefined";
            }
        }, {
            key: "log",
            value: function log(type, module, name, msg) {
                var str = "esRouter: " + type + ": " + module + "=>" + name + "= " + msg;
                if (type === 0) {
                    throw str;
                } else if (this.options.log) {
                    if (type === 1) {
                        console.warn(str);
                    } else {
                        console.log(str);
                    }
                }
            }
        }]);

        return _class;
    }();
})(window);
//# sourceMappingURL=esRouter-es5.js.map
