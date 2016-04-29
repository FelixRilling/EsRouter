"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {

    var _location = window.location;

    window.esRouter = function () {
        function _class(nodeList, options, events) {
            _classCallCheck(this, _class);

            this.sections = nodeList;
            this.events = {
                before: events.before,
                done: events.done,
                fail: events.fail,
                always: events.always
            };

            this.options = {
                ajax: options.ajax | false,
                log: options.log | false
            };

            this.slug = {
                preSlash: options.slug.preSlash | false,
                postSlash: options.slug.postSlash | false,
                urlFragmentInitator: typeof options.slug.urlFragmentInitator === "string" ? options.slug.urlFragmentInitator : "#",
                urlFragmentAppend: typeof options.slug.urlFragmentAppend === "string" ? options.slug.urlFragmentAppend : ""
            };
            this.slug.full = (this.slug.preSlash ? "/" : "") + this.slug.urlFragmentInitator + this.slug.urlFragmentAppend;

            this.data = {
                active: null,
                activeId: null,
                defaultId: null
            };

            if (typeof this.sections[0] === "undefined") {
                this.throwError(0);
            }
        }

        //Initialize & move to url slug


        _createClass(_class, [{
            key: "init",
            value: function init() {
                var defaultSection = this.findData(this.sections, "routerDefault", "true");
                if (defaultSection) {
                    this.data.defaultId = defaultSection.dataset.routerId;
                    var slug = this.slugGet();
                    this.writeLog("init", this.data.defaultId);
                    this.moveTo(slug);
                } else {
                    this.throwError(1);
                }
            }

            //main move-to-id

        }, {
            key: "moveTo",
            value: function moveTo(id, recursive) {
                this.callback(this.events.before, [id, this]);
                this.writeLog("move", id);
                var success = this.toggleActiveSection(id);

                if (!success) {
                    //if not found revert to default
                    if (!recursive) {
                        this.writeLog("warning", id + " not found");
                        this.moveTo(this.data.defaultId, true);
                    } else {
                        this.throwError(2);
                    }
                } else {
                    this.slugSet(this.data.activeId);
                    this.callback(this.events.done, [this.data.active, this.data.activeId, this.getCurrentIndex(), this]);
                }

                this.callback(this.events.always, [this.data.active, this.data.activeId, this.getCurrentIndex(), this]);
                return success;
            }
        }, {
            key: "moveBy",
            value: function moveBy(val) {
                var index = this.getCurrentIndex();
                if (typeof this.sections[index + val] !== "undefined") {
                    this.moveTo(this.sections[index + val].dataset["routerId"]);
                }
            }
        }, {
            key: "moveForward",
            value: function moveForward() {
                this.moveBy(1);
            }
        }, {
            key: "moveBackward",
            value: function moveBackward() {
                this.moveBy(-1);
            }
        }, {
            key: "toggleActiveSection",
            value: function toggleActiveSection(id) {
                var newSection = this.findData(this.sections, "routerId", id);
                if (typeof newSection !== "undefined") {
                    this.data.activeId = id;
                    this.data.active = newSection;
                    return true;
                } else {
                    return false;
                }
            }
            /*##############/
            / Slug functions
            /###############*/

        }, {
            key: "slugGet",
            value: function slugGet(recursive) {
                if (this.slugIsSet()) {
                    return _location.href.substr(_location.href.lastIndexOf(this.slug.full) + (this.slug.preSlash ? 2 : 1));
                } else {
                    //Only recurse once, error after that
                    if (!recursive) {
                        this.slugInit(this.data.defaultId);
                        return this.slugGet(true);
                    } else {
                        this.throwError(3);
                    }
                }
            }
        }, {
            key: "slugIsSet",
            value: function slugIsSet() {
                return _location.href.lastIndexOf(this.slug.full) > -1;
            }
        }, {
            key: "slugSet",
            value: function slugSet(id) {
                _location.href = _location.href.substr(0, _location.href.lastIndexOf(this.slug.full) + this.slug.full.length) + id;
            }
        }, {
            key: "slugInit",
            value: function slugInit(id) {
                _location.href = _location.href + this.slug.full + id;
            }

            /*##############/
            / Utility functions
            /###############*/

        }, {
            key: "getCurrentIndex",
            value: function getCurrentIndex() {
                return this.getElementIndex(this.sections, this.data.active);
            }
        }, {
            key: "getElementIndex",
            value: function getElementIndex(nodelist, node) {
                var result = void 0;
                this.iterateDomNode(nodelist, function (x, i) {
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
                this.iterateDomNode(node, function (x) {
                    if (x.dataset[data] === val) {
                        result = x;
                    }
                });
                return result;
            }
        }, {
            key: "iterateDomNode",
            value: function iterateDomNode(nodelist, fn) {
                for (var i = 0; i < nodelist.length; i++) {
                    fn(nodelist[i], i);
                }
            }
        }, {
            key: "callback",
            value: function callback(fn, args) {
                if (typeof fn === "function") {
                    fn.apply(this, args);
                }
            }
        }, {
            key: "writeLog",
            value: function writeLog(type, message) {
                if (this.options.log) {
                    console.log("esRouter " + type + ": " + message);
                }
            }
        }, {
            key: "throwError",
            value: function throwError(code) {
                throw new Error("esRouter error: " + code);
                this.callback(this.events.fail, [code, this]);
            }
        }]);

        return _class;
    }();
})(window);
//# sourceMappingURL=esRouter-es5.js.map
