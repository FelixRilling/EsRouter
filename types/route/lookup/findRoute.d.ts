import { IRouteLookup } from "./IRouteLookup";
/**
 * Finds route by path.
 *
 * @private
 * @param {Array<string>} path path string array.
 * @param {object} routes object containing routes.
 * @returns {object|null} object containing route and args, or null if none was found.
 */
declare const findRoute: (path: string[], routes: [string[], import("../routeFn").routeFn][]) => IRouteLookup | null;
export { findRoute };
