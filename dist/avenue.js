var Avenue = (function () {
    'use strict';

    /**
     * Checks if the value has a certain type-string.
     *
     * @function isTypeOf
     * @memberof Is
     * @since 1.0.0
     * @param {any} val
     * @param {string} type
     * @returns {boolean}
     * @example
     * isTypeOf({}, "object")
     * // => true
     *
     * isTypeOf([], "object")
     * // => true
     *
     * isTypeOf("foo", "string")
     * // => true
     *
     * @example
     * isTypeOf("foo", "number")
     * // => false
     */

    /**
     * Iterates over each entry of an object.
     *
     * @function forEachEntry
     * @memberof For
     * @param {object} obj
     * @param {function} fn fn(key: any, val: any, index: number, arr: any[])
     * @example
     * const a = {a: 1, b: 2};
     *
     * forEachEntry(a, (key, val, index) => a[key] = val * index)
     * // a = {a: 0, b: 2}
     */
    const forEachEntry = (obj, fn) => {
        Object.entries(obj).forEach((entry, index) => {
            fn(entry[0], entry[1], index, obj);
        });
    };

    /**
     * Returns hash without init-character.
     *
     * @private
     * @returns {string} current location hash, without the hash.
     */
    const getLocationHash = () => location.hash.replace("#", "");

    /**
     * Splits path by slashes and trims.
     *
     * @private
     * @param {string} pathStr path string.
     * @returns {Array<string>} trimmed path string array.
     */
    const splitPath = (path) => path.split("/").filter(item => item.length);

    /**
     * Checks if the pathPart is a path variable.
     *
     * @private
     * @param {string} path path string.
     * @returns {boolean} if the pathPart is a path variable.
     */
    const isPathVariable = (pathPart) => pathPart[0] === ":";
    /**
     * Checks if two routes match.
     *
     * @private
     * @param {Array<string>} currentPath first route.
     * @param {Array<string>} routePath second route.
     * @returns {boolean} if the first and second route match.
     */
    const matchRoutes = (currentPath, routePath) => currentPath.every((currentPathPart, index) => {
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
     * @param {Array<string>} path path string array.
     * @param {object} routes object containing routes.
     * @returns {object|null} object containing route and args, or null if none was found.
     */
    const findRoute = (path, routes) => {
        const route = routes.find((routeCurrent) => matchRoutes(path, routeCurrent[0]));
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
    const Avenue = class {
        /**
         * Avenue constructor.
         *
         * @constructor
         * @param {object} routes object of routes to use.
         */
        constructor(routes) {
            this.view = null;
            this.routes = [];
            this.fallback = () => { };
            // Change routes from {string: fn} to [string[], fn] and extract fallback route
            forEachEntry(routes, (routeItemPath, routeItemFn) => {
                if (routeItemPath === "?") {
                    this.fallback = routeItemFn;
                }
                else {
                    this.routes.push([splitPath(routeItemPath), routeItemFn]);
                }
            });
            window.addEventListener("hashchange", e => this.setView(getLocationHash(), e), false);
            // Load current route if exists
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
    };

    return Avenue;

}());
//# sourceMappingURL=avenue.js.map
