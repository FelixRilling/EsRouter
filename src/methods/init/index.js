"use strict";

import bind from "../dom/bind";
import readData from "../dom/readData";

export default function () {
    const _this = this;

    _this.elements = bind.call(_this);

    [].forEach.call(_this.elements.field, element => {
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
