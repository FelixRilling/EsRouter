"use strict";

const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for wildcard or equivalency
            return routePathPart.startsWith(":") || currentPathPart === routePathPart;
        }
    });
};

export default matchRoutes;
