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

  function _array(input) {
    if (arguments.length == 1 && Array.isArray(input)) {
      return input;
    }
    return Array.apply(undefined, arguments);
  }
  exports.array = _array;

  function _isUrl(path) {
    return (/^(?:https?:)?\/\//i).test(path);
  }
  exports.isUrl = _isUrl;

  function _joinUrl( /* ... */ ) {
    return Array.prototype.map.call(arguments, function (part) {
      // remove trailing slashes
      return part.replace(/\/+$/, '');
    }).join('/');
  }
  exports.joinUrl = _joinUrl;

  function _relative(basePath, filePath) {
    return path.relative(
      path.normalize(basePath),
      path.normalize(filePath));
  }
  exports.relative = _relative;

  function _expand(patterns, basePath) {
    var urls = [];
    var globs = [];

    _array(patterns).forEach(function (pattern) {
      if (_isUrl(pattern)) {
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
        return _relative(basePath, filePath);
      });
    }

    return matches.concat(urls);
  }
  exports.expand = _expand;

  function _uniq(array) {
    return array.filter(function (value, index) {
      return array.indexOf(value) === index;
    });
  }
  exports.uniq = _uniq;

  return exports;
};
