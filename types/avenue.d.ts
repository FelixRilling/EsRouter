import { pathStr } from "./lib/path";
import { routeFn } from "./lib/route";
declare type view = pathStr | null;
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
        view: view;
        routes: [string[], routeFn][];
        fallback: routeFn;
        /**
         * Sets view to a route path.
         *
         * @param {string} path
         * @param {Event|null} [e=null]
         */
        setView(path: string, e?: Event | null): void;
        /**
         * Returns active view path.
         *
         * @returns {string}
         */
        getView(): view;
    };
};
export { Avenue };
