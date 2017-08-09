## TypeScript Compiler for Meteor

TypeScript files are compiled into ES5 and CommonJS modules by default.

> Based on TypeScript@2.4.0

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

Install Meteor typings by `npm i @types/meteor`.

### Custom Typings

Typings files are processed in the same way as regular ts-files. 
If you place a declaration file into server folder it will be used only for the server code only.

Note that any change to a global declaration file will cause diagnostics re-evaluation.
Hence, if you change some custom declaration file often, makes sence to reference it in some main ts-file
and exclude in the config, i.e.:
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

Thanks @urigo (Uri) for his support and resources to continue 
development of this project.

## License
MIT
