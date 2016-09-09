var esRouter = (function () {
'use strict';

const _window = window;
const _document = _window.document;
const _location = _window.location;

function query (elements) {
    const fieldKeys = Object.keys(elements.fields);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    fieldKeys.forEach((key, i) => {
        result[key] = queryByField(elements.prefix, elements.fields[key]);
    });

    return result;
}

function readData (element, prefix, key) {
    function getAttr(prefix, key) {
        return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
    }

    return element.dataset[getAttr(prefix, key)];
}

const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};

function bind (categories, elements) {
    const _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    //Bind router-link events
    bindClick(categories.link, element => {
        const id = readData(element, elements.prefix, elements.fields.link);

        _this.moveTo(id);
    });

    //Bind router-pagination events
    bindClick(categories.pagination, element => {
        const val = readData(element, elements.prefix, elements.fields.pagination);

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

function move (id) {
    const _this = this;
    const index = _this.data.ids.indexOf(id);

    //beforeMove Callback
    _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

    //Set new section
    _this.data.activeId = id;
    _this.data.index = index;
    setSlug.call(_this, id);

    //afterMove Callback
    _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
}

function moveTo (id) {
    const _this = this;

    if (_this.data.ids.includes(id)) {
        move.call(_this, id);
    }
}

function moveBy (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

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
const esRouter = function (options, events, plugins) {
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
    moveForward: function () {
        this.moveBy(1);
    },
    moveBackward: function () {
        this.moveBy(-1);
    }
};

return esRouter;

}());