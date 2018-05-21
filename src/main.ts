import { forEachEntry } from "lightdash";
import { IRoutes } from "./interfaces";
import findRoute from "./lib/findRoute";
import { getHash, hasHash } from "./lib/hash";
import { splitPath } from "./lib/path";
import { pathStr, routeArr, routeFn, view } from "./types";

/**
 * Avenue Class
 *
 * @class
 */
const Avenue = class {
    public view: view;
    public routes: routeArr;
    public fallback: routeFn;
    /**
     * Avenue constructor
     *
     * @constructor
     * @param {Object} routes
     */
    constructor(routes: IRoutes) {
        this.view = null;
        this.routes = [];
        this.fallback = () => {};

        // Change routes from {string: fn} to [string[], fn] and extract fallback route
        forEachEntry(routes, (routeItemPath: pathStr, routeItemFn: routeFn) => {
            if (routeItemPath === "?") {
                this.fallback = routeItemFn;
            } else {
                this.routes.push([splitPath(routeItemPath), routeItemFn]);
            }
        });

        window.addEventListener(
            "hashchange",
            e => this.setView(getHash(), e),
            false
        );

        // Load current route if exists
        if (hasHash()) {
            this.setView(getHash());
        }
    }
    /**
     * Sets view to a route path
     *
     * @param {string} path
     * @param {Event|null} [e=null]
     */
    public setView(path: pathStr, e: Event | null = null): void {
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
    public getView(): view {
        return this.view;
    }
};

export default Avenue;
