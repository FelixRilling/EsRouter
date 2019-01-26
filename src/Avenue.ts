import { forEachEntry } from "lightdash";
import { getLocationHash } from "./location/location";
import { splitPath } from "./path/path";
import { IRoutes } from "./route/IRoutes";
import { findRoute } from "./route/lookup/findRoute";
import { routeFn } from "./route/routeFn";
import { routeItem } from "./route/routeItem";
import { view } from "./view/view";

/**
 * Avenue class.
 *
 * @class
 */
class Avenue {
    public view: view;
    public routes: routeItem[];
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
        this.fallback = () => null;

        // Change routes from {string: fn} to [string[], fn] and extract fallback route
        forEachEntry(routes, (routeItemFn: routeFn, routeItemPath: string) => {
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

        // Load current route if it exists
        this.setView(getLocationHash());
    }

    /**
     * Sets view to a route path.
     *
     * @param {string} path string route path.
     * @param {Event|null} [e=null] event, if called through one.
     */
    public setView(path: string, e: Event | null = null): void {
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
}

export { Avenue };
