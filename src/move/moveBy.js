"use strict";

import moveTo from "./moveTo";

/**
 * Move by Value
 * @param {Number} val Value to move by
 * @returns {Object} Avenue instance
 */
export default function(instance, val) {
    const newId = instance.data.ids[instance.data.index + val];

    if (typeof newId !== "undefined") {
        return moveTo(instance, newId);
    }
}
