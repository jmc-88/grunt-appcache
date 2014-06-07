'use strict';

var grunt = require('grunt');
var appcache = require('../tasks/lib/appcache').init(grunt);

/*
   ======== A Handy Little Nodeunit Reference ========
   https://github.com/caolan/nodeunit

   Test methods:
   test.expect(numAssertions)
   test.done()
   Test assertions:
   test.ok(value, [message])
   test.equal(actual, expected, [message])
   test.notEqual(actual, expected, [message])
   test.deepEqual(actual, expected, [message])
   test.notDeepEqual(actual, expected, [message])
   test.strictEqual(actual, expected, [message])
   test.notStrictEqual(actual, expected, [message])
   test.throws(block, [error], [message])
   test.doesNotThrow(block, [error], [message])
   test.ifError(value)
   */

exports.appcache = {
    setUp: function (done) {
        // setup here if necessary
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
