import { pathArr } from "./pathArr";

/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param {string} path Path string.
 * @returns {Array<string>} trimmed path string array.
 */
const splitPath = (path: string): pathArr =>
    path.split("/").filter(item => item.length);

export { splitPath };
