var Avenue = function () {
    'use strict';

    const _window = window;
    const _location = location;

    /**
     * Returns hash without starting char
     * @param {Object} _location location Object
     * @returns {String} replaced string
     */
    const getHash = _location => _location.hash.replace("#", "");

    /**
     * Splits path by dashes and trims
     * @param {String} path path string
     * @returns {Array} split path
     */
    const splitPath = path => path.split("/").filter(item => item.length);

    /**
     * Returns wether the pathPart is a variable
     * @param {String} path Path part string
     * @returns {Boolean} wether the pathPart is a variable
     */
    const isPathVariable = path => path[0] === ":";

    /**
     * Checks if two routes match
     * @param {Array} currentPath splitted current path
     * @param {Array} currentPath splitted route path
     * @returns {Boolean} if routes match
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

    /**
     * Finds route by path from route container
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

    /**
     * Avenue Class
     * @class
     */
    const Avenue = class {
        /**
         * Avenue constructor
         * @constructor
         * @param {Object} routeMap routing map
         */
        constructor(routeMap) {
            const _this = this;
            const currentPath = getHash(_location);

            _this.routes = []; //Route storage
            _this.fallback = () => {}; //Fallback fn

            //Change routes from {path:fn} to [{path,fn}] and extracts fallback route
            Object.keys(routeMap).forEach(routePath => {
                if (routePath === "?") {
                    //Fallback route
                    _this.fallback = routeMap[routePath];
                } else {
                    //Normal route
                    _this.routes.push({
                        path: splitPath(routePath),
                        fn: routeMap[routePath]
                    });
                }
            });

            //Bind hashchange event to changeView
            _window.addEventListener("hashchange", e => {
                _this.changeView(getHash(_location), e);
            }, false);

            //Load current route when existing
            if (currentPath) {
                _this.changeView(currentPath);
            }
        }
        /**
         * Changes view by route
         * @param {String} path route path
         * @param {Event|undefined} e Event object
         */
        changeView(path, e) {
            const _this = this;
            const routeData = findRoute(path, _this.routes);

            if (routeData) {
                //Runs route
                routeData.fn(e, routeData.args, path);
            } else {
                //Or fallback if route wasnt found
                _this.fallback(e, path);
            }
        }
        /**
         * Navigate to the given path, triggering hashchange event
         * @param {String} path Path string
         */
        navigate(path) {
            _location.hash = path;
        }
    };

    return Avenue;
}();