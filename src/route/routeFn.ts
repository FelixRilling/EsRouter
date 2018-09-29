import { IRouteParams } from "./lookup/IRouteParams";

type routeFn = (params: IRouteParams, path: string, e: Event | null) => void;

export { routeFn };
