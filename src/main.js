"use strict";

import {
    _location,
    _window,
} from "./lib/constants";
import getHash from "./lib/getHash";
import findRoute from "./lib/findRoute";
import splitPath from "./lib/splitPath";

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
     * @param {Object} routes routing map
     */
    constructor(routes) {
        const _this = this;
        const currentHash = getHash(_location);

        _this.$routes = [];

        //Parse routes from {path:fn} to [{path,fn}]
        Object.keys(routes).forEach(routePath => {
            _this.$routes.push({
                path: splitPath(routePath),
                fn: routes[routePath]
            });
        });

        //Bind event
        _window.addEventListener("hashchange", e => {
            _this.navigate(getHash(_location), e);
        }, false);

        //load current route
        if (currentHash.length) {
            _this.navigate(currentHash);
        }
    }
    /**
     * Navigate to the given path
     *
     * @param {String} path Path string
     * @param {Event} e Initializer event
     */
    navigate(path, e) {
        const routeData = findRoute(path, this.$routes);

        _location.hash = path;

        if (routeData) {
            routeData.fn(e, routeData.args);
        }
    }
};

export default Avenue;
