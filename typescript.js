'use strict';

var ts = Npm.require('typescript');

class DiagnosticMessage {
  constructor(filePath, message, line, column) {
    this.filePath = filePath;
    this.message = message;
    this.line = line;
    this.column = column;
  }

  get formattedMsg() {
    return `${this.filePath} (${this.line}, ${this.column}): ${this.message}`;
  }
}

class CompilerDiagnostics {
  constructor(
      syntactic: DiagnosticMessage[],
      semantic: DiagnosticMessage[]
    ) {
    this.syntactic = syntactic;
    this.semantic = semantic;
  }

  logSyntactic() {
    this.syntactic.forEach(diagnostic => {
      console.log(diagnostic.formattedMsg);
    });
  }

  logSemantic() {
    this.semantic.forEach(diagnostic => {
      console.log(diagnostic.formattedMsg);
    });
  }
}

function assert(expression: Boolean, message?: String) {
  if (!expression) {
    message = message || '[TypeScript]: assert failure';
    throw new Error(message);
  }
}

// Normalizes file reference path to be relative to the root app path:
// 1) resolves every ../ in the front of the path
// 2) resolves every other ../
function normalizeRef(refPath, filePath) {
  let refDir = ts.getDirectoryPath(ts.normalizeSlashes(refPath));
  let fileDir = ts.getDirectoryPath(ts.normalizeSlashes(filePath));

  let refParts = refDir.split('/');
  let fileParts = fileDir.split('/').reverse();

  let count = 0;
  // Resolve every front ../
  for (let part of refParts) {
    if (part !== '..' && part !== '.') {
      break;
    }
    if (part === '..') {
      fileParts.pop();
    }
    count++;
  }

  let resultPath = fileParts.reverse().concat(refParts.slice(count));
  resultPath.push(ts.getBaseFileName(refPath));

  // Resolve every other ../
  return ts.normalizePath(resultPath.join('/'));
}

TypeScript = class TypeScript {

  // Transpiles Meteor plugin's file objects.
  // To avoid holding compilation results in the memory,
  // it executes a callback with the results on each file compiled.
  //
  // TODO: add exact type for the onFileReadyCallback.
  // @param {Function} onFileReadyCallback
  //    Callback to be called with the result of file compilation.
  static transpileFiles(files, options, onFileReadyCallback: Function) {

    assert(Match.test(options.filePath, Function),
      '[TypeScript.transpileFiles]: options.filePath should be a function');

    assert(Match.test(options.moduleName, Match.Optional(Function)),
      '[TypeScript.transpileFiles]: options.moduleName should be a function');

    TypeScript._transpileFiles(files, options, onFileReadyCallback);
  }

  static transpile(fileContent, options) {

    assert(Match.test(options.filePath, String),
      '[TypeScript.transpile]: options.filePath should be a string');

    return TypeScript._transpile(fileContent, options);
  }

  static getCompilerOptions(customOptions) {
    let compilerOptions = ts.getDefaultCompilerOptions();

    _.extend(compilerOptions, customOptions);

    // Support decorators by default.
    compilerOptions.experimentalDecorators = true;

    // Always emit imports for unresolved files.
    compilerOptions.isolatedModules = true;

    // Declaration files are expected to
    // be generated separately.
    compilerOptions.declaration = false;

    // Overrides watching,
    // it is handled by Meteor itself.
    compilerOptions.watch = false;

    // We use source maps via Meteor file API,
    // This class's API provides source maps
    // separately but alongside compilation results.
    // Hence, skip generating inline source maps.
    compilerOptions.inlineSourceMap = false;
    compilerOptions.inlineSources = false;

    // Always emit.
    compilerOptions.noEmit = false;
    compilerOptions.noEmitOnError = false;

    // Don't generate any files, hence,
    // skip setting outDir and outFile.
    compilerOptions.outDir = null;
    compilerOptions.outFile = null;

    // This is not need as well.
    // API doesn't have paramless methods.
    compilerOptions.rootDir = null;
    compilerOptions.sourceRoot = null;

    return compilerOptions;
  }
  
  // 1) Normalizes slashes in the file path
  // 2) Removes file extension
  static normalizePath(filePath) {
    var resultName = filePath;
    if (ts.fileExtensionIs(resultName, '.map')) {
      resultName = resultName.replace('.map', '');
    }
    return ts.removeFileExtension(
      ts.normalizeSlashes(resultName));
  }

  static isDeclarationFile(filePath) {
    return filePath.match(/^.*\.d\.ts$/);
  }

  static _transpileFiles(files, options, onFileReadyCallback) {
    let compilerOptions = TypeScript.getCompilerOptions(options);

    let defaultHost = ts.createCompilerHost(compilerOptions);

    let fileMap = ts.createFileMap(TypeScript.normalizePath);
    files.forEach(file => 
      fileMap.set(options.filePath(file), file));

    let fileResultMap = ts.createFileMap(TypeScript.normalizePath);

    let customHost = {
      getSourceFile: (fileName, target) => {
        let sourceFile = defaultHost.getSourceFile(fileName, target);
        let file = fileMap.get(fileName);
        if (!file) return  sourceFile;

        sourceFile.moduleName = options.moduleName &&
          options.moduleName(file);
        return sourceFile;
      }
    };

    let compilerHost = _.extend({}, defaultHost, customHost);
    let fileNames = files.map(file => options.filePath(file));
    let program = ts.createProgram(fileNames, compilerOptions, compilerHost);

    // Emit
    program.emit(undefined, (fileName, outputText, writeByteOrderMark) => {
      let file = fileMap.get(fileName);
      if (!file) return;

      let fileResult = fileResultMap.get(fileName) || {};

      if (ts.fileExtensionIs(fileName, '.map')) {
        // Gets source map path as a module name
        // in order to keep package prefix for
        // files from a package.
        let sourceMapPath = options.moduleName ?
          options.moduleName(file) : options.filePath(file);
        let sourceMap = TypeScript._prepareSourceMap(
          outputText, file.getContentsAsString(), sourceMapPath);
        fileResult.sourceMapPath = sourceMapPath;
        fileResult.sourceMap = sourceMap;
      } else {
        fileResult.path = fileName;
        fileResult.data = outputText;
      }

      let isFileReady = fileResult.data &&
        (!compilerOptions.sourceMap || fileResult.sourceMap);

      if (isFileReady) {
        fileResultMap.remove(fileName);
        let diagnostics = TypeScript._readDiagnostics(program,
          options.filePath(file));

        let referencedPaths = [];
        if (!compilerOptions.noResolve) {
          // Source files are already processed,
          // each one is retreived from the internal map here.
          let sourceFile = customHost.getSourceFile(fileName);
          let referencedPaths = !compilerOptions.noResolve ?
            TypeScript._getReferencedPaths(sourceFile): [];
        }

        onFileReadyCallback(file, referencedPaths, diagnostics, fileResult);
        return;
      }

      fileResultMap.set(fileName, fileResult);
    });
  }

  static _transpile(fileContent, options) {
    let compilerOptions = TypeScript.getCompilerOptions(options);

    let sourceFile = ts.createSourceFile(options.filePath,
      fileContent, compilerOptions.target);
    if (options.moduleName) {
      sourceFile.moduleName = options.moduleName;
    }

    let defaultHost = ts.createCompilerHost(compilerOptions);

    let customHost = {
      getSourceFile: (fileName, target) => {
        // We already have content of the target file,
        // skip reading it again.
        if (fileName === ts.normalizeSlashes(options.filePath)) {
          return sourceFile;
        }
        return defaultHost.getSourceFile(fileName, target);
      }
    };

    let compilerHost = _.extend({}, defaultHost, customHost);
    let program = ts.createProgram([options.filePath],
      compilerOptions, compilerHost);

    let data, sourceMap;
    program.emit(sourceFile, (fileName, outputText, writeByteOrderMark) => {
      if (TypeScript.normalizePath(fileName) !==
          TypeScript.normalizePath(options.filePath)) return;

      if (ts.fileExtensionIs(fileName, '.map')) {
        let sourceMapPath = options.moduleName ?
          options.moduleName : options.filePath;
        sourceMap = TypeScript._prepareSourceMap(
          outputText, fileContent, sourceMapPath);
      } else {
        data = outputText;
      }
    });

    let referencedPaths = !compilerOptions.noResolve ?
      TypeScript._getReferencedPaths(sourceFile): [];

    let diagnostics = this._readDiagnostics(program, options.filePath);

    return { data, sourceMap, referencedPaths, diagnostics };
  }

  static _prepareSourceMap(sourceMapContent, fileContent, sourceMapPath) {
    let sourceMapJson = JSON.parse(sourceMapContent);
    sourceMapJson.sourcesContent = [fileContent];
    sourceMapJson.sources = [sourceMapPath];
    return sourceMapJson;
  }

  static _getReferencedPaths(sourceFile) {
    let referencedPaths = [];

    // Get resolved modules.
    if (sourceFile.resolvedModules) {
      for (let moduleName in sourceFile.resolvedModules) {
        let module = sourceFile.resolvedModules[moduleName];
        if (module && module.resolvedFileName) {
          referencedPaths.push(module.resolvedFileName);
        }
      }
    }

    // Get declaration file references.
    if (sourceFile.referencedFiles) {
      let refFiles = sourceFile.referencedFiles.map((ref) => {
        return ref.fileName;
      });
      for (let path of refFiles) {
        referencedPaths.push(normalizeRef(path, sourceFile.fileName));
      }
    }
    return referencedPaths;
  }

  // TODO: try slitting semantic diagnostics into realted to unresolved modules
  // and all other remaining.
  static _readDiagnostics(program, filePath: String): CompilerDiagnostics {
    let sourceFile;
    if (filePath) {
      sourceFile = program.getSourceFile(filePath);
    }

    let syntactic = TypeScript._flattenDiagnostics(
      program.getSyntacticDiagnostics(sourceFile));
    let semantic =  TypeScript._flattenDiagnostics(
      program.getSemanticDiagnostics(sourceFile));
    let diagnostics = new CompilerDiagnostics(syntactic, semantic);

    return diagnostics;
  }

  static _flattenDiagnostics(tsDiagnostics: Array<ts.Diagnostic>) {
    let diagnostics: DiagnosticMessage[] = [];

    tsDiagnostics.forEach((diagnostic) => {
      if (!diagnostic.file) return;

      let pos = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      let line = pos.line + 1;
      let column = pos.character + 1;

      diagnostics.push(
        new DiagnosticMessage(diagnostic.file.fileName, message, line, column));
    });

    return diagnostics;
  }
}
