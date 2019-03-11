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
const spritesmith = require('gulp.spritesmith');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pump = require('pump');


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
  gulp.watch('app/js/**/*.js', gulp.series('js'));
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

gulp.task('sprite:raster', function() {
  let spriteData = gulp.src("app/img/raster/advantage-*.png")
  .pipe(spritesmith({
    retinaSrcFilter: ['app/img/raster/advantage-*@2x.png'],
    imgName: "sprite.png",
    retinaImgName: 'sprite@2x.png',
    cssName: "sprite.css",
    padding: 20
  }))
  return spriteData.pipe(gulp.dest("build/img/raster/sprite"));
})

gulp.task('sprite', function () {
  return gulp.src("app/img/vector/*.svg")
    .pipe(cheerio({
      run: function($) {
        $("[fill]").removeAttr("fill");
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgStore({
      inlineSvg: true
    }))
    .pipe(gulp.dest("build/img/vector"));
})

gulp.task('fonts', function () {
  return gulp.src("app/fonts/**/*")
    .pipe(gulp.dest("build/fonts"));
})

gulp.task('js', function (cb) {
  pump([
    gulp.src("app/js/*.js"),
    concat("main.min.js"),
    gulp.dest("build/js")
  ], cb);
})

gulp.task('clean', function () {
  return del('./build')
})

gulp.task('dev', gulp.series(
  'clean',
  gulp.parallel(
    'pug',
    'sass',
    'js',
    'fonts',
    'image:dev',
    'sprite',
    'sprite:raster'
    )
  ))

gulp.task('default', gulp.series(
  'dev',
  gulp.parallel(
    'watch',
    'serve'
    )
  ))