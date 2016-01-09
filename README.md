## TypeScript packaged for Meteor.
TypeScript API that is adapted to be used in Meteor packages.

### Getting Started
Install package `meteor add barbatus:typescript` and start using TypeScript right away, e.g.:
````js
    let result = TypeScript.transpile(fileContent, {
        compilerOptions: {module: 'system'},
        typings: ['typings/angular2.d.ts'], // typings that will be compiled together with the given content.
        filePath: some_path, // file path relative to the app root.
        moduleName: some_module // set module name if you want to use ES6 modules.
    })
````
Package's API strives to be close to the Babel package's [one](https://atmospherejs.com/meteor/babel-compiler).

### API
#### TypeScript.transpileFiles(files, options, fileReadyCallback)
**`files`** param is expected to be Meteor's file objects in a compiler plugin.
Method eventually uses only `getContentsAsString()` inside,
access to other file properties can be defined in the **`options`**.

**`options`** should have the following structure:
````js
{
    compilerOptions: Object,
    typings?: Array<String>,
    filePath: file => file.getPathInPackage()
    moduleName: file => getModuleName(file)
}
````
`compilerOptions` TypeScript compiler options. See the next paragraph for detailed description.

`typings` (optional) is expected be an array of declaration file paths. If provided, these files will be compiled together with .ts-files, thus,
eliminating the need to use `/// <reference path='...' />` syntax.

`filePath` field is expected to be a function that gets in a file object and return its file path.
Field is **required**.

`moduleName` (optional) field. If you want to use modules, you set the `module` field of the `compilerOptions` (e.g., `compilerOptions.module = ts.ModuleKind.System`) and define a `moduleName` function that gets in a file and retuns its module name.

**`fileReadyCallback`** — callback that is being executed each time file transpilation is completed.

Callback's params are defined as follows:
````js
    TypeScript.transpileFiles(files, options,
        (file, referencedPaths, diagnostics, resultData) => {

        })
````

`file` — file that has been compiled.

`referencedPaths` — paths of the TypeScript modules and declaration files that current file uses.
Param is useful for Meteor compilers since allows to watch for changes in the file's dependencies and re-compile file when used methods or classes have been changed.

`diagnostics` — an diagnostics object that provides diagnostics of the file transpilation.
Structure of this object is described below.

`resultData` — result of the transpilation:
````js
    {
        path: filePath, // normalized relative path of the transpiled file (no ./, ../ and \ inside)
        data: content, // transpiled content
        sourceMap: sourceMapContent // source map content
    }
```
`sourceMap` is not null only if you set `sourceMap: true` in the `compilerOptions`.

#### TypeScript.transpile(fileContent, options);
Same as `transpileFiles` but only for one file's string content. String content can be taken by file API's method
`file.getContentsAsString()`.

Method returns a result object of the following structure:
````js
    {
        data: content,
        sourceMap: sourceMapContent,
        referencedPaths: filePaths, // file paths of other modules and declaration files
        diagnostics: diagnosticsObject
    }
````

### Compiler Options
Compiler options are pretty much the same as described [here](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options) with few exceptions.

Package restricts usage of options that potentially conflics or not supported by the API.

Namely options that are set to false for time being are `declaration`, `project`, `watch` (file changes watch is expected to done via Meteor plugins), `inlineSourceMap`, `inlineSources`, `outDir`, `outFile`, `rootDir`, `sourceRoot`.

Package also extends usage of some of the options for the API. For example, if you set ``noResolve`` to true `referencedFiles` array will be always empty.

### Diagnostics
As now diagnostics object consists of two properties: syntactic and semantic.

Syntactic is an array of all syntax errors. Semantic is an array of basically all type-cheking erros including unresolved modules errors, missing variables etc.
In the future versions semactic errors are expected to be structured into more parts for convenience.

Diagnostics object has two convenient methods for logging out error details to the terminal, e.g.:
````js
 diagnostics.logSyntactic(); // prints all syntactic errors
 diagnostics.logSemantic(); //  prints all semantics errors
 // Or you can
 diagnostics.semantic.forEach(message => ...);   // iterate semantic messages
 diagnostics.syntactic.forEach(message => ...);   // iterate syntactic messages
````

### Example of Usage
You can check out TS [compilers](https://github.com/barbatus/ts-compilers) package, which is based on the current package.

