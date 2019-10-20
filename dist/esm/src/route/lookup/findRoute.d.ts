import { RouteLookup } from "./RouteLookup";
/**
 * Finds route by path.
 *
 * @private
 * @param {Array<string>} path path string array.
 * @param {object} routes object containing routes.
 * @returns {object|null} object containing route and args, or null if none was found.
 */
declare const findRoute: (path: string[], routes: [string[], import("../RouteFn").RouteFn][]) => RouteLookup | null;
export { findRoute };
//# sourceMappingURL=findRoute.d.ts.map