"use strict";

import findRoute from "./findRoute";

/**
 * Changes view by route
 *
 * @param {String} path route path
 * @param {Object} routes route map
 * @param {Event} e Event object
 * @returns {Object} matching route
 */
const changeView = function (path, routes, e) {
    const routeData = findRoute(path, routes[0]);

    if (routeData) {
        //Runs route
        routeData.fn(e, routeData.args, path);
    }else{
        //Or fallback if route wasnt found
        routes[1](e, path);
    }
};

export default changeView;
