## TypeScript Compiler for Meteor

Adds TypeScript compiler to Meteor projects.
> Discussion about TypeScript compiler for Meteor happens here https://github.com/Urigo/angular2-meteor/issues/102.
> This package might become the official TypeScript package, let's make it the best all together!

TypeScript is transpiled into ECMAScript 5 and CommonJS modules by default.

All together default TypeScript compiler options of this compiler looks like:
````json
{
  "module": "commonjs",
  "target": "es5",
  "moduleResolution": "node",
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "sourceMap": true
}
````

## Typings

Recommended way to install typigns is to use [`typings`](https://github.com/typings/typings) tool.

For example, to install Meteor declaration files, you'll need to run commands as follows:
````
npm install typings -g

typings install meteor --ambient
````

Current compiler doesn't make difference between declaration and regular TypeScript files and processes them all.
Also it sticks to the Meteor isomorphic environment, which means it compiles files architercture-wise.

In other words, if you put declaration files, for example, in the server folder, they will be used for the server side code only.
