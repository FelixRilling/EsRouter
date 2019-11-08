import { PathArr } from "./PathArr";

/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param path Path string.
 * @returns trimmed path string array.
 */
const splitPath = (path: string): PathArr =>
    path.split("/").filter(item => item.length);

export { splitPath };
