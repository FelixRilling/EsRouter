import { IRoutes } from "./interfaces";
import { routeFn, view } from "./types";
/**
 * Avenue Class
 *
 * @class
 */
declare const Avenue: {
    new (routes: IRoutes): {
        view: view;
        routes: [string[], routeFn][];
        fallback: routeFn;
        setView(path: string, e?: Event | null): void;
        getView(): view;
    };
};
export default Avenue;
