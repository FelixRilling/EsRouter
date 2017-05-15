"use strict";

/**
 * Returns hash without init-character
 * @param {Object} _location location Object
 * @returns {String} replaced string
 */
const getHash = _location => _location.hash.replace("#", "");

export default getHash;
