/*
 * grunt-appcache
 *
 * Licensed under the MIT license.
 */

'use strict';

const grunt = require('grunt');
const utils = require('../tasks/lib/utils').init(grunt);

exports.libUtils = {
  setUp: (done) => done(),

  array: (test) => {
    test.expect(3);
    test.deepEqual(utils.array([]), [],
        'should not change the input');
    test.deepEqual(utils.array({}), [{}],
        'should return an array containing an object');
    test.deepEqual(utils.array(1, 2, 3), [1, 2, 3],
        'should convert the arguments to an array');
    test.done();
  },

  isUrl: (test) => {
    test.expect(3);
    test.ok(utils.isUrl('http://google.com'),
        'should accept a valid HTTP URL');
    test.ok(utils.isUrl('https://google.com'),
        'should accept a valid HTTPS URL');
    test.ok(!utils.isUrl('this http://google.com is not a URL'),
        'should reject an invalid URL');
    test.done();
  },

  joinUrl: (test) => {
    test.expect(2);
    test.equal(utils.joinUrl('http://google.com', 'test'),
        'http://google.com/test',
        'should correctly concatenate a URL path part');
    test.equal(utils.joinUrl('http://google.com', 'test/'),
        'http://google.com/test',
        'should remove trailing slashes');
    test.done();
  },

  relative: (test) => {
    test.expect(3);
    test.equal(utils.relative('/test', '/test/file'), 'file',
        'should transform the path to be relative');
    test.equal(utils.relative('/test/', '/test/file'), 'file',
        'should transform the path to be relative');
    test.equal(utils.relative('../test', '../test/file'), 'file',
        'should transform the path to be relative');
    test.done();
  },

  expand: (test) => {
    test.expect(4);
    test.deepEqual(
        utils.expand('test/expected/**/*.json'),
        ['test/expected/read/revision.json'],
        'should expand glob patterns correctly');
    test.deepEqual(
        utils.expand(['test/expected/**/*.json']),
        ['test/expected/read/revision.json'],
        'should expand glob patterns in arrays correctly');
    test.deepEqual(
        utils.expand(['test/expected/**/*.json', 'http://google.com']),
        ['test/expected/read/revision.json', 'http://google.com'],
        'should expand glob patterns, preserving URLs');
    test.deepEqual(
        utils.expand('test/expected/**/*.json', 'test/expected/read/'),
        ['revision.json'],
        'should expand glob patterns to relative paths');
    test.done();
  },

  uniq: (test) => {
    test.expect(2);
    test.deepEqual(utils.uniq([1, 2, 3, 1, 2, 3]), [1, 2, 3],
        'should remove duplicates');
    test.deepEqual(utils.uniq([1, 'test', 3, 'test']), [1, 'test', 3],
        'should remove duplicates in a mixed array');
    test.done();
  },
};
