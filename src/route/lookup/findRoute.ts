import { PathArr } from "../../path/PathArr";
import { RouteItem } from "../RouteItem";
import { RouteParams } from "./RouteParams";

/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param pathPart path string.
 * @returns if the pathPart is a path variable.
 */
const isPathVariable = (pathPart: string): boolean => pathPart.startsWith(":");

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

interface RouteLookup {
    route: RouteItem;
    args: RouteParams;
}

/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
const findRoute = (path: PathArr, routes: RouteItem[]): RouteLookup | null => {
    const route = routes.find((routeCurrent: RouteItem) =>
        routesMatch(path, routeCurrent[0])
    );

    if (route) {
        const args: RouteParams = {};

        route[0].forEach((routePathPart: string, index: number) => {
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
