"use strict";

const splitPath = function (path) {
    return path.split("/").filter(item => item.length);
};

export default splitPath;
