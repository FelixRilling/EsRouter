"use strict";

/**
 * Returns hash without starting char
 *
 * @param {Object} _location location Object
 * @returns {String} replaced string
 */
const getHash = function (_location) {
    return _location.hash.replace("#", "");
};

export default getHash;
