"use strict";

import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import runCallbacks from "../api/runCallbacks";
import _moveTo from "../move/moveTo";
import _moveBy from "../move/moveBy";
import {
    readData
} from "../dom/data";
import {
    getSlug
} from "../slug/index";
import {
    eachNode
} from "../util";


/**
 * Init Avenue instance
 * @returns {Object} Avenue instance
 */
export default function() {
    const _this = this;
    const _options = _this.options;
    const slug = getSlug(_this.options.slugPrepend);

    //beforeInit Callback
    runCallbacks(_this, "beforeInit", {});

    /**
     * DOM
     */
    //Collect DOM elements
    _this.elements = queryElements(_options.attributes);
    if (_options.autobind) {
        //Bind router-link events
        bind(_this.elements.link, "click", element => {
            const id = readData(element, _options.attributes.prefix, _options.attributes.types.link);

            _moveTo(_this, id);
        });

        //Bind router-pagination events
        bind(_this.elements.pagination, "click", element => {
            const val = Number(readData(element, _options.attributes.prefix, _options.attributes.types.pagination));

            _moveBy(_this, val);
        });
    }

    /**
     * Data
     */
    //Read ids
    eachNode(_this.elements.field, element => {
        const id = readData(
            element,
            _options.attributes.prefix,
            _options.attributes.types.field
        );

        if (element === _this.elements.fieldDefault[0]) {
            _this.data.defaultId = id;
        }

        _this.data.ids.push(id);
    });

    /**
     * Move
     */
    //Move to either saved slug or default id
    if (slug !== "") {
        _moveTo(_this, slug);
    } else {
        _moveTo(_this, _this.data.defaultId);
    }

    //afterInit Callback
    runCallbacks(_this, "afterInit", {});

    return _this;
}
