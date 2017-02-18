"use strict";

/**
 * Returns wether the pathPart is a variable
 *
 * @param {String} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = function (path) {
    return path[0] === ":";
};

export default isPathVariable;
