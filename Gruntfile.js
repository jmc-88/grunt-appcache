/*
 * grunt-appcache
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/**/*.js',
        '<%= nodeunit.tests %>',
        '!node_modules/**/*.js',
      ],
    },

    clean: {
      tests: ['tmp'],
    },

    appcache: {
      options: {
        basePath: 'test',
      },
      test: {
        dest: 'tmp/appcache.manifest',
        cache: 'test/**/*',
      },
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('build', ['clean', 'appcache']);
  grunt.registerTask('test', ['eslint', 'nodeunit']);
  grunt.registerTask('verify', ['build', 'test']);
  grunt.registerTask('default', ['build', 'test']);
};
