# grunt-appcache [![Build Status](https://travis-ci.org/jmc-88/grunt-appcache.svg?branch=master)](https://travis-ci.org/jmc-88/grunt-appcache)

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

#### options.preferOnline
Type: `Boolean`
Default value: `false`

Specifies whether to write the "prefer-online" entry in the "SETTINGS:" section or not. [More information](http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#appcache).  

### Target fields

#### dest

`String` indicating the output path for the AppCache manifest. Mandatory. 

#### baseUrl
Type: `String`
Default value: `undefined`

The base URL to prepend to all expanded cache entries. In case of a Bower module, you can set this to `/bower_components/mywebcomponent`.

#### includes
Type: `Grunt globbing pattern`
Default value: `undefined`
[globbing pattern spec](http://gruntjs.com/configuring-tasks#globbing-patterns)

The purposes is to merge all manifest files that match the globbing pattern into this generated
manifest appcache. The contents of each matching files' sections are merged together, and subsequently added to the final `cache`, `network` and `fallback` target fields. It is very useful when 
you create you own Bower component with this Grunt Task or when you use a third party
component that include their appcache manifest. See Bower usage examples below.

#### cache

A descriptor for the "CACHE:" entries. A cache descriptor can be either :

Type: `Grunt globbing pattern` 
Default value: `[]`
[globbing pattern spec](http://gruntjs.com/configuring-tasks#globbing-patterns)

Alternatively, this argument can be an `Object`.

Type: `Object`
Default Value: `{ patterns: [], literals: [], pageslinks: []}` 

* Containing the optional properties `patterns` (a cache descriptor, as defined earlier).

* `literals` : `String` or `Array` of `String`s to insert as is in the "CACHE:" section.

* `pageslinks` a `Grunt globbing pattern` to defined all the pages to parse to extract `href` attribute
of any kind of `link` tags and to extract `src` attribut of any `script` tag.
This extraction will be added in the cache section. 

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

### Usage Examples with Bower

Real web applications are made by lots of pieces, which you can conveniently handle with Bower.
Here you can find some examples to make so that `grunt-appcache` generates an AppCache manifest
even when your application is split into Bower components.

```js
grunt.initConfig({
  appcache: {
    options: {
        // appcache is always for the distrib version not for development
        basePath: 'dist', 
    },
    // this target is only for components
    mod: {
        // it will go to bower_components from the point of view the web app
        baseUrl: '/bower_components/<%= package.name %>',
        // generate a partial appcache into the distrib folder
        dest: 'dist/manifest.appcache',
        cache: {
            patterns: [
                // add all css, js and assets of my components
                'dist/**/*',
                // but not informational files
                '!dist/bower.json',
                '!dist/CHANGELOG.md',
                '!dist/README.md'
            ],
        },
        network: '*'
        // here you can add also fallback directives specific to it
    },
    // this target is only for application
    app: {
        // we are now in the root of the web app
        baseUrl: '/',
        // appcache is always for the distrib version not for development
        dest: 'dist/manifest.appcache',
        // parse all partials manifest files into bower_components
        includes: 'dist/bower_components/**/*.appcache',
        cache: {
            patterns: [
                // add all css, js and assets of my application
                'dist/**/*',
                // but not files from third party components
                '!dist/bower_components/**',
                // and not informational files
                '!dist/bower.json',
                '!dist/CHANGELOG.md',
                '!dist/README.md'
            ],
            // don't forget to cache the root
            literals: '/',
            // and finish to add components which haven't a partial appcache
            pageslinks: 'dist/index.html'
        },
        network: '*',
        fallback: '/ /offline.html'
    }
  }
})
```

To generate a partial appcache manifest, launch `grunt appcache:mod`. It will generate :

```
CACHE MANIFEST
# rev 1 - 2014-12-09T10:20:50.833Z

CACHE:
/bower_components/mymodule/images/checkerboard.png
/bower_components/mymodule/mymodule.css
/bower_components/mymodule/mymodule.js

NETWORK:
*
```

To generate a full appcache manifest, launch `grunt appcache:app`. It will generate :

```
CACHE MANIFEST
# rev 1 - 2014-12-10T07:27:17.969Z

CACHE:
/bower_components/mymodule/images/checkerboard.png
/bower_components/mymodule/mymodule.css
/bower_components/mymodule/mymodule.js
/images/icons/favicon.png
/bower_components/angular/angular-csp.css
/styles/myapp.css
/bower_components/jquery/jquery.js
/bower_components/angular/angular.js
/scripts/myapp.js
/
/images/myapplogo.png
/index.html
/robots.txt

NETWORK:
*

FALLBACK:
/ /offline.html
```

