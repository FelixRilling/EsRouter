"use strict";

/**
 * Returns if the pathPart is a variable
 * @param {String} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = path => path[0] === ":";

export default isPathVariable;
