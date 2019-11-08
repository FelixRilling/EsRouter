import { isPathVariable } from "../../path/isPathVariable";
import { PathArr } from "../../path/PathArr";

/**
 * Checks if two routes match.
 *
 * @private
 * @param currentPath first route.
 * @param routePath second route.
 * @returns if the first and second route match.
 */
const routesMatch = (currentPath: PathArr, routePath: PathArr): boolean =>
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

export { routesMatch };
