"use strict";

import callback from "./callback";

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
export default function(context, type, data) {
    const _plugins = context.plugins;

    //Call plugins
    _plugins.active.forEach(plugin => {
        const pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            const fn = pluginObj[type];
            //Check if plugin event exists
            if (fn) {
                callback(context, fn, data, plugin.options, plugin.events);
            }
        } else {
            throw `Missing plugin ${plugin.name}`;
        }
    });

    //Call user events
    callback(context, context.events[type], data);
}
