"use strict";

import queryElements from "../dom/queryElements";
import bindEvents from "../dom/bindEvents";
import readData from "../dom/readData";
import {
    getSlug
} from "../slug";
import {
    eachNode
} from "../util";

export default function () {
    const _this = this;
    const slug = getSlug.call(_this);

    //beforeInit Callback
    _this.events.beforeInit.call(_this);

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_this.options.elements);
    if (_this.options.autobind) {
        //Bind buttons
        bindEvents.call(_this, _this.elements, _this.options.elements);
    }

    /**
     * Data
     */
    //Read default ids
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

    /**
     * Move
     */
    //Move to either saved slug or default id
    if (slug !== "") {
        _this.moveTo(slug);
    } else {
        _this.moveTo(_this.data.defaultId);
    }

    //afterInit Callback
    _this.events.afterInit.call(_this);
}
