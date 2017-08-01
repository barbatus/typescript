## TypeScript Compiler for Meteor

TypeScript files are compiled into ES5 and CommonJS modules by default.

> Based on TypeScript@2.4.2

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

Since Meteor 1.4, which is based on Node.js v4.x, it's possible to use ES6 on the server
(limited to the subset of ES6 supported by v4.x).

If you want to compile into ES6 on the server, put a `tsconfig.json` into the server folder:
```json
{
  "compilerOptions": {
    "target": "ES6"
  }
}
```

## Path mappings

TypeScript paths mapping is supported since `0.6.0`, though,
with some limitations. It works only for local files and for `module: commonjs`.

You can now use paths like `imports/client/foo` instead of Meteor rooted
paths like `/imports/client/foo` if you add to the `config.json` as follows:
```json
  "baseUrl": ".",
  "paths": {
    "*": ["*"]
  }
```

## Typings

There are several sources of typings you'll need to know about when developing a Meteor app with TypeScript:
* Typings from NPM packages:
  * More and more NPM packages come today with typings along with the source code files.
    TypeScript finds main declaration file using `typings` field in the package.json and applies it automatically,
    so users are free of worry about typings at all in this case.
  * Special NPM packages that contain only typings.
    Since 2.1.x there is a way to add NPMs with typings to the project globally.
    Use `types` option of `tsconfig.json` and set a list of NPMs you want to use there (see Installation below).
* Typings installed and managed by [`typings`](https://github.com/typings/typings) utility.
   It's de-facto a major tool to manage typings today. Besides features to
   search and install typings from DefinitelyTyped, it has own typings repository supported by the community.
   So makes sense to give it at a try if you want to search typings easily as well as install them not only from
   DefinitelyTyped but from GitHub repos and other sources.
* Typings related to Meteor itself (NPMs and Atmosphere packages).
   You can find most typings available for Meteor [here](https://github.com/meteor-typings).
   Some of them are already published as NPM packages, which means they can be installed and used
   as described above. If not, you can always install them with help of `typings` utility.
   For more info, please read [here](https://github.com/meteor-typings/meteor).
* Custom typings: user d.ts-files that contain custom declarations.

### Installation

To install Meteor declaration files, install `meteor-typings` NPM and
change `tsconfig.json` as follows:
```json
{
  "compilerOptions": {
    "types": ["meteor-typings"]
  }
}
```

This way you can install typings globally from various NPMs.
For example, there is a special NPM scope called `@types` supported by the TypeScript authors,
which currently contains NPM repos with all typings from
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) repo.

Rule of thumb: use `typings` utility to seach typings in DefinitelyTyped repo and install them as NPMs from
`@types` scope.

For more information about Meteor typings, please read README at https://github.com/meteor-typings/meteor.

### Typings Processing

Typings files are processed in the same way as regular ts-files. 
It means that if you place a declaration file into, for example, server folder
it will be used only for the server code only.

> Please note that any change to global typings will cause diagnostics re-evaluation (though it's less heavy than re-compilation) of the whole project,
> including the case when references (see below) added or removed from ts-files.

If you change some custom declaration file often, it makes sence to reference it in some main ts-file
but exclude in the config:
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

## Credits

Thanks @urigo (Uri) for his constant support and resources to continue 
development of this project.

## License
MIT
