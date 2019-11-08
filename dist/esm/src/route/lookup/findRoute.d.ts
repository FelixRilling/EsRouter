import { PathArr } from "../../path/PathArr";
import { RouteItem } from "../RouteItem";
import { RouteParams } from "./RouteParams";
interface RouteLookup {
    route: RouteItem;
    args: RouteParams;
}
/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
declare const findRoute: (path: PathArr, routes: RouteItem[]) => RouteLookup | null;
export { findRoute };
//# sourceMappingURL=findRoute.d.ts.map