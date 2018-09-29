/**
 * Returns hash without init-character.
 *
 * @private
 * @returns {string} current location hash, without the hash.
 */

const getLocationHash = (): string => location.hash.replace("#", "");

export { getLocationHash };
