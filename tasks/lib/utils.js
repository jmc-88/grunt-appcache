/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

module.exports.init = function(grunt) {
  const path = require('path');
  const exports = {};

  exports.array = function(...args) {
    if (args.length == 1 && Array.isArray(args[0])) {
      return args[0];
    }
    return Array(...args);
  };

  exports.isUrl = function(path) {
    return (/^(?:https?:)?\/\//i).test(path);
  };

  exports.joinUrl = function(...args) {
    return Array.prototype.map.call(args, function(part) {
      // remove trailing slashes
      return part.replace(/\/+$/, '');
    }).join('/');
  };

  exports.relative = function(basePath, filePath) {
    return path.relative(
        path.normalize(basePath),
        path.normalize(filePath));
  };

  exports.expand = function(patterns, basePath) {
    const urls = [];
    const globs = [];

    exports.array(patterns).forEach(function(pattern) {
      if (exports.isUrl(pattern)) {
        urls.push(pattern);
      } else {
        globs.push(pattern);
      }
    });

    let matches = grunt.file.expand({
      filter: function(src) {
        return grunt.file.isFile(src);
      },
    }, globs);

    if (typeof basePath === 'string') {
      matches = matches.map(function(filePath) {
        return exports.relative(basePath, filePath);
      });
    }

    return matches.concat(urls);
  };

  exports.uniq = function(array) {
    return array.filter(function(value, index) {
      return array.indexOf(value) === index;
    });
  };

  return exports;
};
