/**
 * Returns hash without init-character.
 *
 * @private
 * @returns current location hash, without the hash.
 */
const getLocationHash = (): string => location.hash.replace("#", "");

export { getLocationHash };
