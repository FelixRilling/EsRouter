"use strict";

import {
    _location,
    _window,
} from "./constants";
import getHash from "./lib/getHash";
import splitPath from "./lib/splitPath";
import findRoute from "./lib/findRoute";

/**
 * Avenue Class
 * @class
 */
const Avenue = class {
    /**
     * Avenue constructor
     * @constructor
     * @param {Object} routeMap routing map
     */
    constructor(routeMap) {
        const _this = this;
        const currentPath = getHash(_location);

        _this.routes = []; //Route storage
        _this.fallback = () => {}; //Fallback fn

        //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
        Object.keys(routeMap).forEach(routePath => {
            if (routePath === "?") { //Fallback route
                _this.fallback = routeMap[routePath];
            } else { //Normal route
                _this.routes.push({
                    path: splitPath(routePath),
                    fn: routeMap[routePath]
                });
            }
        });

        //Bind hashchange event
        _window.addEventListener("hashchange", e => {
            _this.changeView(getHash(_location), e);
        }, false);

        //load current route if existing
        if (currentPath) {
            _this.changeView(currentPath);
        }

    }
    /**
     * Changes view by route
     * @param {String} path route path
     * @param {Event|undefined} e Event object
     */
    changeView(path, e) {
        const _this = this;
        const routeData = findRoute(path, _this.routes);

        if (routeData) {
            //Runs route
            routeData.fn(e, routeData.args, path);
        } else {
            //Or fallback if route wasnt found
            _this.fallback(e, path);
        }
    }
    /**
     * Navigate to the given path
     * @param {String} path Path string
     */
    navigate(path) {
        _location.hash = path;
    }
};

export default Avenue;
