![AvenueJS](./logo.png)

# AvenueJS

> An ES6 based, modern and small library for for DOM-routing

## Introduction

esRouter is an ES6 based, modern and small library for for DOM-routing, with support for both ajax as well as preloaded routing. esRouter was built for easy ajax navigation in CMS environments but can be used with classic websites as well

# Syntax

```javascript
var myRouter = new esRouter({
    log: false, //log messages
    ajax: false, //enable ajax routing
    autoBind: true, //bind click events to data-router-href/link
    dataPrefix: "router",
    slug: {
        preSlash: false, //add slash before urlFragment?
        postSlash: false, //add slash after urlFragment?
        prepend: "",
        append: ""
    }
}, {
    before: function() {}, //executes before moving
    done: function() {}, //executes after moving if successfull
    fail: function() {}, //executes after moving if it errors
    after: function() {}, //executes after moving
});
```

# Examples

## Example 1: Preloaded content

```javascript
var myRouter = new esRouter({},{
    before: function() {
        console.log("started!")
    },
    done: function(id) {
        console.log("finished routing to" + id)
    }
});
```

esRouter makes use of html data attributes to manage your routing sections

```html
<!--Classic preloaded routing-->
<section class="mySection" data-router-section="main" data-router-default="true">Hello World! Page 1</section>
<section class="mySection" data-router-section="secondary">Lorem ipsum! Page 2</section>
<div class="mySection" data-router-section="third">Et dolor! Page 3</div>
<div class="container">
    <div class="mySection" data-router-section="wrapped">Im wrapped!</div>
</div>
<br>

<button data-router-href="main">Go to main</button>
<br>
<button data-router-pagin="-1">Go Backward</button>
<button data-router-pagin="1">Go Forward</button>
```

## Example 2: AJAX content

```javascript
var myRouter = new esRouter({
  ajax: true
}, {
    before: function() {
        console.log("started!")
    },
    done: function(id) {
        console.log("finished routing to" + id)
    }
});
```

enter the source of the ajax content in the DOM

```html
<!--Classic preloaded routing-->
<section class="mySection" data-router-section="main" data-router-src="ajax/main.html" data-router-default="true"></section>
<section class="mySection" data-router-section="secondary" data-router-src="ajax/secondary.html"></section>
<div class="mySection" data-router-section="third" data-router-src="ajax/third.html"></div>
<div class="container">
    <div class="mySection" data-router-section="wrapped" data-router-src="ajax/last.html"></div>
</div>
<br>

<button data-router-href="main">Go to main</button>
<br>
<button data-router-pagin="-1">Go Backward</button>
<button data-router-pagin="1">Go Forward</button>
```

# Data-attributes

esRouter has a number of HTML data-attributes:

## Sections

**section**: used to declare a part/section/page of the router with name. _required_

```html
<div data-router-section="mySection"></div>
```

**default**: used to declare the section that the router should start on or go to if an error occurs. _required_

```html
<div data-router-section="mySection" data-router-default="true"></div>
```

**src**: AJAX mode only. specify url of the content source .

```html
<div data-router-section="mySection" data-router-src="content.html"></div>
```

## Navigation

**href**: contains an id that the router will jump to.

```html
<a href="javascript:;" data-router-href="mySection">jump to mySection</a>
```

**pagin**: paginate by the value.

```html
<a href="javascript:;" data-router-pagin="-1">backward</a>
<a href="javascript:;" data-router-pagin="1">forward</a>
```

# Plugins

right now esRouter only has one plugin: esRouter.scroll

## esRouter.scroll

esRouter.scroll allows scrolling based routing. to enable it (after including the plugin js into your load order), you need to set:

```javascript

scroll: {
    enabled: true
},
```

in the options when creating your router (view the demo.scroll.html in the demo directory for more information).

# Error Codes

esRouter uses Error codes to avoid putting string error messages in the code. Syntax:

```text
esRouter: #type#: #module#=>#error#: #msg#, #data#
```

Note: the minified version only shows errors.

## Codes:

Types:

- 0: Fatal Error
- 1: Warning
- 2: Info

Modules:

- 0: Initialization
- 1: Moving
- 2: Callback
- 3: AJAX

Errors:

- 0: not found
- 1: recursed to deep
