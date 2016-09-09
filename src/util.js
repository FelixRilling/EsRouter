"use strict";

/**
 * NodeList iterate
 *
 * @private
 * @param {NodeList} elements NodeList to iterate trough
 * @param {Function} fn to call
 */
export const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};
