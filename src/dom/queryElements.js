"use strict";

import {
    _document
} from "../constants";
import {
    getDataQueryDom
} from "./data";

/**
 * Query router elements
 * @param {Object} attributes The Options attributes property
 * @returns {Object} Object of query results
 */
export default function(attributes) {
    const fieldKeys = Object.keys(attributes.types);
    const result = {};

    fieldKeys.forEach((key, i) => {
        const query = getDataQueryDom(attributes.prefix, attributes.types[key]);

        result[key] = _document.querySelectorAll(query);
    });

    return result;
}
