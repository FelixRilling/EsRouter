import { IRoutes } from "./route/IRoutes";
import { routeFn } from "./route/routeFn";
import { routeItem } from "./route/routeItem";
import { view } from "./view/view";
/**
 * Avenue class.
 *
 * @class
 */
declare class Avenue {
    view: view;
    routes: routeItem[];
    fallback: routeFn;
    /**
     * Avenue constructor.
     *
     * @constructor
     * @param {object} routes object of routes to use.
     */
    constructor(routes: IRoutes);
    /**
     * Sets view to a route path.
     *
     * @param {string} path string route path.
     * @param {Event|null} [e=null] event, if called through one.
     */
    setView(path: string, e?: Event | null): void;
    /**
     * Returns active view path.
     *
     * @returns {string|null} active view, or null if none was set.
     */
    getView(): view;
}
export { Avenue };
