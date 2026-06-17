const gulp = require("gulp");
const less = require("gulp-less");
const sourcemaps = require("gulp-sourcemaps");

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */

const SIMPLE_LESS = ["styles/*.less"];
function compileLESS() {
  return gulp
    .src("styles/simple.less")
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./styles/"));
}
const css = gulp.series(compileLESS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(SIMPLE_LESS, css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = css;
exports.watch = gulp.series(css, watchUpdates);
exports.css = css;
