/*
esRouter v1.0.1

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

(function (window) {
    let _location = window.location;

    window.esRouter = class {
        constructor(options = {}, events = {}) {
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
                log: options.log || false,
                autoBind: options.autoBind || true
            };

            _this.data = {
                active: null,
                activeId: null,
                defaultId: null,
                index: 0
            };

            //Everything about changing the URL
            _this.slug = {
                preSlash: options.slug.preSlash || false, //prepend slash?
                postSlash: options.slug.postSlash || false, //append slash?
                prepend: (typeof options.slug.prepend === "string") ? options.slug.prepend : "",
                append: (typeof options.slug.append === "string") ? options.slug.append : "",
                get(recursive, error) {
                    if (_this.slug.has()) {
                        return _location.href.substr(
                            _location.href.lastIndexOf(_this.slug.built) +
                            _this.slug.built.length +
                            (_this.slug.preSlash ? 1 : 0)
                        );
                    } else {
                        error(recursive);
                    }
                },
                has() {
                    return _location.href.lastIndexOf(_this.slug.built) > -1;
                },
                set(id) {
                    _location.href = (
                        _location.href.substr(
                            0,
                            _location.href.lastIndexOf(_this.slug.built) +
                            _this.slug.built.length
                        ) +
                        id
                    );
                },
                create(id) {
                    _location.href = (
                        _location.href +
                        _this.slug.built +
                        id
                    );
                },
                init(error, done) {
                    let slug = _this.slug.get(false, recursive => {
                        //Only recurse once, error after that
                        if (!recursive) {
                            _this.slug.create(_this.data.defaultId);
                            return _this.slug.get(true);
                        } else {
                            error();
                        }
                    });
                    done(slug);
                },
                built: null
            };
            _this.slug.built = (_this.slug.preSlash ? "/" : "") + "#" + _this.slug.prepend + _this.slug.append;

            _this.dom = {
                corePrefix: options.corePrefix || "router", //Core of the data-router attribute
                built: {},
                elements: {},
                base: {
                    field: "section",
                    fieldDefault: "default",
                    link: "href",
                    pagination: "pagin",
                    source: "src",
                },
                getElements: function (error, done) {
                    _this.ut.eachObject(_this.dom.base, (item, key, index) => {
                        let attr = _this.dom.buildAttr(_this.dom.corePrefix, _this.dom.base[key]);

                        _this.dom.built[key] = attr;
                        _this.dom.elements[key] = document.querySelectorAll("[" + attr[0] + "]") || [];

                        if (!_this.ut.isDefined(_this.dom.elements[key])) {
                            error(_this.dom.elements[key]);
                        }
                    });
                    done();
                },
                buildAttr(pre, attr) {
                    return [buildDomAttr(pre, attr), buildDataSet(pre, attr)];

                    function buildDomAttr(pre, attr) {
                        return "data-" + pre + "-" + attr;
                    }

                    function buildDataSet(pre, attr) {
                        return pre + attr[0].toUpperCase() + attr.substr(1);
                    }
                },
                autoBind() {
                    if (_this.options.autoBind) {
                        addClickEvent(_this.dom.elements.link, ev => {
                            _this.moveTo(ev.target.dataset[_this.dom.built.link[1]]);
                        });
                        addClickEvent(_this.dom.elements.pagination, ev => {
                            _this.moveBy(parseInt(ev.target.dataset[_this.dom.built.pagination[1]]));
                        });
                    }

                    function addClickEvent(element, fn) {
                        _this.ut.each(element, link => {
                            link.addEventListener("click", fn);
                        });
                    }
                },
            };

            _this.router = {
                init(error) {
                    //Query DOM
                    _this.dom.getElements(
                        key => {
                            _this.ut.log(1, 0, 1, key);
                        },
                        _this.dom.autoBind
                    );

                    //Read defaults
                    if (!_this.ut.isDefined(_this.dom.elements.field)) {
                        _this.ut.log(0, 0, 0, _this);
                    }
                    if (!_this.ut.isDefined(_this.dom.elements.fieldDefault)) {
                        _this.ut.log(0, 0, 0, _this);
                    } else {
                        _this.data.defaultId = _this.dom.elements.fieldDefault[0].dataset[
                            _this.dom.built.field[1]
                        ];
                    }

                    //Init slug
                    _this.slug.init(() => {
                        _this.ut.log(1, 1, 1, _this);
                    }, slug => {
                        _this.moveTo(slug);
                    });
                },
                move(id, recursive) {
                    _this.ut.callback(_this.events.before, [id, _this]);
                    let success = toggleActivefield(id);

                    if (success) {
                        _this.slug.set(_this.data.activeId);
                        if (_this.options.ajax) {
                            _this.ut.getAJAX(_this.data.active.dataset[_this.dom.built.source[1]], responseText => {
                                _this.data.active.innerHTML = responseText;
                                _this.ut.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this, responseText]);
                            });
                        } else {
                            _this.ut.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                        }

                    } else {
                        //if not found revert to default
                        if (!recursive) {
                            _this.ut.log(1, 1, 0, id);
                            _this.moveTo(_this.data.defaultId, true);
                        } else {
                            _this.ut.callback(_this.events.fail, [id, _this]);
                            _this.ut.log(0, 1, 1, this);
                        }
                    }
                    _this.ut.callback(_this.events.always, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                    return success;

                    function toggleActivefield(id) {
                        let newfield = _this.ut.findData(_this.dom.elements.field, _this.dom.built.field[1], id);

                        if (_this.ut.isDefined(newfield)) {
                            _this.data.activeId = id;
                            _this.data.active = newfield;
                            _this.data.index = _this.getCurrentIndex();
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            };

            _this.ut = {
                getElementIndex(nodelist, node) {
                    let result;
                    _this.ut.each(nodelist, (x, i) => {
                        if (x === node) {
                            result = i;
                        }
                    });
                    return result;
                },
                findData(node, data, val) {
                    let result;
                    _this.ut.each(node, x => {
                        if (x.dataset[data] === val) {
                            result = x;
                        }
                    });
                    return result;
                },
                each(arr, fn) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        fn(arr[i], i);
                    }
                },
                eachObject(object, fn) {
                    let keys = Object.keys(object);
                    for (let i = 0, l = keys.length; i < l; i++) {
                        fn(object[keys[i]], keys[i], i);
                    }
                },

                getAJAX(url, fn) {
                    let xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", data => {
                        fn(data.target.response);
                    });
                    xhr.addEventListener("error", data => {
                        this.ut.log(1, 3, 0, xhr);
                    });
                    xhr.open("GET", url);
                    xhr.send();
                },
                callback(fn, args) {
                    if (typeof fn === "function") {
                        fn.apply(this, args);
                    }
                },
                isDefined(val) {
                    return typeof val !== "undefined";
                },
                /*tryCatch(fn, error, sucess) {
                    let result = true;
                    try {
                        fn();
                    } catch (e) {
                        result = false;
                        error(e);
                    } finally {
                        if (result) {
                            sucess();
                        }
                    }
                },*/
                log(type, module, name, msg) {
                    let str = `esRouter: ${type}: ${module}=>${name}= ${msg}`;
                    if (type === 0) {
                        throw str;
                    } else if (_this.options.log) {
                        if (type === 1) {
                            console.warn(str);
                        } else {
                            console.log(str);
                        }
                    }
                }
            };
        }

        //Initialize & move to url slug
        init() {
            let _this = this;
            _this.router.init();
            return _this;
        }
        moveTo(id) {
            let _this = this;
            _this.router.move(id, false);
            return _this;
        }
        moveBy(val) {
            let _this = this,
                index = _this.data.index;
            if (_this.ut.isDefined(_this.dom.elements.field[index + val])) {
                return _this.moveTo(
                    _this.dom.elements.field[index + val].dataset[_this.dom.built.field[1]]
                );
            } else {
                _this.ut.log(2, 1, 0, val);
                return false;
            }
        }
        moveForward() {
            return this.moveBy(1);
        }
        moveBackward() {
            return this.moveBy(-1);
        }
        getCurrentIndex() {
            let _this = this;
            return _this.ut.getElementIndex(_this.dom.elements.field, _this.data.active);
        }

    };

})(window);
