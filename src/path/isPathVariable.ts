/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param pathPart path string.
 * @returns if the pathPart is a path variable.
 */
const isPathVariable = (pathPart: string): boolean => pathPart.startsWith(":");

export { isPathVariable };
