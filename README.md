# xpect - A [LearnBoost/expect.js](https://github.com/LearnBoost/expect.js) fork [![Build Status](https://travis-ci.org/schnittstabil/xpect.svg)](https://travis-ci.org/schnittstabil/xpect)

Minimalistic BDD assertion toolkit based on
[should.js](http://github.com/visionmedia/should.js)

```js
xpect(window.r).to.be(undefined);
xpect({ a: 'b' }).to.eql({ a: 'b' })
xpect(5).to.be.a('number');
xpect([]).to.be.an('array');
xpect(window).not.to.be.an(Image);
```

## Features

### expect

- Cross-browser: works on IE6+, Firefox, Safari, Chrome, Opera.
- Compatible with all test frameworks.
- Node.JS ready (`npm install xpect`).
- Standalone. Single global with no prototype extensions or shims.

### additional features beyond expect

- [AMD support](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (not easy to achieve with `expect.js` because of the `.js` prefix in its package name)
- AMD, [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) and Browser-Globals support by [UMD](https://github.com/umdjs/umd/blob/master/returnExports.js)
- [bower.io support](http://bower.io) (`bower install xpect`)
- [component support](https://github.com/component/guide) (`component install xpect`)
- and, most importantly, **same AMD and CommonJS package name**

## How to use

### CommonJS (Node.js)

```js
var xpect = require('xpect');
xpect(42).to.be.ok();
```

### Browser Globals

```html
<script src="xpect.js"></script>
<script>
  xpect(42).to.be.ok();
</script>
```

### AMD

```js
define(['xpect'] , function (xpect) {
  xpect(42).to.be.ok();
});
```

## API

**ok**: asserts that the value is _truthy_ or not

```js
xpect(1).to.be.ok();
xpect(true).to.be.ok();
xpect({}).to.be.ok();
xpect(0).to.not.be.ok();
```

**be** / **equal**: asserts `===` equality

```js
xpect(1).to.be(1)
xpect(NaN).not.to.equal(NaN);
xpect(1).not.to.be(true)
xpect('1').to.not.be(1);
```

**eql**: asserts loose equality that works with objects

```js
xpect({ a: 'b' }).to.eql({ a: 'b' });
xpect(1).to.eql('1');
```

**a**/**an**: asserts `typeof` with support for `array` type and `instanceof`

```js
// typeof with optional `array`
xpect(5).to.be.a('number');
xpect([]).to.be.an('array');  // works
xpect([]).to.be.an('object'); // works too, since it uses `typeof`

// constructors
xpect(5).to.be.a(Number);
xpect([]).to.be.an(Array);
xpect(tobi).to.be.a(Ferret);
xpect(person).to.be.a(Mammal);
```

**match**: asserts `String` regular expression match

```js
xpect(program.version).to.match(/[0-9]+\.[0-9]+\.[0-9]+/);
```

**contain**: asserts indexOf for an array or string

```js
xpect([1, 2]).to.contain(1);
xpect('hello world').to.contain('world');
```

**length**: asserts array `.length`

```js
xpect([]).to.have.length(0);
xpect([1,2,3]).to.have.length(3);
```

**empty**: asserts that an array is empty or not

```js
xpect([]).to.be.empty();
xpect({}).to.be.empty();
xpect({ length: 0, duck: 'typing' }).to.be.empty();
xpect({ my: 'object' }).to.not.be.empty();
xpect([1,2,3]).to.not.be.empty();
```

**property**: asserts presence of an own property (and value optionally)

```js
xpect(window).to.have.property('xpect')
xpect(window).to.have.property('xpect', xpect)
xpect({a: 'b'}).to.have.property('a');
```

**key**/**keys**: asserts the presence of a key. Supports the `only` modifier

```js
xpect({ a: 'b' }).to.have.key('a');
xpect({ a: 'b', c: 'd' }).to.only.have.keys('a', 'c');
xpect({ a: 'b', c: 'd' }).to.only.have.keys(['a', 'c']);
xpect({ a: 'b', c: 'd' }).to.not.only.have.key('a');
```

**throwException**/**throwError**: asserts that the `Function` throws or not when called

```js
xpect(fn).to.throwError(); // synonym of throwException
xpect(fn).to.throwException(function (e) { // get the exception object
  xpect(e).to.be.a(SyntaxError);
});
xpect(fn).to.throwException(/matches the exception message/);
xpect(fn2).to.not.throwException();
```

**withArgs**: creates anonymous function to call fn with arguments

```js
xpect(fn).withArgs(invalid, arg).to.throwException();
xpect(fn).withArgs(valid, arg).to.not.throwException();
```

**within**: asserts a number within a range

```js
xpect(1).to.be.within(0, Infinity);
```

**greaterThan**/**above**: asserts `>`

```js
xpect(3).to.be.above(0);
xpect(5).to.be.greaterThan(3);
```

**lessThan**/**below**: asserts `<`

```js
xpect(0).to.be.below(3);
xpect(1).to.be.lessThan(3);
```

**fail**: explicitly forces failure.

```js
xpect().fail()
xpect().fail("Custom failure message")
```

## Using with a test framework

For example, if you create a test suite with
[mocha](http://github.com/visionmedia/mocha).

Let's say we wanted to test the following program:

**math.js**

```js
function add (a, b) { return a + b; };
```

Our test file would look like this:

```js
describe('test suite', function () {
  it('should expose a function', function () {
    xpect(add).to.be.a('function');
  });

  it('should do math', function () {
    xpect(add(1, 3)).to.equal(4);
  });
});
```

If a certain xpectation fails, an exception will be raised which gets captured
and shown/processed by the test runner.

## Differences with should.js

- No need for static `should` methods like `should.strictEqual`. For example,
  `xpect(obj).to.be(undefined)` works well.
- Some API simplifications / changes.
- API changes related to browser compatibility.

## Running tests

```bash
# install xpect and devDependencies
npm install xpect
cd node_modules/xpect
npm install
npm run install-browser-test

# node
npm test

# browser
npm run browser-test
xdg-open http://localhost:3000/test/
```

## Credits

(The MIT License)

Copyright (c) 2011 Guillermo Rauch &lt;guillermo@learnboost.com&gt;

Portions (c) 2014 Michael Mayer &lt;michael@schnittstabil.de&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### 3rd-party

Heavily borrows from [should.js](http://github.com/visionmedia/should.js) by TJ
Holowaychuck - MIT.
