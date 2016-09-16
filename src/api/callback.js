"use strict";

import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import {
    readData,
    writeData
} from "../dom/data";
import {
    getSlug,
    setSlug
} from "../slug";

/**
 * Callback user/plugin fn
 * @private
 * @param {String} type Callback function name
 * @param {Object} context The Avenue instance
 * @param {Object} data Object of data to pass
 */
export default function(type, context, data) {
    function runCallback(fn, options) {
        const api = {
            //Avenue API
            data: context.data,
            options: context.options,
            elements: context.elements,
            methods: {
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
        const args = [data, api];

        if (options) {
            args.push(options);
        }

        fn.apply(context, args);
    }

    //Call plugins
    context.plugins.forEach(plugin => {
        const fn = plugin[0][type];
        if (fn) {
            runCallback(fn, plugin[1]);
        }
    });

    //Call user events
    runCallback(context.events[type]);
}
