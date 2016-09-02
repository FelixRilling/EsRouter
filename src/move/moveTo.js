"use strict";

import move from "./move";

export default function (id) {
    const _this = this;

    if (_this.data.ids.includes(id)) {
        move.call(_this, id);
    } else {
        console.info("MISSING " + id);
    }
}
