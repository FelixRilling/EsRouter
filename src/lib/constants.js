"use strict";

const _window = window;
const _document = _window.document;
const _location = _window.location;
const _history = _window.history;

const DOM_ATTR = "routing";
const DOM_ATTR_DATA = `[data-${DOM_ATTR}]`;
const URL_BASE = /\.*/;

export {
    _window,
    _document,
    _location,
    _history,

    DOM_ATTR,
    DOM_ATTR_DATA,
    URL_BASE
};
