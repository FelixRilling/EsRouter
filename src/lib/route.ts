import { pathArr, pathStr } from "./path";

type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
type routeItem = [pathArr, routeFn];
type routeArr = routeItem[];

interface IParams {
    [key: string]: string;
}

interface IRouteArgs {
    [key: string]: any;
}

interface IRouteLookup {
    route: routeItem;
    args: IRouteArgs;
}

/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param {string} path path string.
 * @returns {boolean} if the pathPart is a path variable.
 */
const isPathVariable = (pathPart: string): boolean => pathPart[0] === ":";

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

/**
 * Finds route by path.
 *
 * @private
 * @param {Array<string>} path path string array.
 * @param {object} routes object containing routes.
 * @returns {object|null} object containing route and args, or null if none was found.
 */
const findRoute = (path: pathArr, routes: routeArr): IRouteLookup | null => {
    const route = routes.find((routeCurrent: routeItem) =>
        matchRoutes(path, routeCurrent[0])
    );

    if (route) {
        const args: IRouteArgs = {};

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

export { findRoute, routeFn, routeArr, routeItem };
