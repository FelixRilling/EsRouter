"use strict";

/**
 * Read value of element data attribute
 *
 * @private
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} key The attribute key
 * @returns {String} the value of the attribute
 */
export default function (element, prefix, key) {
    function getAttr(prefix, key) {
        return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
    }

    return element.dataset[getAttr(prefix, key)];
}
