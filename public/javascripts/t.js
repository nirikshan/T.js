// Generated by CoffeeScript 1.3.3
(function() {
  var FirstFieldPattern, T, hasFunction, include, isArray, isEmpty, isFunction, isObject, merge, normalize, normalizeChildren, parseStyleString, prepareOutput, process, processAttributes, processCssClasses, processFirst, processFunctions, processStyles, render, renderAttributes, renderChildren,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  isArray = function(o) {
    return o instanceof Array;
  };

  isFunction = function(o) {
    return typeof o === "function";
  };

  isObject = function(o) {
    return typeof o === "object" && (!(o instanceof Array));
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
    if (isFunction(o)) {
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

  FirstFieldPattern = /^([^#.]+)?(#([^.]+))?(.(.*))?$/;

  processFirst = function(items) {
    var attrs, classes, first, id, matches, tag;
    first = items[0];
    if (typeof first !== 'string') {
      throw "Invalid first argument " + first;
    }
    if (matches = first.match(FirstFieldPattern)) {
      tag = matches[1];
      id = matches[3];
      classes = matches[5];
      if (id || classes) {
        attrs = {};
        if (id) {
          attrs.id = id;
        }
        if (classes) {
          attrs["class"] = classes.replace('.', ' ');
        }
        items.splice(0, 1, tag, attrs);
      }
    } else {
      first;

    }
    return items;
  };

  renderAttributes = function(attributes, data) {
    var key, name, result, s, style, styles, value;
    result = "";
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

  renderChildren = function(children, data) {
    var item, result, _i, _len;
    if (!isArray(children)) {
      return children;
    }
    result = "";
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      item = children[_i];
      result += render(item);
    }
    return result;
  };

  include = function(template, mapper) {
    var wrapFunc;
    wrapFunc = function(data) {
      if (mapper) {
        return process(template, mapper(data));
      } else {
        return process(template, data);
      }
    };
    wrapFunc.template = template;
    wrapFunc.mapper = mapper;
    return wrapFunc;
  };

  processFunctions = function(template, data) {
    var i, item, key, result, value, _results, _results1;
    if (isFunction(template)) {
      return processFunctions(template(data), data);
    }
    if (isArray(template)) {
      _results = [];
      for (i in template) {
        item = template[i];
        _results.push(processFunctions(item, data));
      }
      return _results;
    } else if (isObject(template)) {
      result = {};
      _results1 = [];
      for (key in template) {
        if (!__hasProp.call(template, key)) continue;
        value = template[key];
        if (isFunction(value)) {
          _results1.push(result[key] = processFunctions(value(data), data));
        } else {
          _results1.push(result[key] = value);
        }
      }
      return _results1;
    } else {
      return template;
    }
  };

  normalizeChildren = function(items) {
    var i, item, _i, _ref;
    if (!isArray(items)) {
      return items;
    }
    for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = normalizeChildren(items[i]);
      if (isArray(item)) {
        if (item[0] === '') {
          item.shift();
          items.splice.apply(items, [i, 1].concat(__slice.call(item)));
        }
      } else if (typeof item === 'undefined' || item === null || item === '') {

      } else {
        items[i] = item;
      }
    }
    return items;
  };

  normalize = function(items) {
    if (!isArray(items)) {
      return items;
    }
    return normalizeChildren(items);
  };

  parseStyleString = function(str) {
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
    var newStyles, style, styles;
    newStyles = {};
    style = attrs.style;
    if (typeof style === 'string') {
      newStyles = merge(newStyles, parseStyleString(style));
    }
    styles = attrs.styles;
    if (typeof styles === 'string') {
      newStyles = merge(newStyles, parseStyleString(styles));
    }
    if (isObject(style)) {
      newStyles = merge(newStyles, style);
    }
    if (isObject(styles)) {
      newStyles = merge(newStyles, styles);
    }
    delete attrs.styles;
    if (!isEmpty(newStyles)) {
      attrs.style = newStyles;
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
    var attrs, i, item, newStyles, styles, _i, _ref;
    if (isArray(items)) {
      attrs = {};
      for (i in items) {
        item = items[i];
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
      for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
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

  prepareOutput = function(template, data) {
    var item, key, output, value, _i, _len, _results;
    if (isFunction(template)) {
      return prepareOutput(template(data));
    } else if (isArray(template)) {
      if (hasFunction(template)) {
        _results = [];
        for (_i = 0, _len = template.length; _i < _len; _i++) {
          item = template[_i];
          _results.push(prepareOutput(item));
        }
        return _results;
      } else {
        return template;
      }
    } else if (isObject(template)) {
      if (hasFunction(template)) {
        output = {};
        for (key in template) {
          value = template[key];
          output[key] = prepareOutput(value);
        }
        return output;
      } else {
        return template;
      }
    } else {
      return template;
    }
  };

  process = function(template, data) {
    var output;
    output = prepareOutput(template, data);
    output = normalize(output);
    return output = processAttributes(output);
  };

  render = function(template, data) {
    var first, result, second;
    if (typeof template === "string") {
      return template;
    }
    if (!isArray(template)) {
      return "" + template;
    }
    if (template.length === 0) {
      return;
    }
    first = template.shift();
    if (first === "") {
      return renderChildren(template, data);
    }
    if (template.length === 0) {
      return "<" + first + "/>";
    }
    result = "<" + first;
    second = template.shift();
    if (isObject(second)) {
      result += renderAttributes(second);
      if (template.length === 0) {
        result += "/>";
        return result;
      } else {
        result += ">";
      }
    } else {
      result += ">";
      result += renderChildren([second], data);
      if (template.length === 0) {
        result += "</" + first + ">";
        return result;
      }
    }
    if (template.length > 0) {
      result += renderChildren(template, data);
      result += "</" + first + ">";
    }
    return result;
  };

  T = function() {};

  T.include = include;

  T.process = process;

  T.render = render;

  T.utils = {
    isEmpty: isEmpty,
    processFirst: processFirst,
    processFunctions: processFunctions,
    normalize: normalize,
    processAttributes: processAttributes,
    parseStyleString: parseStyleString,
    processStyles: processStyles
  };

  this.T = T;

}).call(this);
