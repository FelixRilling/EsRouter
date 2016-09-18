"use strict";


import {
    eachNode
} from "../util";

/**
 * Bind UI Events
 * @param {Object} elements The elements
 * @param {Object} type The event type
 * @param {Object} fn The event function
 */
export default function(elements, type, fn) {
    eachNode(elements, element => {
        element.addEventListener(type, ev => {
            fn(element, ev);
        }, false);
    });
}
