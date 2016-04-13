var React = {
  createElement(elName, props) {
    return { elName, props };
  }
}

Tinytest.add('typescript - runtime - react', (test) => {
  {
    let props = {
      style: { display: 'block' }
    };
    class Component {
      render() {
        return <div {...props} />;
      }
    }

    let element = { elName: 'div', props };
    test.equal((new Component()).render(), element);
  }
});
