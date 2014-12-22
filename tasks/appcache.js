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
    var cheerio = require('cheerio');
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

    function uniq(array) {
        return array.filter(function (value, index) {
            return array.indexOf(value) === index;
        });
    }

    grunt.registerMultiTask('appcache', 'Automatically generates an HTML5 AppCache manifest from a list of files.', function () {
        var self = this;
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
            this.data.cache.pageslinks = array(this.data.cache.pageslinks || []);
            cachePatterns = this.data.cache.patterns;
        }

        var fallback = array(this.data.fallback || []);
        var network = array(this.data.network || []);
        var cache = [];

        if (this.data.includes) {
            // first parse appcache files to include it
            expand(this.data.includes, options.basePath)
            .map(function (path) {
                return options.basePath ? joinUrl(options.basePath, path) : path;
            })
            .forEach(function(filename) {
                var manifest = appcache.readManifest(filename);
                Array.prototype.push.apply(cache, manifest.cache);
                Array.prototype.push.apply(network, manifest.network);
                Array.prototype.push.apply(fallback, manifest.fallback);
            });
        }

        if (typeof this.data.cache === 'object') {
            // seconds add link to the cache
            expand(this.data.cache.pageslinks).forEach(function(filename) {
                var content = grunt.file.read(filename);
                var $ = cheerio.load(content); 
                // parse links
                $('link[href]').each(function() {
                    var href = $(this).attr('href');
                    if(href.indexOf('data:') !== 0) {
                        cache.push(href);
                    }
                });

                // parse scripts
                $('script[src]').each(function() {
                    var src = $(this).attr('src');
                    if(src.indexOf('data:') !== 0) {
                        cache.push(src);                     
                    }
                });
            });

            // third add literals to the cache
            Array.prototype.push.apply(cache, this.data.cache.literals);
        }

        // then add patterns to the cache
        Array.prototype.push.apply(cache,
            expand(cachePatterns, options.basePath)
            .filter(function (path) {
                return ignored.indexOf(path) === -1;
            })
            .map(function (path) {
                return self.data.baseUrl ? joinUrl(self.data.baseUrl, path) : path;
            })
        );

        var manifest = {
            version: {
                revision: 1,
                date: new Date()
            },
            cache: uniq(cache),
            network: uniq(network),
            fallback: uniq(fallback),
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
