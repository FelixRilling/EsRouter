"use strict";

export default function (val) {
    const _this = this;
    const newId = _this.data.ids[_this.data.index + val];

    if (typeof newId !== "undefined") {
        _this.moveTo(newId);
    } else {
        console.info("MISSING " + val);
    }
}
