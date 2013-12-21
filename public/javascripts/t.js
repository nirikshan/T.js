// Generated by CoffeeScript 1.4.0
(function() {
  var T, VERSION, create,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  VERSION = "0.8.0";

  create = function() {
    var T, internal;
    T = function() {
      var data, template;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return template.process.apply(template, data);
    };
    T.VERSION = VERSION;
    T.create = create;
    T.templates = {};
    T.internal = internal = {};
    internal.callbacks = [];
    internal.isArray = function(o) {
      return o instanceof Array;
    };
    internal.isObject = function(o) {
      return o !== null && typeof o === "object" && (!(o instanceof Array));
    };
    internal.isTemplate = function(o) {
      return o !== null && typeof o === "object" && o.isTjsTemplate;
    };
    internal.isEmpty = function(o) {
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
    internal.hasFunction = function(o) {
      var item, key, value, _i, _len;
      if (typeof o === 'function') {
        return true;
      }
      if (internal.isTemplate(o)) {
        return true;
      }
      if (internal.isArray(o)) {
        for (_i = 0, _len = o.length; _i < _len; _i++) {
          item = o[_i];
          if (internal.hasFunction(item)) {
            return true;
          }
        }
      } else if (internal.isObject(o)) {
        for (key in o) {
          if (!__hasProp.call(o, key)) continue;
          value = o[key];
          if (internal.hasFunction(value)) {
            return true;
          }
        }
      }
    };
    internal.merge = function(o1, o2) {
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
    internal.Template = function(template, name) {
      this.template = template;
      this.name = name;
      return this.isTjsTemplate = true;
    };
    internal.Template.prototype.process = function() {
      var data, tags;
      data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      tags = internal.prepareOutput.apply(internal, [this.template].concat(__slice.call(data)));
      tags = internal.normalize(tags);
      tags = internal.processAttributes(tags);
      return new internal.TemplateOutput(this, tags);
    };
    internal.Template.prototype.prepare = function(includes) {
      var key, template, value;
      for (key in includes) {
        if (!__hasProp.call(includes, key)) continue;
        value = includes[key];
        if (!internal.isTemplate(value)) {
          includes[key] = new internal.Template(value);
        }
      }
      template = new internal.Template(this.template, this.name);
      template.process = function() {
        var data, oldIncludes, _ref;
        data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        try {
          if (internal.includes) {
            oldIncludes = internal.includes;
          }
          if (includes) {
            internal.includes = includes;
          }
          return (_ref = internal.Template.prototype.process).call.apply(_ref, [this].concat(__slice.call(data)));
        } finally {
          if (oldIncludes) {
            internal.includes = oldIncludes;
          } else {
            delete internal.includes;
          }
        }
      };
      return template;
    };
    internal.TemplateOutput = function(template, tags) {
      this.template = template;
      this.tags = tags;
    };
    internal.TemplateOutput.prototype.toString = function(options) {
      return internal.render(this.tags, options);
    };
    internal.TemplateOutput.prototype.render = function(options) {
      if (options.inside) {
        $(options.inside).html(this.toString());
      } else if (options.replace) {
        $(options.replace).replace(this.toString());
      } else if (options.prependTo) {
        $(options.prependTo).prepend(this.toString());
      } else if (options.appendTo) {
        $(options.appendTo).append(this.toString());
      } else if (options.before) {
        $(options.before).before(this.toString());
      } else if (options.after) {
        $(options.after).after(this.toString());
      } else if (options.handler) {
        options.handler(this.toString());
      } else {
        return internal.renderTags(this.tags);
      }
      return internal.registerCallbacks();
    };
    internal.RENDER_COMPLETE_CALLBACK = 'renderComplete';
    internal.FIRST_NO_PROCESS_PATTERN = /^<.*/;
    internal.FIRST_FIELD_PATTERN = /^([^#.]+)?(#([^.]+))?(.(.*))?$/;
    internal.processFirst = function(items) {
      var attrs, classes, first, i, id, matches, part, parts, rest, tag;
      first = items[0];
      if (internal.isArray(first)) {
        return items;
      }
      if (typeof first !== 'string') {
        throw "Invalid first argument " + first;
      }
      if (first.match(internal.FIRST_NO_PROCESS_PATTERN)) {
        return items;
      }
      parts = first.split(' ');
      if (parts.length > 1) {
        i = parts.length - 1;
        rest = items.slice(1);
        while (i >= 0) {
          part = parts[i];
          rest.unshift(part);
          rest = [internal.processFirst(rest)];
          i--;
        }
        return rest[0];
      }
      if (matches = first.match(internal.FIRST_FIELD_PATTERN)) {
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
    internal.normalize = function(items) {
      var first, i, item, _i, _ref;
      if (!internal.isArray(items)) {
        return items;
      }
      for (i = _i = _ref = items.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
        item = internal.normalize(items[i]);
        if (internal.isArray(item)) {
          first = item[0];
          if (first === '') {
            item.shift();
            items.splice.apply(items, [i, 1].concat(__slice.call(item)));
          } else if (internal.isArray(first)) {
            items.splice.apply(items, [i, 1].concat(__slice.call(item)));
          }
        } else if (item instanceof internal.TemplateOutput) {
          items[i] = item.tags;
        } else if (typeof item === 'undefined' || item === null || item === '') {

        } else {
          items[i] = item;
        }
      }
      return items;
    };
    internal.parseStyles = function(str) {
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
    internal.processStyles = function(attrs) {
      var key, style, value, _ref;
      style = attrs.style;
      if (typeof style === 'string') {
        attrs.style = internal.parseStyles(style);
      } else if (internal.isObject(style && !internal.isEmpty(style))) {
        attrs.style = style;
      }
      if (attrs.style) {
        _ref = attrs.style;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          if (key.indexOf('_') >= 0) {
            delete attrs.style[key];
            attrs.style[key.replace(/_/g, '-')] = value;
          }
        }
      }
      return attrs;
    };
    internal.processCssClasses = function(attrs, newAttrs) {
      if (attrs["class"]) {
        if (newAttrs["class"]) {
          newAttrs["class"] = attrs["class"] + ' ' + newAttrs["class"];
        } else {
          newAttrs["class"] = attrs["class"];
        }
      }
      return newAttrs;
    };
    internal.processAttributes = function(items) {
      var attrs, i, item, newStyles, styles, _i, _j, _len, _ref;
      if (internal.isArray(items)) {
        if (items.length === 0) {
          return items;
        }
        attrs = {};
        items = internal.processFirst(items);
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (internal.isArray(item)) {
            internal.processAttributes(item);
          } else if (internal.isObject(item)) {
            internal.processStyles(item);
            styles = attrs.style;
            newStyles = item.style;
            internal.processCssClasses(attrs, item);
            attrs = internal.merge(attrs, item);
            styles = internal.merge(styles, newStyles);
            if (!internal.isEmpty(styles)) {
              attrs.style = styles;
            }
          }
        }
        for (i = _j = _ref = items.length - 1; _ref <= 0 ? _j <= 0 : _j >= 0; i = _ref <= 0 ? ++_j : --_j) {
          if (internal.isObject(items[i])) {
            items.splice(i, 1);
          }
        }
        if (!internal.isEmpty(attrs)) {
          items.splice(1, 0, attrs);
        }
      }
      return items;
    };
    internal.prepareOutput = function() {
      var data, template;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof template === 'function') {
        return internal.prepareOutput.apply(internal, [template.apply(null, data)].concat(__slice.call(data)));
      } else if (internal.isTemplate(template)) {
        return template.process.apply(template, data);
      } else {
        return template;
      }
    };
    internal.registerCallbacks = function(config) {
      var callback, cssClass, element, myCallbacks, name, _ref, _results;
      _results = [];
      while (internal.callbacks.length > 0) {
        _ref = internal.callbacks.shift(), cssClass = _ref[0], myCallbacks = _ref[1];
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
                if (name === internal.RENDER_COMPLETE_CALLBACK) {
                  _results2.push(callback(element));
                } else {
                  _results2.push($(element).on(name, callback));
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
    internal.getRandomCssClass = function() {
      return String(Math.random()).replace('0.', 'cls');
    };
    internal.processCallbacks = function(attributes) {
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
        cssClass = internal.getRandomCssClass();
        internal.callbacks.push([cssClass, myCallbacks]);
        if (attributes["class"]) {
          return attributes["class"] += ' ' + cssClass;
        } else {
          return attributes["class"] = cssClass;
        }
      }
    };
    internal.renderAttributes = function(attributes) {
      var key, name, result, s, style, styles, value;
      result = "";
      internal.processCallbacks(attributes);
      for (key in attributes) {
        if (!__hasProp.call(attributes, key)) continue;
        value = attributes[key];
        if (key === "style") {
          styles = attributes.style;
          if (internal.isObject(styles)) {
            s = "";
            for (name in styles) {
              if (!__hasProp.call(styles, name)) continue;
              style = styles[name];
              if (typeof style === 'number') {
                style += 'px';
              }
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
    internal.renderRest = function(input, options) {
      var item;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = input.length; _i < _len; _i++) {
          item = input[_i];
          _results.push(internal.render(item, options));
        }
        return _results;
      })()).join('');
    };
    internal.render = function(input, options) {
      var attrs, first, item, key, result, second, value;
      if (typeof input === 'undefined' || input === null) {
        return '';
      }
      if (!internal.isArray(input)) {
        return '' + input;
      }
      if (input.length === 0) {
        return '';
      }
      first = input.shift();
      if (internal.isArray(first)) {
        return internal.render(first, options) + ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = input.length; _i < _len; _i++) {
            item = input[_i];
            _results.push(internal.render(item, options));
          }
          return _results;
        })()).join('');
      }
      if (first === "") {
        return internal.renderRest(input, options);
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
      if (internal.isObject(second)) {
        attrs = second;
        if (options != null ? options.ignoreCallbacks : void 0) {
          attrs = {};
          for (key in second) {
            if (!__hasProp.call(second, key)) continue;
            value = second[key];
            if (typeof value !== 'function') {
              attrs[key] = value;
            }
          }
        }
        result += internal.renderAttributes(attrs);
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
        result += internal.render(second);
        if (input.length === 0) {
          result += "</" + first + ">";
          return result;
        }
      }
      if (input.length > 0) {
        result += internal.renderRest(input, options);
        result += "</" + first + ">";
      }
      return result;
    };
    internal.renderTags = function(tags) {
      var fragment, parent;
      parent = internal.isArray(tags[0]) ? fragment = document.createDocumentFragment() : void 0;
      return internal.renderChildTags(parent, tags);
    };
    internal.renderChildTags = function(parent, tags) {
      var el, item, k, key, part, renderComplete, s, v, value, _i, _j, _len, _len1;
      if (internal.isArray(tags[0])) {
        for (_i = 0, _len = tags.length; _i < _len; _i++) {
          item = tags[_i];
          internal.renderChildTags(parent, item);
        }
        return parent;
      }
      el = document.createElement(tags.shift());
      if (parent) {
        parent.appendChild(el);
      }
      renderComplete = null;
      for (_j = 0, _len1 = tags.length; _j < _len1; _j++) {
        part = tags[_j];
        if (typeof part === 'string') {
          el.appendChild(document.createTextNode(part));
        } else if (internal.isObject(part)) {
          for (key in part) {
            if (!__hasProp.call(part, key)) continue;
            value = part[key];
            if (key === 'renderComplete') {
              renderComplete = value;
            } else if (typeof value === 'function') {
              $(el).bind(key, value);
            } else if (key.toLowerCase() === 'style' && internal.isObject(value)) {
              s = "";
              for (k in value) {
                if (!__hasProp.call(value, k)) continue;
                v = value[k];
                s += "" + k + ":" + v + ";";
              }
              value = s;
            }
            el.setAttribute(key, value);
          }
        } else if (internal.isArray(part)) {
          internal.renderChildTags(el, part);
        }
      }
      if (typeof renderComplete === "function") {
        renderComplete(el);
      }
      return el;
    };
    T.each = function() {
      var args, array, template;
      template = arguments[0], array = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return T.process(function() {
        var item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          _results.push(T.apply(null, [template, item].concat(__slice.call(args))));
        }
        return _results;
      });
    };
    T.each_with_index = function() {
      var args, array, template;
      template = arguments[0], array = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return T.process(function() {
        var i, item, _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
          item = array[i];
          _results.push(T.apply(null, [template, item, i].concat(__slice.call(args))));
        }
        return _results;
      });
    };
    T.each_pair = function() {
      var args, hash, template;
      template = arguments[0], hash = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return T.process(function() {
        var key, value, _results;
        _results = [];
        for (key in hash) {
          if (!__hasProp.call(hash, key)) continue;
          value = hash[key];
          _results.push(T.apply(null, [template, key, value].concat(__slice.call(args))));
        }
        return _results;
      });
    };
    T.process = function() {
      var data, template, _ref;
      template = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = new internal.Template(template)).process.apply(_ref, data);
    };
    T.include = function() {
      var data, name, _ref, _ref1;
      name = arguments[0], data = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = internal.includes) != null ? (_ref1 = _ref[name]).process.apply(_ref1, data) : void 0;
    };
    T.template = function(template) {
      return new internal.Template(template);
    };
    T.escape = function(str) {
      if (!str) {
        return str;
      }
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };
    T.unescape = function(str) {
      if (!str) {
        return str;
      }
      return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    };
    internal.thisRef = this;
    T.noConflict = function() {
      if (T.oldT) {
        internal.thisRef.T = T.oldT;
      } else {
        delete internal.thisRef.T;
      }
      return T;
    };
    if (this.T) {
      T.oldT = this.T;
    }
    return T;
  };

  T = create();

  this.T = T;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = T;
  }

}).call(this);
