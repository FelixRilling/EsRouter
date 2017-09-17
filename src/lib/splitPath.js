/**
 * Splits path by dashes and trims
 *
 * @param {string} path path string
 * @returns {Array<string>} split path
 */
const splitPath = path => path.split("/").filter(item => item.length);

export default splitPath;
