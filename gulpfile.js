
'use strict';
var path = require('path');
var exec = require('child_process').exec;
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var tslint = require('gulp-tslint');
var rimraf = require('gulp-rimraf');
var Config = require('./gulpfile.config');

var config = new Config();

var tsc = require('gulp-typescript')


var vendors = {
  fonts: [
    './vendors/fontawesome/fonts/*',
  ],
  js: [
    './vendors/jquery/dist/jquery.js',
    './vendors/angular/angular.js',
    './vendors/angular-bootstrap/ui-bootstrap-tpls.js',
    './vendors/bootstrap-fileinput/js/fileinput.min.js',
    './vendors/animated-checkboxes/js/svgcheckbx.js',
    './vendors/konva/konva.js',
    './vendors/seiyria-bootstrap-slider/js/bootstrap-slider.js',
    './vendors/angular-bootstrap-slider/slider.js',
    './vendors/menu/js/modernizr.custom.js',
    './vendors/color-thief/src/color-thief.js',
    './vendors/api-vendors/vk.js'
  ]
};

gulp.task('gen-ts-refs', function() {
  var target = gulp.src(config.appTypeScriptReferences);
  var sources = gulp.src([config.allTypeScript], {
    read: false
  });
  return target.pipe(inject(sources, {
    starttag: '//{',
    endtag: '//}',
    transform: function(filepath) {
      return '/// <reference path="../..' + filepath + '" />';
    }
  })).pipe(gulp.dest(config.typings));

});

gulp.task('ts-lint', function() {
  return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

gulp.task('compile-ts', function() {
  var sourceTsFiles = [config.allTypeScript, //path to typescript files
    config.libraryTypeScriptDefinitions, //reference to library .d.ts files
    config.appTypeScriptReferences
  ]; //reference to app.d.ts files

  var tsResult = gulp.src(sourceTsFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(tsc({
      target: 'ES5',
      declarationFiles: false,
      noExternalResolve: true
    }));
  tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
  return tsResult.js
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('clean-ts', function() {
  var typeScriptGenFiles = [config.tsOutputPath, // path to generated JS files
    config.globalPath + '/js/*.js', // path to all JS files auto gen'd by editor
    config.globalPath + '/js/*.js.map' // path to all sourcemap files auto gen'd by editor
  ];

  // delete the files
  return gulp.src(typeScriptGenFiles, {
      read: false
    })
    .pipe(rimraf());
});


gulp.task('less', function() {
  return gulp.src('./src/less/app.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'vendors', 'bootstrap', 'less')]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('vendors', function() {
  return gulp.src(vendors.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('fonts', function() {
  return gulp.src(vendors.fonts)
    .pipe(plumber())
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('ts', function() {
  return gulp.src(['./src/ts/*.ts'])
    .pipe(tsc({
      module: "CommonJS",
      sourcemap: true,
      emitError: false,
      target: "es5"
    }))
    .pipe(gulp.dest('./src/js/test'));
});


gulp.task('views', function() {
  return gulp.src('./src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', ['build'], function() {
  watch('./src/less/**/*.less', function() {
    gulp.start('less');
  });

  watch([config.allTypeScript], function() {
    gulp.start('ts-lint');
    gulp.start('compile-ts');
    gulp.start('gen-ts-refs');
  });


  watch('./src/views/**/*.html', function() {
    gulp.start('views');
  });

  watch(vendors.js, function() {
    gulp.start('vendors');
  });

  watch(vendors.fonts, function() {
    gulp.start('fonts');
  });
});




gulp.task('build', ['less', 'vendors', 'ts-lint', 'compile-ts', 'gen-ts-refs', 'views', 'fonts']);

gulp.task('default', ['build']);