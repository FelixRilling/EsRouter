"use strict";


import {
    eachNode
} from "../util";

/**
 * Bind UI Events
 *
 * @private
 * @param {Object} elements The Elements property
 * @param {Object} fn The Event function
 */
export default function(elements, fn) {
    eachNode(elements, element => {
        element.addEventListener("click", ev => {
            fn(element, ev);
        }, false);
    });
}
