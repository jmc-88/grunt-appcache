/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    clean: {
      tests: ['tmp'],
    },

    appcache: {
      options: {
        basePath: 'test'
      },
      test: {
        dest: 'tmp/appcache.manifest',
        cache: 'test/**/*'
      }
    },

    jsbeautifier: {
      modify: {
        src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js'],
    },
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('build', ['clean', 'appcache']);
  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('verify', ['build', 'jsbeautifier:verify', 'test']);
  grunt.registerTask('default', ['build', 'jsbeautifier:modify', 'test']);

};
