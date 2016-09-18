"use strict";

import callback from "./callback";
import getApi from "./getApi";

/**
 * Runs Plugin/User events
 * @param {Object} context Instance context
 * @param {String} type Event type
 * @param {Object} data Event data
 */
export default function(instance, type, data) {
    const _plugins = instance.plugins;
    const _api = getApi(instance);

    //Call plugins
    _plugins.active.forEach(plugin => {
        const pluginObj = _plugins.container[plugin.name];
        //Check if requested plugin exists
        if (pluginObj) {
            callback(pluginObj[type], data, _api, plugin.options, plugin.events);
        } else {
            throw `Missing plugin ${plugin.name}`;
        }
    });

    //Call user events
    callback(instance.events[type], data, _api);
}
