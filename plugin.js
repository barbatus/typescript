Plugin.registerCompiler({
  extensions: ['ts', 'tsx'],
  filename: ['tsconfig.json']
}, function () {
  return new TypeScriptCompiler({
    // We define own helpers.
    noEmitHelpers: true,
    jsx: 'react'
  });
});
