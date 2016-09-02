"use strict";

import init from "./init";
import moveTo from "./move/moveTo";
import moveBy from "./move/moveBy";
/**
 * Basic esRouter Constructor
 *
 * @constructor
 * @param {String} id To identify the instance
 * @returns {Object} Returns esRouter instance
 */
const esRouter = function (options, events, plugins) {
    const _this = this;

    _this.options = {
        autobind: options.autobind || true,
        slug: {
            start: ""
        },
        elements: {
            prefix: "router",
            fields: {
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
esRouter.prototype = {
    init,
    moveTo,
    moveBy,
    moveForward: function () {
        this.moveBy(1);
    },
    moveBackward: function () {
        this.moveBy(-1);
    }
};

export default esRouter;
