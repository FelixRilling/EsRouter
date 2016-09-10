"use strict";

import {
    _document
} from "../constants";

/**
 * Query router elements
 *
 * @private
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
export default function(attributes) {
    const fieldKeys = Object.keys(attributes.types);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    fieldKeys.forEach((key, i) => {
        result[key] = queryByField(attributes.prefix, attributes.types[key]);
    });

    return result;
}
