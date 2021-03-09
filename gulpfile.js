const gulp = require("gulp");
const babel = require('gulp-babel');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

function javascript(callback) {
  return gulp.src("./src/javascript/*.js")
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(gulp.dest("./dist"));
}

function stylesheet(callback) {
    return gulp.src('./src/sass/**/*.scss')
               .pipe(sass().on('error', sass.logError))
               .pipe(gulp.dest('./dist/stylesheet'));
}

function copy(callback) {
  return gulp.src(["./src/manifest.json", "./src/popup.html"])
             .pipe(gulp.dest("./dist"));
}

exports.default = gulp.parallel(javascript, stylesheet, copy);
exports.watch = () => {
    gulp.watch('./src/**/*', gulp.parallel(javascript, stylesheet, copy))
        .on('all', (event, path, stats) => {})
}