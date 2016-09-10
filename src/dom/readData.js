"use strict";

import {
    getDataProp
} from "./dataQuery";

/**
 * Read value of element data attribute
 *
 * @private
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} key The attribute key
 * @returns {String} the value of the attribute
 */
export default function(element, prefix, name) {
    return element.dataset[getDataProp(prefix, name)];
}
