"use strict";

/**
 * Splits path by dashes and trims
 * @param {String} path path string
 * @returns {Array} split path
 */
const splitPath = path => path.split("/").filter(item => item.length);

export default splitPath;
