var avenue = function () {
    'use strict';

    const _window = window;
    const _document = _window.document;
    const _location = _window.location;
    const _history = _window.history;

    const DOM_ATTR = "routing";
    const DOM_ATTR_DATA = `[data-${DOM_ATTR}]`;
    const URL_BASE = /\.*/;

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

    /**
     * Applies Avenue to all given forms
     *
     * @param {Object} routes Configuration object
     */
    const avenue = function (routes) {
        const URL_BASE$$1 = _location.pathname;

        Array.from(_document.querySelectorAll(DOM_ATTR_DATA)).forEach(element => {
            element.addEventListener("click", e => {
                e.preventDefault();
                navigate(e.target.attributes.getNamedItem("href").value, routes, e, URL_BASE$$1);
            });
        });
    };

    return avenue;
}();