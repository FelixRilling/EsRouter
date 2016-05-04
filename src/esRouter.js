/*
esRouter v0.2.1

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

(function(window) {

    let _location = window.location;

    window.esRouter = class {
        constructor(
            options,
            events
        ) {
            /*##############/
            / Construct Router
            /###############*/
            let _this = this;
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
                preSlash: options.slug.preSlash || false,
                postSlash: options.slug.postSlash || false,
                urlFragmentInitator: (typeof options.slug.urlFragmentInitator === "string") ? options.slug.urlFragmentInitator : "#",
                urlFragmentAppend: (typeof options.slug.urlFragmentAppend === "string") ? options.slug.urlFragmentAppend : "",
            };
            _this.slug.built = (_this.slug.preSlash ? "/" : "") + _this.slug.urlFragmentInitator + _this.slug.urlFragmentAppend;

            options.dataAttr = options.dataAttr || {};
            _this.dom = {
                getElements: function(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        let attr = _this.dom.dataAttr.buildAttr(_this.dom.dataAttr.corePrefix, _this.dom.dataAttr[arr[i]]);
                        _this.dom.dataAttr.built[arr[i]] = attr;
                        _this.dom.elements[arr[i]] = document.querySelectorAll("[" + attr[0] + "]") || [];
                        if (!_this.isDefined(_this.dom.elements[arr[i]])) {
                            _this.writeLog([0, 1, 0], _this.dom.elements[attr[0]]);
                        }
                    }
                },
                dataAttr: {

                    buildAttr: function(pre, attr) {
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
        init() {
            let _this = this;
            _this.dom.getElements(_this.dom.dataAttr.types);
            setDefault();
            bindEvents();

            function setDefault() {
                if (!_this.isDefined(_this.dom.elements.field)) {
                    _this.throwError([0, 0], _this);
                }
                if (_this.isDefined(_this.dom.elements.fieldDefault)) {
                    _this.data.defaultId = _this.dom.elements.fieldDefault[0].dataset[
                        _this.dom.dataAttr.built.field[1]
                    ];
                    let slug = _this.slugGet();
                    _this.moveTo(slug);
                } else {
                    _this.throwError([0, 1], _this);
                }
            }

            function bindEvents() {
                _this.iterateDomNode(_this.dom.elements.link, link => {
                    link.addEventListener("click", ev => {
                        _this.moveTo(ev.target.dataset[_this.dom.dataAttr.built.link[1]]);
                    });
                });
                _this.iterateDomNode(_this.dom.elements.pagination, pagin => {
                    pagin.addEventListener("click", ev => {
                        _this.moveBy(parseInt(ev.target.dataset[_this.dom.dataAttr.built.pagination[1]]));
                    });
                });
            }
        }

        /*##############/
        / Main routing functions
        /###############*/
        moveTo(id, recursive) {
            let _this = this;
            _this.callback(_this.events.before, [id, _this]);
            let success = toggleActivefield(id);

            if (success) {
                _this.slugSet(_this.data.activeId);
                if (_this.options.ajax) {
                    _this.getAJAX(_this.data.active.dataset[_this.dom.dataAttr.built.source[1]], responseText => {
                        _this.data.active.innerHTML = responseText;
                        _this.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this, responseText]);
                    });
                } else {
                    _this.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                }

            } else {
                //if not found revert to default
                if (!recursive) {
                    _this.writeLog([1, 1, 0], id);
                    _this.moveTo(_this.data.defaultId, true);
                } else {
                    _this.callback(_this.events.fail, [id, _this]);
                    _this.throwError([1, 1], this);
                }
            }
            _this.callback(_this.events.always, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
            return success;

            function toggleActivefield(id) {
                let newfield = _this.findData(_this.dom.elements.field, _this.dom.dataAttr.built.field[1], id);

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
        moveBy(val) {
            let _this = this,
                index = _this.data.index;
            if (_this.isDefined(_this.dom.elements.field[index + val])) {
                return _this.moveTo(
                    _this.dom.elements.field[index + val].dataset[_this.dom.dataAttr.built.field[1]]
                );
            } else {
                _this.writeLog([1, 2, 0], val);
                return false;
            }
        }
        moveForward() {
            return this.moveBy(1);
        }
        moveBackward() {
            return this.moveBy(-1);
        }

        /*##############/
        / Slug functions
        /###############*/
        slugGet(recursive) {
            let _this = this;
            if (_location.href.lastIndexOf(this.slug.built) > -1) {
                return _location.href.substr(
                    _location.href.lastIndexOf(_this.slug.built) +
                    _this.slug.built.length +
                    (_this.slug.preSlash ? 1 : 0)
                );
            } else {
                //Only recurse once, error after that
                if (!recursive) {
                    _this.slugInit(_this.data.defaultId);
                    return _this.slugGet(true);
                } else {
                    _this.throwError([1, 1], this);
                }
            }
        }
        slugSet(id) {
            _location.href = (_location.href.substr(
                0,
                _location.href.lastIndexOf(this.slug.built) +
                this.slug.built.length
            ) + id);
        }
        slugInit(id) {
            _location.href = (
                _location.href +
                this.slug.built +
                id);
        }

        /*##############/
        / Utility functions
        /###############*/
        getCurrentIndex() {
            let _this = this;
            return _this.getElementIndex(_this.dom.elements.field, _this.data.active);
        }
        getElementIndex(nodelist, node) {
            let result;
            this.iterateDomNode(nodelist, (x, i) => {
                if (x === node) {
                    result = i;
                }
            });
            return result;
        }
        findData(node, data, val) {
            let result;
            this.iterateDomNode(node, (x) => {
                if (x.dataset[data] === val) {
                    result = x;
                }
            });
            return result;
        }
        iterateDomNode(nodelist, fn) {
            for (let i = 0; i < nodelist.length; i++) {
                fn(nodelist[i], i);
            }
        }
        getAJAX(url, fn) {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", data => {
                fn(data.target.response);
            });
            xhr.addEventListener("error", data => {
                this.throwError([3, 0], xhr);
            });
            xhr.open("GET", url);
            xhr.send();
        }
        callback(fn, args) {
            if (typeof fn === "function") {
                fn.apply(this, args);
            }
        }
        isDefined(val) {
                return typeof val !== "undefined";
            }
            //log
        writeLog(type, content) {
                if (this.options.log) {
                    console.log(`esRouter: Type:${type[1]}:${type[2]} in module ${type[0]}`, content);
                }
            }
            //!log
        throwError(type, content) {
            throw Error(`esRouter: 0:${type[1]} in module ${type[0]}`, content);
        }

    };

})(window);
