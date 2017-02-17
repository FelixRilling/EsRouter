"use strict";

import {
    URI_DELIMITER_ARG
} from "./constants";

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
