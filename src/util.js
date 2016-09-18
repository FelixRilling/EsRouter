"use strict";

/**
 * NodeList iterate
 * @private
 * @param {NodeList} elements NodeList to iterate trough
 * @param {Function} fn Function to call
 */
export const eachNode = function(elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};
