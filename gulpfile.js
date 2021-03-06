'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var jpegoptim = require('imagemin-jpegoptim');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore');
var spriteBg = require('gulp-svg-sprites');
var run = require('run-sequence');
var del = require('del');
var server = require('browser-sync').create();

gulp.task('html', function() {
  return gulp.src('source/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('build'))
  .pipe(server.stream());
});

gulp.task('style', function() {
  return gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    mqpacker(),
    autoprefixer()
    ]))
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream());
});

gulp.task('script', function() {
  return gulp.src(['source/js/lib/*.js', 'source/js/script.js'])
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/js'))
  .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp.src('source/img/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng(),
    imagemin.svgo(),
    jpegoptim({
      max: 70,
      progressive: true
    })
    ]))
  .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function() {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest('build/img'));
});

gulp.task('symbols-build', function() {
  return gulp.src('source/img/symbols/*.svg')
  .pipe(imagemin([
    imagemin.svgo()
    ]))
  .pipe(gulp.dest('build/img/symbols'))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('symbols.svg'))
  .pipe(gulp.dest('build/img'));
});

gulp.task('symbols-clean', function() {
  del('build/img/symbols');
});

gulp.task('symbols', function (done) {
  run(
    'symbols-build',
    'symbols-clean',
    done
    );
});

gulp.task('sprite-bg-build', function() {
  return gulp.src('source/img/bg-icons/*.svg')
  .pipe(imagemin([
    imagemin.svgo()
    ]))
  .pipe(gulp.dest('build/img/bg-icons'))
  .pipe(spriteBg({
    baseSize: 1,
    padding: 100,
    preview: {
      sprite: ''
    },
    svg: {
      sprite: '../bg-icons.svg'
    },
    cssFile: 'bg-icons.css',
  }
  ))
  .pipe(gulp.dest('build/img/bg-icons'));
});

gulp.task('sprite-bg-clean', function() {
  del('build/img/bg-icons');
});

gulp.task('sprite-bg', function (done) {
  run(
    'sprite-bg-build',
    'sprite-bg-clean',
    done
    );
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}'
    ], {
      base: 'source'
    })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build/**/*');
});

gulp.task('build', function (done) {
  run(
    'clean',
    'copy',
    'html',
    'style',
    'script',
    'images',
    'webp',
    'symbols',
    'sprite-bg',
    done
    );
});

gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', ['style']);
  gulp.watch('source/**/*.html', ['html']);
  gulp.watch('source/js/**/*.js', ['script']);
});
