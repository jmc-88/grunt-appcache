/*
 * grunt-appcache
 *
 * Licensed under the MIT license.
 */

/* eslint-disable no-invalid-this */
'use strict';

module.exports = function(grunt) {
  const path = require('path');
  const cheerio = require('cheerio');
  const utils = require('./lib/utils').init(grunt);
  const appcache = require('./lib/appcache').init(grunt);

  const taskDescription =
    'Automatically generates an HTML5 AppCache manifest from a list of files.';

  grunt.registerMultiTask('appcache', taskDescription, function() {
    const self = this;
    const output = path.normalize(this.data.dest);
    const options = this.options({
      basePath: process.cwd(),
      ignoreManifest: true,
      preferOnline: false,
    });

    let ignored = [];
    if (this.data.ignored) {
      ignored = utils.expand(this.data.ignored, options.basePath);
    }
    if (options.ignoreManifest) {
      ignored.push(utils.relative(options.basePath, output));
    }

    let cachePatterns = utils.array(this.data.cache || []);
    if (typeof this.data.cache === 'object') {
      this.data.cache.patterns = utils.array(this.data.cache.patterns || []);
      this.data.cache.literals = utils.array(this.data.cache.literals || []);
      this.data.cache.pageslinks = utils.array(
          this.data.cache.pageslinks || []);
      cachePatterns = this.data.cache.patterns;
    }

    const fallback = utils.array(this.data.fallback || []);
    const network = utils.array(this.data.network || []);
    const cache = [];

    if (this.data.includes) {
      // first parse appcache files to include it
      utils.expand(this.data.includes, options.basePath)
          .map(function(path) {
            return options.basePath ?
            utils.joinUrl(options.basePath, path) :
            path;
          })
          .forEach(function(filename) {
            const manifest = appcache.readManifest(filename);
            Array.prototype.push.apply(cache, manifest.cache);
            Array.prototype.push.apply(network, manifest.network);
            Array.prototype.push.apply(fallback, manifest.fallback);
          });
    }

    if (typeof this.data.cache === 'object') {
      // seconds add link to the cache
      utils.expand(this.data.cache.pageslinks).forEach(function(filename) {
        const content = grunt.file.read(filename);
        const $ = cheerio.load(content);
        // parse links
        $('link[href]').each(function() {
          const href = $(this).attr('href');
          if (href.indexOf('data:') !== 0) {
            cache.push(href);
          }
        });

        // parse scripts
        $('script[src]').each(function() {
          const src = $(this).attr('src');
          if (src.indexOf('data:') !== 0) {
            cache.push(src);
          }
        });
      });

      // third add literals to the cache
      Array.prototype.push.apply(cache, this.data.cache.literals);
    }

    // then add patterns to the cache
    Array.prototype.push.apply(cache,
        utils.expand(cachePatterns, options.basePath)
            .filter(function(path) {
              return ignored.indexOf(path) === -1;
            })
            .map(function(path) {
              return self.data.baseUrl ?
          utils.joinUrl(self.data.baseUrl, path) :
          path;
            })
    );

    const manifest = {
      version: {
        revision: 1,
        date: new Date(),
      },
      cache: utils.uniq(cache),
      network: utils.uniq(network),
      fallback: utils.uniq(fallback),
      settings: options.preferOnline ? ['prefer-online'] : [],
    };

    if (grunt.file.exists(output)) {
      const original = appcache.readManifest(output);
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
