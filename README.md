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

#### options.ignoreManifest
Type: `Boolean`
Default value: `true`

Specifies if to ignore the cache manifest itself from the list of files to insert in the "CACHE:" section.

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
