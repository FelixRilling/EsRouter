"use strict";

(function(window) {
  //Shorthands for compression
  const _window = window,
    _document = document,
    _getElementById = _document.getElementById;


  //Calls esQuery constructor
  function $(selector, context) {
    if (!(this instanceof esQuery)) {
      return new esQuery(selector, context);
    }
  }


  //Main Class
  let esQuery = class {
    constructor(selector, context) {
      /*
       * Query Engine
       */
      if (typeof selector === "string") {
        const testDOM = /^<.+>$/;
        let matches = [];


        //Create Dom when DOM-String supplied
        if (selector.search(testDOM) > -1) {

          let element = _document.createElement("div");
          element.innerHTML = selector;
          matches = [element.firstChild];

        }
        //Else Select
        else {
          const testId = /^#\w+$/,
            testClass = /^\.\w+$/,
            testTag = /^\w+$/;

          //Check if "context" exists, if not make it "document"
          if (!context) {
            context = _document;
          } else {
            //revert to document if the context can"t be found
            context = _getElementById(context.replace("#", "")) || _document;
          }

          //Select via fitting selector (id,class,tag or query)
          if (selector.search(testId) > -1) {
            matches.push(context.getElementById(selector.replace("#", "")));
          } else if (selector.search(testClass) > -1) {
            matches = context.getElementsByClassName(selector.replace(".", ""));
          } else if (selector.search(testTag) > -1) {
            matches = context.getElementsByTagName(selector);
          } else {
            matches = context.querySelectorAll(selector);
          }
        }

        //return results
        if (matches.length) {
          this.length = matches.length;
          for (var i = 0; i < matches.length; i++) {
            this[i] = matches[i];
          }
        }
      }
    }




    //esQuery Methods
    //1) Utility
    each(fn) {
      //"forEach" is more fitting but "for" is waaaay faster
      //[].forEach.call(this, fn(value,index));
      for (var i = 0; i < this.length; i++) {
        fn(this[i], i);
      }
      return this;
    }

    //2) Events
    //Main event method
    on(type, fn, capture) {
      return this.each(element => {
        element.addEventListener(type, fn, capture || false);
      });
    }

      //'Short'hands (only the most important, for others use $().on)
    ready(fn, capture) {
      return this.on("DOMContentLoaded", fn, capture);
    }
    load(fn, capture) {
      return this.on("load", fn, capture);
    }
    click(fn, capture) {
      return this.on("click", fn, capture);
    }
    change(fn, capture) {
      return this.on("change", fn, capture);
    }
    select(fn, capture) {
      return this.on("select", fn, capture);
    }
    focus(fn, capture) {
      return this.on("focus", fn, capture);
    }
    blur(fn, capture) {
      return this.on("blur", fn, capture);
    }


    //3) DOM Manipulation
    //General
    append(string) {
      return this.each(element => {
        element.innerHTML += string;
      });
    }

    prepend(string) {
      return this.each(element => {
        element.innerHTML = string + element.innerHTML;
      });
    }

    remove() {
      return this.each(element => {
        element.parentNode.removeChild(element);
      });
    }

    empty() {
      return this.each(element => {
        element.parentNode.removeChild(element);
      });
    }


    //Content
    html(string) {
      if (string) {
        return this.each(element => {
          element.innerHTML = string;
        });
      }
      return this[0].innerHTML;
    }

    text(string) {
      if (string) {
        return this.each(element => {
          element.textContent = string;
        });
      }
      return this[0].textContent;
    }

    val(value) {
      if (value) {
        return this.each(element => {
          element.value = value;
        });
      }
      return this[0].value;
    }


    //Atributes
    attr(attribute, value) {
      if (value) {
        return this.each(element => {
          element.setAttribute(attribute, value);
        });
      }
      return this[0].getAttribute(attribute);
    }

    css(property, value) {
      if (value) {
        return this.each(element => {
          element.style[property] = value;
        });
      }
      return this[0].style[property];
    }

    height(value) {
      if (value) {
        return this.each(element => {
          element.style.height = value;
        });
      }
      return this[0].offsetHeight;
    }

    width(value) {
      if (value) {
        return this.each(element => {
          element.style.width = value;
        });
      }
      return this[0].offsetWidth;
    }

    addClass(classToAdd) {
      return this.each(element => {
        if (!element.className) {
          element.className = classToAdd;
        } else {
          element.className += " " + classToAdd;
        }
      });
    }

    removeClass(classToRemove) {
      return this.each(element => {
        element.className = element.className.replace(
          classToRemove,
          ""
        );
      });
    }

    hasClass(classToCheck) {
      return (
        this[0].className &&
        this[0].className.indexOf(classToCheck) > -1
      );
    }



  };

  //Export
  window.esQuery = esQuery;
  window.$ = $;
})(window);
