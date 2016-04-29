"use strict";

(function(window) {

    let _location = window.location;

    window.esRouter = class {
        constructor(
            nodeList,
            options,
            events
        ) {
            let _this = this;
            _this.sections = nodeList;
            _this.events = {
                before: events.before,
                done: events.done,
                fail: events.fail,
                always: events.always
            };

            _this.options = {
                ajax: options.ajax,
                log: options.log
            };


            //Fake options if nonexstistant
            _this.options = options | {
                slug: options.slug | {},
                domAttr: options.domAttr | {}
            };

            _this.slug = {
                preSlash: options.slug.preSlash,
                postSlash: options.slug.postSlash,
                urlFragmentInitator: (typeof options.slug.urlFragmentInitator === "string") ? options.slug.urlFragmentInitator : "#",
                urlFragmentAppend: (typeof options.slug.urlFragmentAppend === "string") ? options.slug.urlFragmentAppend : "",
            };
            _this.slug.built = (_this.slug.preSlash ? "/" : "") + _this.slug.urlFragmentInitator + _this.slug.urlFragmentAppend;


            /*_this.domAttr = {
                buildAttr: function(pre, attr) {
                    return [buildDomAttr(pre, attr), buildDataSet(pre, attr)];

                    function buildDomAttr(pre, attr) {
                        return "data-" + pre + "-" + attr;
                    }

                    function buildDataSet(pre, attr) {
                        return pre + attr[0].toUpperCase() + attr.substr(1);
                    }
                },

                corePrefix: options.domAttr.corePrefix | "router", //Core of the data-router attribute
                section: options.domAttr.section | "section", // #coreprefix#-#section# => data-router-section
                sectionDefault: options.domAttr.sectionDefault | "default",
                link: options.domAttr.link | "href",
                pagination: options.domAttr.pagination | "pagin",
                built: {
                    section: _this.domAttr.buildAttr(_this.domAttr.corePrefix, _this.domAttr.section),
                    sectionDefault: _this.domAttr.buildAttr(_this.domAttr.corePrefix, _this.domAttr.sectionDefault),
                    link: _this.domAttr.buildAttr(_this.domAttr.corePrefix, _this.domAttr.link),
                    pagination: _this.domAttr.buildAttr(_this.domAttr.corePrefix, _this.domAttr.pagination),
                }
            };*/

            _this.data = {
                active: null,
                activeId: null,
                defaultId: null
            };

            if (typeof _this.sections[0] === "undefined") {
                _this.throwError(0);
            }

        }


        //Initialize & move to url slug
        init() {
            let _this = this,
                defaultSection = _this.findData(
                    _this.sections,
                    "routerDefault",
                    "true"
                );
            if (defaultSection) {
                _this.data.defaultId = defaultSection.dataset.routerId;
                let slug = _this.slugGet();
                _this.writeLog("init", _this.data.defaultId);
                _this.moveTo(slug);
            } else {
                _this.throwError(1);
            }

        }

        //main move-to-id
        moveTo(id, recursive) {
            let _this = this;
            _this.callback(_this.events.before, [id, _this]);
            _this.writeLog("move", id);
            let success = (id => {
                let newSection = _this.findData(_this.sections, "routerId", id);
                if (typeof newSection !== "undefined") {
                    _this.data.activeId = id;
                    _this.data.active = newSection;
                    return true;
                } else {
                    return false;
                }
            })(id);

            if (!success) {
                //if not found revert to default
                if (!recursive) {
                    _this.writeLog("warning", id + " not found");
                    _this.moveTo(_this.data.defaultId, true);
                } else {
                    _this.throwError(2);
                }
            } else {
                _this.slugSet(_this.data.activeId);
                _this.callback(_this.events.done, [_this.data.active, _this.data.activeId, _this.getCurrentIndex(), _this]);
            }

            _this.callback(_this.events.always, [_this.data.active, _this.data.activeId, _this.getCurrentIndex(), _this]);
            return success;
        }
        moveBy(val) {
            let _this = this;
            let index = _this.getCurrentIndex();
            if (typeof _this.sections[index + val] !== "undefined") {
                _this.moveTo(
                    _this.sections[index + val].dataset["routerId"]
                );
            }
        }
        moveForward() {
            this.moveBy(1);
        }
        moveBackward() {
                this.moveBy(-1);
            }
            /*##############/
            / Slug functions
            /###############*/
        slugGet(recursive) {
            let _this = this;
            if (_location.href.lastIndexOf(this.slug.built) > -1) {
                return _location.href.substr(
                    _location.href.lastIndexOf(_this.slug.built) +
                    (_this.slug.preSlash ? 2 : 1)
                );
            } else {
                //Only recurse once, error after that
                if (!recursive) {
                    _this.slugInit(_this.data.defaultId);
                    return _this.slugGet(true);
                } else {
                    _this.throwError(3);
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
            return _this.getElementIndex(_this.sections, _this.data.active);
        }
        getElementIndex(nodelist, node) {
            let result;
            this.iterateDomNode(nodelist, function(x, i) {
                if (x === node) {
                    result = i;
                }
            });
            return result;
        }
        findData(node, data, val) {
            let result;
            this.iterateDomNode(node, function(x) {
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
        callback(fn, args) {
            if (typeof fn === "function") {
                fn.apply(this, args);
            }
        }
        writeLog(type, message) {
            if (this.options.log) {
                console.log("esRouter " + type + ": " + message);
            }
        }
        throwError(code) {
            let _this = this;
            _this.callback(_this.events.fail, [code, _this]);
            throw new Error("esRouter error: " + code);
        }
    };

})(window);
