"use strict";

import readData from "../dom/readData";
import {
    eachNode
} from "../util";

export default function () {
    const _this = this;

    //Save Ids
    eachNode(_this.elements.field, element => {
        const id = readData(
            element,
            _this.options.elements.prefix,
            _this.options.elements.fields.field
        );

        _this.data.ids.push(id);

        if (element === _this.elements.fieldDefault[0]) {
            _this.data.defaultId = id;
        }
    });
}
