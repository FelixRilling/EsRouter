"use strict";

import {
    _document
} from "../../constants";

export default function () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);
    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    keys.forEach((key, i) => {
        result[key] = queryByField(_elements.prefix, _elements.fields[key]);
    });

    return result;
}
