/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param path Path string.
 * @returns trimmed path string array.
 */
const splitPath = (path) => path.split("/").filter(item => item.length);
export { splitPath };
//# sourceMappingURL=splitPath.js.map