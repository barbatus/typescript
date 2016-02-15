Plugin.registerCompiler({
  extensions: ['ts'],
  filename: ['tsconfig.json']
}, function () {
  return new TypeScriptCompiler({
    // We define own helpers.
    noEmitHelpers: true
  });
});
