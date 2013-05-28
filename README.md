# T.js - a simple & powerful template engine

## DESCRIPTION

T.js is a template engine that uses simple Javascript data structure to 
represent html/xml data.

### BASIC RULES

* A tag is represented by an array;
* First item is the tag name, and id and css classes if present, e.g.
  'div#id.class1.class2';
* Rest of the array contains the tag's attributes, text or child tags;
* Attributes are stored in hash, e.g. {"name": "username", "type": "text"};
* Text values are strings, e.g. "This is sample content";
* Child tags are in child arrays;
* Attributes can appear anywhere after tag name and are merged into one hash;
* Texts and child tags are rendered sequentially.

### ADVANCED FEATURES

* Functions can be used everywhere, they'll be invoked and their results will
  be used to generate final output, e.g.
  ```javascript
  ['div.now', function(){return new Date();}]
  ```

* render() takes an optional data argument, that argument will then be passed 
  to functions inside the template, e.g.
  ```javascript
  var template = ['div.total', function(data){return data.total;}];
  T(template).render({total: 100});
  ```

* Support layout, e.g.
  ```javascript
  var layout = ['div', ['div', 'Title'], T.include('body')]
  var body   = ['div', 'Content goes here']
  T(layout).prepare({'body': body}).render()
  ```

## USAGE

* Include T.js on top of HTML
```html
<script src="PATH_TO/t.js"></script>
```

* Define template
```javascript
var template = ["a.edit", {"href": "/edit"}, "Edit"]
```

* Render
```javascript
var result = T(template).render()
```

* Result is like
```html
<a class="edit" href="/edit">Edit</a>
```

## EXAMPLES

### EXAMPLE 1: A simple template that uses data
```javascript
var template = function(account){
  return [
    'div.account', 
    ['div.header', 'Account Info'],
    ['div.label', 'Name'],
    ['div', account.name],
    ['div.label', 'Age'],
    ['div', account.age]
  ];
};
var account = {
  name: 'John Doe',
  age: 25
};
var result = T(template).render(account);
// result is like below (after formatted)
// <div class="account">
//   <div class="header">Account Info</div>
//   <div class="label">Name</div>
//   <div>John Doe</div>
//   <div class="label">Age</div>
//   <div>25</div>
// </div>
```

### [EXAMPLE 2: A simple TODO list](http://jsfiddle.net/gcao/gRzNP/)

## DEVELOPMENT SETUP (MAC)

$ git clone git://github.com/gcao/T.js.git  
$ cd T.js

$ brew install node  
$ npm install coffee-script  

$ gem install bundler  
$ bundle  
$ guard  

## NOTES

* Run with LiveReload support:  
thin -p 8000 start

* Run with no external dependency:  
cd public && python -m SimpleHTTPServer

* Open Demo Page:  
open http://localhost:8000

* Run Jasmine tests in browser:  
open http://localhost:8000/spec_runner.html

* Convert between html and T:  
bin/html2t spec/fixtures/test.html  
bin/html2t spec/fixtures/test.html | bin/t2html  

* Convert T to CoffeeScript (js2coffee has to be installed):  
bin/html2t spec/fixtures/test.html | js2coffee

* Convert haml to html to T template to html:  
bundle exec bin/haml2erb spec/fixtures/test.haml | HTML_FRAGMENT=true bin/html2t | bin/t2html

* Integrate with Jasmine Headless WebKit:  
Config file is located at public/javascripts/spec/jasmine.yml  
jasmine-headless-webkit -c -j public/javascripts/spec/jasmine.yml

