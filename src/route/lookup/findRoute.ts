import { isPathVariable } from "../../path/isPathVariable";
import { pathArr } from "../../path/pathArr";
import { routeItem } from "../routeItem";
import { IRouteLookup } from "./IRouteLookup";
import { IRouteParams } from "./IRouteParams";
import { matchRoutes } from "./matchRoute";

/**
 * Finds route by path.
 *
 * @private
 * @param {Array<string>} path path string array.
 * @param {object} routes object containing routes.
 * @returns {object|null} object containing route and args, or null if none was found.
 */
const findRoute = (path: pathArr, routes: routeItem[]): IRouteLookup | null => {
    const route = routes.find((routeCurrent: routeItem) =>
        matchRoutes(path, routeCurrent[0])
    );

    if (route) {
        const args: IRouteParams = {};

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
