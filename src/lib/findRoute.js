"use strict";

import {
    URI_DELIMITER_ARG
} from "./constants";
import splitPath from "./splitPath";
import matchRoutes from "./matchRoutes";

/**
 * Finds route by path from route container
 *
 * @param {String} path route path
 * @param {Object} routes route map
 * @returns {Object} matching route
 */
const findRoute = function (path, routes) {
    const currentPath = splitPath(path);
    const matchingRoute = routes.find(route => {
        return matchRoutes(currentPath, route.path);
    });

    if (matchingRoute) {
        const args = {};

        matchingRoute.path.forEach((matchingRoutePathPart, index) => {
            if (matchingRoutePathPart[0] === URI_DELIMITER_ARG) {
                args[matchingRoutePathPart.substr(1)] = currentPath[index];
            }
        });

        return {
            args,
            fn: matchingRoute.fn
        };
    }

    return null;
};

export default findRoute;
