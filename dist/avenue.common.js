'use strict';

"use strict";

const _window = window;
const _location = location;

"use strict";

/**
 * Returns hash without init-character
 *
 * @param {Object} _location location Object
 * @returns {string} replaced string
 */
const getHash = _location => _location.hash.replace("#", "");

"use strict";

/**
 * Splits path by dashes and trims
 *
 * @param {string} path path string
 * @returns {Array<string>} split path
 */
const splitPath = path => path.split("/").filter(item => item.length);

"use strict";

/**
 * Returns if the pathPart is a variable
 *
 * @param {string} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = path => path[0] === ":";

"use strict";

/**
 * Checks if two routes match
 *
 * @param {Array<string>} currentPath splitted current path
 * @param {Array<string>} routePath splitted route path
 * @returns {boolean} if routes match
 */
const matchRoutes = function (currentPath, routePath) {
    return currentPath.every((currentPathPart, index) => {
        const routePathPart = routePath[index];

        if (routePathPart) {
            //Checks for variable-wildcard or equivalency
            return isPathVariable(routePathPart) || currentPathPart === routePathPart;
        }
    });
};

"use strict";

/**
 * Finds route by path from route container
 *
 * @param {string} path route path
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
            if (isPathVariable(matchingRoutePathPart)) {
                args[matchingRoutePathPart.substr(1)] = currentPath[index];
            }
        });

        return {
            args,
            fn: matchingRoute.fn
        };
    }
};

"use strict";

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
        const currentPath = getHash(_location);

        this.routes = []; //Route storage
        this.fallback = () => {}; //Fallback fn

        //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
        Object.keys(routeMap).forEach(routePath => {
            if (routePath === "?") { //Fallback route
                this.fallback = routeMap[routePath];
            } else { //Normal route
                this.routes.push({
                    path: splitPath(routePath),
                    fn: routeMap[routePath]
                });
            }
        });

        //Bind hashchange event to changeView
        _window.addEventListener("hashchange", e => {
            this.changeView(getHash(_location), e);
        }, false);

        //Load current route when existing
        if (currentPath) {
            this.changeView(currentPath);
        }

    }
    /**
     * Changes view by route
     *
     * @param {string} path route path
     * @param {Event} e Event object
     */
    changeView(path, e) {
        const routeData = findRoute(path, this.routes);

        if (routeData) {
            //Runs route
            routeData.fn(e, routeData.args, path);
        } else {
            //Or fallback if route wasnt found
            this.fallback(e, path);
        }
    }
    /**
     * Navigate to the given path, triggering hashchange event
     *
     * @param {string} path Path string
     */
    navigate(path) {
        _location.hash = path;
    }
};

module.exports = Avenue;
