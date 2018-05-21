import { IParams } from "./interfaces";

type pathStr = string;
type pathArr = pathStr[];

type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
type routeItem = [pathArr, routeFn];
type routeArr = routeItem[];

type view = pathStr | null;

export { pathStr, pathArr, routeFn, routeItem, routeArr, view };
