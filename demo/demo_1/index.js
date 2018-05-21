"use strict";

const $output = document.querySelector("#output");

const router = new Avenue({
    "/": () => {
        $output.textContent = "Home";
    },
    "/about": () => {
        $output.textContent = "About";
    },
    "/users/:user": params => {
        $output.textContent = `User: '${params.user}'`;
    },
    "/users/:user/edit": params => {
        $output.textContent = `User edit: '${params.user}'`;
    },
    "/groups/:group/users/:user/edit": params => {
        $output.textContent = `User edit: '${params.user}' from group '${
            params.group
        }'`;
    },
    "?": (path, params, e) => {
        $output.textContent = `URL doesn't match any route: '${path}'; Parameters: ${params}, Event: ${e}`;
    }
});

console.log(router);
