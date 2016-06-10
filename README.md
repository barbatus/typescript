## TypeScript Compiler for Meteor

Adds TypeScript compiler to Meteor apps.
> Discussion about the TypeScript compiler for Meteor happens here https://github.com/Urigo/angular2-meteor/issues/102.
> This package might become official, let's make it the best all together!

TypeScript files are compiled (or transpiled) into ECMAScript 5 and CommonJS modules by default.

Default compiler options as JSON:
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

> "Default" means that these options are preset internally, so you don't need to specify them in the `tsconfig`. You may want though to add `tsconfig` to fix your IDE's TypeScript plugin.

## Typings

There are three major types of typings you may encouter developing a Meteor app in TypeScript.

One of them is typings that come from NPM packages. These typings are read and applied by the compiler automatically, so you don't need to worry about them at all. Angular 2's NPM is a good example of such NPMs.

Another type is typings for any third-party library you've decided to use, for example, Moment.js. Recommended way to search and install such typings is to use [`typings`](https://github.com/typings/typings) tool, which is de-facto a major tool to manage typings today.

Last type is typings directly related to Meteor itself, to any of its associated NPMs, or to any Atmosphere package.
This type of typings is supposed to be installed with the help of the `typings` tool as well, but with one nuance to mention.
There is a special Github organization supposed to contain all Meteor-related typings in separate repos.
Please, check out https://github.com/meteor-typings and https://github.com/meteor-typings/meteor.

### Installation

To install Meteor declaration files, you'll need to run in the terminal as follows:
````
npm install typings -g

typings install registry:env/meteor --ambient
````

For more information, please read README at https://github.com/meteor-typings/meteor.

### Typings Processing

This package's TypeScript compiler doesn't make difference between declaration and regular TypeScript file processesing them all together. It, though, recognizes architectures of the files it processes, which means if you place a declaration file in the server folder, its typings will be read and applied for the server architecture only.

You'll find that `typings` folder contains two subfolders: `main` and `browser`. It corresponds to the typings structure supported by the `typings`. TypeScript compiler will use typings from `main` for the server side only, and accordingly - from `browser` for the client side.

## Example

As an example, check out a simple TODO app built with Angular2 and TypeScript,
https://github.com/Urigo/angular2-meteor/tree/master/examples/todos-meteor-1.3

## Package Structure

This package uses (directly or indirectly) tree other packages, which are worth to mention:

[typescript-compiler](https://github.com/barbatus/typescript-compiler) - exports a Meteor TypeScript compiler that implements Meteor compiler API. TypeScript compiler in its turn uses [meteor-typescript](https://github.com/barbatus/meteor-typescript) package’s API
to compile TypeScript source code incrementally on file changes.

[meteor-typescript](https://github.com/barbatus/meteor-typescript) - an NPM package that exports an incremental TypeScript build class.
That class is designed to be used in the series of subsequent compilations of TypeScript source code. In that case, TypeScript Service API, which is used internally, allows to reuse compilation statistics and data between subsequent builds, thus, improving speed of the compilation.

[typescript-runtime](https://github.com/barbatus/typescript-runtime) - currently contains TypeScript helpers,
which allow to configure behavior of some parts of the compiled TypeScript code for special use cases. One of the use cases is usage with the old browsers.
