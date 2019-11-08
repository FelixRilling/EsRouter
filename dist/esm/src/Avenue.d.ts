import { RouteDictionary } from "./route/RouteDictionary";
import { RouteFn } from "./route/RouteFn";
import { RouteItem } from "./route/RouteItem";
declare type View = string | null;
/**
 * Avenue class.
 *
 * @class
 */
declare class Avenue {
    view: View;
    routes: RouteItem[];
    fallback: RouteFn;
    /**
     * Avenue constructor.
     *
     * @constructor
     * @param {object} routes object of routes to use.
     */
    constructor(routes: RouteDictionary);
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
    getView(): View;
}
export { Avenue };
//# sourceMappingURL=Avenue.d.ts.map