Package.describe({
  name: 'barbatus:typescript',
  version: '0.7.0',
  summary: 'TypeScript for Meteor',
  git: 'https://github.com/barbatus/typescript',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'typescript',
  use: ['barbatus:typescript-compiler'],
  sources: ['plugin.js']
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1');

  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('barbatus:typescript-compiler@0.10.0');

  api.imply('modules@0.11.6');

  api.imply('barbatus:typescript-runtime@1.1.0');
});

Package.onTest(function(api) {
  api.use('tinytest@1.0.12');
  api.use('barbatus:typescript');

  api.addFiles('tests/runtime-tests.ts', 'client');
  api.addFiles('tests/runtime-react-tests.tsx', 'client');
});
