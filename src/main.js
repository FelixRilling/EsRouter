"use strict";

import getApi from "./api/getApi";
import init from "./init";
import moveTo from "./move/moveTo";
import moveBy from "./move/moveBy";

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

    _this.api = getApi(_this);
};

//Plugins Container
Avenue.plugins = {};

/**
 * Expose Avenue methods
 */
Avenue.prototype = {
    init,
    moveTo: function(id) {
        return moveBy(this, id);
    },
    moveBy: function(val) {
        return moveBy(this, val);
    },
    moveForward: function() {
        return moveBy(this, 1);
    },
    moveBackward: function() {
        return moveBy(this, -1);
    }
};

export default Avenue;
