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

    function array(input) {
        return Array.isArray(input) ? input : [input];
    }

    function isUrl(path) {
        return (/^(?:https?:)?\/\//i).test(path);
    }

    function joinUrl(/* ... */) {
        return Array.prototype.map.call(arguments, function (part) {
            // remove trailing slashes
            return part.replace(/\/+$/, '');
        }).join('/');
    }

    function relative(basePath, filePath) {
        return path.relative(
                path.normalize(basePath),
                path.normalize(filePath));
    }

    function expand(pattern, basePath) {
        var matches = grunt.file.expand({
            filter: function (src) {
                return grunt.file.isFile(src) || isUrl(src);
            }
        }, pattern);
        if (typeof basePath === 'string') {
            matches = matches.map(function (filePath) {
                return relative(basePath, filePath);
            });
        }
        return matches;
    }

    grunt.registerMultiTask('appcache', 'Automatically generates an HTML5 AppCache manifest from a list of files.', function () {
        var output = path.normalize(this.data.dest);
        var options = this.options({
            basePath: process.cwd(),
            ignoreManifest: true,
            preferOnline: false
        });

        var ignored = [];
        if (this.data.ignored) {
            ignored = expand(this.data.ignored, options.basePath);
        }
        if (options.ignoreManifest) {
            ignored.push(relative(options.basePath, output));
        }

        var cachePatterns = array(this.data.cache || []);
        if (typeof this.data.cache === 'object') {
            this.data.cache.patterns = array(this.data.cache.patterns || []);
            this.data.cache.literals = array(this.data.cache.literals || []);
            cachePatterns = this.data.cache.patterns;
        }
        var cache = expand(cachePatterns, options.basePath).filter(function (path) {
            return ignored.indexOf(path) === -1;
        });
        if (typeof options.baseUrl === 'string') {
            cache = cache.map(function (path) {
                return joinUrl(options.baseUrl, path);
            });
        }
        if (typeof this.data.cache === 'object') {
            Array.prototype.push.apply(cache, this.data.cache.literals);
        }

        var manifest = {
            version: {
                revision: 1,
                date: new Date()
            },
            cache: cache,
            network: array(this.data.network || []),
            fallback: array(this.data.fallback || []),
            settings: options.preferOnline ? ['prefer-online'] : []
        };

        if (grunt.file.exists(output)) {
            var original = appcache.readManifest(output);
            manifest.version.revision = (1 + original.version.revision);
        }

        if (!appcache.writeManifest(output, manifest)) {
            grunt.log.error('AppCache manifest creation failed.');
            return false;
        }

        grunt.log.writeln('AppCache manifest "' +
                path.basename(output) +
                '" created.');
    });

};
