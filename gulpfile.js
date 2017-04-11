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
var inlineCss = require('gulp-inline-css');
var minify = require('gulp-minifier');
var pug = require('gulp-pug');

var isProduction = (argv.production === undefined) ? false : true;


// EMAIL CSS 
gulp.task('emailCSS', function() {
  return gulp.src('src/email/**/*.styl')
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(gulp.dest('.tmp/'))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('src/email/'));
});

// EMAIL PUG
gulp.task('emailHTML', function () {
  return gulp.src('src/email/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(i18n({
      createLangDirs: true,
      langDir: 'src/email/languages/',
      trace: true
    }))
    .pipe(gulp.dest('.tmp/'))
    .pipe(inlineCss({
    	applyLinkTags: true,
      applyStyleTags: true,
      applyTableAttributes: true,
      removeHtmlSelectors: true,
    	removeLinkTags: true,
    	removeStyleTags: true
    }))
    .pipe(header('<!-- Generated on: ' + new Date() + ' -->\n'))
    .pipe(gulp.dest('email/'));
});


// EMAIL IMAGES
// Copy images
gulp.task('emailImages', function() {
  return gulp.src('src/email/images/**/*')
    .pipe(gulp.dest('email/images/'))
});


// WATCH EMAIL
gulp.task('watchEmail', function () {
  gulp.watch('src/email/**/*.styl',['emailCSS','emailHTML']);
  gulp.watch('src/email/**/*.yaml',['emailHTML']);
  gulp.watch('src/email/**/*.pug',['emailHTML']);
  gulp.watch('src/email/images/**/*',['emailImages']);
});

// TASK EMAIL 
gulp.task('email', ['emailCSS','emailHTML','emailImages','watchEmail']);






// IMAGES
// Copy images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('development/images/'))
    .pipe(gulpif(argv.production, gulp.dest('public/images/')));
});

// CSS 
// Put all vendor CSS together
gulp.task('css', function() {
  return gulp.src(['src/vendors/**/*.css'], {base: 'src'})
    .pipe(concat('vendors.css'))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyCSS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});
// CSS preprocessor 
gulp.task('stylus', function() {
  return gulp.src('src/css/**/*', {base: 'src'})
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyCSS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});

// HTML 
// Compile pug files into HTML and split languages.
// Languages are defined by creating appropriate folders in the folder languages.
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

// JAVASCRIPT 
// Put JS files together 
var jsFiles = ['src/vendors/jquery-2.1.4.min.js','src/vendors/parsley.min.js','src/vendors/**/*.js','src/js/**/*.js'];
gulp.task('js', function() {
  return gulp.src(jsFiles, {base: 'src'})
    .pipe(concat('main-generated.js'))
    .pipe(header('/* Generated on: ' + new Date() + ' */\n'))
    .pipe(gulp.dest('development/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyJS: true})))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});

// LOCAL SERVER
// Start a local server for developement
gulp.task('connect', function() {
  connect.server({
    port: 8080,
    root: 'development'
  });
});

// WATCH
// Watch files
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


// TASKS
// Bundled tasks
gulp.task('default', ['css','stylus','html','htmlRoot','js','images']);
gulp.task('dev', ['css','stylus','html','htmlRoot','js','images','watch','connect']);
