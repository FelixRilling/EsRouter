"use strict";

import {
    eachNode
} from "../util";

export default function(data, api) {
    const allFields = api.elements.field;
    const activeField = data.element;

    eachNode(allFields, field => {
        field.style.display = "none";
    });

    activeField.style.display = "inherit";
}
