import { routeFn } from "./types";

interface IParams {
    [key: string]: string;
}

interface IRoutes {
    [key: string]: routeFn;
}

export { IParams, IRoutes };
