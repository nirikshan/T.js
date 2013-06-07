// Generated by CoffeeScript 1.4.0
(function() {
  var THIS;

  THIS = this;

  describe("T.internal.processFirst", function() {
    it("should parse div#this.class1.class2", function() {
      var input, result;
      input = ['div#this.class1.class2', 'text'];
      result = [
        'div', {
          id: 'this',
          'class': 'class1 class2'
        }, 'text'
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse div#this", function() {
      var input, result;
      input = ['div#this', 'text'];
      result = [
        'div', {
          id: 'this'
        }, 'text'
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should parse 'div#this div.child'", function() {
      var input, result;
      input = ['div#this div.child', 'text'];
      result = [
        'div', {
          id: 'this'
        }, [
          'div', {
            "class": 'child'
          }, 'text'
        ]
      ];
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    it("should return as is if first starts with '<'", function() {
      var input, result;
      input = ['<!DOCTYPE html>', '...'];
      result = input;
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
    return it("should return as is if first is an array", function() {
      var input, result;
      input = [[], '...'];
      result = input;
      return expect(T.internal.processFirst(input)).toEqual(result);
    });
  });

  describe("T.internal.normalize", function() {
    it("should normalize array", function() {
      var input, result;
      input = ['div', ['', 'text']];
      result = ['div', 'text'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
    it("should normalize array if first item is an array", function() {
      var input, result;
      input = ['div', [['div'], 'text']];
      result = ['div', ['div'], 'text'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
    return it("should normalize array recursively", function() {
      var input, result;
      input = ['div', ['', 'text', ['', 'text2']]];
      result = ['div', 'text', 'text2'];
      return expect(T.internal.normalize(input)).toEqual(result);
    });
  });

  describe("T.internal.parseStyles", function() {
    return it("should parse styles", function() {
      var input, result;
      input = "a:a-value;b:b-value;";
      result = {
        a: 'a-value',
        b: 'b-value'
      };
      return expect(T.internal.parseStyles(input)).toEqual(result);
    });
  });

  describe("T.internal.processStyles", function() {
    return it("should work", function() {
      var input, result;
      input = {
        style: 'a:a-value;b:b-value;'
      };
      result = {
        style: {
          a: 'a-value',
          b: 'b-value'
        }
      };
      return expect(T.internal.processStyles(input)).toEqual(result);
    });
  });

  describe("T.internal.processAttributes", function() {
    it("should merge attributes", function() {
      var input, result;
      input = [
        'div', {
          a: 1
        }, {
          a: 11,
          b: 2
        }
      ];
      result = [
        'div', {
          a: 11,
          b: 2
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    it("should merge attributes and keep other items untouched", function() {
      var input, result;
      input = [
        'div', {
          a: 1
        }, 'first', {
          b: 2
        }, 'second'
      ];
      result = [
        'div', {
          a: 1,
          b: 2
        }, 'first', 'second'
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    it("should merge styles", function() {
      var input, result;
      input = [
        'div', {
          style: 'a:old-a;b:b-value;'
        }, {
          style: 'a:new-a'
        }
      ];
      result = [
        'div', {
          style: {
            a: 'new-a',
            b: 'b-value'
          }
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
    return it("should merge css classes", function() {
      var input, result;
      input = [
        'div', {
          "class": 'first second'
        }, {
          "class": 'third'
        }
      ];
      result = [
        'div', {
          "class": 'first second third'
        }
      ];
      return expect(T.internal.processAttributes(input)).toEqual(result);
    });
  });

  describe("T.process", function() {
    it("should create ready-to-be-rendered data structure from template and data", function() {
      var result, template;
      template = [
        'div#test', {
          "class": 'first second'
        }, {
          "class": 'third'
        }
      ];
      result = [
        'div', {
          id: 'test',
          "class": 'first second third'
        }
      ];
      return expect(T.process(template)).toEqual(result);
    });
    return it("can be called with different data", function() {
      var template;
      template = [
        'div', function(data) {
          return data;
        }
      ];
      expect(T.process(template, 'test')).toEqual(['div', 'test']);
      return expect(T.process(template, 'test1')).toEqual(['div', 'test1']);
    });
  });

  describe("T.render", function() {
    it("should work", function() {
      var result, template;
      template = ['div', 'a', 'b'];
      result = '<div>ab</div>';
      return expect(T.render(template)).toEqual(result);
    });
    it("should work", function() {
      var result, template;
      template = [['div', 'a'], ['div', 'b']];
      result = '<div>a</div><div>b</div>';
      return expect(T.render(template)).toEqual(result);
    });
    it("empty script should not self-close", function() {
      var result, template;
      template = ['script'];
      result = '<script></script>';
      return expect(T.render(template)).toEqual(result);
    });
    it("script should not self-close", function() {
      var result, template;
      template = [
        'script', {
          src: 'test.js'
        }
      ];
      result = '<script src="test.js"></script>';
      return expect(T.render(template)).toEqual(result);
    });
    return it("should render template", function() {
      var result, template;
      template = [
        'div#test', {
          "class": 'first second'
        }, {
          "class": 'third'
        }
      ];
      result = '<div id="test" class="first second third"/>';
      return expect(T.render(template)).toEqual(result);
    });
  });

  describe("T.get", function() {
    it("should work", function() {
      var data, v;
      v = T.get('name');
      data = {
        name: 'John Doe'
      };
      return expect(v(data)).toEqual(data.name);
    });
    it("should work with nested attribute", function() {
      var data, v;
      v = T.get('account.name');
      data = {
        account: {
          name: 'John Doe'
        }
      };
      return expect(v(data)).toEqual(data.account.name);
    });
    return it("Should take default value", function() {
      var v;
      v = T.get('name', 'Default');
      return expect(v()).toEqual('Default');
    });
  });

  describe("T.escape", function() {
    return it("should work", function() {
      return expect(T.escape('<>&<>&')).toEqual('&lt;&gt;&amp;&lt;&gt;&amp;');
    });
  });

  describe("T.unescape", function() {
    return it("should work", function() {
      return expect(T.unescape('&lt;&gt;&amp;&lt;&gt;&amp;')).toEqual('<>&<>&');
    });
  });

  describe("T()", function() {
    it("T(T()) should return same Template object", function() {
      var template;
      template = T(["div", "text"]);
      return expect(T(template)).toEqual(template);
    });
    it("process should work", function() {
      var data, mapper, t, template;
      template = [
        "div", function(data) {
          return data.name;
        }
      ];
      mapper = function(data) {
        return data.account;
      };
      t = T(template).map(mapper);
      data = {
        account: {
          name: 'John Doe'
        }
      };
      return expect(t.process(data)).toEqual(['div', 'John Doe']);
    });
    it("each should work", function() {
      var result, template;
      template = function(data) {
        return ['div', data];
      };
      result = [['div', 'a'], ['div', 'b']];
      return expect(T(template).each().process(['a', 'b'])).toEqual(result);
    });
    it("each with a mapper should work", function() {
      var result, template;
      template = function(data) {
        return ['div', data];
      };
      result = [['div', 'a'], ['div', 'b']];
      return expect(T(template).each(function(data) {
        return data.items;
      }).process({
        items: ['a', 'b']
      })).toEqual(result);
    });
    it("each & T.index() & T.count() should work", function() {
      var result, template;
      template = function(data) {
        return ['div', T.index(), data, T.count()];
      };
      result = [['div', 0, 'a', 2], ['div', 1, 'b', 2]];
      return expect(T(template).each().process(['a', 'b'])).toEqual(result);
    });
    it("include template as partial should work", function() {
      var partial, result, template;
      partial = [
        "div", function(data) {
          return data.name;
        }
      ];
      template = [
        "div", T(partial).map(function(data) {
          return data.account;
        })
      ];
      result = ['div', ['div', 'John Doe']];
      return expect(T(template).process({
        account: {
          name: 'John Doe'
        }
      })).toEqual(result);
    });
    it("include template as partial should work", function() {
      var partial, result, template;
      partial = ["div", T.get('name')];
      template = [
        "div", T(partial).map(function(data) {
          return data.account;
        })
      ];
      result = '<div><div>John Doe</div></div>';
      return expect(T(template).render({
        account: {
          name: 'John Doe'
        }
      })).toEqual(result);
    });
    return it("data is empty", function() {
      var mapper, t, template;
      template = [
        "div", function(data) {
          return data != null ? data.name : void 0;
        }
      ];
      mapper = function(data) {
        return data != null ? data.account : void 0;
      };
      t = T(template).map(mapper);
      return expect(t.process()).toEqual(['div', void 0]);
    });
  });

  describe("T().prepare/T.include", function() {
    it("should work", function() {
      var template;
      template = ['div', T.include('title')];
      return expect(T(template).prepare({
        title: 'Title'
      }).process()).toEqual(['div', 'Title']);
    });
    it("should work with partial", function() {
      var partial, template;
      template = ['div', T.include('title')];
      partial = [
        'div', function(data) {
          return data.name;
        }
      ];
      return expect(T(template).prepare({
        title: partial
      }).process({
        name: 'John Doe'
      })).toEqual(['div', ['div', 'John Doe']]);
    });
    it("prepare2 should work", function() {
      var template;
      template = ['div', T.include2(), T.include('title')];
      return expect(T(template).prepare2('first', {
        title: 'Title'
      }).process()).toEqual(['div', 'first', 'Title']);
    });
    it("nested include/prepare should work", function() {
      var template, template2;
      template = ['div', T.include('title')];
      template2 = [
        'div', T(template).prepare({
          title: 'Title'
        }), T.include('body')
      ];
      return expect(T(template2).prepare({
        body: 'Body'
      }).process()).toEqual(['div', ['div', 'Title'], 'Body']);
    });
    return it("mapper should work", function() {
      var layout, partial, template;
      layout = ['div', T.include('title')];
      partial = function(data) {
        return data.title;
      };
      template = T(layout).prepare({
        title: partial
      }).map(function(data) {
        return data.main;
      });
      return expect(template.process({
        main: {
          title: 'Title'
        }
      })).toEqual(['div', 'Title']);
    });
  });

  describe("T.noConflict", function() {
    it("should work", function() {
      var T1;
      T1 = T.noConflict();
      expect(typeof T).toEqual('undefined');
      return THIS.T = T1;
    });
    return it("pass reference to T in closure", function() {
      var T1;
      T1 = T.noConflict();
      (function(T) {
        var result, template;
        template = function(data) {
          return ["div", T.index(), data];
        };
        result = [['div', 0, 'item1'], ['div', 1, 'item2']];
        return expect(T(template).each().process(['item1', 'item2'])).toEqual(result);
      })(T1);
      return THIS.T = T1;
    });
  });

}).call(this);
