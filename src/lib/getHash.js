/**
 * Returns hash without init-character
 *
 * @returns {string} replaced string
 */
const getHash = () => location.hash.replace("#", "");

export default getHash;
