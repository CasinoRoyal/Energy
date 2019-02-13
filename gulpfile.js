const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const prefix = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const imagemin = require("gulp-imagemin");
const svgStore = require("gulp-svgstore");
const cheerio = require("gulp-cheerio");
const plumber = require("gulp-plumber");
const del = require("del");


gulp.task('pug', function () {
  return gulp.src('app/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty:true
    }))
    .pipe(gulp.dest('./build/html'))
    .on('end', browserSync.reload);
})

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefix({
      browsers: ['last 10 version'],
      cascade: false
    }))
    .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true    
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
})

gulp.task('watch', function () {
  gulp.watch('app/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('app/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('app/img/**/*', gulp.series('image:dev'));
})

gulp.task('serve', function () {
  browserSync.init({
    server: './build',
    open: false
  })
})

gulp.task('image:build', function () {
  return gulp.src("app/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
})

gulp.task('image:dev', function () {
  return gulp.src("app/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
})

gulp.task('sprite', function () {
  return gulp.src("app/img/sprite/*.svg")
    .pipe(cheerio({
      run: function($) {
        $("[fill]").removeAttr("fill");
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(gulp.dest("build/img"));
})

gulp.task('fonts', function () {
  return gulp.src("app/fonts/**/*")
    .pipe(gulp.dest("build/fonts"));
})

gulp.task('clean', function () {
  return del('./build')
})

gulp.task('dev', gulp.series(
  'clean',
  gulp.parallel(
    'pug',
    'sass',
    'fonts',
    'image:dev',
    'sprite'
    )
  ))

gulp.task('default', gulp.series(
  'dev',
  gulp.parallel(
    'watch',
    'serve'
    )
  ))