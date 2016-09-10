"use strict";


//import queryElements from "../dom/queryElements";
//import bindEvents from "../dom/bindEvents";
//import readData from "../dom/readData";

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
export default function(type, context, data) {
    function runCallback(fn, options) {
        const api = {
            //Avenue API
            instance: context,
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
