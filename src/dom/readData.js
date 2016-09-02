"use strict";

export default function (element, prefix, key) {
    const getAttr = function (prefix, key) {
        return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
    };

    return element.dataset[getAttr(prefix, key)];
};
