![AvenueJS](./logo.png)

# AvenueJS

> Avenue is an extremely small routing library

## Introduction

Avenue is a client side router that focuses on speed and size (~700Bytes / ~460Bytes gziped).
The API is heavily influenced by the [Angular1.x router](https://docs.angularjs.org/tutorial/step_09) and [gibon.js](https://github.com/tunnckoCore/gibon).
An unique feature of Avenue is the usage of URL hashes instead of full URLs to improve compability for different webservers.

## Usage

Here is an example from the demo:

### JS

```js
//Avenue({"/foo":(e,params,path)=>{}})
const router = new Avenue({
    "/": () => {
        $output.textContent = "Home";
    },
    "/about": () => {
        $output.textContent = "About";
    },
    "/users/:user": (e, params) => {
        $output.textContent = `User: '${params.user}'`;
    },
    "/users/:user/edit": (e, params) => {
        $output.textContent = `User edit: '${params.user}'`;
    },
    "/groups/:group/users/:user/edit": (e, params) => {
        $output.textContent = `User edit: '${params.user}' from group '${params.group}'`;
    },
    "?": (e, path) => {//Fallback function
        $output.textContent = `URL doesnt match any route: '${path}'`;
    }
});
```

In this case we initialize a router that binds multiple functions for the different views.
Every path should start with a "/"(except the fallback, more on that later).
The functions get called with three arguments: e(Event), params(Object) and path(String).
If a part of the path starts with ":" it will be marked as variable that will be provided in the `params` object.

If you want to call a function whenever no other route matches, the fallback function with the path "?" will be called.

### DOM

Avenue doesnt require special bindings on your links, all you have to do is have a link have a target that starts with a "#":

```html
<!-- Router links -->
<a href="#/">home</a>
<a href="#/about">/about</a>

<!-- Normal link -->
<a href="/back">/back</a>
```
