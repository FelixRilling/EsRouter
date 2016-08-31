'use strict';

var _window = window;
var _document = _window.document;
var _location = _window.location;

function bind() {
    var _this = this;
    var _elements = _this.options.elements;
    var keys = Object.keys(_elements.fields);
    var result = {};

    keys.forEach(function (key, i) {
        result[key] = queryByField(_elements.prefix, _elements.fields[key]);
    });

    return result;

    function queryByField(prefix, name) {
        return _document.querySelectorAll("[data-" + prefix + "-" + name + "]");
    }
}

var readData = function readData(element, prefix, key) {
    return element.dataset[getAttr(prefix, key)];
};

function getAttr(prefix, key) {
    return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
}

var setSlug = function setSlug(active) {
    _location.hash = this.options.slug.start + active;
};
var getSlug = function getSlug() {
    return _location.hash.replace(this.options.slug.start, "").replace("#", "");
};

function _moveTo(id) {
    var _this = this;
    var index = _this.data.ids.indexOf(id);
    //beforeMove Callback
    _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

    _this.data.activeId = id;
    _this.data.index = index;

    setSlug.call(_this, id);

    //afterMove Callback
    _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
}

var moveTo = function moveTo(id) {
    var _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        _moveTo.call(_this, id);
    } else {
        console.info("MISSING " + id);
    }
};
var moveBy = function moveBy(val) {
    var _this = this;
    moveTo.call(_this, _this.data.ids[_this.data.index + val]);
};
var moveForward = function moveForward(val) {
    moveBy.call(this, 1);
};
var moveBackward = function moveBackward(val) {
    moveBy.call(this, -1);
};

function init() {
    var _this = this;
    var slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    _this.elements = bind.call(_this);

    //Save Ids
    [].forEach.call(_this.elements.field, function (element) {
        var id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.field);

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
var esRouter = function esRouter() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var plugins = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

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
    moveForward: moveForward,
    moveBackward: moveBackward
};

module.exports = esRouter;