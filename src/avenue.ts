import { forEachEntry } from "lightdash";
import { getLocationHash } from "./lib/location";
import { pathStr, splitPath } from "./lib/path";
import { findRoute, routeArr, routeFn } from "./lib/route";

type view = pathStr | null;

interface IRoutes {
    [key: string]: routeFn;
}

/**
 * Avenue class.
 *
 * @class
 */
const Avenue = class {
    public view: view;
    public routes: routeArr;
    public fallback: routeFn;
    /**
     * Avenue constructor.
     *
     * @constructor
     * @param {object} routes object of routes to use.
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
            e => this.setView(getLocationHash(), e),
            false
        );

        // Load current route if exists
        this.setView(getLocationHash());
    }
    /**
     * Sets view to a route path.
     *
     * @param {string} path string route path.
     * @param {Event|null} [e=null] event, if called through one.
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
     * Returns active view path.
     *
     * @returns {string|null} active view, or null if none was set.
     */
    public getView(): view {
        return this.view;
    }
};

export { Avenue };
