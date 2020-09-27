"use strict";

var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest,
    parallel = _require.parallel,
    series = _require.series,
    watch = _require.watch; // 引入清除文件模块


var del = require('del');

var LessAutoprefix = require('less-plugin-autoprefix');

var browserSync = require('browser-sync');

var loadPlugins = require('gulp-load-plugins');

var plugins = loadPlugins();
var bs = browserSync.create();
var autoprefix = new LessAutoprefix({
  browsers: ["last 2 versions"]
}); // cwd方法返回当前命令行所在的工作目录

var cwd = process.cwd(); // 读取pages.config.js文件，防止出错

var config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    "public": 'public',
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
    port: '3000'
  }
};

try {
  // require当前命令行下的package.json文件
  var loadConfig = require("".concat(cwd, "/pages.config.js")); // 如果有传入就和默认的合并


  config = Object.assign({}, config, loadConfig);
} catch (e) {} // 如果没有就执行default config
// 创建清除文件任务


var clean = function clean() {
  return del([config.build.dist, config.build.temp]);
}; // 创建sass任务


var style = function style() {
  // 可以使用字符串拼接的方式
  return src(config.build.src + '/' + config.build.paths.styles, {
    base: config.build.src
  }).pipe(plugins.sass({
    outputStyle: 'expanded'
  })).pipe(dest(config.build.temp)).pipe(bs.reload({
    stream: true
  }));
}; // 创建less任务


var lessStyle = function lessStyle() {
  // cwd是指从哪个目录下开始寻找，和path的路径对应即可
  return src(config.build.paths.lessStyles, {
    base: config.build.src,
    cwd: config.build.src
  }).pipe(plugins.less({
    plugins: [autoprefix]
  })).pipe(dest(config.build.temp)).pipe(bs.reload({
    stream: true
  }));
}; // 创建babel任务


var script = function script() {
  return src(config.build.paths.scripts, {
    base: config.build.src,
    cwd: config.build.src
  }).pipe(plugins.babel({
    presets: [require('@babel/preset-env')]
  })).pipe(dest(config.build.temp)).pipe(bs.reload({
    stream: true
  }));
}; // 创建模板引擎任务


var page = function page() {
  return src(config.build.paths.pages, {
    base: config.build.src,
    cwd: config.build.src
  }).pipe(plugins.swig({
    data: config.data,
    defaults: {
      cache: false
    }
  })).pipe(dest(config.build.temp)).pipe(bs.reload({
    stream: true
  }));
}; // 图片压缩任务


var image = function image() {
  return src(config.build.paths.images, {
    base: config.build.src,
    cwd: config.build.src
  }).pipe(plugins.imagemin()).pipe(dest(config.build.dist));
}; // 图片压缩任务


var font = function font() {
  return src(config.build.paths.fonts, {
    base: config.build.src,
    cwd: config.build.src
  }).pipe(plugins.imagemin()).pipe(dest(config.build.dist));
}; // 将public的任务进行额外输出


var extra = function extra() {
  return src('**', {
    base: config.build["public"],
    cwd: config.build["public"]
  }).pipe(dest(config.build.dist));
}; // 创建服务任务


var serve = function serve() {
  // 这边也可以指定第二个参数cwd
  watch(config.build.paths.styles, {
    cwd: config.build.src
  }, style);
  watch(config.build.paths.lessStyles, {
    cwd: config.build.src
  }, lessStyle);
  watch(config.build.paths.scripts, {
    cwd: config.build.src
  }, script);
  watch(config.build.paths.pages, page);
  watch([config.build.paths.images, config.build.paths.fonts], {
    cwd: config.build.src
  }, bs.reload); // 因为public目录不同，所以单独抽离出来

  watch(['**'], {
    cwd: config.build.src
  }, bs.reload); // 进行初始化

  bs.init({
    notify: false,
    port: config.develop.port,
    server: {
      baseDir: [config.build.temp, config.build.src, config.build["public"]],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
};

var useref = function useref() {
  return src(config.build.paths.pages, {
    base: config.build.temp,
    cwd: config.build.temp
  }) // .指的是项目根目录，不需要修改
  .pipe(plugins.useref({
    searchPath: [config.build.temp, '.']
  })).pipe(plugins["if"](/\.js$/, plugins.uglify())).pipe(plugins["if"](/\.css$/, plugins.cleanCss())).pipe(plugins["if"](/\.html$/, plugins.htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  }))).pipe(dest(config.build.dist));
};

var compile = parallel(style, lessStyle, script, page);
var build = series(clean, parallel(series(compile, useref), image, font, extra));
var develop = series(compile, serve);
module.exports = {
  clean: clean,
  build: build,
  develop: develop
};