"use strict";

import callback from "../api/callback";
import {
    setSlug
} from "../slug";

/**
 * Move to id
 *
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
export default function(id) {
    const _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        const index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        callback("beforeMove", _this, {
            id,
            index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug(_this.options.slugPrepend, id);

        //afterMove Callback
        callback("afterMove", _this, {
            id,
            index,
            element: _this.elements.field[index]
        });

    }

    return _this;
}
