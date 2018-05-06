'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var webp = require('gulp-webp');

gulp.task('style', function() {
  gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer()
    ]))
  .pipe(gulp.dest('source/css'))
  .pipe(server.stream());
});

gulp.task('webp', function() {
  gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp())
  .pipe(gulp.dest('source/img'));
});

gulp.task('serve', ['style'], function() {
  server.init({
    server: 'source/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', ['style']);
  gulp.watch('source/*.html').on('change', server.reload);
});
