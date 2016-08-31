/*
esRouter v3.0.0

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
            let _this = this;

            _this.plugins = [];

            _this.$e = events;

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
            options.slug = options.slug || {};
            _this.$s = {
                preSlash: options.slug.preSlash || false, //prepend slash?
                postSlash: options.slug.postSlash || false, //append slash?
                prepend: (typeof options.slug.prepend === "string") ? options.slug.prepend : "",
                append: (typeof options.slug.append === "string") ? options.slug.append : "",
                get(recursive, error) {
                    if (_this.$s.has()) {
                        return _location.href.substr(
                            _location.href.lastIndexOf(_this.$s.built) +
                            _this.$s.built.length +
                            (_this.$s.preSlash ? 1 : 0)
                        );
                    } else {
                        error(recursive);
                    }
                },
                has() {
                    return _location.href.lastIndexOf(_this.$s.built) > -1;
                },
                set(id) {
                    _location.href = (
                        _location.href.substr(
                            0,
                            _location.href.lastIndexOf(_this.$s.built) +
                            _this.$s.built.length
                        ) +
                        id
                    );
                },
                create(id) {
                    _location.href = (
                        _location.href +
                        _this.$s.built +
                        id
                    );
                },
                init(error, done) {
                    let slug = _this.$s.get(false, recursive => {
                        //Only recurse once, error after that
                        if (!recursive) {
                            _this.$s.create(_this.data.defaultId);
                            return _this.$s.get(true);
                        } else {
                            error();
                        }
                    });
                    done(slug);
                },
                built: null
            };
            _this.$s.built = (_this.$s.preSlash ? "/" : "") + "#" + _this.$s.prepend + _this.$s.append;

            _this.$d = {
                corePrefix: options.dataPrefix || "router", //Core of the data-router attribute
                built: {},
                elements: {},
                base: {
                    field: "section",
                    fieldDefault: "default",
                    link: "href",
                    pagination: "pagin",
                    //source: "src",
                },
                getElements: function (error, done) {
                    _this.$u.eO(_this.$d.base, (item, key, index) => {
                        let attr = _this.$d.buildAttr(_this.$d.corePrefix, _this.$d.base[key]);

                        _this.$d.built[key] = attr;
                        _this.$d.elements[key] = document.querySelectorAll("[" + attr[0] + "]") || [];

                        if (!_this.$u.isDefined(_this.$d.elements[key])) {
                            error(_this.$d.elements[key]);
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
                bindNav() {
                    addClickEvent(_this.$d.elements.link, ev => {
                        _this.moveTo(ev.target.dataset[_this.$d.built.link[1]], $e => {
                            _this.$u.eA(_this.plugins, plugin => {
                                plugin.link.call(_this, $e);
                            });
                        });
                    });
                    addClickEvent(_this.$d.elements.pagination, ev => {
                        _this.moveBy(parseInt(ev.target.dataset[_this.$d.built.pagination[1]]), $e => {
                            _this.$u.eA(_this.plugins, plugin => {
                                plugin.link.call(_this, $e);
                            });
                        });
                    });

                    function addClickEvent(element, fn) {
                        _this.$u.eA(element, link => {
                            link.addEventListener("click", fn);
                        });
                    }
                },
            };

            _this.$r = {
                init(error) {
                    //Query DOM
                    _this.$d.getElements(
                        key => {
                            //throw error if elements cant load
                            _this.$u.log(1, 0, 1, key);
                        },
                        () => {
                            //continue when dom is selected
                            if (!_this.$u.isDefined(_this.$d.elements.fieldDefault)) {
                                //throw error if default is undefined
                                _this.$u.log(0, 0, 0, _this);
                            } else {
                                //else store default id
                                _this.data.defaultId = _this.$d.elements.fieldDefault[0].dataset[
                                    _this.$d.built.field[1]
                                ];

                                if (_this.options.autoBind) {
                                    _this.$d.bindNav();
                                }

                                //Init slug and move to slug
                                _this.$s.init(() => {
                                    _this.$u.log(1, 1, 1, _this);
                                }, slug => {
                                    _this.moveTo(slug);
                                });
                            }
                        }
                    );
                    //Call plugin init
                    _this.$u.eA(_this.plugins, plugin => {
                        plugin.init.call(_this, _this);
                    });
                },
                move(id, recursive, fn) {
                    _this.$u.cb(_this.$e.before, [id, _this]);
                    let result = setActive(id, () => {
                        //error
                        if (!recursive) {
                            //recurse one time on error
                            _this.$u.log(1, 1, 0, id);
                            _this.$r.move(_this.data.defaultId, true);
                        } else {
                            _this.$u.cb(_this.$e.fail, [id, _this]);
                            _this.$u.log(0, 1, 1, this);
                        }
                    }, () => {
                        //sucess
                        _this.$s.set(_this.data.activeId);
                        if (_this.options.ajax) {
                            _this.$u.getAJAX(_this.data.active.dataset[_this.$d.built.source[1]], responseText => {
                                _this.data.active.innerHTML = responseText;
                                _this.$u.cb(_this.$e.done, [_this.data.active, _this.data.activeId, _this.data.index, _this, responseText]);
                            });
                        } else {
                            _this.$u.cb(_this.$e.done, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                        }
                        //Call plugin move
                        _this.$u.eA(_this.plugins, plugin => {
                            plugin.move.call(_this, _this.data.active);
                        });

                        //Calls internal cb
                        _this.$u.cb(fn, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                    });

                    _this.$u.cb(_this.$e.always, [_this.data.active, _this.data.activeId, _this.data.index, _this]);
                    return result;

                    function setActive(id, error, done) {
                        let newField = _this.$u.findData(_this.$d.elements.field, _this.$d.built.field[1], id);

                        if (_this.$u.isDefined(newField)) {
                            _this.data.activeId = id;
                            _this.data.active = newField;
                            _this.data.index = _this.getCurrentIndex();

                            done();

                            return true;
                        } else {
                            error();
                            return false;
                        }
                    }
                }
            };

            _this.$u = {
                getElementIndex(nodelist, node) {
                    let result;

                    _this.$u.eA(nodelist, (x, i) => {
                        if (x === node) {
                            result = i;
                        }
                    });
                    return result;
                },
                findData(node, data, val) {
                    let result;

                    _this.$u.eA(node, x => {
                        if (x.dataset[data] === val) {
                            result = x;
                        }
                    });
                    return result;
                },
                //each Array
                eA(arr, fn) {
                    for (let i = 0, l = arr.length; i < l; i++) {
                        fn(arr[i], i);
                    }
                },
                //each Object
                eO(object, fn) {
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
                        _this.$u.log(1, 3, 0, xhr);
                    });
                    xhr.open("GET", url);
                    xhr.send();
                },
                cb(fn, args) {
                    if (typeof fn === "function") {
                        return fn.apply(this, args);
                    }
                },
                isDefined(val) {
                    return typeof val !== "undefined";
                },
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
            this.$r.init();
            return this;
        }
        moveTo(id, fn) {
            this.$r.move(id, false, fn);
            return this;
        }
        moveBy(val, fn) {
            let _this = this,
                newIndex = _this.data.index + val;

            if (_this.$u.isDefined(_this.$d.elements.field[newIndex])) {
                _this.$r.move(
                    _this.$d.elements.field[newIndex].dataset[_this.$d.built.field[1]],
                    false,
                    fn
                );
            } else {
                _this.$u.log(2, 1, 0, val);
            }
            return _this;
        }
        moveForward(fn) {
            return this.moveBy(1, fn);
        }
        moveBackward(fn) {
            return this.moveBy(-1, fn);
        }
        getCurrentIndex() {
            return this.$u.getElementIndex(this.$d.elements.field, this.data.active);
        }

    };

})(window);
