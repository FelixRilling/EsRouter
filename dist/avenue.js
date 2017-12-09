var Avenue = (function () {
'use strict';

/**
 * Checks if the value has a certain type-string
 *
 * @function isTypeOf
 * @memberof Is
 * @since 1.0.0
 * @param {any} val
 * @param {string} type
 * @returns {boolean}
 * @example
 * // returns true
 * isTypeOf({}, "object")
 * isTypeOf([], "object")
 * isTypeOf("foo", "string")
 *
 * @example
 * // returns false
 * isTypeOf("foo", "number")
 */
/**
 * Returns an array of the objects entries
 *
 * `Object.entries` shorthand
 *
 * @function objEntries
 * @memberof Object
 * @since 1.0.0
 * @param {Object} obj
 * @returns {any[]} Array<[key: any, val: any]>]
 * @example
 * // returns [["a", 1], ["b", 2], ["c", 3]]
 * objEntries({a: 1, b: 2, c: 3})
 */
const objEntries = Object.entries;

/**
 * Iterates over each element in an array
 *
 * Wrapper around arr.forEach to have a cleaner API and better minified code
 *
 * @function forEach
 * @memberof For
 * @param {any[]} arr
 * @param {function} fn fn(val: any, index: number, arr: any[])
 * @example
 * // returns a = [0, 2, 6]
 * const a = [1, 2, 3];
 *
 * forEach(a, (val, index)=>a[index] = val * index)
 */
const forEach = (arr, fn) => arr.forEach(fn);

/**
 * Iterates over each entry of an object
 *
 * @function forEachEntry
 * @memberof For
 * @param {object} obj
 * @param {function} fn fn(val: any, key: any, index: number, arr: any[])
 * @example
 * // returns a = {a: 0, b: 2}
 * const a = {a: 1, b: 2};
 *
 * forEachEntry(a, (val, key, index) => a[key] = val * index)
 */
const forEachEntry = (obj, fn) => {
  forEach(objEntries(obj), (entry, index) => {
    fn(entry[1], entry[0], index, obj);
  });
};

/**
 * Returns if the pathPart is a variable
 *
 * @param {string} path Path part string
 * @returns {Boolean} wether the pathPart is a variable
 */
const isPathVariable = path => path[0] === ":";

/**
 * Checks if two routes match
 *
 * @param {Array<string>} currentPath splitted current path
 * @param {Array<string>} routePath splitted route path
 * @returns {boolean} if routes match
 */
const matchRoutes = (currentPath, routePath) => currentPath.every((currentPathPart, index) => {
    const routePathPart = routePath[index];

    if (routePathPart) {
        //Checks for variable-wildcard or equivalency
        return isPathVariable(routePathPart) || currentPathPart === routePathPart;
    }
});

/**
 * Finds route by path from route container
 *
 * @param {Array<string>} path route path
 * @param {Object} routes route map
 * @returns {Object} matching route
 */
const findRoute = (path, routes) => {
    const route = routes.find(route => matchRoutes(path, route[0]));

    if (route) {
        const args = {};

        forEach(route[0], (routePathPart, index) => {
            if (isPathVariable(routePathPart)) {
                args[routePathPart.substr(1)] = path[index];
            }
        });

        return {
            route,
            args
        };
    } else {
        return null;
    }
};

/**
 * Returns hash without init-character
 *
 * @returns {string} replaced string
 */
const getHash = () => location.hash.replace("#", "");

/**
 * Splits path by dashes and trims
 *
 * @param {string} path path string
 * @returns {Array<string>} split path
 */
const splitPath = path => path.split("/").filter(item => item.length);

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
        const currentPath = getHash();

        this.routes = [];
        this.fallback = () => {};

        //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
        forEachEntry(routeMap, (routeFn, routePath) => {
            if (routePath === "?") {
                this.fallback = routeMap[routePath];
            } else {
                this.routes.push([splitPath(routePath), routeFn]);
            }
        });

        window.addEventListener("hashchange", e => this.changeView(getHash(), e), false);

        //Load current route if exists
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
    changeView(path, e = null) {
        const result = findRoute(splitPath(path), this.routes);

        return result ? result.route.fn(e, result.args, path) : this.fallback(e, path);
    }
    /**
     * Navigate to the given path, triggering hashchange event
     *
     * @param {string} path Path string
     */
    navigate(path) {
        location.hash = path;
    }
};

return Avenue;

}());
