# AvenueJS

> An extremely small TypeScript routing library

## Introduction

Avenue is a client side router that focuses on speed and size (~800Bytes).
The API is heavily influenced by the [AngularJS router](https://docs.angularjs.org/tutorial/step_09) and [gibon.js](https://github.com/tunnckoCore/gibon).
An unique feature of Avenue is the usage of URL hashes instead of full URLs to ensure compatibility for different web servers.

## Usage

```shell
npm install avenuejs
```

### API

```typescript
import {Avenue} from "avenuejs";

const router = new Avenue({
    "/": () => console.log("Home"),
    "/about": () => console.log("About"),
    "/users/:user": params => console.log(`User: '${params.user}'`),
    "/users/:user/edit": params => console.log(`User edit: '${params.user}'`),
    "/groups/:group/users/:user/edit": params =>
        console.log(`User edit: '${params.user}' from group '${params.group}'`),
    "?": (params, path, e) =>
        // Fallback function
        console.log(
            `URL doesn't match any route: '${path}'; Parameters: ${params}, Event: ${e}`
        )
});
```

In this case we initialize a router that binds multiple functions for the different routes.
Every path should start with a "/"(except the fallback, more on that later).

If a part of the path starts with ":" it will be marked as variable that will be provided in the `params` object.
(ex: the path variable "/:foo/" will be available in the param object as the key "foo").

If no route matches, the fallback route under the path "?" will be called.

### DOM

Avenue does not require special bindings on your links, all you have to do is have your links `href` start with a "#":

```html
<!-- Router links -->
<a href="#/">home</a>
<a href="#/about">/about</a>

<!-- Normal link -->
<a href="/back">/back</a>
```
