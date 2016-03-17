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
          "webpack"
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
          "dist/esQuery.min.js": ".tmp/esQuery.js",
          "dist/esQuery-es5.min.js": ".tmp/esQuery-es5.js"
        },
        options: {
          compress: {
            drop_console: true,
            screw_ie8: true
          }
        }
      },
      /*unsafe: {
        files: {

        },
        options: {
          compress: {
            drop_console: true,
            screw_ie8: true,
            unsafe: true,
            unsafe_comps: true
          }
        }
      }*/
    },
    copy: {
      dist: {
        files: {
          "dist/esQuery.js": ".tmp/esQuery.js",
          "dist/esQuery-es5.js": ".tmp/esQuery-es5.js"
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
          ".tmp/esQuery-es5.js": ".tmp/esQuery.js"
        }
      }
    },
    webpack: {
      main: {
        // webpack options
        entry: "src/esCore.js",
        output: {
          path: ".tmp/",
          filename: "esQuery.js",
        },

        stats: {
          // Configure the console output
          colors: false,
          modules: true,
          reasons: true
        },
        // stats: false disables the stats output

        failOnError: true, // don't report error to grunt if webpack find errors
        // Use this if webpack errors are tolerable and grunt should continue

        watch: true, // use webpacks watcher
        // You need to keep the grunt process alive

        keepalive: true, // don't finish the grunt task
        // Use this in combination with the watch option

        inline: true, // embed the webpack-dev-server runtime into the bundle
        // Defaults to false

        hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
        // Use this in combination with the inline option

      },
      anotherName: {}
    }
  });

  grunt.registerTask("build", [
    "clean:dist",
    "webpack"
  ]);

  grunt.registerTask("test", [
    "build",
    "jshint"
  ]);

  grunt.registerTask("dist", [
    "build",
    "babel:dist",
    "uglify:main",
    "copy:dist"
  ]);

  grunt.registerTask("default", [
    "jshint",
    "dist"
  ]);

};
