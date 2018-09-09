import { routeFn } from "./lib/route";
interface IRoutes {
    [key: string]: routeFn;
}
/**
 * Avenue class.
 *
 * @class
 */
declare const Avenue: {
    new (routes: IRoutes): {
        view: string | null;
        routes: [string[], routeFn][];
        fallback: routeFn;
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
        getView(): string | null;
    };
};
export { Avenue };
