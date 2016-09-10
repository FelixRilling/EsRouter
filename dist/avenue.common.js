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

var _window = window;
var _document = _window.document;
var _location = _window.location;

/**
 * Query router elements
 *
 * @private
 * @param {Object} elements The Options elements property
 * @returns {Object} Object of query results
 */
function queryElements (elements) {
    var fieldKeys = Object.keys(elements.fields);
    var result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll("[data-" + prefix + "-" + name + "]");
    }

    fieldKeys.forEach(function (key, i) {
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
 * @param {Object} options The Options elements property
 */
function bindEvents (elements, options) {
    var _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, function (element) {
            element.addEventListener("click", function (ev) {
                fn(element, ev);
            }, false);
        });
    }

    //Bind router-link events
    bindClick(elements.link, function (element) {
        var id = readData(element, options.prefix, options.fields.link);

        _this.moveTo(id);
    });

    //Bind router-pagination events
    bindClick(elements.pagination, function (element) {
        var val = readData(element, options.prefix, options.fields.pagination);

        _this.moveBy(Number(val));
    });
}

/**
 * Set new slug
 *
 * @private
 * @param {String} active Slug to set
 */
var setSlug = function setSlug(active) {
    _location.hash = this.options.slugPrepend + active;
};

/**
 * Read current slug
 *
 * @private
 * @returns {String} Returns slug value
 */
var getSlug = function getSlug() {
    return _location.hash.replace(this.options.slugPrepend, "").replace("#", "");
};

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
        callback.call(_this, "beforeMove", {
            id: id,
            index: index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug.call(_this, id);

        //afterMove Callback
        callback.call(_this, "afterMove", {
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
 * Callback user/plugin fn
 *
 * @private
 * @param {String} type Callback function name
 * @param {Object} data Object of data to pass
 */
function callback (type, data) {
    var _this = this;

    function runCallback(fn, options) {
        if (typeof fn === "function") {
            var args = [data, {
                //Avenue API
                move: {
                    moveTo: moveTo,
                    moveBy: moveBy
                },
                dom: {
                    queryElements: queryElements,
                    bindEvents: bindEvents,
                    readData: readData
                },
                slug: {
                    getSlug: getSlug,
                    setSlug: setSlug
                }
            }];

            if (options) {
                args.push(options);
            }

            fn.apply(_this, args);
        }
    }

    //Call plugins
    _this.plugins.forEach(function (plugin) {
        runCallback(plugin[0][type], plugin[1]);
    });

    //Call user events
    runCallback(_this.events[type]);
}

/**
 * Init Avenue instance
 *
 * @returns {Object} Avenue instance
 */
function init () {
    var _this = this;
    var slug = getSlug.call(_this);

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
    eachNode(_this.elements.field, function (element) {
        var id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.field);

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