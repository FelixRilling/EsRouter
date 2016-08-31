"use strict";

import {
    setSlug
} from "../slug";

export default function (id) {
    const _this = this;
    const index = _this.data.ids.indexOf(id);

    _this.data.activeId = id;
    _this.data.index = index;

    setSlug.call(_this, id);
}
