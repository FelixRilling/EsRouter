/**
 * Avenue v3.5.0
 * Author: Felix Rilling
 * Homepage: https://github.com/FelixRilling/Avenue#readme
 * License: MIT
 */

'use strict';

/**
 * Store Constants
 */

var _window = window;
var _document = _window.document;
var _location = _window.location;

/**
 * Get data query for dom element
 *
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} query Selector query
 */

var getDataQueryDom = function getDataQueryDom(prefix, name) {
  return "[data-" + prefix + "-" + name + "]";
};

/**
 * Get data query for node property
 *
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} query Selector query
 */
var getDataQueryProp = function getDataQueryProp(prefix, name) {
  return prefix + name.substr(0, 1).toUpperCase() + name.substr(1);
};

/**
 * Read value of element data attribute
 *
 * @private
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} key The attribute key
 * @returns {String} the value of the attribute
 */
var readData = function readData(element, prefix, name) {
  return element.dataset[getDataQueryProp(prefix, name)];
};

/**
 * Set value of element data attribute
 *
 * @private
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} key The attribute key
 * @param {String} value The attribute value
 */
var writeData = function writeData(element, prefix, name, value) {
  element.dataset[getDataQueryProp(prefix, name)] = value;
};

/**
 * Query router elements
 *
 * @private
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
function queryElements (attributes) {
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
 *
 * @private
 * @param {NodeList} elements NodeList to iterate trough
 * @param {Function} fn to call
 */

var eachNode = function eachNode(elements, fn) {
    [].forEach.call(elements, function (element) {
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
function bind (elements, type, fn) {
    eachNode(elements, function (element) {
        element.addEventListener(type, function (ev) {
            fn(element, ev);
        }, false);
    });
}

/**
 * Set new slug
 *
 * @private
 * @param {String} active Slug to set
 */
var setSlug = function setSlug(slugPrepend, active) {
    _location.hash = slugPrepend + active;
};

/**
 * Read current slug
 *
 * @private
 * @returns {String} Returns slug value
 */
var getSlug = function getSlug(slugPrepend) {
    return _location.hash.replace(slugPrepend, "").replace("#", "");
};

/**
 * Callback user/plugin fn
 *
 * @private
 * @param {String} type Callback function name
 * @param {Object} data Object of data to pass
 */
function callback (type, context, data) {
    function runCallback(fn, options) {
        var api = {
            //Avenue API
            data: context.data,
            options: context.options,
            elements: context.elements,
            methods: {
                dom: {
                    queryElements: queryElements,
                    bind: bind,
                    readData: readData,
                    writeData: writeData
                },
                slug: {
                    setSlug: setSlug,
                    getSlug: getSlug
                }
            }
        };
        var args = [data, api];

        if (options) {
            args.push(options);
        }

        fn.apply(context, args);
    }

    //Call plugins
    context.plugins.forEach(function (plugin) {
        var fn = plugin[0][type];
        if (fn) {
            runCallback(fn, plugin[1]);
        }
    });

    //Call user events
    runCallback(context.events[type]);
}

/**
 * Init Avenue instance
 *
 * @returns {Object} Avenue instance
 */
function init () {
    var _this = this;
    var _options = _this.options;
    var slug = getSlug(_this.options.slugPrepend);

    //beforeInit Callback
    callback("beforeInit", _this, {});

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
    callback("afterInit", _this, {});

    return _this;
}

/**
 * Move to id
 *
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
function moveTo (id) {
    var _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        var index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        callback("beforeMove", _this, {
            id: id,
            index: index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug(_this.options.slugPrepend, id);

        //afterMove Callback
        callback("afterMove", _this, {
            id: id,
            index: index,
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
    var _this = this;
    var newId = _this.data.ids[_this.data.index + val];

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
var Avenue = function Avenue(options, events, plugins) {
    var _this = this;

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

    /**
     * Events
     */
    events = events || {};
    _this.events = {
        beforeInit: events.beforeInit || function () {},
        afterInit: events.afterInit || function () {},
        beforeMove: events.beforeMove || function () {},
        afterMove: events.afterMove || function () {}
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

module.exports = Avenue;