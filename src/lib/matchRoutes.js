"use strict";

import {
    URI_DELIMITER_ARG
} from "./constants";

/**
 * Checks two routes for matching
 *
 * @param {Array} currentPath splitted current path
 * @param {Array} currentPath splitted route path
 * @returns {Boolean} if routes match
 */
const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for wildcard or equivalency
            return routePathPart[0] === URI_DELIMITER_ARG || currentPathPart === routePathPart;
        }
    });
};

export default matchRoutes;
