#!/usr/bin/env node
// 获取一下命令行参数，argv是一个数组
// 数组第一个参数是node.exe固定的，第二个参数是当前文件路径也是固定的
// 之后用户的参数都跟在后面
// console.log(process.argv)
// 往命令行参数中push，
process.argv.push('--cwd')
// 当前命令行所在目录
process.argv.push(process.cwd())
// 还要push gulpfile的路径
process.argv.push('--gulpfile')
// 找的是lib目录下的index.js
// require是载入这个模块，resolve是找到这个模块对应的路径，参数是相对路径
// 相对目录就是../lib/index
// 这里直接写..就可以，因为..找的是csf-gulp-build根目录，里面会自动找package.json里面的main属性下的lib/index.js文件
process.argv.push(require.resolve('..'))

// 直接载入gulp.js去执行gulp-cli
require('gulp/bin/gulp')