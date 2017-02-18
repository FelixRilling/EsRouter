"use strict";

const $output = document.querySelector("#output");

const router = new Avenue({
    "/": () => {
        $output.textContent = "Home";
    },
    "/about": () => {
        $output.textContent = "About";
    },
    "/users/:user": (e, params) => {
        $output.textContent = `User: ${params.user}`;
    },
    "/users/:user/edit": (e, params) => {
        $output.textContent = `User edit: ${params.user}`;
    },
    "/groups/:group/users/:user/edit": (e, params) => {
        $output.textContent = `User edit: ${params.user} from group ${params.group}`;
    },
    "?": (e, path) => {
        $output.textContent = `URL doesnt match route: ${path}`;
    }
});

console.log(router);
