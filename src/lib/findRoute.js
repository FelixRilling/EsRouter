"use strict";

import {
    URI_DELIMITER_ARG
} from "./constants";
import splitPath from "./splitPath";
import matchRoutes from "./matchRoutes";

const findRoute = function (path, routes) {
    const currentPath = splitPath(path);
    const matchingRoute = routes.find(route => {
        return matchRoutes(currentPath, route.path);
    });

    if (matchingRoute) {
        const matchingRoutePath = matchingRoute.path;
        const args = {};

        matchingRoutePath.forEach((matchingRoutePathPart, index) => {
            if (matchingRoutePathPart[0] === URI_DELIMITER_ARG) {
                const argKey = matchingRoutePathPart.substr(1);
                const argVal = currentPath[index];

                args[argKey] = argVal;
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
