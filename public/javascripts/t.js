// Generated by CoffeeScript 1.4.0
(function() {
  var FIRST_FIELD_PATTERN, FIRST_NO_PROCESS_PATTERN, T, VERSION, callbacks, create, escape, getRandomCssClass, hasFunction, init, isArray, isEmpty, isObject, isTemplate, merge, normalize, parseStyles, prepareOutput, processAttributes, processCallbacks, processCssClasses, processFirst, processStyles, registerCallbacks, render, renderAttributes, renderRest, unescape,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  VERSION = "0.5.0";

  isArray = function(o) {
    return o instanceof Array;
  };

  isObject = function(o) {
    return o !== null && typeof o === "object" && (!(o instanceof Array));
  };

  isTemplate = function(o) {
    return o !== null && typeof o === "object" && o.isTjsTemplate;
  };

  isEmpty = function(o) {
    var key;
    if (!o) {
      return true;
    }
    for (key in o) {
      if (!__hasProp.call(o, key)) continue;
      return false;
    }
    return true;
  };

  hasFunction = function(o) {
    var item, key, value, _i, _len;
    if (typeof o === 'function') {
      return true;
    }
    if (isTemplate(o)) {
      return true;
    }
    if (isArray(o)) {
      for (_i = 0, _len = o.length; _i < _len; _i++) {
        item = o[_i];
        if (hasFunction(item)) {
          return true;
        }
      }
    } else if (isObject(o)) {
      for (key in o) {
        if (!__hasProp.call(o, key)) continue;
        value = o[key];
        if (hasFunction(value)) {
          return true;
        }
      }
    }
  };

  escape = function(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  unescape = function(str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  };

  merge = function(o1, o2) {
    var key, value;
    if (!o2) {
      return o1;
    }
    if (!o1) {
      return o2;
    }
    for (key in o2) {
      if (!__hasProp.call(o2, key)) continue;
      value = o2[key];
      o1[key] = value;
    }
    return o1;
  };

  callbacks = [];

  FIRST_NO_PROCESS_PATTERN = /^<.*/;

  FIRST_FIELD_PATTERN = /^([^#.]+)?(#([^.]+))?(.(.*))?$/;

  processFirst = function(items) {
    var attrs, classes, first, i, id, matches, part, parts, rest, tag;
    first = items[0];
    if (isArray(first)) {
      return items;
    }
    if (typeof first !== 'string') {
      throw "Invalid first argument " + first;
    }
    if (first.match(FIRST_NO_PROCESS_PATTERN)) {
      return items;
    }
    parts = first.split(' ');
    if (parts.length > 1) {
      i = parts.length - 1;
      rest = items.slice(1);
      while (i >= 0) {
        part = parts[i];
        rest.unshift(part);
        rest = [processFirst(rest)];
        i--;
      }
      return rest[0];
    }
    if (matches = first.match(FIRST_FIELD_PATTERN)) {
      tag = matches[1] || 'div';
      id = matches[3];
      classes = matches[5];
      if (id || classes) {
        attrs = {};
        if (id) {
          attrs.id = id;
        }
        if (classes) {
          attrs["class"] = classes.replace(/\./g, ' ');
        }
        items.splice(0, 1, tag, attrs);
      }
    }
    return items;
  };

  normalize = function(items) {
    var first, i, item, _i, _ref;
    if (!isArray(items)) {
      return items;
    }
    for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = normalize(items[i]);
      if (isArray(item)) {
        first = item[0];
        if (first === '') {
          item.shift();
          items.splice.apply(items, [i, 1].concat(__slice.call(item)));
        } else if (isArray(first)) {
          items.splice.apply(items, [i, 1].concat(__slice.call(item)));
        }
      } else if (typeof item === 'undefined' || item === null || item === '') {

      } else {
        items[i] = item;
      }
    }
    return items;
  };

  parseStyles = function(str) {
    var name, part, styles, value, _i, _len, _ref, _ref1;
    styles = {};
    _ref = str.split(';');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      _ref1 = part.split(':'), name = _ref1[0], value = _ref1[1];
      if (name && value) {
        styles[name.trim()] = value.trim();
      }
    }
    return styles;
  };

  processStyles = function(attrs) {
    var style;
    style = attrs.style;
    if (typeof style === 'string') {
      attrs.style = parseStyles(style);
    } else if (isObject(style && !isEmpty(style))) {
      attrs.style = style;
    }
    return attrs;
  };

  processCssClasses = function(attrs, newAttrs) {
    if (attrs["class"]) {
      if (newAttrs["class"]) {
        newAttrs["class"] = attrs["class"] + ' ' + newAttrs["class"];
      } else {
        newAttrs["class"] = attrs["class"];
      }
    }
    return newAttrs;
  };

  processAttributes = function(items) {
    var attrs, i, item, newStyles, styles, _i, _j, _len, _ref;
    if (isArray(items)) {
      if (items.length === 0) {
        return items;
      }
      attrs = {};
      items = processFirst(items);
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (isArray(item)) {
          processAttributes(item);
        } else if (isObject(item)) {
          processStyles(item);
          styles = attrs.style;
          newStyles = item.style;
          processCssClasses(attrs, item);
          attrs = merge(attrs, item);
          styles = merge(styles, newStyles);
          if (!isEmpty(styles)) {
            attrs.style = styles;
          }
        }
      }
      for (i = _j = _ref = items.length - 1; _ref <= 0 ? _j <= 0 : _j >= 0; i = _ref <= 0 ? ++_j : --_j) {
        if (isObject(items[i])) {
          items.splice(i, 1);
        }
      }
      if (!isEmpty(attrs)) {
        items.splice(1, 0, attrs);
      }
    }
    return items;
  };

  prepareOutput = function() {
    var data, template;
    template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (typeof template === 'function') {
      return prepareOutput.apply(null, [template.apply(null, data)].concat(__slice.call(data)));
    } else if (isTemplate(template)) {
      return template.process.apply(template, data);
    } else {
      return template;
    }
  };

  registerCallbacks = function(registerFunc) {
    var callback, cssClass, element, myCallbacks, name, _ref, _results;
    _results = [];
    while (callbacks.length > 0) {
      _ref = callbacks.shift(), cssClass = _ref[0], myCallbacks = _ref[1];
      _results.push((function() {
        var _i, _len, _ref1, _results1;
        _ref1 = document.querySelectorAll('.' + cssClass);
        _results1 = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          element = _ref1[_i];
          if (element.getAttribute('class') === cssClass) {
            element.removeAttribute('class');
          } else {
            element.setAttribute('class', element.getAttribute('class').replace(cssClass, ''));
          }
          _results1.push((function() {
            var _results2;
            _results2 = [];
            for (name in myCallbacks) {
              if (!__hasProp.call(myCallbacks, name)) continue;
              callback = myCallbacks[name];
              if (registerFunc) {
                _results2.push(registerFunc(element, name, callback));
              } else {
                _results2.push(element[name] = callback);
              }
            }
            return _results2;
          })());
        }
        return _results1;
      })());
    }
    return _results;
  };

  getRandomCssClass = function() {
    return String(Math.random()).replace('0.', 'cls');
  };

  processCallbacks = function(attributes) {
    var cssClass, hasCallbacks, key, myCallbacks, value;
    hasCallbacks = false;
    myCallbacks = {};
    for (key in attributes) {
      if (!__hasProp.call(attributes, key)) continue;
      value = attributes[key];
      if (typeof value === 'function') {
        hasCallbacks = true;
        myCallbacks[key] = value;
        delete attributes[key];
      }
    }
    if (hasCallbacks) {
      cssClass = getRandomCssClass();
      callbacks.push([cssClass, myCallbacks]);
      if (attributes["class"]) {
        return attributes["class"] += ' ' + cssClass;
      } else {
        return attributes["class"] = cssClass;
      }
    }
  };

  renderAttributes = function(attributes) {
    var key, name, result, s, style, styles, value;
    result = "";
    processCallbacks(attributes);
    for (key in attributes) {
      if (!__hasProp.call(attributes, key)) continue;
      value = attributes[key];
      if (key === "style") {
        styles = attributes.style;
        if (isObject(styles)) {
          s = "";
          for (name in styles) {
            if (!__hasProp.call(styles, name)) continue;
            style = styles[name];
            s += name + ":" + style + ";";
          }
          result += " style=\"" + s + "\"";
        } else {
          result += " style=\"" + styles + "\"";
        }
      } else {
        result += " " + key + "=\"" + value + "\"";
      }
    }
    return result;
  };

  renderRest = function(input) {
    var item;
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = input.length; _i < _len; _i++) {
        item = input[_i];
        _results.push(render(item));
      }
      return _results;
    })()).join('');
  };

  render = function(input, handler) {
    var first, item, result, second;
    if (typeof input === 'undefined' || input === null) {
      return '';
    }
    if (!isArray(input)) {
      return '' + input;
    }
    if (input.length === 0) {
      return '';
    }
    first = input.shift();
    if (isArray(first)) {
      return render(first) + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = input.length; _i < _len; _i++) {
          item = input[_i];
          _results.push(render(item));
        }
        return _results;
      })()).join('');
    }
    if (first === "") {
      return renderRest(input);
    }
    if (input.length === 0) {
      if (first === 'script') {
        return "<" + first + "></" + first + ">";
      } else {
        return "<" + first + "/>";
      }
    }
    result = "<" + first;
    second = input.shift();
    if (isObject(second)) {
      result += renderAttributes(second);
      if (input.length === 0) {
        if (first === 'script') {
          result += "></" + first + ">";
        } else {
          result += "/>";
        }
        return result;
      } else {
        result += ">";
      }
    } else {
      result += ">";
      result += render(second);
      if (input.length === 0) {
        result += "</" + first + ">";
        return result;
      }
    }
    if (input.length > 0) {
      result += renderRest(input);
      result += "</" + first + ">";
    }
    if (handler) {
      if (typeof handler === 'function') {
        handler(result);
        registerCallbacks();
      } else {
        raise("render(): handler must be a function, but is a " + (typeof handler) + ".");
      }
    }
    return result;
  };

  create = function() {
    var newT;
    newT = function() {
      var data, name, template;
      name = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      template = newT.use(name);
      if (data.length === 0) {
        return template;
      } else {
        return template.process.apply(template, data);
      }
    };
    init(newT);
    return newT;
  };

  init = function(T) {
    var Template;
    T.create = create;
    T.templates = {};
    T.internal = {};
    T.callbacks = callbacks;
    Template = function(template, name) {
      this.template = template;
      this.name = name;
      return this.isTjsTemplate = true;
    };
    Template.prototype.process = function() {
      var data, output;
      data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      output = prepareOutput.apply(null, [this.template].concat(__slice.call(data)));
      output = normalize(output);
      return processAttributes(output);
    };
    Template.prototype.render = function() {
      var data, output;
      data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      output = this.process.apply(this, data);
      return render(output);
    };
    Template.prototype.renderWith = function() {
      var data, handler, output;
      data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      handler = data.pop();
      output = this.process.apply(this, data);
      return render(output, handler);
    };
    Template.prototype.prepare = function(includes) {
      var key, template, value;
      for (key in includes) {
        if (!__hasProp.call(includes, key)) continue;
        value = includes[key];
        if (!isTemplate(value)) {
          includes[key] = new Template(value);
        }
      }
      template = new Template(this.template, this.name);
      template.process = function() {
        var data, oldIncludes, _ref;
        data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        try {
          if (T.internal.includes) {
            oldIncludes = T.internal.includes;
          }
          if (includes) {
            T.internal.includes = includes;
          }
          return (_ref = Template.prototype.process).call.apply(_ref, [this].concat(__slice.call(data)));
        } finally {
          if (oldIncludes) {
            T.internal.includes = oldIncludes;
          } else {
            delete T.internal.includes;
          }
        }
      };
      return template;
    };
    T.process = function() {
      var data, template, _ref;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = new Template(template)).process.apply(_ref, data);
    };
    T.render = function() {
      var data, template, _ref;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = new Template(template)).render.apply(_ref, data);
    };
    T.renderWith = function() {
      var data, template, _ref;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = new Template(template)).renderWith.apply(_ref, data);
    };
    T.registerCallbacks = registerCallbacks;
    T.include = function() {
      var data, name, _ref, _ref1;
      name = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = T.internal.includes) != null ? (_ref1 = _ref[name]).process.apply(_ref1, data) : void 0;
    };
    T.define = T.def = function(name, template) {
      return T.templates[name] = new Template(template, name);
    };
    T.redefine = T.redef = function(name, template) {
      var newTemplate, oldTemplate, wrapper;
      oldTemplate = T.use(name);
      newTemplate = new Template(template);
      wrapper = function() {
        var backup, data;
        data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        try {
          if (T.original) {
            backup = T.internal.original;
          }
          T.internal.original = oldTemplate;
          return newTemplate.process.apply(newTemplate, data);
        } finally {
          if (backup) {
            T.internal.original = backup;
          } else {
            delete T.internal.original;
          }
        }
      };
      return T.templates[name] = new Template(wrapper, name);
    };
    T.wrapped = function() {
      var data, _ref;
      data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = T.internal.original).process.apply(_ref, data);
    };
    T.use = function(name) {
      return T.templates[name];
    };
    T.escape = escape;
    T.unescape = unescape;
    return T.VERSION = VERSION;
  };

  T = create();

  T.internal.normalize = normalize;

  T.internal.processFirst = processFirst;

  T.internal.parseStyles = parseStyles;

  T.internal.processStyles = processStyles;

  T.internal.processAttributes = processAttributes;

  T.internal.render = render;

  T.internal.callbacks = callbacks;

  T.internal.thisRef = this;

  T.noConflict = function() {
    if (T.oldT) {
      T.internal.thisRef.T = T.oldT;
    } else {
      delete T.internal.thisRef.T;
    }
    return T;
  };

  if (this.T) {
    T.oldT = this.T;
  }

  this.T = T;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = T;
  }

}).call(this);
