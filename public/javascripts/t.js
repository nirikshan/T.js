// Generated by CoffeeScript 1.3.3
(function() {
  var T, include, isArray, isFunction, isObject, normalize, normalizeChildren, parseFirst, parseFirstPattern, process, processAttributes, processFunctions, render, renderAttributes, renderChildren,
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

  parseFirstPattern = /^([^#.]+)?(#([^.]+))?(.(.*))?$/;

  parseFirst = function(first) {
    var matches;
    if (typeof first !== 'string') {
      throw "Invalid first argument " + first;
    }
    if (matches = first.match(parseFirstPattern)) {
      return {
        tag: matches[1],
        id: matches[3],
        classes: matches[5]
      };
    } else {
      return first;
    }
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
    console.log('normalizeChildren');
    console.log(items);
    for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = normalizeChildren(items[i]);
      if (isArray(item)) {
        if (item[0] === '') {
          console.log('here');
          console.log(items);
          items.splice.apply(items, [i, 1].concat(__slice.call(item.shift())));
          console.log(items);
        }
      } else if (typeof item === 'undefined' || item === null || item === '') {

      } else {
        items[i] = item;
      }
    }
    console.log('after normalizeChildren');
    console.log(items);
    return items;
  };

  normalize = function(items) {
    if (!isArray(items)) {
      return items;
    }
    items = normalizeChildren(items);
    console.log(items);
    return items;
  };

  processAttributes = function(output) {};

  process = function(template, data) {
    var i, item, key, value;
    if (isFunction(template)) {
      return process(template(data), data);
    }
    if (isArray(template)) {
      for (i in template) {
        item = template[i];
        template[i] = process(item, data);
      }
    } else if (isObject(template)) {
      for (key in template) {
        if (!__hasProp.call(template, key)) continue;
        value = template[key];
        if (isFunction(value)) {
          template[key] = process(value(data), data);
        }
      }
    }
    return template;
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
    processFunctions: processFunctions,
    normalize: normalize,
    processAttributes: processAttributes
  };

  this.T = T;

}).call(this);
