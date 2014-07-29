# grunt-appcache

> Grunt task for generating an HTML5 AppCache manifest from the specified list of files.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appcache --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appcache');
```

## The "appcache" task

### Overview
In your project's Gruntfile, add a section named `appcache` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  appcache: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.basePath
Type: `String`
Default value: `process.cwd()`

The absolute or relative path to the directory to consider as the root of the application for which to generate the cache manifest.

#### options.baseUrl
Type: `String`
Default value: `undefined`

The base URL to prepand to all expanded cache entries.

#### options.ignoreManifest
Type: `Boolean`
Default value: `true`

Specifies if to ignore the cache manifest itself from the list of files to insert in the "CACHE:" section.

#### options.preferOnline
Type: `Boolean`
Default value: `false`

Specifies whether to write the "prefer-online" entry in the "SETTINGS:" section or not. [More information](http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#appcache).  

### Target fields

#### dest

`String` indicating the output path for the AppCache manifest.

#### cache

A descriptor for the "CACHE:" entries. A cache descriptor can be either a `String` or an `Array` of `String`s, in the format accepted by the `patterns` argument to [grunt.file.expand](http://gruntjs.com/api/grunt.file#grunt.file.expand).
Alternatively, this argument can be an `Object` containing the optional properties `patterns` (a cache descriptor, as defined earlier) and `literals` (`String` or `Array` of `String`s to insert as is in the "CACHE:" section).

#### ignored

Files to be ignored and excluded from the "CACHE:" entries. This parameter has been deprecated since v0.1.4, when proper support for the `!` prefix to the glob patterns was added (this serves the same purpose while being more concise).

#### network

`String` or `Array` of `String`s to insert as is in the "NETWORK:" section.

#### fallback

`String` or `Array` of `String`s to insert as is in the "FALLBACK:" section.

### Usage Examples

In this example, the module is set to generate an AppCache manifest from the contents of the `static` directory, placing the resulting manifest in `static/manifest.appcache`. The `basePath` option allows the module to generate paths relative to the `static` directory, instead of the directory where the gruntfile resides.

```js
grunt.initConfig({
  appcache: {
    options: {
      basePath: 'static'
    },
    all: {
      dest: 'static/manifest.appcache',
      cache: 'static/**/*',
      network: '*',
      fallback: '/ /offline.html'
    }
  }
})
```

The next example uses the extended syntax to the `cache` parameter:

```js
grunt.initConfig({
  appcache: {
    options: {
      basePath: 'static'
    },
    all: {
      dest: 'static/manifest.appcache',
      cache: {
        patterns: [
          'static/**/*',         // all the resources in 'static/'
          '!static/ignored/**/*' // except the 'static/ignored/' subtree
        ],
        literals: '/'            // insert '/' as is in the "CACHE:" section
      }
    }
  }
})
```
