
/**
 * Module dependencies.
 */

function err (fn, msg) {
  try {
    fn();
    throw new Error('Expected an error');
  } catch (err) {
    xpect(msg).to.be(err.message);
  }
}

/**
 * Feature detection for `name` support.
 */

var nameSupported;

(function a () {
  nameSupported = 'a' == a.name;
})();

/**
 * Tests.
 */

describe('xpect', function () {

  it('should have .version', function () {
    xpect(xpect.version).to.be.ok();
  });

  it('should work in its basic form', function () {
    xpect('test').to.be.a('string');
  });

  it('should test true', function () {
    xpect(true).to.be(true);
    xpect(false).to.not.be(true);
    xpect(1).to.not.be(true);

    err(function () {
      xpect('test').to.be(true);
    }, "expected 'test' to equal true")
  });

  it('should allow not.to', function () {
    xpect(true).not.to.be(false);

    err(function () {
      xpect(false).not.to.be(false);
    }, "expected false to not equal false")
  });

  it('should test ok', function () {
    xpect(true).to.be.ok();
    xpect(false).to.not.be.ok();
    xpect(1).to.be.ok();
    xpect(0).to.not.be.ok();

    err(function () {
      xpect('').to.be.ok();
    }, "expected '' to be truthy");

    err(function () {
      xpect('test').to.not.be.ok();
    }, "expected 'test' to be falsy");
  });

  it('should test false', function () {
    xpect(false).to.be(false);
    xpect(true).to.not.be(false);
    xpect(0).to.not.be(false);

    err(function () {
      xpect('').to.be(false);
    }, "expected '' to equal false")
  });

  it('should test functions with arguments', function () {
    function itThrowsSometimes (first, second) {
      if (first ^ second) {
        throw new Error('tell');
      }
    }

    xpect(itThrowsSometimes).withArgs(false, false).to.not.throwException();
    xpect(itThrowsSometimes).withArgs(false, true).to.throwException(/tell/);
    xpect(itThrowsSometimes).withArgs(true, false).to.throwException(/tell/);
    xpect(itThrowsSometimes).withArgs(true, true).to.not.throwException();
  });

  it('should test for exceptions', function () {
    function itThrows () {
      a.b.c;
    }

    function itThrowsString () {
      throw 'aaa';
    }

    function itThrowsMessage () {
      throw new Error('tobi');
    }

    var anonItThrows = function () {
      a.b.c;
    }

    function itWorks () {
      return
    }

    var anonItWorks = function () { }

    xpect(itThrows).to.throwException();
    xpect(itWorks).to.not.throwException();

    var subject;

    xpect(itThrows).to.throwException(function (e) {
      subject = e;
    });

    xpect(subject).to.be.an(Error);

    xpect(itThrowsMessage).to.throwException(/tobi/);
    xpect(itThrowsMessage).to.not.throwException(/test/);

    err(function () {
      xpect(itThrowsMessage).to.throwException(/no match/);
    }, 'expected \'tobi\' to match /no match/');

    var subject2;

    xpect(itThrowsString).to.throwException(function (str) {
      subject2 = str;
    });

    xpect(subject2).to.be('aaa');

    xpect(itThrowsString).to.throwException(/aaa/);
    xpect(itThrowsString).to.not.throwException(/bbb/);

    err(function () {
      xpect(itThrowsString).to.throwException(/no match/i);
    }, 'expected \'aaa\' to match /no match/i');

    var called = false;

    xpect(itWorks).to.not.throwError(function () {
      called = true;
    });

    xpect(called).to.be(false);

    err(function () {
      xpect(5).to.throwException();
    }, 'expected 5 to be a function');

    err(function () {
      xpect(anonItThrows).not.to.throwException();
    }, 'expected fn not to throw an exception');

    err(function () {
      xpect(anonItWorks).to.throwException();
    }, 'expected fn to throw an exception');

    if (nameSupported) {
      err(function () {
        xpect(itWorks).to.throwException();
      }, 'expected itWorks to throw an exception');
    } else {
      err(function () {
        xpect(itWorks).to.throwException();
      }, 'expected fn to throw an exception');
    }

    if (nameSupported) {
      err(function () {
        xpect(itThrows).not.to.throwException();
      }, 'expected itThrows not to throw an exception');
    } else {
      err(function () {
        xpect(anonItThrows).not.to.throwException();
      }, 'expected fn not to throw an exception');
    }
  });

  it('should test arrays', function () {
    xpect([]).to.be.a('array');
    xpect([]).to.be.an('array');

    err(function () {
      xpect({}).to.be.an('array');
    }, 'expected {} to be an array');
  });

  it('should test regex', function () {
    xpect(/a/).to.be.an('regexp');
    xpect(/a/).to.be.a('regexp');

    err(function () {
      xpect(null).to.be.a('regexp');
    }, 'expected null to be a regexp');
  });

  it('should test objects', function () {
    xpect({}).to.be.an('object');

    err(function () {
      xpect(null).to.be.an('object');
    }, 'expected null to be an object');
  });

  it('should test .equal()', function () {
    var foo;
    xpect(foo).to.be(undefined);
  });

  it('should test typeof', function () {
    xpect('test').to.be.a('string');

    err(function () {
      xpect('test').to.not.be.a('string');
    }, "expected 'test' not to be a string");

    xpect(5).to.be.a('number');

    err(function () {
      xpect(5).to.not.be.a('number');
    }, "expected 5 not to be a number");
  });

  it('should test instanceof', function () {
    function Foo(){}
    xpect(new Foo()).to.be.a(Foo);

    if (nameSupported) {
      err(function () {
        xpect(3).to.be.a(Foo);
      }, "expected 3 to be an instance of Foo");
    } else {
      err(function () {
        xpect(3).to.be.a(Foo);
      }, "expected 3 to be an instance of supplied constructor");
    }
  });

  it('should test within(start, finish)', function () {
    xpect(5).to.be.within(3,6);
    xpect(5).to.be.within(3,5);
    xpect(5).to.not.be.within(1,3);

    err(function () {
      xpect(5).to.not.be.within(4,6);
    }, "expected 5 to not be within 4..6");

    err(function () {
      xpect(10).to.be.within(50,100);
    }, "expected 10 to be within 50..100");
  });

  it('should test above(n)', function () {
    xpect(5).to.be.above(2);
    xpect(5).to.be.greaterThan(2);
    xpect(5).to.not.be.above(5);
    xpect(5).to.not.be.above(6);

    err(function () {
      xpect(5).to.be.above(6);
    }, "expected 5 to be above 6");

    err(function () {
      xpect(10).to.not.be.above(6);
    }, "expected 10 to be below 6");
  });

  it('should test match(regexp)', function () {
    xpect('foobar').to.match(/^foo/)
    xpect('foobar').to.not.match(/^bar/)

    err(function () {
      xpect('foobar').to.match(/^bar/i)
    }, "expected 'foobar' to match /^bar/i");

    err(function () {
      xpect('foobar').to.not.match(/^foo/i)
    }, "expected 'foobar' not to match /^foo/i");
  });

  it('should test length(n)', function () {
    xpect('test').to.have.length(4);
    xpect('test').to.not.have.length(3);
    xpect([1,2,3]).to.have.length(3);

    err(function () {
      xpect(4).to.have.length(3);
    }, 'expected 4 to have a property \'length\'');

    err(function () {
      xpect('asd').to.not.have.length(3);
    }, "expected 'asd' to not have a length of 3");
  });

  it('should test eql(val)', function () {
    xpect('test').to.eql('test');
    xpect({ foo: 'bar' }).to.eql({ foo: 'bar' });
    xpect(1).to.eql(1);
    xpect('4').to.eql(4);
    xpect(/a/gmi).to.eql(/a/mig);

    err(function () {
      xpect(4).to.eql(3);
    }, 'expected 4 to sort of equal 3');
  });

  it('should test equal(val)', function () {
    xpect('test').to.equal('test');
    xpect(1).to.equal(1);

    err(function () {
      xpect(4).to.equal(3);
    }, 'expected 4 to equal 3');

    err(function () {
      xpect('4').to.equal(4);
    }, "expected '4' to equal 4");
  });

  it('should test be(val)', function () {
    xpect('test').to.be('test');
    xpect(1).to.be(1);

    err(function () {
      xpect(4).to.be(3);
    }, 'expected 4 to equal 3');

    err(function () {
      xpect('4').to.be(4);
    }, "expected '4' to equal 4");
  });

  it('should test empty', function () {
    xpect('').to.be.empty();
    xpect({}).to.be.empty();
    xpect([]).to.be.empty();
    xpect({ length: 0 }).to.be.empty();

    err(function () {
      xpect(null).to.be.empty();
    }, 'expected null to be an object');

    err(function () {
      xpect({ a: 'b' }).to.be.empty();
    }, 'expected { a: \'b\' } to be empty');

    err(function () {
      xpect({ length: '0' }).to.be.empty();
    }, 'expected { length: \'0\' } to be empty');

    err(function () {
      xpect('asd').to.be.empty();
    }, "expected 'asd' to be empty");

    err(function () {
      xpect('').to.not.be.empty();
    }, "expected '' to not be empty");

    err(function () {
      xpect({}).to.not.be.empty();
    }, "expected {} to not be empty");
  });

  it('should test property(name)', function () {
    xpect('test').to.have.property('length');
    xpect(4).to.not.have.property('length');
    xpect({ length: undefined }).to.have.property('length');

    err(function () {
      xpect('asd').to.have.property('foo');
    }, "expected 'asd' to have a property 'foo'");

    err(function () {
      xpect({ length: undefined }).to.not.have.property('length');
    }, "expected { length: undefined } to not have a property 'length'");
  });

  it('should test property(name, val)', function () {
    xpect('test').to.have.property('length', 4);
    xpect({ length: undefined }).to.have.property('length', undefined);

    err(function () {
      xpect('asd').to.have.property('length', 4);
    }, "expected 'asd' to have a property 'length' of 4, but got 3");

    err(function () {
      xpect('asd').to.not.have.property('length', 3);
    }, "expected 'asd' to not have a property 'length' of 3");

    err(function () {
      xpect('asd').to.not.have.property('foo', 3);
    }, "'asd' has no property 'foo'");

    err(function () {
      xpect({ length: undefined }).to.not.have.property('length', undefined);
    }, "expected { length: undefined } to not have a property 'length'");
  });

  it('should test own.property(name)', function () {
    xpect('test').to.have.own.property('length');
    xpect({ length: 12 }).to.have.own.property('length');

    err(function () {
      xpect({ length: 12 }).to.not.have.own.property('length');
    }, "expected { length: 12 } to not have own property 'length'");
  });

  it('should test string()', function () {
    xpect('foobar').to.contain('bar');
    xpect('foobar').to.contain('foo');
    xpect('foobar').to.include.string('foo');
    xpect('foobar').to.not.contain('baz');
    xpect('foobar').to.not.include.string('baz');

    err(function () {
      xpect(3).to.contain('baz');
    }, "expected 3 to contain 'baz'");

    err(function () {
      xpect('foobar').to.contain('baz');
    }, "expected 'foobar' to contain 'baz'");

    err(function () {
      xpect('foobar').to.not.contain('bar');
    }, "expected 'foobar' to not contain 'bar'");
  });

  it('should test contain()', function () {
    xpect(['foo', 'bar']).to.contain('foo');
    xpect(['foo', 'bar']).to.contain('foo');
    xpect(['foo', 'bar']).to.contain('bar');
    xpect([1,2]).to.contain(1);
    xpect(['foo', 'bar']).to.not.contain('baz');
    xpect(['foo', 'bar']).to.not.contain(1);

    err(function () {
      xpect(['foo']).to.contain('bar');
    }, "expected [ 'foo' ] to contain 'bar'");

    err(function () {
      xpect(['bar', 'foo']).to.not.contain('foo');
    }, "expected [ 'bar', 'foo' ] to not contain 'foo'");
  });

  it('should test keys(array)', function () {
    xpect({ foo: 1 }).to.have.keys(['foo']);
    xpect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar']);
    xpect({ foo: 1, bar: 2 }).to.have.keys('foo', 'bar');
    xpect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('foo', 'bar');
    xpect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('bar', 'foo');
    xpect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('baz');

    xpect({ foo: 1, bar: 2 }).to.include.keys('foo');
    xpect({ foo: 1, bar: 2 }).to.include.keys('bar', 'foo');
    xpect({ foo: 1, bar: 2 }).to.include.keys(['foo']);
    xpect({ foo: 1, bar: 2 }).to.include.keys(['bar']);
    xpect({ foo: 1, bar: 2 }).to.include.keys(['bar', 'foo']);

    xpect({ foo: 1, bar: 2 }).to.not.have.keys('baz');
    xpect({ foo: 1, bar: 2 }).to.not.have.keys('foo', 'baz');
    xpect({ foo: 1, bar: 2 }).to.not.include.keys('baz');
    xpect({ foo: 1, bar: 2 }).to.not.include.keys('foo', 'baz');
    xpect({ foo: 1, bar: 2 }).to.not.include.keys('baz', 'foo');

    err(function () {
      xpect({ foo: 1 }).to.have.keys();
    }, "keys required");

    err(function () {
      xpect({ foo: 1 }).to.have.keys([]);
    }, "keys required");

    err(function () {
      xpect({ foo: 1 }).to.not.have.keys([]);
    }, "keys required");

    err(function () {
      xpect({ foo: 1 }).to.include.keys([]);
    }, "keys required");

    err(function () {
      xpect({ foo: 1 }).to.have.keys(['bar']);
    }, "expected { foo: 1 } to include key 'bar'");

    err(function () {
      xpect({ foo: 1 }).to.have.keys(['bar', 'baz']);
    }, "expected { foo: 1 } to include keys 'bar', and 'baz'");

    err(function () {
      xpect({ foo: 1 }).to.have.keys(['foo', 'bar', 'baz']);
    }, "expected { foo: 1 } to include keys 'foo', 'bar', and 'baz'");

    err(function () {
      xpect({ foo: 1 }).to.not.have.keys(['foo']);
    }, "expected { foo: 1 } to not include key 'foo'");

    err(function () {
      xpect({ foo: 1 }).to.not.have.keys(['foo']);
    }, "expected { foo: 1 } to not include key 'foo'");

    err(function () {
      xpect({ foo: 1, bar: 2 }).to.not.have.keys(['foo', 'bar']);
    }, "expected { foo: 1, bar: 2 } to not include keys 'foo', and 'bar'");

    err(function () {
      xpect({ foo: 1 }).to.not.include.keys(['foo']);
    }, "expected { foo: 1 } to not include key 'foo'");

    err(function () {
      xpect({ foo: 1 }).to.include.keys('foo', 'bar');
    }, "expected { foo: 1 } to include keys 'foo', and 'bar'");

    // only
    xpect({ foo: 1, bar: 1 }).to.only.have.keys('foo', 'bar');
    xpect({ foo: 1, bar: 1 }).to.only.have.keys(['foo', 'bar']);

    err(function () {
      xpect({ a: 'b', c: 'd' }).to.only.have.keys('a', 'b', 'c');
    }, "expected { a: 'b', c: 'd' } to only have keys 'a', 'b', and 'c'");

    err(function () {
      xpect({ a: 'b', c: 'd' }).to.only.have.keys('a');
    }, "expected { a: 'b', c: 'd' } to only have key 'a'");
  });

  it('should allow chaining with `and`', function () {
    xpect(5).to.be.a('number').and.be(5);
    xpect(5).to.be.a('number').and.not.be(6);
    xpect(5).to.be.a('number').and.not.be(6).and.not.be('5');

    err(function () {
      xpect(5).to.be.a('number').and.not.be(5);
    }, "expected 5 to not equal 5");

    err(function () {
      xpect(5).to.be.a('number').and.not.be(6).and.not.be.above(4);
    }, "expected 5 to be below 4");
  });

  it('should fail with `fail`', function () {
    err(function () {
        xpect().fail();
    }, "explicit failure");
  });

  it('should fail with `fail` and custom message', function () {
    err(function () {
        xpect().fail("explicit failure with message");
    }, "explicit failure with message");
  });

});
