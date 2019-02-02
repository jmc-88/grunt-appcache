/*
 * grunt-appcache
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports.init = function(grunt) {
  const path = require('path');
  const exports = {};

  exports.array = (...args) => {
    if (args.length == 1 && Array.isArray(args[0])) {
      return args[0];
    }
    return Array(...args);
  };

  exports.isUrl = (path) => (/^(?:https?:)?\/\//i).test(path);

  exports.joinUrl = (...args) =>
    args.map((part) => part.replace(/\/+$/, '')).join('/');

  exports.relative = (basePath, filePath) =>
    path.relative(path.normalize(basePath), path.normalize(filePath));

  exports.expand = (patterns, basePath) => {
    const urls = [];
    const globs = [];

    exports.array(patterns).forEach((pattern) => {
      if (exports.isUrl(pattern)) {
        urls.push(pattern);
      } else {
        globs.push(pattern);
      }
    });

    let matches = grunt.file.expand({
      filter: (src) => grunt.file.isFile(src),
    }, globs);

    if (typeof basePath === 'string') {
      matches = matches.map((filePath) => exports.relative(basePath, filePath));
    }

    return matches.concat(urls);
  };

  exports.uniq = (array) =>
    array.filter((value, index) => array.indexOf(value) === index);

  return exports;
};
