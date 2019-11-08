import { isPathVariable } from "../../path/isPathVariable";
import { routesMatch } from "./routesMatch";
/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
const findRoute = (path, routes) => {
    const route = routes.find((routeCurrent) => routesMatch(path, routeCurrent[0]));
    if (route) {
        const args = {};
        route[0].forEach((routePathPart, index) => {
            if (isPathVariable(routePathPart)) {
                args[routePathPart.substr(1)] = path[index];
            }
        });
        return {
            route,
            args
        };
    }
    return null;
};
export { findRoute };
//# sourceMappingURL=findRoute.js.map