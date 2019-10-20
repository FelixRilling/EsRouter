import { PathArr } from "./PathArr";

/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param {string} path Path string.
 * @returns {Array<string>} trimmed path string array.
 */
const splitPath = (path: string): PathArr =>
    path.split("/").filter(item => item.length);

export { splitPath };
