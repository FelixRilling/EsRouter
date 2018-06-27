type pathStr = string;
type pathArr = pathStr[];

/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param {string} pathStr path string.
 * @returns {Array<string>} trimmed path string array.
 */
const splitPath = (path: pathStr): pathArr =>
    path.split("/").filter(item => item.length);

export { splitPath, pathStr, pathArr };
