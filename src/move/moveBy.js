"use strict";

import moveTo from "./moveTo";

/**
 * Move by Value
 * @param {Number} val Value to move by
 * @returns {Object} Avenue instance
 */
export default function (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo.call(_this, newId);
    }
}
