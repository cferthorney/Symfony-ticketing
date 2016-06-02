var gulp = require('gulp');
var $    = require('gulp-load-plugins')();

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

var config = {
  resourcesDir: 'app/Resources',
  sassDir: 'scss/**/*.scss',
  scriptDir: 'js/**',
  production: !!$.util.env.production,
  sourcemaps: !$.util.env.production
};

var app = {};

app.addStyle = function (paths, outputFilename) {
  return gulp.src(paths)
      .pipe($.plumber())
      .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
      .pipe($.sass({
        includePaths: sassPaths
      })
          .on('error', $.sass.logError))
      .pipe($.concat(outputFilename))
      .pipe($.if(config.production, $.cleanCss()))
      .pipe($.autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9']
      }))
      .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
      .pipe(gulp.dest('web/css'));
}

gulp.task('sass', function() {
  app.addStyle([
    config.resourcesDir + '/' + config.sassDir
    ], 'main.css');
});

gulp.task('default', ['sass'], function() {
  gulp.watch([config.resourcesDir + '/' + config.sassDir], ['sass']);
});
