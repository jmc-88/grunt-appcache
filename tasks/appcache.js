/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var path = require('path');
    var appcache = require('./lib/appcache').init(grunt);

    function identity(input) {
        return input;
    }

    function isAbsolutePath(path) {
        return (/^(?:https?:)?\/\//i).test(path);
    }

    function expand(input) {
        var list = [];
        input.forEach(function (pattern) {
            if(isAbsolutePath(pattern)) {
                list.push(pattern);
            }
            else {
                list.push.apply(list, grunt.file.expand(pattern).filter(function (filepath) {
                    return grunt.file.exists(filepath) && grunt.file.isFile(filepath);
                }));
            }
        });
        return list;
    }

    function filter(input, action) {
        if (!Array.isArray(input)) {
            input = [input];
        }
        return action(input);
    }

    grunt.registerMultiTask('appcache', 'Automatically generates an HTML5 AppCache manifest from a list of files.', function () {
        var options = this.options({
            basePath: process.cwd(),
            ignoreManifest: true,
            preferOnline: false
        });

        options.basePath = path.normalize(options.basePath);

        var ignored = [];
        if (this.data.ignored) {
            ignored = filter(this.data.ignored, expand).map(function (filepath) {
                return path.normalize(filepath);
            });
        }

        if (options.ignoreManifest) {
            ignored.push(path.normalize(this.data.dest));
        }

        var manifest = {
            version: {
                revision: 1,
                date: new Date()
            },
            cache: filter(this.data.cache, expand).filter(function (filepath) {
                return (-1 === ignored.indexOf(path.normalize(filepath)));
            }).map(function (filepath) {
                if (isAbsolutePath(filepath)) {
                    return filepath;
                }
                return path.relative(options.basePath, path.normalize(filepath));
            }),
            network: filter(this.data.network || [], identity),
            fallback: filter(this.data.fallback || [], identity)
        };

        if (grunt.file.exists(this.data.dest)) {
            var original = appcache.readManifest(this.data.dest);
            manifest.version.revision = (1 + original.version.revision);
        }

        if (!appcache.writeManifest(this.data.dest, manifest)) {
            grunt.log.error('AppCache manifest creation failed.');
            return false;
        }

        grunt.log.writeln('AppCache manifest "' + this.data.dest + '" created.');
    });

};
