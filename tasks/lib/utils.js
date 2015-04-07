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

  exports.array = function (input) {
    if (arguments.length == 1 && Array.isArray(input)) {
      return input;
    }
    return Array.apply(undefined, arguments);
  };

  exports.isUrl = function (path) {
    return (/^(?:https?:)?\/\//i).test(path);
  };

  exports.joinUrl = function ( /* ... */ ) {
    return Array.prototype.map.call(arguments, function (part) {
      // remove trailing slashes
      return part.replace(/\/+$/, '');
    }).join('/');
  };

  exports.relative = function (basePath, filePath) {
    return path.relative(
      path.normalize(basePath),
      path.normalize(filePath));
  };

  exports.expand = function (patterns, basePath) {
    var urls = [];
    var globs = [];

    exports.array(patterns).forEach(function (pattern) {
      if (exports.isUrl(pattern)) {
        urls.push(pattern);
      } else {
        globs.push(pattern);
      }
    });

    var matches = grunt.file.expand({
      filter: function (src) {
        return grunt.file.isFile(src);
      }
    }, globs);

    if (typeof basePath === 'string') {
      matches = matches.map(function (filePath) {
        return exports.relative(basePath, filePath);
      });
    }

    return matches.concat(urls);
  };

  exports.uniq = function (array) {
    return array.filter(function (value, index) {
      return array.indexOf(value) === index;
    });
  };

  return exports;
};
