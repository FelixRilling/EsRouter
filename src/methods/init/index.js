"use strict";

import query from "../dom/query";
import bind from "../dom/bind";
import read from "./read";
import {
    getSlug
} from "../slug";

export default function () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    //Collect DOM elements
    _this.elements = query.call(_this);
    if (_this.options.autobind) {
        //Bind buttons
        bind.call(_this, _this.elements);
    }
    //Read default ids
    read.call(_this);

    //Move to either saved slug or default id
    if (slug !== "") {
        _this.moveTo(slug);
    } else {
        _this.moveTo(_this.data.defaultId);
    }

    //afterInit Callback
    _this.events.afterInit.call(_this);
}
