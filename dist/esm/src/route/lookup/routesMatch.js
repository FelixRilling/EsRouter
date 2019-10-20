import { isPathVariable } from "../../path/isPathVariable";
/**
 * Checks if two routes match.
 *
 * @private
 * @param {Array<string>} currentPath first route.
 * @param {Array<string>} routePath second route.
 * @returns {boolean} if the first and second route match.
 */
const routesMatch = (currentPath, routePath) => currentPath.every((currentPathPart, index) => {
    const routePathPart = routePath[index];
    if (routePathPart) {
        // Checks for variable-wildcard or equivalency
        return (isPathVariable(routePathPart) ||
            currentPathPart === routePathPart);
    }
    return false;
});
export { routesMatch };
//# sourceMappingURL=routesMatch.js.map