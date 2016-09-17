/**
 * Avenue v3.8.1
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

var Avenue = (function () {
'use strict';

/**
 * Store Constants
 */
const _window = window;
const _document = _window.document;
const _location = _window.location;

/**
 * Get data query for dom element
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Selector query
 */
const getDataQueryDom = function(prefix, name) {
    return `[data-${prefix}-${name}]`;
};

/**
 * Get data query for node property
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Prop query
 */
const getDataQueryProp = function(prefix, name) {
    return prefix + name.substr(0, 1).toUpperCase() + name.substr(1);
};

/**
 * Read value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @returns {String} Value of the attribute
 */
const readData = function(element, prefix, name) {
    return element.dataset[getDataQueryProp(prefix, name)];
};

/**
 * Set value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @param {String} value The attribute value
 */
const writeData = function(element, prefix, name, value) {
    element.dataset[getDataQueryProp(prefix, name)] = value;
};

/**
 * Query router elements
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
var queryElements = function(attributes) {
    const fieldKeys = Object.keys(attributes.types);
    const result = {};

    fieldKeys.forEach((key, i) => {
        const query = getDataQueryDom(attributes.prefix, attributes.types[key]);

        result[key] = _document.querySelectorAll(query);
    });

    return result;
}

/**
 * NodeList iterate
 * @private
 * @param {NodeList} elements NodeList to iterate trough
 * @param {Function} fn Function to call
 */
const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};

/**
 * Bind UI Events
 * @param {Object} elements The Elements property
 * @param {Object} fn The Event function
 */
var bind = function(elements, type, fn) {
    eachNode(elements, element => {
        element.addEventListener(type, ev => {
            fn(element, ev);
        }, false);
    });
}

/**
 * Runs callback with injected API
 * @param {Object} context Instance context
 * @param {Function} fn Callback function
 * @param {Object} data Callback data
 * @param {Object} options Callback options
 */
function callback(fn, data, api, options, subEvents) {
    if (typeof fn === "function") {
        const args = [data, api, options, subEvents];

        fn.apply(null, args);
    }
}

/**
 * Set new slug
 * @param {String} slugPrepend Slug prefix
 * @param {String} active Slug to set
 */
const setSlug = function(slugPrepend, active) {
    _location.hash = slugPrepend + active;
};

/**
 * Read current slug
 * @param {String} slugPrepend Slug prefix
 * @returns {String} Slug value
 */
const getSlug = function(slugPrepend) {
    return _location.hash.replace(slugPrepend, "").replace("#", "");
};

/**
 * Move to id
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
var moveTo = function(id) {
    const _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        const index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        runCallbacks(_this, "beforeMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug(_this.options.slugPrepend, id);

        //afterMove Callback
        runCallbacks(_this, "afterMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

    }

    return _this;
}

/**
 * Move by Value
 * @param {Number} val Value to move by
 * @returns {Object} Avenue instance
 */
var moveBy = function (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo.call(_this, newId);
    }
}

var getApi = function(context) {
    //Avenue API
    return {
        data: context.data,
        options: context.options,
        elements: context.elements,
        methods: {
            callback,
            util: {
                eachNode
            },
            move: {
                moveBy,
                moveTo
            },
            slug: {
                setSlug,
                getSlug
            },
            dom: {
                queryElements,
                bind,
                readData,
                writeData
            }
        }
    };
}

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
var runCallbacks = function(context, type, data) {
    const _plugins = context.plugins;
    const api = getApi(context);

    //Call plugins
    _plugins.active.forEach(plugin => {
        const pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            const fn = pluginObj[type];
            //Check if plugin event exists
            if (fn) {
                callback(fn, data, api, plugin.options, plugin.events);
            }
        } else {
            throw `Missing plugin ${plugin.name}`;
        }
    });

    //Call user events
    callback(context.events[type], data, api);
}

/**
 * Init Avenue instance
 * @returns {Object} Avenue instance
 */
var init = function() {
    const _this = this;
    const _options = _this.options;
    const slug = getSlug(_this.options.slugPrepend);

    //beforeInit Callback
    runCallbacks(_this, "beforeInit", {});

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_options.attributes);
    if (_options.autobind) {
        //Bind router-link events
        bind(_this.elements.link, "click", element => {
            const id = readData(element, _options.attributes.prefix, _options.attributes.types.link);

            _this.moveTo(id);
        });

        //Bind router-pagination events
        bind(_this.elements.pagination, "click", element => {
            const val = readData(element, _options.attributes.prefix, _options.attributes.types.pagination);

            _this.moveBy(Number(val));
        });
    }

    /**
     * Data
     */
    //Read ids
    eachNode(_this.elements.field, element => {
        const id = readData(
            element,
            _options.attributes.prefix,
            _options.attributes.types.field
        );

        if (element === _this.elements.fieldDefault[0]) {
            _this.data.defaultId = id;
        }

        _this.data.ids.push(id);
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
    runCallbacks(_this, "afterInit", {});

    return _this;
}

/**
 * Basic Avenue Constructor
 * @constructor
 * @param {Object} options Options to use
 * @param {Object} events Events to use
 * @param {Array} plugins Array of plugins
 * @returns {Object} Avenue instance
 */
const Avenue = function(options, events, plugins) {
    const _this = this;

    //Options
    options = options || {};
    _this.options = {
        autobind: options.autobind || true, //bind click events to data-router-href/link
        slugPrepend: options.slugPrepend || "", //Prepend to slug, ex:"currentSection="
        attributes: {
            //Name of the Data-atributes
            prefix: "router",
            types: {
                //ex: prefix="router",field="section" -> "data-router-section"
                field: "section",
                fieldDefault: "default",
                link: "href",
                pagination: "pagin",
                source: "src"
            }
        }
    };

    //Events
    events = events || {};
    _this.events = {
        beforeInit: events.beforeInit,
        afterInit: events.afterInit,
        beforeMove: events.beforeMove,
        afterMove: events.afterMove
    };

    //Instance Plugins
    _this.plugins = {
        active: plugins || [],
        //Ref plugins from global constructor
        container: Avenue.plugins
    };


    //Data
    _this.data = {
        ids: [],
        activeId: null,
        defaultId: null,
        index: 0
    };

    //Elements
    _this.elements = {};
};

//Plugins Container
Avenue.plugins = {};

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

return Avenue;

}());