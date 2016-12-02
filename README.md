## TypeScript Compiler for Meteor

TypeScript files are compiled into ES5 and CommonJS modules by default.

> Based on TypeScript@2.0.10

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

There are several sources of typings you'll need to know about when developing a Meteor app with TypeScript:
* Typings from NPM packages:
  * More and more NPM packages come today with typings along with the source code files.
    TypeScript finds main declaration file using `typings` field in the package.json and applies it automatically,
    so users are free of worry about typings at all in this case.
  * Special NPM packages that contain only typings.
    Since 2.0.0 TypeScript supports referencing NPM packages directly in ts-files.
    For example, `/// <reference types="@types/jquery" />` reference will apply jQuery typings from `@types/jquery` NPM package if it
    exists. `@types` is a special NPM scope supported by the TypeScript authors which contains typings from
    [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) in NPM packages.
    It's possible though to install any NPM package with typings using `reference`.
* Typings installed and managed by [`typings`](https://github.com/typings/typings) utility.
   It's de-facto a major tool to manage typings today. Besides features to
   search and install typings from DefinitelyTyped, it has own typings repository supported by the community.
   So makes sense to give it at a try if you want to search typings easily as well as install them not only from
   DefinitelyTyped but from GitHub repos and other sources.
* Typings related to Meteor itself (NPMs and Atmosphere packages).
   You can find most typings available for Meteor [here](https://github.com/meteor-typings).
   Some of them are already published as NPM packages, which means they can be installed 
   as described above. If not, you can always install them with help of `typings` utility.
   For more info, please read [here](https://github.com/meteor-typings/meteor).
* Custom typings: user d.ts-files that contain custom declarations.

### Installation

To install Meteor declaration files, you'll need to run in the terminal as follows:
````
npm install typings -g

typings install env~meteor --global
````

Or install `meteor-typings` NPM and add
```ts
/// <reference types="meteor-typings" />
```
at the top of the main ts-file (that runs first).

For more information, please read README at https://github.com/meteor-typings/meteor.

### Typings Processing

Typings files are processed in the same way as regular ts-files. 
It means that if you place a declaration file into, for example, server folder
it will be used only for the server code only.

Besides that, this package recognizes two subfolder of the `typings` folder:
`typigns/main` and `typings/browser`. Files from the former will be used for the server
code, and from the latter -- for the browser code accordingly.
This is especially useful if you use `typings` utility to manage typings,
which supports typings separation for the client and server code
(but only for packages from the own repo).

> Please note that any change to global typings will cause diagnostics re-evaluation (though it's less heavy than re-compilation) of the whole project,
> including the case when types references (see above) added or removed from ts-files.

If you change some custom declaration file often, it makes sence to reference it locally in ts-files where used
but exlude it globally in the config:
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
https://github.com/Urigo/angular-meteor/tree/master/examples/todos-meteor-1.3

## Package Structure

This package uses (directly or indirectly) three other packages, which are worth to mention:

[typescript-compiler](https://github.com/barbatus/typescript-compiler) - exports a Meteor TypeScript compiler that implements Meteor compiler API. TypeScript compiler in its turn uses [meteor-typescript](https://github.com/barbatus/meteor-typescript) package’s API
to compile TypeScript source code incrementally on file changes.

[meteor-typescript](https://github.com/barbatus/meteor-typescript) - an NPM package that exports an incremental TypeScript build class.
That class is designed to be used in the series of subsequent compilations of TypeScript source code. In that case, TypeScript Service API, which is used internally, allows to reuse compilation statistics and data between subsequent builds, thus, improving speed of the compilation.

[typescript-runtime](https://github.com/barbatus/typescript-runtime) - currently contains TypeScript helpers,
which allow to configure behavior of some parts of the compiled TypeScript code for special use cases. One of the use cases is usage with the old browsers.
