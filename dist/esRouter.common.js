'use strict';

var _window = window;

var _document = _window.document;

function queryForField(prefix, name) {
    return _document.querySelectorAll("[data-" + prefix + "-" + name + "]");
}

function bind() {
    var _this = this;
    var _elements = _this.options.elements;
    var keys = Object.keys(_elements.fields);
    var result = {};

    keys.forEach(function (key, i) {
        result[key] = queryForField(_elements.prefix, _elements.fields[key]);
    });

    return result;
}

function readData(element, prefix, key) {
    var attr = prefix + key.substr(0, 1).toUpperCase() + key.substr(1);

    return element.dataset[attr];
}

function init() {
    var _this = this;

    _this.elements = bind.call(_this);

    [].forEach.call(_this.elements.field, function (element) {
        var id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.field);

        _this.data.ids.push(id);

        if (element === _this.elements.fieldDefault[0]) {
            _this.data.defaultId = id;
        }
    });
}

/**
 * Basic esRouter Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns esRouter instance
 */
var esRouter = function esRouter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var plugins = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var _this = this;

    _this.options = {
        log: options.log || false,
        autoBind: options.autoBind || true,
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
        init: events.init || null,
        bind: events.bind || null,
        beforeMove: events.beforeMove || null,
        afterMove: events.afterMove || null
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
    moveTo: init,
    moveBy: init
};

module.exports = esRouter;