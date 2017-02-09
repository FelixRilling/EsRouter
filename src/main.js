"use strict";

import {
    _window,
    _document,
    _location,
    DOM_ATTR_DATA
} from "./lib/constants";
import navigate from "./lib/navigate";
/**
 * Applies Avenue to all given forms
 *
 * @param {Object} routes Configuration object
 */
const avenue = function (routes) {
    const URL_BASE = _location.pathname;

    Array.from(_document.querySelectorAll(DOM_ATTR_DATA)).forEach(element => {
        element.addEventListener("click", e => {
            e.preventDefault();
            navigate(e.target.attributes.getNamedItem("href").value, routes, e, URL_BASE);
        });
    });
};

export default avenue;
