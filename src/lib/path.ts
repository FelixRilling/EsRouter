type pathStr = string;
type pathArr = pathStr[];

/**
 * Splits path by dashes and trims.
 *
 * @private
 * @param {string} pathStr
 * @returns {Array<string>}
 */
const splitPath = (path: pathStr): pathArr =>
    path.split("/").filter(item => item.length);

export { splitPath, pathStr, pathArr };
