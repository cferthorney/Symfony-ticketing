var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var Q = require('q');

var Pipeline = function() {
    this.entries = [];
};
Pipeline.prototype.add = function() {
    this.entries.push(arguments);
};
Pipeline.prototype.run = function(callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;
    var runNextEntry = function() {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {
            deferred.resolve();
            return;
        }
        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function() {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();
    return deferred.promise;
};

var sassPaths = [
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src'
];

var config = {
    bowerDirectory: 'bower_components',
    resourcesDir: 'app/Resources',
    imgDir: 'img',
    sassDir: 'scss/**/*.scss',
    scriptDir: 'js/**/*.js',
    manifestPath: 'app/Resources/manifests/rev-manifest.json',
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
        .pipe($.concat('css/' + outputFilename))
        .pipe($.if(config.production, $.cleanCss()))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe($.rev())
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest('web'))
        .pipe($.rev.manifest(config.manifestPath, {
            merge: true
        }))
        .pipe(gulp.dest('.'))
}

app.addScript = function (paths, outputFilename) {
    return gulp.src(paths)
        .pipe($.plumber())
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe($.concat('js/' + outputFilename))
        .pipe($.if(config.production, $.uglify()))
        .pipe($.rev())
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest('web'))
        .pipe($.rev.manifest(config.manifestPath, {
            merge: true
        }))
        .pipe(gulp.dest('.'))
}

app.copy = function (sourceFiles, outputDir) {
    return gulp.src(sourceFiles)
        .pipe(gulp.dest(outputDir));
}

gulp.task('clean', function() {
   del.sync(config.manifestPath);
   del.sync('web/css/*');
   del.sync('web/fonts/*');
   del.sync('web/js/*');

});

gulp.task('fonts', function() {
   return app.copy([
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.eot',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.svg',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.ttf',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.woff'
    ],'web/fonts')
});

gulp.task('images', function() {
   return app.copy([config.resourcesDir], 'web/img')
});

gulp.task('styles', function () {
    var pipeline = new Pipeline();

    pipeline.add([
        config.resourcesDir + '/' + config.sassDir,
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.css'
    ], 'main.css');

    return pipeline.run(app.addStyle);
});

gulp.task('scripts', function () {
    var pipeline = new Pipeline();

    pipeline.add([
        config.bowerDirectory + '/jquery/dist/jquery.js',
        config.bowerDirectory + '/what-input/what-input.js',
        config.bowerDirectory + '/foundation-sites/dist/foundation.js',
        config.resourcesDir + '/' + config.scriptDir
    ], 'main.js');

    return pipeline.run(app.addScript);
});

gulp.task('watch', function () {
    gulp.watch([config.resourcesDir + '/' + config.sassDir], ['styles']);
    gulp.watch([config.resourcesDir + '/' + config.scriptDir],['scripts']);
});

gulp.task('default', ['clean', 'styles', 'scripts', 'fonts', 'images', 'watch'], function () {

});
