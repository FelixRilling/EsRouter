"use strict";


/**
 * Get data query for dom element
 *
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} query Selector query
 */
export const getDataDom = function(prefix, name) {
    return `[data-${prefix}-${name}]`;
};

/**
 * Get data query for node property
 *
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} query Selector query
 */
export const getDataProp = function(prefix, name) {
    return prefix + name.substr(0, 1).toUpperCase() + name.substr(1);
};
