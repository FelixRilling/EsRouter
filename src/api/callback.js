"use strict";


/**
 * Runs callback with injected API
 * @param {Object} context Instance context
 * @param {Function} fn Callback function
 * @param {Object} data Callback data
 * @param {Object} options Callback options
 * @param {Object} subEvents Callback subEvents
 */
export default function callback(fn, data, api, options, subEvents) {
    if (typeof fn === "function") {
        const args = [data, api];

        if (options) {
            args.push(options);
        }
        if (subEvents) {
            args.push(subEvents);
        }

        fn.apply(null, args);
    }
}
