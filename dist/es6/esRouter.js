var esRouter = (function () {
'use strict';

const _window = window;
const _document = _window.document;
const _location = _window.location;

function query () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    keys.forEach((key, i) => {
        result[key] = queryByField(_elements.prefix, _elements.fields[key]);
    });

    return result;
}

const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};

function readData (element, prefix, key) {
    const getAttr = function (prefix, key) {
        return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
    };

    return element.dataset[getAttr(prefix, key)];
};

function bind (categories) {
    const _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    bindClick(categories.link, element => {
        const id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.link);

        _this.moveTo(id);
    });
    
    bindClick(categories.pagination, element => {
        const val = readData(element, _this.options.elements.prefix, _this.options.elements.fields.pagination);

        _this.moveBy(Number(val));
    });
}

function read () {
    const _this = this;

    //Save Ids
    eachNode(_this.elements.field, element => {
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

const setSlug = function (active) {
    _location.hash = this.options.slug.start + active;
};
const getSlug = function () {
    return _location.hash.replace(this.options.slug.start, "").replace("#", "");
};

function init () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    //Collect DOM elements
    _this.elements = query.call(_this);
    if (_this.options.autobind) {
        //Bind buttons
        bind.call(_this, _this.elements);
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

function moveTo (id) {
    const _this = this;

    if (_this.data.ids.includes(id)) {

        const index = _this.data.ids.indexOf(id);
        //beforeMove Callback
        _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug.call(_this, id);

        //afterMove Callback
        _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
    } else {
        console.info("MISSING " + id);
    }
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
    moveBy: function (val) {
        const _this = this;

        _this.moveTo(_this.data.ids[_this.data.index + val]);
    },
    moveForward: function () {
        this.moveBy(1);
    },
    moveBackward: function () {
        this.moveBy(-1);
    }
};

return esRouter;

}());