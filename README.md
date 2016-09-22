![AvenueJS](./logo.png)

# AvenueJS

> A small and modern DOM-route

## Introduction

Avenue is a small and modern DOM-router designed for on page routing.

**Plugins**

- [avenue-ajax](https://github.com/FelixRilling/avenue-ajax): Ajax support for your Avenue fields

- [avenue-scroll](https://github.com/FelixRilling/avenue-scroll): Scroll based Avenue navigation

## Usage

Installation via bower:

```shell
  bower install avenuejs --save
```

### Example 1: Simple router

```javascript
var myRouter = new Avenue();

myRouter.init();

setTimeout(function(){
  //move to the field with the id "secondary"
  myRouter.moveTo("secondary");
},1000);
```

Avenue makes use of HTML data attributes to manage your routing sections

```html
<div>
  <section class="mySection" data-router-section="main" data-router-default="true">Hello World! Page 1: Main</section>
  <section class="mySection" data-router-section="secondary">Lorem ipsum! Page 2: Secondary</section>
  <section class="mySection" data-router-section="middle">Et dolor! Page 3: Middle</section>
  <section class="mySection" data-router-section="fourth">sit amet dolor! Page 4: Fourth</section>
  <section class="mySection" data-router-section="last">Bye World! Page 5: Last</section>
</div>
```

### Example 2: Options and Autobind

```javascript
var myRouter = new Avenue({
            slugPrepend: "currentSection=",
        }
    },
    {
        afterMove: function(data) {
            console.log("Moved to " + data.id)
        },
    }, []);

myRouter.init();
```

```html
<div>
  <section class="mySection" data-router-section="main" data-router-default="true">Hello World! Page 1: Main</section>
  <section class="mySection" data-router-section="secondary">Lorem ipsum! Page 2: Secondary</section>
  <section class="mySection" data-router-section="middle">Et dolor! Page 3: Middle</section>
  <section class="mySection" data-router-section="fourth">sit amet dolor! Page 4: Fourth</section>
  <section class="mySection" data-router-section="last">Bye World! Page 5: Last</section>
</div>
<div>
  <!--Avenue binds its events to elements withe either "data-router-pagin" or "data-router-href" set-->
  <button data-router-pagin="-1">Go Backward</button>
  <button data-router-pagin="1">Go Forward</button>
  <button data-router-href="main">Jump to main</button>
  <button data-router-href="last">Jump to Last</button>
</div>
```

## Syntax

Init:

```javascript
//Avenue({options},{events},[plugins])
var myRouter = new Avenue({
    autoBind: true, //Bind click events to data-router-href/link
    slugPrepend: "", //Prepend to slug, ex:"currentSection="
    }
}, {
    beforeInit: function () {},
    afterInit: function () {},
    beforeMove: function () {},
    afterMove: function () {},
}, []);
```

Methods:

```javascript
myRouter.moveTo("myId"); //Move to field with the section id "myId"

myRouter.moveBy(2); //Move by value, accepts positive and negative numbers
myRouter.moveForwards(); //Alias for myRouter.moveBy(1)
myRouter.moveBackwards(); //Alias for myRouter.moveBy(-1)
```

### Data-attributes

Avenue has a number of supported HTML data-attributes:

### Sections

**section**: used to declare a part/section/page of the router with the name. _required_

```html
<div data-router-section="mySection"></div>
```

**default**: used to declare the section that the router should start on or go to if an error occurs. _required_

```html
<div data-router-section="mySection" data-router-default="true"></div>
```

### Navigation

**href**: Contains an id that the router will jump to.

```html
<a href="javascript:;" data-router-href="mySection">jump to mySection</a>
```

**pagin**: paginate by the value.

```html
<a href="javascript:;" data-router-pagin="-1">backward</a>
<a href="javascript:;" data-router-pagin="1">forward</a>
```
