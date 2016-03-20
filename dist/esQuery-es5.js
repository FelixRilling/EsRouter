"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
  //Shorthands for compression
  var _window = window,
      _document = document,
      _getElementById = _document.getElementById;

  //Calls esQuery constructor
  function $(selector, context) {
    if (!(this instanceof esQuery)) {
      return new esQuery(selector, context);
    }
  }

  //Main Class
  var esQuery = function () {
    function esQuery(selector, context) {
      _classCallCheck(this, esQuery);

      /*
       * Query Engine
       */
      if (typeof selector === "string") {
        var testDOM = /^<.+>$/;
        var matches = [];

        //Create Dom when DOM-String supplied
        if (selector.search(testDOM) > -1) {

          var element = _document.createElement("div");
          element.innerHTML = selector;
          matches = [element.firstChild];
        }
        //Else Select
        else {
            var testId = /^#\w+$/,
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


    _createClass(esQuery, [{
      key: "each",
      value: function each(fn) {
        //"forEach" is more fitting but "for" is waaaay faster
        //[].forEach.call(this, fn(value,index));
        for (var i = 0; i < this.length; i++) {
          fn(this[i], i);
        }
        return this;
      }

      //2) Events
      //Main event method

    }, {
      key: "on",
      value: function on(type, fn, capture) {
        return this.each(function (element) {
          element.addEventListener(type, fn, capture || false);
        });
      }

      //'Short'hands (only the most important, for others use $().on)

    }, {
      key: "ready",
      value: function ready(fn, capture) {
        return this.on("DOMContentLoaded", fn, capture);
      }
    }, {
      key: "load",
      value: function load(fn, capture) {
        return this.on("load", fn, capture);
      }
    }, {
      key: "click",
      value: function click(fn, capture) {
        return this.on("click", fn, capture);
      }
    }, {
      key: "change",
      value: function change(fn, capture) {
        return this.on("change", fn, capture);
      }
    }, {
      key: "select",
      value: function select(fn, capture) {
        return this.on("select", fn, capture);
      }
    }, {
      key: "focus",
      value: function focus(fn, capture) {
        return this.on("focus", fn, capture);
      }
    }, {
      key: "blur",
      value: function blur(fn, capture) {
        return this.on("blur", fn, capture);
      }

      //3) DOM Manipulation
      //General

    }, {
      key: "append",
      value: function append(string) {
        return this.each(function (element) {
          element.innerHTML += string;
        });
      }
    }, {
      key: "prepend",
      value: function prepend(string) {
        return this.each(function (element) {
          element.innerHTML = string + element.innerHTML;
        });
      }
    }, {
      key: "remove",
      value: function remove() {
        return this.each(function (element) {
          element.parentNode.removeChild(element);
        });
      }
    }, {
      key: "empty",
      value: function empty() {
        return this.each(function (element) {
          element.parentNode.removeChild(element);
        });
      }

      //Content

    }, {
      key: "html",
      value: function html(string) {
        if (string) {
          return this.each(function (element) {
            element.innerHTML = string;
          });
        }
        return this[0].innerHTML;
      }
    }, {
      key: "text",
      value: function text(string) {
        if (string) {
          return this.each(function (element) {
            element.textContent = string;
          });
        }
        return this[0].textContent;
      }
    }, {
      key: "val",
      value: function val(value) {
        if (value) {
          return this.each(function (element) {
            element.value = value;
          });
        }
        return this[0].value;
      }

      //Atributes

    }, {
      key: "attr",
      value: function attr(attribute, value) {
        if (value) {
          return this.each(function (element) {
            element.setAttribute(attribute, value);
          });
        }
        return this[0].getAttribute(attribute);
      }
    }, {
      key: "css",
      value: function css(property, value) {
        if (value) {
          return this.each(function (element) {
            element.style[property] = value;
          });
        }
        return this[0].style[property];
      }
    }, {
      key: "height",
      value: function height(value) {
        if (value) {
          return this.each(function (element) {
            element.style.height = value;
          });
        }
        return this[0].offsetHeight;
      }
    }, {
      key: "width",
      value: function width(value) {
        if (value) {
          return this.each(function (element) {
            element.style.width = value;
          });
        }
        return this[0].offsetWidth;
      }
    }, {
      key: "addClass",
      value: function addClass(classToAdd) {
        return this.each(function (element) {
          if (!element.className) {
            element.className = classToAdd;
          } else {
            element.className += " " + classToAdd;
          }
        });
      }
    }, {
      key: "removeClass",
      value: function removeClass(classToRemove) {
        return this.each(function (element) {
          element.className = element.className.replace(classToRemove, "");
        });
      }
    }, {
      key: "hasClass",
      value: function hasClass(classToCheck) {
        return this[0].className && this[0].className.indexOf(classToCheck) > -1;
      }
    }]);

    return esQuery;
  }();

  //Export
  window.esQuery = esQuery;
  window.$ = $;
})(window);
//# sourceMappingURL=esQuery-es5.js.map
