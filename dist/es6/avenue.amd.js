/**
 * Avenue v3.10.0
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

define('avenue', function () { 'use strict';

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
const eachNode = function(elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};

/**
 * Bind UI Events
 * @param {Object} elements The elements
 * @param {Object} type The event type
 * @param {Object} fn The event function
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
 * @param {Object} subEvents Callback subEvents
 */
function callback(fn, data, api, options, subEvents) {
    if (typeof fn === "function") {
        const args = [data, api];

        if (options) {
            args.push(options);
        }
        if (subEvents) {
            args.push(subEvents);
        }

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
var moveTo = function(instance, id) {
    if (instance.data.ids.indexOf(id) > -1) {
        const index = instance.data.ids.indexOf(id);
        const element = instance.elements.field[index];

        //beforeMove Callback
        runCallbacks(instance, "beforeMove", {
            id,
            index,
            element
        });

        //Set new section
        instance.data.activeId = id;
        instance.data.index = index;
        setSlug(instance.options.slugPrepend, id);

        //afterMove Callback
        runCallbacks(instance, "afterMove", {
            id,
            index,
            element
        });

    }

    return instance;
}

/**
 * Move by Value
 * @param {Number} val Value to move by
 * @returns {Object} Avenue instance
 */
var _moveBy = function(instance, val) {
    const newId = instance.data.ids[instance.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo(instance, newId);
    }
}

/**
 * Returns avenue api
 * @param {Object} instance Avenue instance
 * @returns {Object} Avenue api
 */
var getApi = function(instance) {

    //Avenue API
    return {
        data: instance.data,
        options: instance.options,
        elements: instance.elements,
        callback,
        util: {
            eachNode
        },
        move: {
            //Instance specific, needs context bind
            moveTo: function(id) {
                return moveTo(instance, id);
            },
            moveBy: function(val) {
                return _moveBy(instance, val);
            }
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
    };
}

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
var runCallbacks = function(instance, type, data) {
    const _plugins = instance.plugins;
    const _api = getApi(instance);

    //Call plugins
    _plugins.active.forEach(plugin => {
        const pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            callback(pluginObj[type], data, _api, plugin.options, plugin.events);
        } else {
            throw `Missing plugin ${plugin.name}`;
        }
    });

    //Call user events
    callback(instance.events[type], data, _api);
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

            moveTo(_this, id);
        });

        //Bind router-pagination events
        bind(_this.elements.pagination, "click", element => {
            const val = Number(readData(element, _options.attributes.prefix, _options.attributes.types.pagination));

            _moveBy(_this, val);
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
        moveTo(_this, slug);
    } else {
        moveTo(_this, _this.data.defaultId);
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
    moveTo: function(id) {
        return _moveBy(this, id);
    },
    moveBy: function(val) {
        return _moveBy(this, val);
    },
    moveForward: function() {
        return _moveBy(this, 1);
    },
    moveBackward: function() {
        return _moveBy(this, -1);
    }
};

return Avenue;

});