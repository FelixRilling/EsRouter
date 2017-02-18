"use strict";

import {
    _location,
    _window,
} from "./constants";
import getHash from "./lib/getHash";
import splitPath from "./lib/splitPath";
import changeView from "./lib/changeView";

/**
 * Avenue Class
 *
 * @class
 */
const Avenue = class {
    /**
     * Avenue constructor
     *
     * @constructor
     * @param {Object} routeMap routing map
     */
    constructor(routeMap) {
        const _this = this;
        const currentPath = getHash(_location);
        //[[routes],fallback]
        const routes = [
            [],
            () => {}
        ];

        _this.$routes = routes;

        //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
        Object.keys(routeMap).forEach(routePath => {
            if (routePath === "?") {
                //Fallback route
                routes[1] = routeMap[routePath];
            } else {
                //Normal routes
                routes[0].push({
                    path: splitPath(routePath),
                    fn: routeMap[routePath]
                });
            }
        });

        //Bind event
        _window.addEventListener("hashchange", e => {
            //Change view to new hash path
            changeView(getHash(_location), routes, e);
        }, false);

        //load current route if existing
        if (currentPath) {
            changeView(currentPath, routes);
        }

    }
    /**
     * Navigate to the given path
     *
     * @param {String} path Path string
     */
    navigate(path) {
        _location.hash = path;

        changeView(path, this.$routes);
    }
};

export default Avenue;
