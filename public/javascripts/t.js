// Generated by CoffeeScript 1.3.3
(function() {
  var FirstFieldPattern, T, Template, hasFunction, isArray, isEmpty, isObject, merge, normalize, parseStyles, prepareOutput, processAttributes, processCssClasses, processFirst, processStyles, render, renderAttributes,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  isArray = function(o) {
    return o instanceof Array;
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
    if (typeof o === 'function') {
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
      if (o.isTemplate) {
        return true;
      }
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

  normalize = function(items) {
    var i, item, _i, _ref;
    if (!isArray(items)) {
      return items;
    }
    for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      item = normalize(items[i]);
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
    var newStyles, style, styles;
    newStyles = {};
    style = attrs.style;
    if (typeof style === 'string') {
      newStyles = merge(newStyles, parseStyles(style));
    }
    styles = attrs.styles;
    if (typeof styles === 'string') {
      newStyles = merge(newStyles, parseStyles(styles));
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
    var attrs, i, item, newStyles, styles, _i, _j, _len, _ref;
    if (isArray(items)) {
      attrs = {};
      processFirst(items);
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

  prepareOutput = function(template, data) {
    var item, key, output, value, _i, _len, _results;
    if (typeof template === 'function') {
      return prepareOutput(template(data), data);
    } else if (isArray(template)) {
      if (hasFunction(template)) {
        _results = [];
        for (_i = 0, _len = template.length; _i < _len; _i++) {
          item = template[_i];
          _results.push(prepareOutput(item, data));
        }
        return _results;
      } else {
        return template;
      }
    } else if (isObject(template)) {
      if (template.isTemplate) {
        return prepareOutput(template.process(data), data);
      } else if (hasFunction(template)) {
        output = {};
        for (key in template) {
          value = template[key];
          output[key] = prepareOutput(value, data);
        }
        return output;
      } else {
        return template;
      }
    } else {
      return template;
    }
  };

  renderAttributes = function(attributes) {
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

  render = function(output) {
    var first, result, second;
    if (!isArray(output)) {
      return output.toString();
    }
    if (output.length === 0) {
      return '';
    }
    first = output.shift();
    if (first === "") {
      return render(output);
    }
    if (output.length === 0) {
      return "<" + first + "/>";
    }
    result = "<" + first;
    second = output.shift();
    if (isObject(second)) {
      result += renderAttributes(second);
      if (output.length === 0) {
        result += "/>";
        return result;
      } else {
        result += ">";
      }
    } else {
      result += ">";
      result += render(second);
      if (output.length === 0) {
        result += "</" + first + ">";
        return result;
      }
    }
    if (output.length > 0) {
      result += render(output);
      result += "</" + first + ">";
    }
    return result;
  };

  Template = function(template, mapper) {
    this.template = template;
    this.mapper = mapper;
    return this.isTemplate = true;
  };

  Template.prototype.process = function(data) {
    var output;
    if (this.mapper) {
      data = this.mapper(data);
    }
    output = prepareOutput(this.template, data);
    output = normalize(output);
    return processAttributes(output);
  };

  Template.prototype.render = function(data) {
    var output;
    output = this.process(data);
    return render(output);
  };

  T = function(template, mapper) {
    return new Template(template, mapper);
  };

  T.process = function(template, data) {
    return new Template(template).process(data);
  };

  T.render = function(template, data) {
    return new Template(template).render(data);
  };

  T.utils = {
    normalize: normalize,
    processFirst: processFirst,
    parseStyles: parseStyles,
    processStyles: processStyles,
    processAttributes: processAttributes,
    render: render
  };

  this.T = T;

}).call(this);
