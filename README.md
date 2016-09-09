![AvenueJS](./logo.png)

# AvenueJS

> An ES6 based, modern and small library for for DOM-routing

## Introduction

esRouter is an ES6 based, modern and small library for for DOM-routing, with support for both ajax as well as preloaded routing. esRouter was built for easy ajax navigation in CMS environments but can be used with classic websites as well

# Syntax

```javascript
//Avenue(options,events,plugins)
var myRouter = new Avenue({
    autoBind: true, //bind click events to data-router-href/link
    slugPrepend: "", //Prepend to slug, ex:"currentSection="
    }
}, {
    beforeInit: function () {},
    afterInit: function () {},
    beforeMove: function () {},
    afterMove: function () {},
}, []);
```

# Examples

## Example 1: Simple router

```javascript
var myRouter = new Avenue();
```

Avenue makes use of html data attributes to manage your routing sections

```html
<!--Classic preloaded routing-->
<section class="mySection" data-router-section="main" data-router-default="true">Hello World! Page 1: Main</section>
<section class="mySection" data-router-section="secondary">Lorem ipsum! Page 2: Secondary</section>
<section class="mySection" data-router-section="middle">Et dolor! Page 3: Middle</section>
<section class="mySection" data-router-section="fourth">sit amet dolor! Page 4: Fourth</section>
<section class="mySection" data-router-section="last">Bye World! Page 5: Last</section>

<button data-router-pagin="-1">Go Backward</button>
<button data-router-pagin="1">Go Forward</button>
<br>
<button data-router-href="main">Jump to main</button>
<button data-router-href="last">Jump to Last</button>
```

## Example 2: Options

```javascript
var myRouter = new Avenue({
            slugPrepend: "currentSection=",
        }
    },
    {
        afterMove: function (data) {
            console.log("Moved to " + data.id)
        },
    }, []);
```


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

Avenue has a number of HTML data-attributes:

## Sections

**section**: used to declare a part/section/page of the router with name. _required_

```html
<div data-router-section="mySection"></div>
```

**default**: used to declare the section that the router should start on or go to if an error occurs. _required_

```html
<div data-router-section="mySection" data-router-default="true"></div>
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
