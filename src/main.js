"use strict";

import {
    _document,
    _location,
    _window,
    DOM_ATTR_DATA
} from "./lib/constants";
import getHash from "./lib/getHash";
import findRoute from "./lib/findRoute";
import splitPath from "./lib/splitPath";

/**
 * Avenue Class
 *
 * @class
 * @param {Object} routes routing map
 */
const AvenueClass = class {
    constructor(routes) {
        const _this = this;
        const currentHash = getHash(_location);

        _this.$routes = [];

        //Parse routes
        Object.keys(routes).forEach(routePath => {
            _this.$routes.push({
                path: splitPath(routePath),
                fn: routes[routePath]
            });
        });

        //Bind events
        Array.from(_document.querySelectorAll(DOM_ATTR_DATA)).forEach(element => {
            element.addEventListener("click", e => {
                e.preventDefault();
                _this.navigate(e.target.attributes.getNamedItem("href").value, e);
            }, false);
        });

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
        const _this = this;
        const routeData = findRoute(path, _this.$routes);

        _location.hash = path;

        if (routeData) {
            routeData.fn(e, routeData.args);
        }
    }
};

export default AvenueClass;
