"use strict";

import {
    _location
} from "../constants";

/**
 * Set new slug
 * @private
 * @param {String} active Slug to set
 */
export const setSlug = function(slugPrepend, active) {
    _location.hash = slugPrepend + active;
};

/**
 * Read current slug
 * @private
 * @returns {String} Slug value
 */
export const getSlug = function(slugPrepend) {
    return _location.hash.replace(slugPrepend, "").replace("#", "");
};
