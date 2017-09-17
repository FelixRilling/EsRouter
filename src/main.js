import {
    _location,
    _window,
} from "./constants";
import getHash from "./lib/getHash";
import splitPath from "./lib/splitPath";
import findRoute from "./lib/findRoute";

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

export default Avenue;
