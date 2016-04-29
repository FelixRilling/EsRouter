"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (location, window) {

    var esRouter = function () {
        function esRouter() {
            var nodeList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var events = arguments.length <= 1 || arguments[1] === undefined ? {
                before: null,
                done: null,
                fail: null,
                always: null
            } : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {
                ajax: false,
                slug: {
                    preSlash: true,
                    urlFragmentInitator: "#",
                    urlFragmentAppend: ""
                }
            } : arguments[2];

            _classCallCheck(this, esRouter);

            this.sections = nodeList;
            this.events = events;
            this.options = options;
            this.slug = (options.slug.preSlash ? "/" : "") + options.slug.urlFragmentInitator + options.slug.urlFragmentAppend;

            this.active = null;
            this.activeId = null;
            this.defaultId = null;

            if (typeof this.sections[0] === "undefined") {
                throw new Error("Sections undefined! are section datasets bound?");
            }
        }

        //Initialize & move to url slug


        _createClass(esRouter, [{
            key: "init",
            value: function init() {
                this.defaultId = this.findData(this.sections, "sectionDefault", "true").dataset.routerId;

                var slug = this.getSlug();
                console.log("Router: init", slug);
                this.moveTo(slug);
            }

            //main move-to-id

        }, {
            key: "moveTo",
            value: function moveTo(id) {
                this.events.before(id, this);

                this.activeId = id;
                console.log("Router: move", this.activeId);
                this.setSlug(id);
                if (!this.toggleActiveSection(id)) {
                    //if not found revert to default
                    console.log("Router: error: #" + id + " not found");
                    this.moveTo(this.defaultId);
                }
                this.callback(this.activeId, this.active, this.getCurrentIndex());
                return id;
            }
        }, {
            key: "moveForward",
            value: function moveForward() {
                this.movePaginated(-1);
            }
        }, {
            key: "moveBackward",
            value: function moveBackward() {
                this.movePaginated(1);
            }
        }, {
            key: "movePaginated",
            value: function movePaginated(val) {
                var index = this.getCurrentIndex();
                if (typeof this.sections[index + val] !== "undefined") {
                    this.moveTo(this.sections[index + val].dataset["routerId"]);
                }
            }
        }, {
            key: "toggleActiveSection",
            value: function toggleActiveSection(id) {
                this.iterateDomNode(this.sections, function (e) {
                    e.classList.remove("active");
                });

                var newSection = this.findData(this.sections, "routerId", id);
                if (typeof newSection !== "undefined") {
                    newSection.classList.add("active");
                    this.active = newSection;
                    return true;
                } else {
                    return false;
                }
            }
            /*##############/
            / Slug functions
            /###############*/

        }, {
            key: "getSlug",
            value: function getSlug() {
                var index = location.href.lastIndexOf(this.slug);
                if (index > -1) {
                    return location.href.substr(location.href.lastIndexOf(this.slug) + 2);
                } else {
                    this.initSlug(this.defaultId);
                    return this.getSlug();
                }
            }
        }, {
            key: "setSlug",
            value: function setSlug(id) {
                location.href = location.href.substr(0, location.href.lastIndexOf(this.slug) + 2) + id;
            }
        }, {
            key: "initSlug",
            value: function initSlug(id) {
                location.href = location.href + "#" + id;
            }

            /*##############/
            / Utility functions
            /###############*/

        }, {
            key: "getCurrentIndex",
            value: function getCurrentIndex() {
                return this.getElementIndex(this.sections, this.active);
            }
        }, {
            key: "getElementIndex",
            value: function getElementIndex(nodelist, node) {
                var result;
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
                var result;
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
        }]);

        return esRouter;
    }();

    //Export
    window.esRouter = esRouter;
})(location, window);
//# sourceMappingURL=esRouter-es5.js.map
