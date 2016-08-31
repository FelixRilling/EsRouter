var esRouter = (function () {
'use strict';

const _window = window;
const _document = _window.document;
const _location = _window.location;

function bind () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);
    const result = {};

    keys.forEach((key, i) => {
        result[key] = queryByField(_elements.prefix, _elements.fields[key]);
    });

    return result;

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }
}

const readData = function (element, prefix, key) {
    return element.dataset[getAttr(prefix, key)];
};

function getAttr(prefix, key) {
    return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
}

const setSlug = function (active) {
    _location.hash = this.options.slug.start + active;
};
const getSlug = function () {
    return _location.hash.replace(this.options.slug.start, "").replace("#", "");
};

function _moveTo (id) {
    const _this = this;
    const index = _this.data.ids.indexOf(id);
    //beforeMove Callback
    _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

    _this.data.activeId = id;
    _this.data.index = index;

    setSlug.call(_this, id);

    //afterMove Callback
    _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
}

const moveTo = function (id) {
    const _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        _moveTo.call(_this, id);
    } else {
        console.info("MISSING " + id);
    }
};
const moveBy = function (val) {
    const _this = this;
    moveTo.call(_this, _this.data.ids[_this.data.index + val]);
};
const moveForward = function (val) {
    moveBy.call(this, 1);
};
const moveBackward = function (val) {
    moveBy.call(this, -1);
};

function init () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    _this.elements = bind.call(_this);

    //Save Ids
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

    //Move to either saved slug or default id
    if (slug !== "") {
        moveTo.call(_this, slug);
    } else {
        moveTo.call(_this, _this.data.defaultId);
    }

    //afterInit Callback
    _this.events.afterInit.call(_this);
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
    init,
    moveTo,
    moveBy,
    moveForward,
    moveBackward
};

return esRouter;

}());