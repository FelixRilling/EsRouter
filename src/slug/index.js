"use strict";

import {
    _location
} from "../constants";

/**
 * Set new slug
 *
 * @private
 * @param {String} active Slug to set
 */
export const setSlug = function (active) {
    _location.hash = this.options.slug.prepend + active;
};

/**
 * Read current slug
 *
 * @private
 * @returns {String} Returns slug value
 */
export const getSlug = function () {
    return _location.hash.replace(this.options.slug.prepend, "").replace("#", "");
};
