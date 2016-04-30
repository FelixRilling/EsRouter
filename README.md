# esRouter

esRouter is a ES6 based, modern and small library for for DOM routing, with support foir both ajax as well as preloaded routing.

Example (preloaded content):

```javascript
var myRouter = new esRouter({
    options
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
<section class="mySection" data-router-id="main" data-router-default="true">Hello World! Page 1</section>
<section class="mySection" data-router-id="secondary">Lorem ipsum! Page 2</section>
<div class="mySection" data-router-id="third">Et dolor! Page 3</div>
<div class="container">
    <div class="mySection" data-router-id="wrapped">Im wrapped!</div>
</div>
<br>

<a href="javascript:;" data-router-href="main">Go to Main</a>
<br>
<a href="javascript:;" data-router-pagin="-1">Go Backward</a>
<a href="javascript:;" data-router-pagin="1">Go Forward</a>
```

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
