import getHash from "./lib/getHash";
import splitPath from "./lib/splitPath";
import findRoute from "./lib/findRoute";
import { forEachEntry } from "lightdash";

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
                this.routes.push({
                    path: splitPath(routePath),
                    fn: routeFn
                });
            }
        });

        window.addEventListener(
            "hashchange",
            e => this.changeView(getHash(), e),
            false
        );

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
    changeView(path, e) {
        const routeData = findRoute(path, this.routes);

        if (routeData) {
            routeData.fn(e, routeData.args, path);
        } else {
            this.fallback(e, path);
        }
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

export default Avenue;
