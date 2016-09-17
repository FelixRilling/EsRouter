"use strict";


/**
 * Get data query for dom element
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Selector query
 */
export const getDataQueryDom = function(prefix, name) {
    return `[data-${prefix}-${name}]`;
};

/**
 * Get data query for node property
 * @private
 * @param {String} prefix Data prefix
 * @param {String} name Data name
 * @returns {String} Prop query
 */
export const getDataQueryProp = function(prefix, name) {
    return prefix + name.substr(0, 1).toUpperCase() + name.substr(1);
};

/**
 * Read value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @returns {String} Value of the attribute
 */
export const readData = function(element, prefix, name) {
    return element.dataset[getDataQueryProp(prefix, name)];
};

/**
 * Set value of element data attribute
 * @param {Node} element The element node to check
 * @param {String} prefix The attribute prefix
 * @param {String} name The attribute name
 * @param {String} value The attribute value
 */
export const writeData = function(element, prefix, name, value) {
    element.dataset[getDataQueryProp(prefix, name)] = value;
};
