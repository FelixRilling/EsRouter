"use strict";

import {
    eachNode
} from "../../util";

export default function (categories) {
    const _this = this;
    const result = {};

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", fn, false);
        });
    }

    bindClick(categories["link"], () => {
        console.log(1);
    });

    bindClick(categories["pagination"], () => {
        console.log(2);
    });
}
