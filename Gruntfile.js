"use strict";

module.exports = function(grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {});

    grunt.initConfig({
        watch: {
            js: {
                files: [
                    "src/{,*/}*.js"
                ],
                tasks: [
                    "dist"
                ]
            },
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            files: {
                src: [
                    "src/{,*/}.js"
                ]
            },
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        "dist/{,*/}*",
                        ".tmp/{,*/}*"
                    ]
                }]
            }
        },

        uglify: {
            main: {
                files: {
                    "dist/esRouter-es5.min.js": ".tmp/esRouter-es5.rpl.js"
                },
                options: {
                    compress: {
                        drop_console: true,
                        screw_ie8: true
                    }
                }
            }
        },

        copy: {
            build: {
                files: {
                    ".tmp/esRouter.js": "src/esRouter.js",
                }
            },
            dist: {
                files: {
                    "dist/esRouter.js": ".tmp/esRouter.js",
                    "dist/esRouter-es5.js": ".tmp/esRouter-es5.js"
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"]
            },
            dist: {
                files: {
                    ".tmp/esRouter-es5.js": ".tmp/esRouter.js"
                }
            }
        },
        /* UglifyJS doesnt uglify properties, so we do it by hand*
         * The properties left out are not included for a reason, adding them will break functionality
         * UPDATE: yep we shouldnt do this, too much work
         */
        replace: {
            dist: {
                options: {

                    patterns: [
                        //General
                        {
                            match: /built/g,
                            replacement: "a"
                        },
                        //Slug
                        {
                            match: /urlFragmentInitator/g,
                            replacement: "b"
                        }, {
                            match: /urlFragmentAppend/g,
                            replacement: "c"
                        }, {
                            match: /corePrefix/g,
                            replacement: "d"
                        }, {
                            match: /dataAttr/g,
                            replacement: "e"
                        }, {
                            match: /preSlash/g,
                            replacement: "f"
                        }, {
                            match: /postSlash/g,
                            replacement: "g"
                        },
                        //dom
                        {
                            match: /sectionDefault/g,
                            replacement: "i"
                        }, {
                            match: /link/g,
                            replacement: "j"
                        }, {
                            match: /pagination/g,
                            replacement: "k"
                        }, {
                            match: /source/g,
                            replacement: "t"
                        },
                        //callback
                        {
                            match: /callback/g,
                            replacement: "l"
                        }, {
                            match: /iterateDomNode/g,
                            replacement: "m"
                        }, {
                            match: /isDefined/g,
                            replacement: "n"
                        }, {
                            match: /writeLog/g,
                            replacement: "o"
                        }, {
                            match: /findData/g,
                            replacement: "p"
                        }, {
                            match: /getElementIndex/g,
                            replacement: "q"
                        }, {
                            match: /getCurrentIndex/g,
                            replacement: "r"
                        }, {
                            match: /throwError/g,
                            replacement: "s"
                        }, {
                            match: /responseText/g,
                            replacement: "u"
                        }, {
                            match: /getAJAX/g,
                            replacement: "v"
                        }, {
                            match: /defaultId/g,
                            replacement: "w"
                        }, {
                            match: /activeId/g,
                            replacement: "x"
                        }
                    ]
                },
                files: {
                    ".tmp/esRouter-es5.rpl.js": ".tmp/esRouter-es5.js"
                }
            }
        },

    });

    grunt.registerTask("build", [
        "clean:dist",
        "copy:build",
    ]);

    grunt.registerTask("test", [
        "build",
        "jshint"
    ]);

    grunt.registerTask("dist", [
        "build",
        "babel:dist",
        "replace",
        "uglify:main",
        "copy:dist"
    ]);

    grunt.registerTask("default", [
        "jshint",
        "dist"
    ]);

};
