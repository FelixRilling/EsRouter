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
          "babel"
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
        presets: ["es2015", "stage-0", "stage-1", "stage-2", "stage-3"]
      },
      dist: {
        files: {
          ".tmp/esRouter-es5.js": ".tmp/esRouter.js"
        }
      }
    },    /* UglifyJS doesnt uglify properties, so we do it by hand*
         * The properties left out are not included for a reason, adding them will break functionality
         * UPDATE: yep we shouldnt do this, too much work
         */
        replace: {
          dist: {
            options: {
              patterns: [{
                match: /built/g,
                replacement: "a"
              }]
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
