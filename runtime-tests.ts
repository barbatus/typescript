Tinytest.add('typescript - runtime - decorators', (test) => {
  {
    function classDecorator() {
      return function(cls) {
        cls.prototype.foo = 'foo';
      };
    }

    @classDecorator()
    class Foo {}

    test.equal((new Foo()).foo, 'foo');
  }
});
