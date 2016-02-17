'use strict';
// HelloWorldServer with modules, to run: meteor run --release METEOR@1.3-modules-beta.7

function sayHello (param: number) {
  console.log(param);
}

export class HelloWorldServer {
  constructor(public name: string = 'World') {}

  toString() {
    return `Hello ${this.name}`;
  }
}

console.log(new HelloWorldServer('Server World').toString());
sayHello('string instead of number');
