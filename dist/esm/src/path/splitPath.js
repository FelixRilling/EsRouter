/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param {string} path Path string.
 * @returns {Array<string>} trimmed path string array.
 */
const splitPath = (path) => path.split("/").filter(item => item.length);
export { splitPath };
//# sourceMappingURL=splitPath.js.map