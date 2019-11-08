'use strict';

/**
 * Iterates over each entry of an object.
 *
 * @memberof For
 * @param {object} obj Object to iterate.
 * @param {function} fn Function to use (`fn(key: *, val: *, index: number, obj: object) => void`).
 * @example
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (key, val, index) => {
 *     a[key] = val * index;
 * })
 * // a = {a: 0, b: 2}
 */
const forEachEntry = (obj, fn) => {
    for (const [key, val] of Object.entries(obj)) {
        fn(val, key, obj);
    }
};

var Delimiters;
(function (Delimiters) {
    Delimiters["KEBAB"] = "-";
    Delimiters["SNAKE"] = "_";
})(Delimiters || (Delimiters = {}));

/**
 * Returns hash without init-character.
 *
 * @private
 * @returns current location hash, without the hash.
 */
const getLocationHash = () => location.hash.replace("#", "");

/**
 * Splits path by slashes and trims.
 *
 * @private
 * @param path Path string.
 * @returns trimmed path string array.
 */
const splitPath = (path) => path.split("/").filter(item => item.length);

/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param pathPart path string.
 * @returns if the pathPart is a path variable.
 */
const isPathVariable = (pathPart) => pathPart.startsWith(":");
/**
 * Checks if two routes match.
 *
 * @private
 * @param currentPath first route.
 * @param routePath second route.
 * @returns if the first and second route match.
 */
const routesMatch = (currentPath, routePath) => currentPath.every((currentPathPart, index) => {
    const routePathPart = routePath[index];
    if (routePathPart) {
        // Checks for variable-wildcard or equivalency
        return (isPathVariable(routePathPart) ||
            currentPathPart === routePathPart);
    }
    return false;
});
/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
const findRoute = (path, routes) => {
    const route = routes.find((routeCurrent) => routesMatch(path, routeCurrent[0]));
    if (route) {
        const args = {};
        route[0].forEach((routePathPart, index) => {
            if (isPathVariable(routePathPart)) {
                args[routePathPart.substr(1)] = path[index];
            }
        });
        return {
            route,
            args
        };
    }
    return null;
};

/**
 * Avenue class.
 *
 * @class
 */
class Avenue {
    /**
     * Avenue constructor.
     *
     * @constructor
     * @param {object} routes object of routes to use.
     */
    constructor(routes) {
        this.view = null;
        this.routes = [];
        this.fallback = () => null;
        // Change routes from {string: fn} to [string[], fn] and extract fallback route
        forEachEntry(routes, (routeItemFn, routeItemPath) => {
            if (routeItemPath === "?") {
                this.fallback = routeItemFn;
            }
            else {
                this.routes.push([splitPath(routeItemPath), routeItemFn]);
            }
        });
        window.addEventListener("hashchange", e => this.setView(getLocationHash(), e), false);
        // Load current route if it exists
        this.setView(getLocationHash());
    }
    /**
     * Sets view to a route path.
     *
     * @param {string} path string route path.
     * @param {Event|null} [e=null] event, if called through one.
     */
    setView(path, e = null) {
        const result = findRoute(splitPath(path), this.routes);
        if (result) {
            this.view = path;
            result.route[1](result.args, path, e);
        }
        else {
            this.fallback({}, path, e);
        }
    }
    /**
     * Returns active view path.
     *
     * @returns {string|null} active view, or null if none was set.
     */
    getView() {
        return this.view;
    }
}

module.exports = Avenue;
//# sourceMappingURL=avenue.common.js.map
