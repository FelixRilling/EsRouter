"use strict";

import {
    _document
} from "../../constants";

function queryForField(prefix, name) {
    return _document.querySelectorAll(`[data-${prefix}-${name}]`);
}

export default function () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);
    const result = {};

    keys.forEach((key, i) => {
        result[key] = queryForField(_elements.prefix, _elements.fields[key]);
    });

    return result;
}
