var gulp = require('gulp');
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect-php');
var gulpCssPreprocessor = require('gulp-css-preprocessor');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var header = require('gulp-header');
var i18n = require('gulp-html-i18n');
var inlineCss = require('gulp-inline-css');
var kss = require('kss');
// var kss = require('gulp-kss');
var minify = require('gulp-minifier');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var run = require('gulp-run');

var isProduction = (argv.production === undefined) ? false : true;


// EMAIL CSS
gulp.task('emailCSS', function() {
  return gulp.src('src/email/**/*.styl')
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    .pipe(gulp.dest('email/.tmp'));
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
    .pipe(gulp.dest('email/.tmp/'))
    .pipe(inlineCss({
    	applyLinkTags: true,
      applyStyleTags: true,
      applyTableAttributes: true,
      removeHtmlSelectors: true,
    	removeLinkTags: true,
    	removeStyleTags: true
    }))
    .pipe(gulpif(argv.production, header('<!-- Generated on: ' + new Date() + ' -->\n')))
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






// Copy htaccess
gulp.task('htaccess', function() {
  return gulp.src('src/.htaccess')
    .pipe(gulp.dest('public/'))
});


// IMAGES
// Copy images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('public/images/'))
    .pipe(gulpif(argv.production, gulp.dest('public/images/')));
});


// CSS
// Put all vendor CSS together
gulp.task('css', function() {
  return gulp.src(['src/vendors/**/*.css'], {base: 'src'})
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(gulpif(argv.production, minify({minify: true, minifyCSS: true})))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulpif(argv.production, gulp.dest('public/css/')));
});
// CSS preprocessor
gulp.task('stylus', function() {
  return gulp.src('src/css/style.styl', {base: 'src'})
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(gulp.dest('public/'))
    .pipe(gulpif(argv.production, minify({minify: true, minifyCSS: true})))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});


// Style guide
gulp.task('styleguide-run', function() {
  return run('kss '
    + '--title "Generic Style Guide" '
    + '--source src/css '
    + '--destination public/styleguide '
    + '--css ../css/style.css '
    // + '--builder node_modules/michelangelo/kss_styleguide/custom-template/'
    + '--builder src/styleguide/'
    ).exec();
  // return run('kss --config styleguide.json').exec();
});
gulp.task('styleguide-css', function() {
  return gulp.src('src/styleguide/kss-assets/css/kss.scss')
    .pipe(gulpCssPreprocessor())
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(gulp.dest('src/styleguide/kss-assets/css/'))
    .pipe(gulpif(argv.production, minify({minify: true, minifyCSS: true})))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    // .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulpif(argv.production, gulp.dest('src/styleguide/kss-assets/css/')));
});


// PUG
// Compile pug files into HTML and split languages.
// Languages are defined by creating appropriate folders in the folder languages.
gulp.task('pug', function() {
  return gulp.src('src/pages/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(i18n({
      createLangDirs: true,
      langDir: 'src/languages/',
      trace: true
    }))
    .pipe(gulp.dest('public/'))
    .pipe(gulpif(argv.production, header('<!-- Generated on: ' + new Date() + ' -->\n')))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});
gulp.task('htmlRoot', function() {
  return gulp.src('src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
    .pipe(gulpif(argv.production, header('<!-- Generated on: ' + new Date() + ' -->\n')))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});


// PHP
gulp.task('php', function() {
  return gulp.src('src/pages/**/*.php')
    .pipe(gulp.dest('public/'))
    .pipe(gulpif(argv.production, header('<!-- Generated on: ' + new Date() + ' -->\n')))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});


// JAVASCRIPT
// Put all vendor JS together
var jsFiles = ['src/vendors/**/*.js'];
gulp.task('jsVendors', function() {
  return gulp.src(jsFiles, {base: 'src'})
    .pipe(gulp.dest('public/'))
    .pipe(gulpif(argv.production, minify({minify: true, minifyCSS: true})))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulpif(argv.production, gulp.dest('public/')));
});
// Put JS files together
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js', {base: 'src'})
    .pipe(concat('main-generated.js'))
    .pipe(gulp.dest('public/js/'))
    .pipe(gulpif(argv.production, minify({minify: true,minifyJS: true})))
    .pipe(gulpif(argv.production, header('/* Generated on: ' + new Date() + ' */\n')))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(gulpif(argv.production, gulp.dest('public/js/')));
});


// LOCAL PHP SERVER
gulp.task('connect', function() {
  connect.server({
    base: 'public',
    port: 8080
  });
});


// WATCH
// Watch files
gulp.task('watch', function () {
  gulp.watch('src/vendors/**/*.css',['css']);
  gulp.watch('src/css/**/*.styl',['stylus','styleguide-run']);
  gulp.watch('src/styleguide/kss-assets/css/**/*.scss',['styleguide-css','styleguide-run']);
  gulp.watch('src/**/*.yaml',['pug']);
  gulp.watch('src/**/*.pug',['pug']);
  gulp.watch('src/**/*.php',['php']);
  gulp.watch('src/*.pug',['htmlRoot']);
  gulp.watch('src/js/**/*.js',['js']);
  gulp.watch('src/vendors/**/*.js',['js']);
  gulp.watch('src/images/**/*',['images']);
});


// TASKS
// Bundled tasks
gulp.task('default', ['css','stylus','styleguide-css','styleguide-run','pug','php','htmlRoot','jsVendors','js','images','htaccess','watch','connect']);
gulp.task('build', ['css','stylus','styleguide-css','styleguide-run','pug','php','htmlRoot','jsVendors','js','images','htaccess']);
