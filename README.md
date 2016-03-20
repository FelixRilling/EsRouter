# esQuery
esQuery is a es6 based, modern and small library for DOM Manipulation with a jQuery-like syntax. the basic selector is:

```javascript
$(selector)
```

this will return the DOM element matching your jQuery-like selector. You can also use:

```javascript
$(selector, context)
```

if you want to specify the context of the selector (can only use IDs, because thats the purpose of using context).

## Selector
The Selector works like the jQuery one:

```javascript

//SELECTOR
//Tag Selector
$("p")
//Returns all "p"s

//ID Selector
$("#featured")
//Returns all elements with the ID "featured"

//Class Selector
$(".active")
//Returns all elements with the Class "active"


//Query Selector
$("ul > li")
//Returns all "li"s that are descendants to an "ul"


//Create DOM via Selector
$("<div class='newElement'>Hello World</div>")
//Returns a new div DOM object
```

## Methods
most of the methods can be used like their jQuery counterparts, some examples:

```javascript
//Methods
//1) Utility
//Go over each li element
$("li").each(
  element=>{

  }
);

//2) Events
$("button").on("click",
  evt=>{
    console.log(evt);
  }
);
//or
$("button").click(
  evt=>{
    console.log(evt);
  }
);

//3) DOM Manipulation
//Append string to DOM
$("#text").append("foobar");

//Prepend string to DOM
$(".footer").prepend("<p>Message</p>");

//Remove element from DOM
$("h1").remove();


$("article").html();//get html
$("article").html("foobar");//set html

$("article > p").text();//get text
$("article > p").text("foobar");//set text

$("input[type=text]").val();//get value
$("input[type=text]").val("foobar");//set value


$("article").attr("id");//get attribute
$("article").attr("id", "thing");//set attribute

$("article#red").css("color");//get style
$("article#red").css("color", "red");//set style

$("article#blue > p").height();//get height
$("article#blue > p").width("100px");//set width


$("article").addClass("newClass");//set new className

$("article.oldClass").removeClass("oldClass");//delete class

$("article").hasClass("doIHaveThisClass");//check for class
```
