## TypeScript

This package adds TypeScript to Meteor projects.

TypeScript is transpiled into ECMAScript 5 and CommonJS modules by default.

Default TypeScript compiler options that current compiler has:
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

Current compiler sticks to Meteor's isomorphic environment, which means it compiles files architercture-wise, or in other words,
if you put declaration files, for example, in the server folder, they will be applied onto the server side code only.
