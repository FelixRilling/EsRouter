"use strict";

import {
    setSlug
} from "../slug";

export default function (id) {
    const _this = this;
    const index = _this.data.ids.indexOf(id);

    //beforeMove Callback
    _this.events.beforeMove.call(_this, id, index, _this.elements.field[index]);

    //Set new section
    _this.data.activeId = id;
    _this.data.index = index;
    setSlug.call(_this, id);

    //afterMove Callback
    _this.events.afterMove.call(_this, id, index, _this.elements.field[index]);
}
