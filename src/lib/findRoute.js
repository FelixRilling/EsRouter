import { forEach } from "lightdash";

/**
 * Returns if the pathPart is a variable
 *
 * @param {string} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = path => path[0] === ":";

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

/**
 * Finds route by path from route container
 *
 * @param {Array<string>} path route path
 * @param {Object} routes route map
 * @returns {Object} matching route
 */
const findRoute = (path, routes) => {
    const route = routes.find(route => matchRoutes(path, route[0]));

    if (route) {
        const args = {};

        forEach(route[0], (routePathPart, index) => {
            if (isPathVariable(routePathPart)) {
                args[routePathPart.substr(1)] = path[index];
            }
        });

        return {
            route,
            args
        };
    } else {
        return null;
    }
};

export default findRoute;
