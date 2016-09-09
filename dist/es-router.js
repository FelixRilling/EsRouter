"use strict";

var esRouter = function () {
    'use strict';

    var _window = window;
    var _document = _window.document;
    var _location = _window.location;

    function query(elements) {
        var fieldKeys = Object.keys(elements.fields);
        var result = {};

        function queryByField(prefix, name) {
            return _document.querySelectorAll("[data-" + prefix + "-" + name + "]");
        }

        fieldKeys.forEach(function (key, i) {
            result[key] = queryByField(elements.prefix, elements.fields[key]);
        });

        return result;
    }

    function readData(element, prefix, key) {
        function getAttr(prefix, key) {
            return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
        }

        return element.dataset[getAttr(prefix, key)];
    }

    var eachNode = function eachNode(elements, fn) {
        [].forEach.call(elements, function (element) {
            fn(element);
        });
    };

    function bind(categories, elements) {
        var _this = this;

        function bindClick(elements, fn) {
            eachNode(elements, function (element) {
                element.addEventListener("click", function (ev) {
                    fn(element, ev);
                }, false);
            });
        }

        //Bind router-link events
        bindClick(categories.link, function (element) {
            var id = readData(element, elements.prefix, elements.fields.link);

            _this.moveTo(id);
        });

        //Bind router-pagination events
        bindClick(categories.pagination, function (element) {
            var val = readData(element, elements.prefix, elements.fields.pagination);

            _this.moveBy(Number(val));
        });
    }

    function read() {
        var _this = this;

        //Save Ids
        eachNode(_this.elements.field, function (element) {
            var id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.field);

            _this.data.ids.push(id);

            if (element === _this.elements.fieldDefault[0]) {
                _this.data.defaultId = id;
            }
        });
    }

    var setSlug = function setSlug(active) {
        _location.hash = this.options.slug.start + active;
    };
    var getSlug = function getSlug() {
        return _location.hash.replace(this.options.slug.start, "").replace("#", "");
    };

    function init() {
        var _this = this;
        var slug = getSlug.call(_this);

        //beforeInit Callback
        _this.events.beforeInit.call(_this);

        //Collect DOM elements
        _this.elements = query(_this.options.elements);
        if (_this.options.autobind) {
            //Bind buttons
            bind.call(_this, _this.elements, _this.options.elements);
        }
        //Read default ids
        read.call(_this);

        //Move to either saved slug or default id
        if (slug !== "") {
            _this.moveTo(slug);
        } else {
            _this.moveTo(_this.data.defaultId);
        }

        //afterInit Callback
        _this.events.afterInit.call(_this);
    }

    function move(id) {
        var _this = this;
        var index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug.call(_this, id);

        //afterMove Callback
        _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
    }

    function moveTo(id) {
        var _this = this;

        if (_this.data.ids.includes(id)) {
            move.call(_this, id);
        }
    }

    function moveBy(val) {
        var _this = this;
        var newId = _this.data.ids[_this.data.index + val];

        if (typeof newId !== "undefined") {
            moveTo.call(_this, newId);
        }
    }

    /**
     * Basic esRouter Constructor
     *
     * @constructor
     * @param {String} id To identify the instance
     * @returns {Object} Returns esRouter instance
     */
    var esRouter = function esRouter(options, events, plugins) {
        var _this = this;

        _this.options = {
            autobind: options.autobind || true,
            slug: {
                start: ""
            },
            elements: {
                prefix: "router",
                fields: {
                    field: "section",
                    fieldDefault: "default",
                    link: "href",
                    pagination: "pagin",
                    source: "src"
                }
            }
        };
        _this.events = {
            beforeInit: events.beforeInit || function () {},
            afterInit: events.afterInit || function () {},
            beforeMove: events.beforeMove || function () {},
            afterMove: events.afterMove || function () {}
        };
        _this.plugins = plugins;

        _this.data = {
            ids: [],
            activeId: null,
            defaultId: null,
            index: 0
        };
        _this.elements = {};
    };

    /**
     * Expose esRouter methods
     */
    esRouter.prototype = {
        init: init,
        moveTo: moveTo,
        moveBy: moveBy,
        moveForward: function moveForward() {
            this.moveBy(1);
        },
        moveBackward: function moveBackward() {
            this.moveBy(-1);
        }
    };

    return esRouter;
}();