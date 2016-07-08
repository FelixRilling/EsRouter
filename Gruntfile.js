"use strict";

module.exports = function (grunt) {
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
                    "dist/esRouter-es5.min.js": ".tmp/esRouter-es5.js",
                    "dist/plugins/esRouter-es5.scroll.min.js": ".tmp/plugins/esRouter-es5.scroll.js"
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
                    ".tmp/plugins/esRouter.scroll.js": "src/plugins/esRouter.scroll.js",
                }
            },
            dist: {
                files: {
                    "dist/esRouter.js": ".tmp/esRouter.js",
                    "dist/esRouter-es5.js": ".tmp/esRouter-es5.js",
                    "dist/plugins/esRouter.scroll.js": ".tmp/plugins/esRouter.scroll.js",
                    "dist/plugins/esRouter-es5.scroll.js": ".tmp/plugins/esRouter-es5.scroll.js"
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
                    ".tmp/esRouter-es5.js": ".tmp/esRouter.js",
                    ".tmp/plugins/esRouter-es5.scroll.js": ".tmp/plugins/esRouter.scroll.js"
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
        //"replace",
        "uglify:main",
        "copy:dist"
    ]);

    grunt.registerTask("default", [
        "jshint",
        "dist"
    ]);

};
