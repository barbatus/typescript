Package.describe({
  name: 'barbatus:typescript',
  version: '0.6.2_2',
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
  api.use('barbatus:typescript-compiler@0.9.2_1');

  api.imply('modules@0.7.6_1');

  api.imply('barbatus:typescript-runtime@1.0.0');
});

Package.onTest(function(api) {
  api.use('tinytest@1.0.12');
  api.use('barbatus:typescript');

  api.addFiles('tests/runtime-tests.ts', 'client');
  api.addFiles('tests/runtime-react-tests.tsx', 'client');
});
