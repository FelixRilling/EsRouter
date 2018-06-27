import { pathArr, pathStr } from "./path";
declare type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
declare type routeItem = [pathArr, routeFn];
declare type routeArr = routeItem[];
interface IParams {
    [key: string]: string;
}
/**
 * Finds route by path from route container.
 *
 * @private
 * @param {Array<string>} path
 * @param {Object} routes
 * @returns {Object}
 */
declare const findRoute: (path: string[], routes: [string[], routeFn][]) => {
    route: [string[], routeFn];
    args: {
        [key: string]: any;
    };
} | null;
export { findRoute, routeFn, routeArr, routeItem };
