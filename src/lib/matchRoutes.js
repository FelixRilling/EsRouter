"use strict";

import isPathVariable from "./isPathVariable";

/**
 * Checks if two routes match
 * @param {Array} currentPath splitted current path
 * @param {Array} currentPath splitted route path
 * @returns {Boolean} if routes match
 */
const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for variable-wildcard or equivalency
            return isPathVariable(routePathPart) || currentPathPart === routePathPart;
        }
    });
};

export default matchRoutes;
