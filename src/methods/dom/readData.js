"use strict";

export default function (element, prefix, key) {
    const attr = prefix + key.substr(0, 1).toUpperCase() + key.substr(1);

    return element.dataset[attr];
}
