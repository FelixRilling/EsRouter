"use strict";

import init from "./init";
import moveTo from "./move/moveTo";
import moveBy from "./move/moveBy";

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

export default EsRouter;
