import { pathStr } from "./path";

/**
 * Returns hash without init-character.
 *
 * @private
 * @returns {string}
 */
const getLocationHash = (): pathStr => location.hash.replace("#", "");

export { getLocationHash };
