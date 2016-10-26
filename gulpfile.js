var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var assign = require('lodash/object/assign');
var hbsfy = require('hbsfy');

var browserSync = require('browser-sync').create();
 browserSync.init({
     server: "./"
 });
 browserSync.stream();

gulp.task('styles', function(){
  gulp.src('sass/**/*.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
          			browsers: ['last 2 versions'],
          			cascade: false
          		}))
          .pipe(gulp.dest('./css'));
});

gulp.task('default', function(){
  gulp.watch('sass/**/*.scss',['styles']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('useref', function(){
  console.log("Hello");
  return gulp.src('./*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('./'))
});

function createBundle(src) {
  if (!src.push) {
    src = [src];
  }

  var customOpts = {
    entries: src,
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  var b = watchify(browserify(opts));

  b.transform(babelify.configure({
    stage: 1
  }));

  b.transform(hbsfy);
  b.on('log', plugins.util.log);
  return b;
}

function bundle(b, outputPath) {
  var splitPath = outputPath.split('/');
  var outputFile = splitPath[splitPath.length - 1];
  var outputDir = splitPath.slice(0, -1).join('/');

  return b.bundle()
    // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source(outputFile))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(plugins.sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('build/public/' + outputDir));
}

var jsBundles = {
  // 'js/polyfills/promise.js': createBundle('./public/js/polyfills/promise.js'),
  // 'js/polyfills/url.js': createBundle('./public/js/polyfills/url.js'),
  // 'js/settings.js': createBundle('./public/js/settings/index.js'),
  // 'js/main.js': createBundle('./public/js/main/index.js'),
  // 'js/remote-executor.js': createBundle('./public/js/remote-executor/index.js'),
  // 'js/idb-test.js': createBundle('./public/js/idb-test/index.js'),
  'sw.js': createBundle('./js/sw/index.js')
};

gulp.task('js:browser', function () {
  return mergeStream.apply(null,
    Object.keys(jsBundles).map(function(key) {
      return bundle(jsBundles[key], key);
    })
  );
});
