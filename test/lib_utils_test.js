/*
 * grunt-appcache
 * http://canvace.com/
 *
 * Copyright (c) 2013 Canvace Srl
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var utils = require('../tasks/lib/utils').init(grunt);

exports.libUtils = {
    setUp: function (done) {
        done();
    },

    array: function (test) {
        test.expect(3);
        test.deepEqual(utils.array([]), [],
                       'should not change the input');
        test.deepEqual(utils.array({}), [{}],
                       'should return an array containing an object');
        test.deepEqual(utils.array(1, 2, 3), [1, 2, 3],
                       'should convert the arguments to an array');
        test.done();
    },

    isUrl: function (test) {
        test.expect(3);
        test.ok(utils.isUrl('http://google.com'),
                'should accept a valid HTTP URL');
        test.ok(utils.isUrl('https://google.com'),
                'should accept a valid HTTPS URL');
        test.ok(!utils.isUrl('this http://google.com is not a URL'),
                'should reject an invalid URL');
        test.done();
    },

    joinUrl: function (test) {
        test.expect(2);
        test.equal(utils.joinUrl('http://google.com', 'test'),
                   'http://google.com/test',
                   'should correctly concatenate a URL path part');
        test.equal(utils.joinUrl('http://google.com', 'test/'),
                   'http://google.com/test',
                   'should remove trailing slashes');
        test.done();
    },

    relative: function (test) {
        test.expect(3);
        test.equal(utils.relative('/test', '/test/file'), 'file',
                   'should transform the path to be relative');
        test.equal(utils.relative('/test/', '/test/file'), 'file',
                   'should transform the path to be relative');
        test.equal(utils.relative('../test', '../test/file'), 'file',
                   'should transform the path to be relative');
        test.done();
    },

    expand: function (test) {
        test.expect(4);
        test.deepEqual(utils.expand('test/expected/**/*.json'),
                       ['test/expected/read/revision.json'],
                       'should expand glob patterns correctly');
        test.deepEqual(utils.expand(['test/expected/**/*.json']),
                       ['test/expected/read/revision.json'],
                       'should expand glob patterns in arrays correctly');
        test.deepEqual(utils.expand(['test/expected/**/*.json',
                                     'http://google.com']),
                       ['test/expected/read/revision.json',
                        'http://google.com'],
                       'should expand glob patterns, preserving URLs');
        test.deepEqual(utils.expand('test/expected/**/*.json',
                                    'test/expected/read/'),
                       ['revision.json'],
                       'should expand glob patterns to relative paths');
        test.done();
    },

    uniq: function (test) {
        test.expect(2);
        test.deepEqual(utils.uniq([1, 2, 3, 1, 2, 3]), [1, 2, 3],
                       'should remove duplicates');
        test.deepEqual(utils.uniq([1, 'test', 3, 'test']), [1, 'test', 3],
                       'should remove duplicates in a mixed array');
        test.done();
    },
};
