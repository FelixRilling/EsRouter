"use strict";

import runCallbacks from "../api/runCallbacks";
import {
    setSlug
} from "../slug";

/**
 * Move to id
 * @param {String} id Id to move to
 * @returns {Object} Avenue instance
 */
export default function(instance, id) {
    if (instance.data.ids.indexOf(id) > -1) {
        const index = instance.data.ids.indexOf(id);
        const element = instance.elements.field[index];

        //beforeMove Callback
        runCallbacks(instance, "beforeMove", {
            id,
            index,
            element
        });

        //Set new section
        instance.data.activeId = id;
        instance.data.index = index;
        setSlug(instance.options.slugPrepend, id);

        //afterMove Callback
        runCallbacks(instance, "afterMove", {
            id,
            index,
            element
        });

    }

    return instance;
}
