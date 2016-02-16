Package.describe({
  name: 'typescript',
  version: '0.1.0',
  summary: 'TypeScript for Meteor',
  git: 'https://github.com/barbatus/typescript',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'typescript',
  use: ['typescript-compiler'],
  sources: ['plugin.js']
});

Package.onUse(function(api) {
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('typescript-compiler');

  api.addFiles(['typescript-helpers.js']);

  api.export(['__extends', '__decorate', '__metadata', '__param', '__awaiter']);

  api.imply('promise');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('typescript');

  api.addFiles('runtime-tests.ts');
});
