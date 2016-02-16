var React = {
  createElement(elName) {
    return elName;
  }
}

Tinytest.add('typescript - runtime - react', (test) => {
  {
    class Component {
      render() {
        return <div />;
      }
    }

    test.equal((new Component()).render(), 'div');
  }
});
