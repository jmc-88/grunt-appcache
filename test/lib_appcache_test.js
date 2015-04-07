/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var appcache = require('../tasks/lib/appcache').init(grunt);

exports.appcache = {
    setUp: function (done) {
        done();
    },

    read: {
        revisionNumber: function (test) {
            test.expect(1);

            var actual = appcache.readManifest('test/fixtures/read/revision.manifest');
            var expected = grunt.file.readJSON('test/expected/read/revision.json');
            test.deepEqual(actual, expected, 'should correctly parse the manifest and save its revision number.');

            test.done();
        }
    }
};
