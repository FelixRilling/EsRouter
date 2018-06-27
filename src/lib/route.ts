import { pathArr, pathStr } from "./path";

type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
type routeItem = [pathArr, routeFn];
type routeArr = routeItem[];

interface IParams {
    [key: string]: string;
}

/**
 * Returns if the pathPart is a path variable.
 *
 * @private
 * @param {string} path
 * @returns {boolean}
 */
const isPathVariable = (pathPart: string): boolean => pathPart[0] === ":";

/**
 * Checks if two routes match.
 *
 * @private
 * @param {Array<string>} currentPath
 * @param {Array<string>} routePath
 * @returns {boolean}
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
 * Finds route by path from route container.
 *
 * @private
 * @param {Array<string>} path
 * @param {Object} routes
 * @returns {Object}
 */
const findRoute = (path: pathArr, routes: routeArr) => {
    const route = routes.find((routeCurrent: routeItem) =>
        matchRoutes(path, routeCurrent[0])
    );

    if (route) {
        const args: { [key: string]: any } = {};

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
