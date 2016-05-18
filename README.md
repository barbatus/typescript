## TypeScript Compiler for Meteor

Adds TypeScript compiler to Meteor projects.
> Discussion about TypeScript compiler for Meteor happens here https://github.com/Urigo/angular2-meteor/issues/102.
> This package might become official, let's make it the best all together!

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

> Please note, "default" means that you don't need to specify them in the tsconfig. Though, you may want to do that to fix your IDE's TypeScript plugin.

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

## Example

As an example, you could check out a simple ToDo app built with Angular2 and TypeScript,
https://github.com/Urigo/angular2-meteor/tree/master/examples/todos-meteor-1.3

## Package Structure

This package uses (directly or indirectly) tree other packages, which are worth to mention:

[typescript-compiler](https://github.com/barbatus/typescript-compiler) - exports a Meteor TypeScript compiler that implements Meteor compiler API. TypeScript compiler in its turn uses [meteor-typescript](https://github.com/barbatus/meteor-typescript) package’s API
to compile TypeScript source code incrementally on file changes.

[meteor-typescript](https://github.com/barbatus/meteor-typescript) - an NPM package that exports an incremental TypeScript build class.
That class is designed to be used in the series of subsequent compilations of TypeScript source code. In that case, TypeScript Service API, which is used internally, allows to reuse compilation statistics and data between subsequent builds, thus, improving speed of the compilation.

[typescript-runtime](https://github.com/barbatus/typescript-runtime) - currently contains TypeScript helpers,
which allow to configure behavior of some parts of the compiled TypeScript code for special use cases. One of the use cases is usage with the old browsers.
