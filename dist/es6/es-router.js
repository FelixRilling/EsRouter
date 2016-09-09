var EsRouter = (function () {
'use strict';

/**
 * Store Constants
 */
const _window = window;
const _document = _window.document;
const _location = _window.location;

/**
 * Query router elements
 *
 * @private
 * @param {Object} elements The Options elements property
 * @returns {Object} Object of query results
 */
function queryElements (elements) {
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

/**
 * Read value of element data attribute
 *
 * @private
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} key The attribute key
 * @returns {String} the value of the attribute
 */
function readData (element, prefix, key) {
    function getAttr(prefix, key) {
        return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
    }

    return element.dataset[getAttr(prefix, key)];
}

/**
 * NodeList iterate
 *
 * @private
 * @param {NodeList} elements NodeList to iterate trough
 * @param {Function} fn to call
 */
const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};

/**
 * Bind UI Events
 *
 * @private
 * @param {Object} elements The Elements property
 * @param {Object} options The Options elements property
 */
function bindEvents (elements, options) {
    const _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    //Bind router-link events
    bindClick(elements.link, element => {
        const id = readData(element, options.prefix, options.fields.link);

        _this.moveTo(id);
    });

    //Bind router-pagination events
    bindClick(elements.pagination, element => {
        const val = readData(element, options.prefix, options.fields.pagination);

        _this.moveBy(Number(val));
    });
}

/**
 * Set new slug
 *
 * @private
 * @param {String} active Slug to set
 */
const setSlug = function (active) {
    _location.hash = this.options.slug.prepend + active;
};

/**
 * Read current slug
 *
 * @private
 * @returns {String} Returns slug value
 */
const getSlug = function () {
    return _location.hash.replace(this.options.slug.prepend, "").replace("#", "");
};

/**
 * Move to id
 *
 * @param {String} id Id to move to
 * @returns {Object} EsRouter instance
 */
function moveTo (id) {
    const _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        const index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        callback.call(_this, "beforeMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug.call(_this, id);

        //afterMove Callback
        callback.call(_this, "afterMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

    }

            return _this;
}

/**
 * Move by Value
 *
 * @param {Number} val Value to move by
 * @returns {Object} EsRouter instance
 */
function moveBy (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo.call(_this, newId);
    }
}

/**
 * Callback user/plugin fn
 *
 * @private
 * @param {String} type Callback function name
 * @param {Object} data Object of data to pass
 */
function callback (type, data) {
    const _this = this;

    function runCallback(fn, options) {
        const args = [data, {
            //EsRouter API
            move: {
                moveTo,
                moveBy
            },
            dom: {
                queryElements,
                bindEvents,
                readData
            },
            slug: {
                getSlug,
                setSlug
            }
        }];

        if (options) {
            args.push(options);
        }

        fn.apply(_this, args);
    }

    //Call plugins
    _this.plugins.forEach(plugin => {
        runCallback(plugin[0][type], plugin[1]);
    });

    //Call user events
    runCallback(_this.events[type]);
}

/**
 * Init esRouter instance
 *
 * @returns {Object} EsRouter instance
 */
function init () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    callback.call(_this, "beforeInit", {});

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_this.options.elements);
    if (_this.options.autobind) {
        //Bind buttons
        bindEvents.call(_this, _this.elements, _this.options.elements);
    }

    /**
     * Data
     */
    //Read default ids
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

    /**
     * Move
     */
    //Move to either saved slug or default id
    if (slug !== "") {
        _this.moveTo(slug);
    } else {
        _this.moveTo(_this.data.defaultId);
    }

    //afterInit Callback
    callback.call(_this, "afterInit", {});

    return _this;
}

/**
 * Basic esRouter Constructor
 *
 * @constructor
 * @param {Object} options To identify the instance
 * @param {Object} events To identify the instance
 * @param {Array} plugins To identify the instance
 * @returns {Object} Returns esRouter instance
 */
const EsRouter = function (options, events, plugins) {
    const _this = this;

    _this.options = {
        autobind: options.autobind || true,
        slug: {
            //Prepend to slug, ex:"currentSection="
            prepend: ""
        },
        elements: {
            //Name of the Data-atributes
            prefix: "router",
            fields: {
                //ex: prefix="router",field="section" -> "data-router-section"
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
EsRouter.prototype = {
    init,
    moveTo,
    moveBy,
    moveForward: function () {
        return this.moveBy(1);
    },
    moveBackward: function () {
        return this.moveBy(-1);
    }
};

return EsRouter;

}());