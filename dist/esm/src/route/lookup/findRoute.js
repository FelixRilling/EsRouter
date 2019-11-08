/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param pathPart path string.
 * @returns if the pathPart is a path variable.
 */
const isPathVariable = (pathPart) => pathPart.startsWith(":");
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
/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
const findRoute = (path, routes) => {
    const route = routes.find((routeCurrent) => routesMatch(path, routeCurrent[0]));
    if (route) {
        const args = {};
        route[0].forEach((routePathPart, index) => {
            if (isPathVariable(routePathPart)) {
                args[routePathPart.substr(1)] = path[index];
            }
        });
        return {
            route,
            args
        };
    }
    return null;
};
export { findRoute };
//# sourceMappingURL=findRoute.js.map