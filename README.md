## TypeScript Compiler for Meteor

TypeScript files are compiled into ES5 and CommonJS modules by default.

> Based on TypeScript@2.0.0 since 0.4.0

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
## ES6

Since Meteor 1.4, which is based on Node.js v4.0, it's possible to use ES6 on the server.

If you want to compile into ES6 on the server, put a `tsconfig.json` into the server folder:
```json
{
  "compilerOptions": {
    "target": "ES6"
  }
}
```

## Typings

There are three major types of typings you may encouter developing a Meteor app in TypeScript:
- Typings from NPM packages. These typings are read and applied by the compiler automatically, so you don't need to worry about them at
  all. Angular 2's NPM is a good example of such NPMs;
- Typings for any third-party library that's not installed as NPM, for example, jQuery. Recommended way to search and install such typings is to use [`typings`](https://github.com/typings/typings) tool, which is de-facto a major tool to manage typings today.
- Typings directly related to Meteor itself (which might be any of associated NPMs or a Atmosphere package);
  This type of typings is supposed to be installed with the help of the `typings` tool as well, but not all of them are available in the global registry. So for more information on how to search and install them, please, check out https://github.com/meteor-typings and https://github.com/meteor-typings/meteor;
- Custom typings.

### Installation

To install Meteor declaration files, you'll need to run in the terminal as follows:
````
npm install typings -g

typings install env~meteor --global
````

For more information, please read README at https://github.com/meteor-typings/meteor.

### Typings Processing

This package compilers declaration and regular TypeScript files all together meaning that each file is processed according to its architecture. So placing a declaration file in the server folder, for example, make it counted only for the server.

Since each NPM package can contain parts as for the client (browser) as well as for the server (main), this package recognizes two subfolders, `main` and `browser`, in the `typings` folder to follow that structure. So files from the `main` will be compiled for the server, and from the `browser` - for the client accordingly.

In order to install typings resources aligned with that structure, you'll need to
add the following resolution to the `typings.json`:

```json
"resolution": {
  "main": "typings/main",
  "browser": "typings/browser"
}
```

Please note that any change to a global declaration file will cause re-compilation of the whole project.
If you change some custom declaration file often, it makes sence to include it locally where used and exlude in the config:
```ts
 /// <reference path="typings/foo.d.ts" />
```
```json
{
  "exclude": ["typings/foo.d.ts"]
}
```

## Example

As an example, check out a simple TODO app built with Angular2 and TypeScript,
https://github.com/Urigo/angular2-meteor/tree/master/examples/todos-meteor-1.3

## Package Structure

This package uses (directly or indirectly) three other packages, which are worth to mention:

[typescript-compiler](https://github.com/barbatus/typescript-compiler) - exports a Meteor TypeScript compiler that implements Meteor compiler API. TypeScript compiler in its turn uses [meteor-typescript](https://github.com/barbatus/meteor-typescript) package’s API
to compile TypeScript source code incrementally on file changes.

[meteor-typescript](https://github.com/barbatus/meteor-typescript) - an NPM package that exports an incremental TypeScript build class.
That class is designed to be used in the series of subsequent compilations of TypeScript source code. In that case, TypeScript Service API, which is used internally, allows to reuse compilation statistics and data between subsequent builds, thus, improving speed of the compilation.

[typescript-runtime](https://github.com/barbatus/typescript-runtime) - currently contains TypeScript helpers,
which allow to configure behavior of some parts of the compiled TypeScript code for special use cases. One of the use cases is usage with the old browsers.
