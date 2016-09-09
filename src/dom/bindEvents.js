"use strict";

import readData from "./readData";
import {
    eachNode
} from "../util";

/**
 * Bind UI Events
 *
 * @private
 * @param {Object} elements The Elements property
 * @param {Object} options The Options elements property
 */
export default function (elements, options) {
    const _this = this;

    function bindClick(elements, fn) {
        eachNode(elements, element => {
            element.addEventListener("click", ev => {
                fn(element, ev);
            }, false);
        });
    }

    //Bind router-link events
    bindClick(elements.link, element => {
        const id = readData(element, options.prefix, options.fields.link);

        _this.moveTo(id);
    });

    //Bind router-pagination events
    bindClick(elements.pagination, element => {
        const val = readData(element, options.prefix, options.fields.pagination);

        _this.moveBy(Number(val));
    });
}
