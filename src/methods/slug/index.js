"use strict";

import {
    _location
} from "../../constants";

export const setSlug = function (active) {
    _location.hash = this.options.slug.start + active;
};
export const getSlug = function () {
    return _location.hash.replace(this.options.slug.start, "").replace("#", "");
};
