"use strict";

import {
    _document
} from "../../constants";
import {
    eachNode
} from "../../util";

export default function () {
    const _this = this;
    const _elements = _this.options.elements;
    const keys = Object.keys(_elements.fields);

    const result = {};

    function queryByField(prefix, name) {
        return _document.querySelectorAll(`[data-${prefix}-${name}]`);
    }

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", fn, false);
        });
    }

    keys.forEach((key, i) => {
        result[key] = queryByField(_elements.prefix, _elements.fields[key]);
    });

    if (_this.options.autobind) {
        bindClick(result["link"], () => {
            console.log(1);
        });

        bindClick(result["pagination"], () => {
            console.log(2);
        });
    }

    return result;

}
