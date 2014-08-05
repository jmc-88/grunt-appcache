/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

module.exports.init = function (grunt) {

    var path = require('path');
    var exports = {};

    exports.readManifest = function (filepath) {
        if (!filepath || !grunt.file.exists(filepath)) {
            grunt.verbose.error('file "' + filepath + '" does not exist');
            return false;
        }

        var manifest = {
            version: {
                revision: 1,
                date: new Date().toISOString()
            },
            cache: [],
            network: [],
            fallback: []
        };
        var section = 'cache';
        var foundHeader = false;
        var foundVersion = false;

        var lines = grunt.file.read(filepath)
            .split(/\r?\n/)
            .map(function (line) {
                return line.trim();
            });

        var manifestSections = {
            'CACHE:': 'cache',
            'NETWORK:': 'network',
            'FALLBACK:': 'fallback',
            'SETTINGS': 'settings'
        };

        for (var i = 0; i < lines.length; ++i) {
            if (lines[i] === '') {
                continue;
            }

            if (lines[i][0] === '#') {
                if (!foundVersion) {
                    var re = /# rev (\d+) - (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)/;
                    var matches = re.exec(lines[i]);
                    if (matches) {
                        manifest.version.revision = parseInt(matches[1], 10);
                        manifest.version.date = new Date(matches[2]).toISOString();
                        foundVersion = true;
                    }
                }
                continue;
            }

            if (lines[i] === 'CACHE MANIFEST') {
                if (foundHeader) {
                    grunt.verbose.error('duplicate "CACHE MANIFEST" header');
                    return false;
                }
                foundHeader = true;
            } else if (lines[i] in manifestSections) {
                if (!foundHeader) {
                    grunt.verbose.error('found section "' + lines[i] + '" before the "CACHE MANIFEST" header');
                    return false;
                }
                section = manifestSections[lines[i]];
            } else {
                if (!foundHeader) {
                    grunt.verbose.error('unexpected "' + lines[i] + '" before the "CACHE MANIFEST" header');
                    return false;
                }
                manifest[section].push(lines[i]);
            }
        }

        return manifest;
    };

    exports.writeManifest = function (filepath, manifest) {
        var contents = ['CACHE MANIFEST'];
        var i;

        if (manifest.version.date.toISOString) {
            contents.push('# rev ' + manifest.version.revision + ' - ' + manifest.version.date.toISOString());
        } else {
            contents.push('# rev ' + manifest.version.revision + ' - ' + manifest.version.date);
        }

        if (0 !== manifest.cache.length) {
            contents.push('');
            contents.push('CACHE:');
            for (i = 0; i < manifest.cache.length; ++i) {
                contents.push(manifest.cache[i].split(path.sep).join('/'));
            }
        }

        if (0 !== manifest.network.length) {
            contents.push('');
            contents.push('NETWORK:');
            for (i = 0; i < manifest.network.length; ++i) {
                contents.push(manifest.network[i]);
            }
        }

        if (0 !== manifest.fallback.length) {
            contents.push('');
            contents.push('FALLBACK:');
            for (i = 0; i < manifest.fallback.length; ++i) {
                contents.push(manifest.fallback[i]);
            }
        }

        if (0 !== manifest.settings.length) {
            contents.push('');
            contents.push('SETTINGS:');
            for (i = 0; i < manifest.settings.length; ++i) {
                contents.push(manifest.settings[i]);
            }
        }

        return grunt.file.write(filepath, contents.join('\n'));
    };

    return exports;

};

