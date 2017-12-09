import isPathVariable from "./isPathVariable";

/**
 * Checks if two routes match
 *
 * @param {Array<string>} currentPath splitted current path
 * @param {Array<string>} routePath splitted route path
 * @returns {boolean} if routes match
 */
const matchRoutes = (currentPath, routePath) =>
    currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for variable-wildcard or equivalency
            return (
                isPathVariable(routePathPart) ||
                currentPathPart === routePathPart
            );
        }
    });

export default matchRoutes;
