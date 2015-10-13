Package.describe({
  name: 'barbatus:typescript',
  version: '0.1.2_1',
  summary: 'TypeScript Package for Meteor',
  git: 'https://github.com/barbatus/angular2/packages/typescript',
  documentation: 'README.md'
});

Npm.depends({
  'typescript': '1.6.2'
});

var server = 'server';

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'ecmascript@0.1.4',
    'check@1.0.5',
    'underscore@1.0.4'
  ], server);

  api.addFiles([
    'typescript.js'
  ], server);

  api.export(['TypeScript'], server);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:typescript');
});
