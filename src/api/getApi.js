"use strict";

import callback from "./callback";
import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import moveTo from "../move/moveTo";
import moveBy from "../move/moveBy";
import {
    eachNode
} from "../util";
import {
    readData,
    writeData
} from "../dom/data";
import {
    getSlug,
    setSlug
} from "../slug";

/**
 * Returns avenue api
 * @param {Object} instance Avenue instance
 * @returns {Object} Avenue api
 */
export default function(instance) {

    //Avenue API
    return {
        data: instance.data,
        options: instance.options,
        elements: instance.elements,
        methods: {
            callback,
            util: {
                eachNode
            },
            move: {
                //Instance specific, needs context bind
                moveTo: function(id) {
                    return moveTo(instance, id);
                },
                moveBy: function(val) {
                    return moveTo(instance, val);
                }
            },
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
}
