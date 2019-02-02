/*
 * grunt-appcache
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports.init = function(grunt) {
  const path = require('path');
  const exports = {};

  const manifestSections = {
    'CACHE:': 'cache',
    'NETWORK:': 'network',
    'FALLBACK:': 'fallback',
    'SETTINGS': 'settings',
  };

  exports.parseVersionLine = function(line) {
    const re =
      /# rev (\d+) - (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)/;
    const matches = re.exec(line);
    if (matches) {
      return {
        revision: parseInt(matches[1], 10),
        date: new Date(matches[2]).toISOString(),
      };
    }
  };

  exports.readManifest = function(filepath) {
    if (!filepath || !grunt.file.exists(filepath)) {
      grunt.verbose.error('file "' + filepath + '" does not exist');
      return false;
    }

    const manifest = {
      version: {
        revision: 1,
        date: new Date().toISOString(),
      },
      cache: [],
      network: [],
      fallback: [],
    };
    let section = 'cache';
    let foundHeader = false;
    let foundVersion = false;

    const lines = grunt.file.read(filepath)
        .split(/\r?\n/)
        .map(function(line) {
          return line.trim();
        });

    for (let i = 0; i < lines.length; ++i) {
      if (lines[i] === '') {
        continue;
      }

      if (lines[i][0] === '#') {
        if (!foundVersion) {
          const version = exports.parseVersionLine(lines[i]);
          if (version) {
            manifest.version = version;
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
          grunt.verbose.error(
              `found section "${lines[i]}" before the "CACHE MANIFEST" header`);
          return false;
        }
        section = manifestSections[lines[i]];
      } else {
        if (!foundHeader) {
          grunt.verbose.error(`unexpected "${lines[i]}" before the `+
            `"CACHE MANIFEST" header`);
          return false;
        }
        manifest[section].push(lines[i]);
      }
    }

    return manifest;
  };

  exports.writeManifest = function(filepath, manifest) {
    const contents = ['CACHE MANIFEST'];
    let i;

    const ver = manifest.version;
    if (ver.date.toISOString) {
      contents.push(`# rev ${ver.revision} - ${ver.date.toISOString()}`);
    } else {
      contents.push(`# rev ${ver.revision} - ${ver.date}`);
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
