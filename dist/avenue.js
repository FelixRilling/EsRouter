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
     * Returns if the pathPart is a path variable
     *
     * @private
     * @param {string} path
     * @returns {boolean} wether the pathPart is a variable
     */
    const isPathVariable = pathPart => pathPart[0] === ":";
    /**
     * Checks if two routes match
     *
     * @private
     * @param {Array<string>} currentPath
     * @param {Array<string>} routePath
     * @returns {boolean}
     */


    const matchRoutes = (currentPath, routePath) => currentPath.every((currentPathPart, index) => {
      const routePathPart = routePath[index];

      if (routePathPart) {
        // Checks for variable-wildcard or equivalency
        return isPathVariable(routePathPart) || currentPathPart === routePathPart;
      }

      return false;
    });
    /**
     * Finds route by path from route container
     *
     * @private
     * @param {Array<string>} path route path
     * @param {Object} routes route map
     * @returns {Object} matching route
     */


    const findRoute = (path, routes) => {
      const route = routes.find(routeCurrent => matchRoutes(path, routeCurrent[0]));

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
     * Returns hash without init-character
     *
     * @private
     * @returns {string}
     */
    const getHash = () => location.hash.replace("#", "");

    /**
     * Splits path by dashes and trims
     *
     * @private
     * @param {string} pathStr
     * @returns {Array<string>}
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
       * @param {Object} routes
       */
      constructor(routes) {
        this.view = null;
        this.routes = [];

        this.fallback = () => {}; // Change routes from {string: fn} to [string[], fn] and extract fallback route


        forEachEntry(routes, (routeItemPath, routeItemFn) => {
          if (routeItemPath === "?") {
            this.fallback = routeItemFn;
          } else {
            this.routes.push([splitPath(routeItemPath), routeItemFn]);
          }
        });
        window.addEventListener("hashchange", e => this.setView(getHash(), e), false); // Load current route if exists

        this.setView(getHash());
      }
      /**
       * Sets view to a route path
       *
       * @param {string} path
       * @param {Event|null} [e=null]
       */


      setView(path, e = null) {
        const result = findRoute(splitPath(path), this.routes);

        if (result) {
          this.view = path;
          result.route[1](result.args, path, e);
        } else {
          this.fallback({}, path, e);
        }
      }
      /**
       * Returns active view path
       *
       * @returns {string}
       */


      getView() {
        return this.view;
      }

    };

    return Avenue;

}());
//# sourceMappingURL=avenue.js.map
