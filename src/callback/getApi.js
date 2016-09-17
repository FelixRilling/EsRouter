"use strict";

import callback from "./callback";
import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import {
    readData,
    writeData
} from "../dom/data";
import {
    getSlug,
    setSlug
} from "../slug";

export default function(context) {
    //Avenue API
    return {
        data: context.data,
        options: context.options,
        elements: context.elements,
        methods: {
            callback,
            slug: {
                setSlug,
                getSlug
            },
            dom: {
                queryElements,
                bind,
                readData,
                writeData
            }
        }
    };
}
