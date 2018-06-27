import { pathStr } from "./path";

/**
 * Returns hash without init-character.
 *
 * @private
 * @returns {string} current location hash, without the hash.
 */
const getLocationHash = (): pathStr => location.hash.replace("#", "");

export { getLocationHash };
