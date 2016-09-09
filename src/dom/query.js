"use strict";

import {
    _document
} from "../constants";

export default function (elements) {
    const fieldKeys = Object.keys(elements.fields);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    fieldKeys.forEach((key, i) => {
        result[key] = queryByField(elements.prefix, elements.fields[key]);
    });

    return result;
}
