"use strict";

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
            if (matchingRoutePathPart.startsWith(":")) {
                const argKey = matchingRoutePathPart.replace(":", "");
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
