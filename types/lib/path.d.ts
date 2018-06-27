declare type pathStr = string;
declare type pathArr = pathStr[];
/**
 * Splits path by dashes and trims.
 *
 * @private
 * @param {string} pathStr
 * @returns {Array<string>}
 */
declare const splitPath: (path: string) => string[];
export { splitPath, pathStr, pathArr };
