import { isPathVariable } from "../../path/isPathVariable";
import { PathArr } from "../../path/PathArr";
import { RouteItem } from "../RouteItem";
import { RouteLookup } from "./RouteLookup";
import { RouteParams } from "./RouteParams";
import { routesMatch } from "./routesMatch";

/**
 * Finds route by path.
 *
 * @private
 * @param path path string array.
 * @param routes object containing routes.
 * @returns object containing route and args, or null if none was found.
 */
const findRoute = (path: PathArr, routes: RouteItem[]): RouteLookup | null => {
    const route = routes.find((routeCurrent: RouteItem) =>
        routesMatch(path, routeCurrent[0])
    );

    if (route) {
        const args: RouteParams = {};

        route[0].forEach((routePathPart: string, index: number) => {
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
