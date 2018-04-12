var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');

gulp.task('default', ['images', 'minify', 'move'], function() {
});

gulp.task('images', function() {
  return gulp.src('./images/**')
  .pipe(imagemin())
  .pipe(gulp.dest('./build/images'));
});

gulp.task('minify', function() {
  return gulp.src(['./*.html', './**/*.html', './css/main.css'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlmin({removeRedundantAttributes: true}))
    .pipe(htmlmin({removeOptionalTags: true}))
    .pipe(htmlmin({removeAttributeQuotes: true}))
    .pipe(htmlmin({minifyCSS: true}))
    .pipe(htmlmin({minifyJS: true}))
    .pipe(htmlmin({minifyURLs: true}))
    .pipe(htmlmin({removeComments: true}))
    .pipe(gulp.dest('./build'));
});

var filesToMove = [
  './*.js',
  './manifest.json'
];

gulp.task('move',['minify', 'images'], function(){
gulp.src(filesToMove, { base: './' })
.pipe(gulp.dest('./build'));
});