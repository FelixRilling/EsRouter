"use strict";

import {
    _location
} from "../../constants";

const _this = this;

export const set = function (active) {
    _location.hash = _this.options.slug.start + active;
};
export const get = function () {
    return _location.hash.replace(_this.options.slug.start, "");
};
