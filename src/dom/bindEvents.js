"use strict";

import readData from "./readData";
import {
    eachNode
} from "../util";

export default function (categories, elements) {
    const _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    //Bind router-link events
    bindClick(categories.link, element => {
        const id = readData(element, elements.prefix, elements.fields.link);

        _this.moveTo(id);
    });

    //Bind router-pagination events
    bindClick(categories.pagination, element => {
        const val = readData(element, elements.prefix, elements.fields.pagination);

        _this.moveBy(Number(val));
    });
}
