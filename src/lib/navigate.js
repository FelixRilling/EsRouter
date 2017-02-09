"use strict";

import {
    _history,
    //_location,
    URL_BASE
} from "./constants";

const navigate = function (path, routes, e, URL_ROOT) {
    const pathCleaned = path.replace(URL_BASE, "");
    const pathFull = URL_ROOT + pathCleaned;
    const route = routes[pathCleaned];

    console.log({
        path,
        pathCleaned,
        pathFull,
        route
    });

    //if (typeof route === "function") {
    _history.pushState(0, 0, pathFull);
    //route(e);
    //}
};

export default navigate;
