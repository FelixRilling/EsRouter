"use strict";

const getHash = function (_location) {
    return _location.hash.replace("#", "");
};

export default getHash;
