import { isPathVariable } from "../../path/isPathVariable";
/**
 * Checks if two routes match.
 *
 * @private
 * @param currentPath first route.
 * @param routePath second route.
 * @returns if the first and second route match.
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