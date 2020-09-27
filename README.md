# csf-gulp-build

> If you have multiple projects that use the gulp plugins, this plugin can help you build multiple automated build projects
>
> It can compile ES6, less and sass, compile templates, compress images and SVG, and compress JS, CSS and HTML code


## install
```bash
$ cnpm install csf-gulp-build
# I wish you can install with cnpm,because gulp-imagemin cannot use with npm install
$ npm install csf-gulp-build
```

## Usage
1. You need `pages.config.js` to set some config
```js
//pages.config.js
module.exports = {
  // build config. It can be ignored ~
  build: {
    // Input directory
    src: 'src',
    // Output directory
    dist: 'release',
    // Temporary directory
    temp: '.tmp',
    // Public directory
    public: 'public',
    // Files path
    paths: {
      styles: 'assets/styles/*.scss',
      lessStyles: 'assets/styles/*.less',
      scripts: 'assets/scripts/*.js',
      pages: '**/*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  },
  develop: {
    // Server port：default 3000
    port: '2080'
  }
  data: {
    // Any variable you can write~
  }
}
```
2. The command line terminal supports the following commands

```bash
# you can clean Output directory and Temporary directory
csf-gulp-build clean
# You can do it in a production environment
csf-gulp-build build
# You can do it in a development environment
csf-gulp-build serve
```



