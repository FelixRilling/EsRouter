'use strict';

const _window = window;
const _document = _window.document;
const _location = _window.location;

const DOM_ATTR_DATA = "[data-routing]";

const URI_DELIMITER_ARG = ":";

const getHash = function (_location) {
    return _location.hash.replace("#", "");
};

const splitPath = function (path) {
    return path.split("/").filter(item => item.length);
};

const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for wildcard or equivalency
            return routePathPart[0] === URI_DELIMITER_ARG || currentPathPart === routePathPart;
        }
    });
};

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

module.exports = AvenueClass;
