/**
 * Finds route by path from route container.
 *
 * @private
 * @param {Array<string>} path
 * @param {Object} routes
 * @returns {Object}
 */
declare const findRoute: (path: string[], routes: [string[], import("src/types").routeFn][]) => {
    route: [string[], import("src/types").routeFn];
    args: {
        [key: string]: any;
    };
} | null;
export { findRoute };
