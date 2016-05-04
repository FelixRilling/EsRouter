# esRouter

esRouter is a ES6 based, modern and small library for for DOM routing, with support foir both ajax as well as preloaded routing.

# Syntax

```javascript
var myRouter = new esRouter({
    log: false, //log messages
    ajax: false, //enable ajax routing
    slug: {
        preSlash: false, //add slash before urlFragment ?
        postSlash: false, //add slash after urlFragment ?
        urlFragmentInitator: "#", //urlFragment initior, you should not change this
        urlFragmentAppend: "" //you can append custom messages like 'currentSection='
    },
    dom: {
        dataAttr: {
            corePrefix: "router", //Core of the data-router attribute
            section: "section", // #coreprefix#-#section# => data-router-section
            sectionDefault: "default",
            link: "href",
            pagination: "pagin",
        }
    },

}, {
    before: function() {}, //executes before moving
    done: function() {}, //executes after moving if successfull
    fail: function() {}, //executes after moving if it errors
    after: function() {}, //executes after moving
})
```

# Examples

## Example 1: Preloaded content

```javascript
var myRouter = new esRouter({
}, {
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

# Error Codes

esRouter uses Error codes to avoid putting string error messages in the code. Syntax:

```
esRouter: #errorType#":#subType# in module #module#, #data#
```

Errortypes:

- 0: Fatal Error
- 1: Warning
- 2: Info

Subtypes:

- 0: not found
- 0: recursed to deep

Modules:

- 0: Initialization
- 1: Moving
- 2: Callback
- 3: AJAX
