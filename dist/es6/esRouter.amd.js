define('esrouter', function () { 'use strict';

const _window = window;

const _document = _window.document;

function queryForField(prefix, name) {
    return _document.querySelectorAll(`[data-${prefix}-${name}]`);
}

function bind () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);
    const result = {};

    keys.forEach((key, i) => {
        result[key] = queryForField(_elements.prefix, _elements.fields[key]);
    });

    return result;
}

function readData (element, prefix, key) {
    const attr = prefix + key.substr(0, 1).toUpperCase() + key.substr(1);

    return element.dataset[attr];
}

function init () {
    const _this = this;

    _this.elements = bind.call(_this);

    [].forEach.call(_this.elements.field, element => {
        const id = readData(
            element,
            _this.options.elements.prefix,
            _this.options.elements.fields.field
        );

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
const esRouter = function (options = {}, events = {}, plugins = []) {
    const _this = this;

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
    init,
    moveTo: init,
    moveBy: init
};

return esRouter;

});