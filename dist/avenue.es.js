/**
 * Avenue v3.8.1
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

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
 * @param {Object} elements The Elements property
 * @param {Object} fn The Event function
 */
var bind = function (elements, type, fn) {
    eachNode(elements, function (element) {
        element.addEventListener(type, function (ev) {
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
        var args = [data, api, options, subEvents];

        fn.apply(null, args);
    }
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
var moveTo = function (id) {
    var _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        var index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        runCallbacks(_this, "beforeMove", {
            id: id,
            index: index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug(_this.options.slugPrepend, id);

        //afterMove Callback
        runCallbacks(_this, "afterMove", {
            id: id,
            index: index,
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
    var _this = this;
    var newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo.call(_this, newId);
    }
}

var getApi = function (context) {
    //Avenue API
    return {
        data: context.data,
        options: context.options,
        elements: context.elements,
        methods: {
            callback: callback,
            util: {
                eachNode: eachNode
            },
            move: {
                moveBy: moveBy,
                moveTo: moveTo
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
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
var runCallbacks = function (context, type, data) {
    var _plugins = context.plugins;
    var api = getApi(context);

    //Call plugins
    _plugins.active.forEach(function (plugin) {
        var pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            var fn = pluginObj[type];
            //Check if plugin event exists
            if (fn) {
                callback(fn, data, api, plugin.options, plugin.events);
            }
        } else {
            throw "Missing plugin " + plugin.name;
        }
    });

    //Call user events
    callback(context.events[type], data, api);
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

            _this.moveTo(id);
        });

        //Bind router-pagination events
        bind(_this.elements.pagination, "click", function (element) {
            var val = readData(element, _options.attributes.prefix, _options.attributes.types.pagination);

            _this.moveBy(Number(val));
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
};

//Plugins Container
Avenue.plugins = {};

/**
 * Expose Avenue methods
 */
Avenue.prototype = {
    init: init,
    moveTo: moveTo,
    moveBy: moveBy,
    moveForward: function moveForward() {
        return this.moveBy(1);
    },
    moveBackward: function moveBackward() {
        return this.moveBy(-1);
    }
};

export default Avenue;