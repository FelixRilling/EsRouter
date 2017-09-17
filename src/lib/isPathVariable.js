"use strict";

/**
 * Returns if the pathPart is a variable
 *
 * @param {string} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = path => path[0] === ":";

export default isPathVariable;
