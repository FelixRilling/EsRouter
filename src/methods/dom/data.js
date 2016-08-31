"use strict";

export const findData = function (elements, prefix, key, value) {
    const attr = prefix + key.substr(0, 1).toUpperCase() + key.substr(1);

};

export const readData = function (element, prefix, key) {
    return element.dataset[getAttr(prefix, key)];
};

function getAttr(prefix, key) {
    return prefix + key.substr(0, 1).toUpperCase() + key.substr(1);
}
