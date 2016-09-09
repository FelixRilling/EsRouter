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
export default function (id) {
    const _this = this;

    if (_this.data.ids.indexOf(id) > -1) {
        const index = _this.data.ids.indexOf(id);

        //beforeMove Callback
        callback.call(_this, "beforeMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

        //Set new section
        _this.data.activeId = id;
        _this.data.index = index;
        setSlug.call(_this, id);

        //afterMove Callback
        callback.call(_this, "afterMove", {
            id,
            index,
            element: _this.elements.field[index]
        });

    }

            return _this;
}
