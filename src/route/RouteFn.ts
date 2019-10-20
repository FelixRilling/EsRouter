import { RouteParams } from "./lookup/RouteParams";

type RouteFn = (params: RouteParams, path: string, e: Event | null) => void;

export { RouteFn };
