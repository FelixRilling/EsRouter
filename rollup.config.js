"use strict";
import {
    rollup
} from "rollup";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";

export default {
    moduleName: "esRouter",
    moduleId: "esrouter",
    entry: "src/main.js",
    plugins: [
        nodeResolve({
            jsnext: false,
            main: true
        }),
        commonjs({})
    ],
    targets: [{
        dest: "dist/es6/esRouter.amd.js",
        format: "amd"
    }, {
        dest: "dist/es6/esRouter.common.js",
        format: "cjs"
    }, {
        dest: "dist/es6/esRouter.es.js",
        format: "es"
    }, {
        dest: "dist/es6/esRouter.js",
        format: "iife"
    }]
};
