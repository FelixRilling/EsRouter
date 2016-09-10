"use strict";

import {
    _document
} from "../constants";
import {
    getDataDom
} from "./dataQuery";


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

    fieldKeys.forEach((key, i) => {
        const query = getDataDom(attributes.prefix, attributes.types[key]);

        result[key] = _document.querySelectorAll(query);
    });

    return result;
}
