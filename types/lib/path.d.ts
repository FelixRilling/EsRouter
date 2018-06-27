declare type pathStr = string;
declare type pathArr = pathStr[];
/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param {string} pathStr path string.
 * @returns {Array<string>} trimmed path string array.
 */
declare const splitPath: (path: string) => string[];
export { splitPath, pathStr, pathArr };
