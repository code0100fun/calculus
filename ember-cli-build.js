/*jshint node:true*/
/* global require, module */
var existsSync = require('exists-sync');
var merge = require('broccoli-merge-trees');
var transpileES6 = require('emberjs-build/lib/utils/transpile-es6');
var stew = require('broccoli-stew');
var concat = require('broccoli-concat');
var find = stew.find;

function transpile(tree, label) {
  return transpileES6(tree, label, { avoidDefine: false, sourceMaps: 'inline' });
}

module.exports = function() {
  var packages = __dirname + '/node_modules';
  var bower = __dirname + '/bower_components';
  var hasBower = existsSync(bower);

  var libTree = find('lib', {
    include: ['**/*.js']
  });

  libTree = transpile(libTree, 'calculus');

  libTree = concat(libTree, {
    inputFiles: ['**/*.js'],
    outputFile: '/amd/calculus.amd.js',
    sourceMapConfig: {
      enabled: true,
      cache: null,
      sourceRoot: '/'
    }
  });

  var testHarnessTrees = [
      find(__dirname + '/tests', {
      srcDir: '/',
      files: [ 'index.html' ],
      destDir: '/tests'
    })
  ];

  if (hasBower) {
    testHarnessTrees.push(find(bower, {
      srcDir: '/qunit/qunit',
      destDir: '/tests'
    }));
  }

  var testHarness = merge(testHarnessTrees);
  var tests = find('tests', { include: ['**/*-test.js', 'helpers/**/*.js'] });
  tests = transpile(tests, 'tests');
  tests = concat(tests, {
    inputFiles: ['**/*.js'],
    outputFile: '/amd/calculus-tests.amd.js',
    sourceMapConfig: {
      enabled: true,
      cache: null,
      sourceRoot: '/'
    }
  });

  var finalTrees = [
    libTree,
    testHarness,
    tests
  ];

  if (hasBower) {
    var loader = find(bower, {
      srcDir: '/loader.js',
      files: [ 'loader.js' ],
      destDir: '/assets'
    });

    finalTrees.push(loader);
  }

  return merge(finalTrees);
};
