Plugin.registerCompiler({
  extensions: ['ts', 'tsx'],
  filenames: ['tsconfig.json']
}, function () {
  return new TypeScriptCompiler({
    // We define own helpers.
    noEmitHelpers: true,
    jsx: 'react'
  });
});
