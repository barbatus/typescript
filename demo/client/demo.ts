'use strict';

// HelloWorld with modules, to run:
// npm install
// meteor run --release METEOR@1.3-modules-beta.7

import {Injectable} from "angular2/core";

import {api} from 'lib';

export class HelloWorld {
  constructor(public name: string = 'World') {}

  toString() {
    return `Hello ${this.name}`;
  }

  foo() {
    api.log();
  }
}

console.log(new HelloWorld().toString());
