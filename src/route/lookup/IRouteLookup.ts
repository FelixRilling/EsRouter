import { routeItem } from "../routeItem";
import { IRouteParams } from "./IRouteParams";

interface IRouteLookup {
    route: routeItem;
    args: IRouteParams;
}

export { IRouteLookup };
