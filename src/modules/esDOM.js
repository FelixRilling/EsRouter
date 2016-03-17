/*
 *################
 * microDOM
 *################
 */
(function(window) {

  //Shorthands for better compression
  var _document = window.document,
    _getElementById = _document.getElementById.bind(_document),
    fn = microDOM.prototype;

  /*
   *##################
   * Main "$" function
   *##################
   */
  function microDOM(selector, context) {

    //Construct microDOM
    if (!(this instanceof microDOM)) {
      return new microDOM(selector, context);
    }

    /*
     *################
     * Selector Engine
     *################
     */
    if (typeof selector === "string") {
      //Regex to detect tag/id/class for optimal Selector use
      var testTag = /^[A-z]+$/,
        testId = /^#[A-z]+$/,
        testClass = /^\.[A-z]+$/,
        matches = [];


      if (selector[0] === "<" && selector[selector.length - 1] === ">") {
        // When the Selector is a DOM string
        // Create DOM element
        var element = _document.createElement("div");
        element.innerHTML = selector;
        matches = [element.firstChild];
      } else {
        //When the Selector is a Query
        //Check if "context" exists, if not make it "document"
        if (!context) {
          context = _document;
        } else {
          //revert to document if the contect can't be found
          context = _getElementById(context.replace("#", "")) || _document;
        }

        //Select via fitting selector (id,class,tag or query)
        if (testId.test(selector)) {
          console.log(1);
          matches.push(context.getElementById(selector.replace("#", "")));
        } else if (testClass.test(selector)) {
          console.log(2);
          matches = context.getElementsByClassName(selector.replace(".", ""));
        } else
        if (testTag.test(selector)) {
          console.log(3);
          matches = context.getElementsByTagName(selector);
        } else {
          console.log(4);
          matches = context.querySelectorAll(selector);
        }
      }

      //results and length to this
      if (matches.length) {
        this.length = matches.length;
        for (var i = 0; i < matches.length; i++) {
          this[i] = matches[i];
        }
      }
    }



  }


  /*
   *#################
   * microDOM methods
   *#################
   */
  fn.each = function(fn) {
    //"forEach" is more fitting but "for" is way faster
    //[].forEach.call(this, fn(value,index));
    for (var i = 0; i < this.length; i++) {
      fn(this[i], i);
    }

    return this;
  };
  //internal shorthand for better compression
  fn.e = fn.each;



  fn.append = function(string) {
    return this.e(function(element) {
      element.innerHTML += string;
    });
  };

  fn.prepend = function(string) {
    return this.e(function(element) {
      element.innerHTML = string + element.innerHTML;
    });
  };

  fn.remove = function() {
    return this.e(function(element) {
      element.parentNode.removeChild(element);
    });
  };


  //Not DRY, but every try to make it so made the file bigger than using it like this
  fn.html = function(string) {
    if (string) {
      return this.e(function(element) {
        element.innerHTML = string;
      });
    }
    return this[0].innerHTML;
  };

  fn.text = function(string) {
    if (string) {
      return this.e(function(element) {
        element.textContent = string;
      });
    }
    return this[0].textContent;
  };

  fn.val = function(value) {
    if (value) {
      return this.e(function(element) {
        element.value = value;
      });
    }
    return this[0].value;
  };



  fn.attr = function(attribute, value) {
    if (value) {
      return this.e(function(element) {
        element.setAttribute(attribute, value);
      });
    }
    return this[0].getAttribute(attribute);
  };

  fn.css = function(property, value) {
    if (value) {
      return this.e(function(element) {
        element.style[property] = value;
      });
    }
    return this[0].style[property];
  };



  fn.addClass = function(classToAdd) {
    return this.e(function(element) {
      if (!element.className) {
        element.className = classToAdd;
      } else {
        element.className += ' ' + classToAdd;
      }
    });
  };

  fn.removeClass = function(classToRemove) {
    return this.e(function(element) {
      element.className = element.className.replace(
        new RegExp('\\b' + classToRemove + '\\b', 'g'),
        ''
      );
    });
  };

  fn.hasClass = function(classToCheck) {
    if (this[0].className && this[0].className.indexOf(classToCheck) > -1) {
      return true;
    } else {
      return false;
    }
  };





  //Export microDOM to global scope
  window.microDOM = microDOM;
  //Exports jQuery like Selector (Comment this out if you need to use jQuery/Zepto)
  window.$ = microDOM;



})(window);
