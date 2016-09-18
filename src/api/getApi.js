"use strict";

import callback from "./callback";
import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import _moveTo from "../move/moveTo";
import _moveBy from "../move/moveBy";
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
        callback,
        util: {
            eachNode
        },
        move: {
            //Instance specific, needs context bind
            moveTo: function(id) {
                return _moveTo(instance, id);
            },
            moveBy: function(val) {
                return _moveBy(instance, val);
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
    };
}
