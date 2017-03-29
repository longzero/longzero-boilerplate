var gulp = require('gulp');
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulpCssPreprocessor = require('gulp-css-preprocessor');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var header = require('gulp-header');
var i18n = require('gulp-html-i18n');
var minify = require('gulp-minifier');
var pug = require('gulp-pug');

var isProduction = (argv.production === undefined) ? false : true;



gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('development/images/'))
    .pipe(gulpif(argv.production, gulp.dest('public/images/')));
});

gulp.task('css', function() {
  return gulp.src(['src/vendors/**/*.css'], {base: 'src'})
    .pipe(concat('vendors.css'))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/css/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyCSS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/css/')));
});
gulp.task('stylus', function() {
  return gulp.src('src/css/**/*', {base: 'src'})
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/css/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyCSS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/css/')));
});


gulp.task('html', function() {
  return gulp.src('src/pages/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(i18n({
      createLangDirs: true,
      langDir: 'src/languages/',
      trace: true
    }))
    .pipe(gulp.dest('.tmp/'))
    .pipe(header('<!-- Generated on: ' + new Date() + ' -->\n'))
    .pipe(gulp.dest('development/'))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});
gulp.task('htmlRoot', function() {
  return gulp.src('src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(header('<!-- Generated on: ' + new Date() + ' -->\n'))
    .pipe(gulp.dest('development/'))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});

var jsFiles = ['src/vendors/jquery-2.1.4.min.js','src/vendors/parsley.min.js','src/vendors/**/*.js','src/js/**/*.js'];

gulp.task('js', function() {
  return gulp.src(jsFiles, {base: 'src'})
    .pipe(concat('main-generated.js'))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/js/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyJS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/js/')));
});

gulp.task('connect', function() {
  connect.server({
    port: 8080,
    root: 'development'
  });
});

gulp.task('watch', function () {
  gulp.watch('src/vendors/**/*.css',['css']);
  gulp.watch('src/css/**/*.styl',['stylus']);
  gulp.watch('src/**/*.yaml',['html']);
  gulp.watch('src/**/*.pug',['html']);
  gulp.watch('src/*.pug',['htmlRoot']);
  gulp.watch('src/js/**/*.js',['js']);
  gulp.watch('src/vendors/**/*.js',['js']);
  gulp.watch('src/images/**/*',['images']);
});

// Default Task
gulp.task('default', ['css','stylus','html','htmlRoot','js','images']);
gulp.task('dev', ['css','stylus','html','htmlRoot','js','images','watch','connect']);
