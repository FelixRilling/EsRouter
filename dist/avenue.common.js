'use strict';

const _window = window;
const _document = _window.document;
const _location = _window.location;

const DOM_ATTR_DATA = "[data-routing]";

const URI_DELIMITER_ARG = ":";

/**
 * Returns hash without starting char
 *
 * @param {Object} _location location Object
 * @returns {String} replaced string
 */
const getHash = function (_location) {
    return _location.hash.replace("#", "");
};

/**
 * Splits path by dashes and trims
 *
 * @param {String} path path string
 * @returns {Array} split path
 */
const splitPath = function (path) {
    return path.split("/").filter(item => item.length);
};

/**
 * Checks two routes for matching
 *
 * @param {Array} currentPath splitted current path
 * @param {Array} currentPath splitted route path
 * @returns {Boolean} if routes match
 */
const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for wildcard or equivalency
            return routePathPart[0] === URI_DELIMITER_ARG || currentPathPart === routePathPart;
        }
    });
};

/**
 * Finds route by path from route container
 *
 * @param {String} path route path
 * @param {Object} routes route map
 * @returns {Object} matching route
 */
const findRoute = function (path, routes) {
    const currentPath = splitPath(path);
    const matchingRoute = routes.find(route => {
        return matchRoutes(currentPath, route.path);
    });

    if (matchingRoute) {
        const args = {};

        matchingRoute.path.forEach((matchingRoutePathPart, index) => {
            if (matchingRoutePathPart[0] === URI_DELIMITER_ARG) {
                args[matchingRoutePathPart.substr(1)] = currentPath[index];
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
    /**
     * Navigate to the given path
     *
     * @param {String} path Path string
     * @param {Event} e Click event
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

module.exports = AvenueClass;
