'use strict';

// HelloWorld with modules, to run: meteor run --release METEOR@1.3-modules-beta.7

export class HelloWorld {
  constructor(public name: string = 'World') {}

  toString() {
    return `Hello ${this.name}`;
  }
}

console.log(new HelloWorld().toString());
