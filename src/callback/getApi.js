"use strict";

import callback from "./callback";
import queryElements from "../dom/queryElements";
import bind from "../dom/bind";
import moveBy from "../move/moveBy";
import moveTo from "../move/moveTo";
import {
    eachNode
} from "../util";
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
            util: {
                eachNode
            },
            move: {
                moveBy,
                moveTo
            },
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
