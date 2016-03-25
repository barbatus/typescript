Plugin.registerCompiler({
  extensions: ['ts', 'tsx'],
  filenames: ['tsconfig.json']
}, function () {
  return new TypeScriptCompiler({
    target: "ES5",
    // We define own helpers.
    noEmitHelpers: true,
    jsx: 'react'
  });
});
