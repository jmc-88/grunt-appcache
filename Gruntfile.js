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

        nodeunit: {
            tests: ['test/*_test.js'],
        },
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean', 'appcache', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
