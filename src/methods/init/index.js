"use strict";

import bind from "../dom/bind";
import {
    readData
} from "../dom/data";

import {
    getSlug
} from "../slug";

import {
    moveTo
} from "../move";

export default function () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    _this.elements = bind.call(_this);

    //Save Ids
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

    //Move to either saved slug or default id
    if (slug !== "") {
        moveTo.call(_this, slug);
    } else {
        moveTo.call(_this, _this.data.defaultId);
    }

    //afterInit Callback
    _this.events.afterInit.call(_this);
}
