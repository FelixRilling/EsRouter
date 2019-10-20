import { RouteItem } from "../RouteItem";
import { RouteParams } from "./RouteParams";

interface RouteLookup {
    route: RouteItem;
    args: RouteParams;
}

export { RouteLookup };
