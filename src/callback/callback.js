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
 * Runs callback with injected API
 * @param {Object} context Instance context
 * @param {Function} fn Callback function
 * @param {Object} data Callback data
 * @param {Object} options Callback options
 */
export default function callback(context, fn, data, options, subEvents) {
    if (typeof fn === "function") {
        const args = [data, {
            //Avenue API
            data: context.data,
            options: context.options,
            elements: context.elements,
            methods: {
                callback,
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
        }];

        if (options) {
            args.push(options);
        }
        if (subEvents) {
            args.push(subEvents);
        }

        fn.apply(context, args);
    }
}
