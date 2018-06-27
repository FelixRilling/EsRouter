import { pathArr, pathStr } from "./path";
declare type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
declare type routeItem = [pathArr, routeFn];
declare type routeArr = routeItem[];
interface IParams {
    [key: string]: string;
}
interface IRouteArgs {
    [key: string]: any;
}
interface IRouteLookup {
    route: routeItem;
    args: IRouteArgs;
}
/**
 * Finds route by path.
 *
 * @private
 * @param {Array<string>} path path string array.
 * @param {object} routes object containing routes.
 * @returns {object|null} object containing route and args, or null if none was found.
 */
declare const findRoute: (path: string[], routes: [string[], routeFn][]) => IRouteLookup | null;
export { findRoute, routeFn, routeArr, routeItem };
