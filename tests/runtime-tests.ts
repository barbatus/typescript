Tinytest.addAsync('typescript - runtime - async', (test, onComplete) => {
  {
    async function service() { return 1; }

    service().then(result => {
      test.equal(result, 1);
      onComplete();
    });
  }
});

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
