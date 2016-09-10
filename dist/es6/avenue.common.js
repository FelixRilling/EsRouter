/**
 * Avenue v3.3.1
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

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
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
function queryElements(attributes) {
    const fieldKeys = Object.keys(attributes.types);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    fieldKeys.forEach((key, i) => {
        result[key] = queryByField(attributes.prefix, attributes.type[key]);
    });

    return result;
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
 * @param {Object} fn The Event function
 */
function bindClick(elements, fn) {
    eachNode(elements, element => {
        element.addEventListener("click", ev => {
            fn(element, ev);
        }, false);
    });
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
 * Set new slug
 *
 * @private
 * @param {String} active Slug to set
 */
const setSlug = function(slugPrepend, active) {
    _location.hash = slugPrepend + active;
};

/**
 * Read current slug
 *
 * @private
 * @returns {String} Returns slug value
 */
const getSlug = function(slugPrepend) {
    return _location.hash.replace(slugPrepend, "").replace("#", "");
};

//import queryElements from "../dom/queryElements";
//import bindEvents from "../dom/bindEvents";
//import readData from "../dom/readData";

/**
 * Callback user/plugin fn
 *
 * @private
 * @param {String} type Callback function name
 * @param {Object} data Object of data to pass
 */
function callback(type, data) {
    const _this = this;

    function runCallback(fn, options) {
        const api = {
            //Avenue API
            instance: _this,
        };
        const args = [data, api];

        if (options) {
            args.push(options);
        }

        fn.apply(_this, args);
    }

    //Call plugins
    _this.plugins.forEach(plugin => {
        const fn = plugin[0][type];
        if (fn) {
            runCallback(fn, plugin[1]);
        }
    });

    //Call user events
    runCallback(_this.events[type]);
}

/**
 * Init Avenue instance
 *
 * @returns {Object} Avenue instance
 */
function init() {
    const _this = this;
    const slug = getSlug(_this.options.slugPrepend);

    //beforeInit Callback
    //callback.call(_this, "beforeInit", {});

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_this.options.attributes);
    if (_this.options.autobind) {
        //Bind buttons
        //Bind router-link events
        bindClick(_this.elements.link, element => {
            const id = readData(element, _this.options.prefix, _this.options.type.link);

            _this.moveTo(id);
        });

        //Bind router-pagination events
        bindClick(_this.element.pagination, element => {
            const val = readData(element, _this.options.prefix, _this.options.type.pagination);

            _this.moveBy(Number(val));
        });
    }

    /**
     * Data
     */
    //Read default ids
    /*eachNode(_this.elements.field, element => {
        const id = readData(
            element,
            _this.options.elements.prefix,
            _this.options.elements.fields.field
        );

        _this.data.ids.push(id);

        if (element === _this.elements.fieldDefault[0]) {
            _this.data.defaultId = id;
        }
    });*/

    /**
     * Move
     */
    //Move to either saved slug or default id
    if (slug !== "") {
        //  _this.moveTo(slug);
    } else {
        //_this.moveTo(_this.data.defaultId);
    }

    //afterInit Callback
    //callback.call(_this, "afterInit", {});

    return _this;
}

/**
 * Move to id
 *
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
function moveTo(id) {
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
        setSlug.call(_this.options.slugPrepend, id);

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
 * @returns {Object} Avenue instance
 */
function moveBy (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo.call(_this, newId);
    }
}

/**
 * Basic Avenue Constructor
 *
 * @constructor
 * @param {Object} options To identify the instance
 * @param {Object} events To identify the instance
 * @param {Array} plugins To identify the instance
 * @returns {Object} Returns Avenue instance
 */
const Avenue = function(options, events, plugins) {
    const _this = this;

    /**
     * Options
     */
    options = options || {};
    _this.options = {
        autobind: options.autobind || true, //bind click events to data-router-href/link
        slugPrepend: options.slugPrepend || "", //Prepend to slug, ex:"currentSection="
        attributes: {
            //Name of the Data-atributes
            prefix: "router",
            type: {
                //ex: prefix="router",field="section" -> "data-router-section"
                field: "section",
                fieldDefault: "default",
                link: "href",
                pagination: "pagin",
                source: "src"
            }
        }
    };

    /**
     * Events
     */
    events = events || {};
    _this.events = {
        beforeInit: events.beforeInit || function() {},
        afterInit: events.afterInit || function() {},
        beforeMove: events.beforeMove || function() {},
        afterMove: events.afterMove || function() {}
    };

    /**
     * Plugins
     */
    _this.plugins = plugins || [];

    /**
     * Data
     */
    _this.data = {
        ids: [],
        activeId: null,
        defaultId: null,
        index: 0
    };

    /**
     * Elements
     */
    _this.elements = {};
};

/**
 * Expose Avenue methods
 */
Avenue.prototype = {
    init,
    moveTo,
    moveBy,
    moveForward: function() {
        return this.moveBy(1);
    },
    moveBackward: function() {
        return this.moveBy(-1);
    }
};

module.exports = Avenue;