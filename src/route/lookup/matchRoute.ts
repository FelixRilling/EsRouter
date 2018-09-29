import { isPathVariable } from "../../path/isPathVariable";
import { pathArr } from "../../path/pathArr";

/**
 * Checks if two routes match.
 *
 * @private
 * @param {Array<string>} currentPath first route.
 * @param {Array<string>} routePath second route.
 * @returns {boolean} if the first and second route match.
 */
const matchRoutes = (currentPath: pathArr, routePath: pathArr): boolean =>
    currentPath.every((currentPathPart: string, index: number) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            // Checks for variable-wildcard or equivalency
            return (
                isPathVariable(routePathPart) ||
                currentPathPart === routePathPart
            );
        }

        return false;
    });

export { matchRoutes };
