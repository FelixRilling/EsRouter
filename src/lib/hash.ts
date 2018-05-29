import { pathStr } from "../types";

/**
 * Returns hash without init-character.
 *
 * @private
 * @returns {string}
 */
const getHash = (): pathStr => location.hash.replace("#", "");

export { getHash };
