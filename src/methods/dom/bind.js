"use strict";

import {
    eachNode
} from "../../util";
import {
    readData
} from "./data";

export default function (categories) {
    const _this = this;
    const result = {};

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    bindClick(categories.link, element => {
        const id = readData(element, _this.options.elements.prefix, _this.options.elements.fields.link);

        _this.moveTo(id);
    });
    bindClick(categories.pagination, element => {
        const val = readData(element, _this.options.elements.prefix, _this.options.elements.fields.pagination);

        _this.moveBy(Number(val));
    });
}
