"use strict";

export const eachNode = function (elements, fn) {
    [].forEach.call(elements, element => {
        fn(element);
    });
};
