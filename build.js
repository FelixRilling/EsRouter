"use strict";

const exec = require("child_process").exec;

const entries = [{
    name: "esRouter",
    cwd: "./",
}, {
    name: "esRouter.ajax",
    cwd: "./plugins/ajax/",
}];

function build(entry) {
    const commands = [
        `rollup -c ${entry.cwd}rollup.config.js`,
        `babel ./dist/${entry.cwd}es6 --out-dir ./dist/${entry.cwd} --plugins array-includes`,
        `uglifyjs ./dist/${entry.cwd}${entry.name}.js -o ./dist/${entry.cwd}${entry.name}.min.js --screw-ie8 --mangle --compress conditionals`
    ];

    console.log(`Started Building Entry '${entry.name}'->${entry.cwd}`);
    commands.forEach(command => {
        console.log("");
        console.log(command);

        exec(command, (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });
}

entries.forEach(entry => {
    build(entry);
    console.log("");
    console.log("");
});
