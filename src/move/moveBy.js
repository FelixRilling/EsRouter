"use strict";

import moveTo from "./moveTo";

export default function (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        moveTo.call(_this, newId);
    }
}
