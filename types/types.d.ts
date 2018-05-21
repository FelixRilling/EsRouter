import { IParams } from "./interfaces";
declare type pathStr = string;
declare type pathArr = pathStr[];
declare type routeFn = (params: IParams, path: pathStr, e: Event | null) => void;
declare type routeItem = [pathArr, routeFn];
declare type routeArr = routeItem[];
declare type view = pathStr | null;
export { pathStr, pathArr, routeFn, routeItem, routeArr, view };
