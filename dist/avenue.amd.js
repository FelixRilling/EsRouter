/**
 * Avenue v3.9.0
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

define('avenue', function () { 'use strict';

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
        var args = [data, api];

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
 * Store Constants
 */

var _window = window;
var _document = _window.document;
var _location = _window.location;

/**
 * Get data query for dom element
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Selector query
 */

var getDataQueryDom = function getDataQueryDom(prefix, name) {
  return "[data-" + prefix + "-" + name + "]";
};

/**
 * Get data query for node property
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Prop query
 */
var getDataQueryProp = function getDataQueryProp(prefix, name) {
  return prefix + name.substr(0, 1).toUpperCase() + name.substr(1);
};

/**
 * Read value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @returns {String} Value of the attribute
 */
var readData = function readData(element, prefix, name) {
  return element.dataset[getDataQueryProp(prefix, name)];
};

/**
 * Set value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @param {String} value The attribute value
 */
var writeData = function writeData(element, prefix, name, value) {
  element.dataset[getDataQueryProp(prefix, name)] = value;
};

/**
 * Query router elements
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
var queryElements = function (attributes) {
    var fieldKeys = Object.keys(attributes.types);
    var result = {};

    fieldKeys.forEach(function (key, i) {
        var query = getDataQueryDom(attributes.prefix, attributes.types[key]);

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

var eachNode = function eachNode(elements, fn) {
    [].forEach.call(elements, function (element) {
        fn(element);
    });
};

/**
 * Bind UI Events
 * @param {Object} elements The elements
 * @param {Object} type The event type
 * @param {Object} fn The event function
 */
var bind = function (elements, type, fn) {
    eachNode(elements, function (element) {
        element.addEventListener(type, function (ev) {
            fn(element, ev);
        }, false);
    });
}

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
var runCallbacks = function (instance, type, data) {
    var _plugins = instance.plugins;

    //Call plugins
    _plugins.active.forEach(function (plugin) {
        var pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            callback(pluginObj[type], data, instance.api, plugin.options, plugin.events);
        } else {
            throw "Missing plugin " + plugin.name;
        }
    });

    //Call user events
    callback(instance.events[type], data, instance.api);
}

/**
 * Set new slug
 * @param {String} slugPrepend Slug prefix
 * @param {String} active Slug to set
 */
var setSlug = function setSlug(slugPrepend, active) {
    _location.hash = slugPrepend + active;
};

/**
 * Read current slug
 * @param {String} slugPrepend Slug prefix
 * @returns {String} Slug value
 */
var getSlug = function getSlug(slugPrepend) {
    return _location.hash.replace(slugPrepend, "").replace("#", "");
};

/**
 * Move to id
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
var moveTo$1 = function (instance, id) {

    if (instance.data.ids.indexOf(id) > -1) {
        var index = instance.data.ids.indexOf(id);
        var element = instance.elements.field[index];

        //beforeMove Callback
        runCallbacks(instance, "beforeMove", {
            id: id,
            index: index,
            element: element
        });

        //Set new section
        instance.data.activeId = id;
        instance.data.index = index;
        setSlug(instance.options.slugPrepend, id);

        //afterMove Callback
        runCallbacks(instance, "afterMove", {
            id: id,
            index: index,
            element: element
        });
    }

    return instance;
}

/**
 * Move by Value
 * @param {Number} val Value to move by
 * @returns {Object} Avenue instance
 */
var moveBy$1 = function (instance, val) {
    var newId = instance.data.ids[instance.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo$1(instance, newId);
    }
}

/**
 * Returns avenue api
 * @param {Object} instance Avenue instance
 * @returns {Object} Avenue api
 */
var getApi = function (instance) {

    //Avenue API
    return {
        data: instance.data,
        options: instance.options,
        elements: instance.elements,
        methods: {
            callback: callback,
            util: {
                eachNode: eachNode
            },
            move: {
                //Instance specific, needs context bind
                moveTo: function moveTo(id) {
                    return moveTo$1(instance, id);
                },
                moveBy: function moveBy$1(val) {
                    return moveTo$1(instance, val);
                }
            },
            slug: {
                setSlug: setSlug,
                getSlug: getSlug
            },
            dom: {
                queryElements: queryElements,
                bind: bind,
                readData: readData,
                writeData: writeData
            }
        }
    };
}

/**
 * Init Avenue instance
 * @returns {Object} Avenue instance
 */
var init = function () {
    var _this = this;
    var _options = _this.options;
    var slug = getSlug(_this.options.slugPrepend);

    //beforeInit Callback
    runCallbacks(_this, "beforeInit", {});

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_options.attributes);
    if (_options.autobind) {
        //Bind router-link events
        bind(_this.elements.link, "click", function (element) {
            var id = readData(element, _options.attributes.prefix, _options.attributes.types.link);

            moveTo$1(_this, id);
        });

        //Bind router-pagination events
        bind(_this.elements.pagination, "click", function (element) {
            var val = Number(readData(element, _options.attributes.prefix, _options.attributes.types.pagination));

            moveBy$1(_this, val);
        });
    }

    /**
     * Data
     */
    //Read ids
    eachNode(_this.elements.field, function (element) {
        var id = readData(element, _options.attributes.prefix, _options.attributes.types.field);

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
        moveTo$1(_this, slug);
    } else {
        moveTo$1(_this, _this.data.defaultId);
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
var Avenue = function Avenue(options, events, plugins) {
    var _this = this;

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

    _this.api = getApi(_this);
};

//Plugins Container
Avenue.plugins = {};

/**
 * Expose Avenue methods
 */
Avenue.prototype = {
    init: init,
    moveTo: function moveTo$1(id) {
        return moveBy$1(this, id);
    },
    moveBy: function moveBy(val) {
        return moveBy$1(this, val);
    },
    moveForward: function moveForward() {
        return moveBy$1(this, 1);
    },
    moveBackward: function moveBackward() {
        return moveBy$1(this, -1);
    }
};

return Avenue;

});