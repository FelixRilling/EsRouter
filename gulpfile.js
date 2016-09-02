"use strict";

const packageJson = require("./package.json");
const bowerJson = require("./bower.json");

const gulp = require("gulp");
const shell = require("gulp-shell");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");

gulp.task("bundle", function () {
    return gulp.src("*.js")
        .pipe(shell("rollup -c"));
});

gulp.task("babel", function () {
    return gulp.src("./dist/es6/*.js")
        .pipe(babel({
            presets: ["es2015"],
            plugins: ["array-includes"]
        }))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("uglify", function () {
    return gulp.src(`./dist/${packageJson.module.name}.${packageJson.module.ext}`)
        .pipe(uglify())
        .pipe(rename({
            basename: packageJson.module.name,
            extname: `.min.${packageJson.module.ext}`
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task("watch", function () {
    gulp.watch("./src/**/.js", ["bundle"]);
});

gulp.task("default", function () {
    runSequence("bundle", "babel", "uglify", function () {
        console.log("Build Completed");
    });
});
