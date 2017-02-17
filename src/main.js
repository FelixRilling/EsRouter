"use strict";

import {
    _document,
    _location,
    DOM_ATTR_DATA
} from "./lib/constants";
import getHash from "./lib/getHash";
import findRoute from "./lib/findRoute";
import splitPath from "./lib/splitPath";

/**
 * Applies Avenue
 *
 * @param {Object} routes Configuration object
 */
const AvenueClass = class {
    constructor(routes) {
        const _this = this;
        const currentHash = getHash(_location);

        _this.$routes = [];
        _this.$elements = Array.from(_document.querySelectorAll(DOM_ATTR_DATA));

        //Parse routes
        Object.keys(routes).forEach(routePath => {
            _this.$routes.push({
                path: splitPath(routePath),
                fn: routes[routePath]
            });
        });

        //Bind events
        _this.$elements.forEach(element => {
            element.addEventListener("click", e => {
                e.preventDefault();
                _this.navigate(e.target.attributes.getNamedItem("href").value, e);
            });
        });

        //load current route
        if (currentHash.length) {
            _this.navigate(currentHash);
        }

    }
    navigate(path, e) {
        const _this = this;
        const routeData = findRoute(path, _this.$routes);
        console.log(routeData);

        _location.hash = path;

        if (typeof routeData.fn === "function") {
            routeData.fn(e, routeData.args);
        }
    }
};

export default AvenueClass;
