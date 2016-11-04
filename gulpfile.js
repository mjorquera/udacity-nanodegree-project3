var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var clean = require('gulp-clean');
var ngAnnotate = require('gulp-ng-annotate');

var browserSync = require('browser-sync').create();
function browserSyncInit(baseDir) {
    browserSync.init({
        server: { baseDir: baseDir }
    });
    browserSync.stream();
}

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src('dist/')
  .pipe(clean());
});

gulp.task('sass', function(){
  return gulp.src('src/sass/*.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
          			browsers: ['last 2 versions'],
          			cascade: false
          		}))
          .pipe(gulp.dest('src/css'))
          .pipe(browserSync.reload({
            stream: true
          }));
});

gulp.task('compress', ['clean'], function(){
  return gulp.src('src/js/restaurant-app.js')
          .pipe(ngAnnotate())
          .pipe(uglify())
          .pipe(gulp.dest('dist/js'))
});

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('src'))
});

var paths = {
 scripts: ['js/**/*.js', '!js/libs/**/*.js'],
 images: ['images/*.ico'],
 html: ['index.html', 'restaurant.html'],
 styles: ['css/**/*.css'],
 fonts: ['fonts/*'],
 libs: ['js/libs/**/*.js'],
 dist: 'dist/'
};

gulp.task('copy', ['clean'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: 'src/'})
 .pipe(gulp.dest('dist/'));

 // Copy styles
 gulp.src(paths.styles, {cwd: 'src/'})
 .pipe(gulp.dest('dist/css'));

 // Copy images files
 gulp.src(paths.images, {cwd: 'src/'})
 .pipe(gulp.dest('dist/images'));

 // Copy fonts files
 gulp.src(paths.fonts, {cwd: 'src/'})
 .pipe(gulp.dest('dist/fonts'));

 // Copy lib scripts, maintaining the original directory structure
gulp.src(paths.libs, {cwd: 'src/**'})
.pipe(gulp.dest('dist/'));
});

// A development task to run anytime a file changes
gulp.task('watch', function() {
 gulp.watch('src/**/*', ['compress', 'sass', 'copy']);
});

gulp.task('default', ['useref'], function(){
  browserSyncInit('src');
  gulp.watch('src/sass/*.scss',['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/*.js', browserSync.reload);
});

gulp.task('serve:dist', ['clean','compress','sass','useref','copy'], function(){
  browserSyncInit('dist');
});
