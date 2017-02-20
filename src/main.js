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

        _this[0] = []; //Route storage
        _this[1] = () => {};//Fallback fn

        //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
        Object.keys(routeMap).forEach(routePath => {
            if (routePath === "?") { //Fallback route
                _this[1] = routeMap[routePath];
            } else {//Normal route
                _this[0].push({
                    path: splitPath(routePath),
                    fn: routeMap[routePath]
                });
            }
        });

        //Bind hashchange event
        _window.addEventListener("hashchange", e => {
            changeView(getHash(_location), _this, e);
        }, false);

        //load current route if existing
        if (currentPath) {
            changeView(currentPath, _this);
        }

    }
    /**
     * Navigate to the given path
     *
     * @param {String} path Path string
     */
    navigate(path) {
        _location.hash = path;

        changeView(path, this);
    }
};

export default Avenue;
