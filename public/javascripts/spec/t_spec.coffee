describe "T.utils.normalize", ->
  it "should normalize array", ->
    input  = ['div', ['', 'text']]
    output = ['div', 'text']
    expect(T.utils.normalize(input)).toEqual(output)

  it "should normalize array recursively", ->
    input = ['div', ['', 'text', ['', 'text2']]]
    output = ['div', 'text', 'text2']
    expect(T.utils.normalize(input)).toEqual(output)

describe "T.utils.parseStyleString", ->
  it "should parse styles", ->
    input  = "a:a-value;b:b-value;"
    output = {a: 'a-value', b: 'b-value'}
    expect(T.utils.parseStyleString(input)).toEqual(output)

describe "T.utils.processStyles", ->
  it "should work", ->
    input  = {style: 'a:a-value;b:b-value;', styles: {c: 'c-value'}}
    output = {style: {a: 'a-value', b: 'b-value', c: 'c-value'}}
    expect(T.utils.processStyles(input)).toEqual(output)

describe "T.utils.processAttributes", ->
  it "should merge attributes", ->
    input  = ['div', {a: 1}, {a: 11, b: 2}]
    output = ['div', {a: 11, b: 2}]
    expect(T.utils.processAttributes(input)).toEqual(output)

  it "should merge attributes and keep other items untouched", ->
    input  = ['div', {a: 1}, 'first', {b: 2}, 'second']
    output = ['div', {a: 1, b: 2}, 'first', 'second']
    expect(T.utils.processAttributes(input)).toEqual(output)

  it "should merge styles", ->
    input  = ['div', {style: 'a:old-a;b:b-value;', styles: {c: 'c-value'}}, {style: 'a:new-a'}]
    output = ['div', {style: {a: 'new-a', b: 'b-value', c: 'c-value'}}]
    expect(T.utils.processAttributes(input)).toEqual(output)

  it "should merge css classes", ->
    input  = ['div', {'class': 'first second'}, {'class': 'third'}]
    output = ['div', {'class': 'first second third'}]
    expect(T.utils.processAttributes(input)).toEqual(output)