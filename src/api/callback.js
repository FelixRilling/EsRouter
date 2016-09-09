"use strict";

import moveTo from "../move/moveTo";
import moveBy from "../move/moveBy";

import queryElements from "../dom/queryElements";
import bindEvents from "../dom/bindEvents";
import readData from "../dom/readData";

import {
    getSlug,
    setSlug
} from "../slug";

/**
 * Callback user/plugin fn
 *
 * @private
 * @param {String} type Callback function name
 * @param {Object} data Object of data to pass
 */
export default function (type, data) {
    const _this = this;

    function runCallback(fn, options) {
        const args = [data, {
            //EsRouter API
            move: {
                moveTo,
                moveBy
            },
            dom: {
                queryElements,
                bindEvents,
                readData
            },
            slug: {
                getSlug,
                setSlug
            }
        }];

        if (options) {
            args.push(options);
        }

        fn.apply(_this, args);
    }

    //Call plugins
    _this.plugins.forEach(plugin => {
        runCallback(plugin[0][type], plugin[1]);
    });

    //Call user events
    runCallback(_this.events[type]);
}
