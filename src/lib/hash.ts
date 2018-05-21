import { pathStr } from "../types";

/**
 * Returns if the page URL has a hash part
 *
 * @private
 * @returns {boolean}
 */
const hasHash = (): boolean => getHash().length > 0;

/**
 * Returns hash without init-character
 *
 * @private
 * @returns {string}
 */
const getHash = (): pathStr => location.hash.replace("#", "");

export { getHash, hasHash };
