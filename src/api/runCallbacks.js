"use strict";

import callback from "./callback";

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
export default function(instance, type, data) {
    const _plugins = instance.plugins;

    //Call plugins
    _plugins.active.forEach(plugin => {
        const pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            callback(pluginObj[type], data, instance.api, plugin.options, plugin.events);
        } else {
            throw `Missing plugin ${plugin.name}`;
        }
    });

    //Call user events
    callback(instance.events[type], data, instance.api);
}
