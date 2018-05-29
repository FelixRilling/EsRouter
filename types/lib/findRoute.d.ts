import { IParams } from "../interfaces";
/**
 * Finds route by path from route container
 *
 * @private
 * @param {Array<string>} path route path
 * @param {Object} routes route map
 * @returns {Object} matching route
 */
declare const findRoute: (path: string[], routes: [string[], (params: IParams, path: string, e: Event | null) => void][]) => {
    route: [string[], (params: IParams, path: string, e: Event | null) => void];
    args: {
        [key: string]: any;
    };
} | null;
export { findRoute };
