var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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
        .pipe($.rev())
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest('web'))
        .pipe($.rev.manifest('app/Resources/manifests/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest('.'))
}

app.addScript = function (paths, outputFilename) {
    return gulp.src(paths)
        .pipe($.plumber())
        .pipe($.if(config.sourcemaps, $.sourcemaps.init()))
        .pipe($.concat(outputFilename))
        .pipe($.if(config.production, $.uglify()))
        .pipe($.rev())
        .pipe($.if(config.sourcemaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest('web'))
        .pipe($.rev.manifest('app/Resources/manifests/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest('.'))
}

app.copy = function (sourceFiles, outputDir) {
    gulp.src(sourceFiles)
        .pipe(gulp.dest(outputDir));
}

gulp.task('fonts', function() {
    app.copy([
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.eot',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.svg',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.ttf',
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.woff'
    ],'web/fonts')
});

gulp.task('images', function() {
   app.copy([config.resourcesDir], 'web/img')
});

gulp.task('styles', function () {
    app.addStyle([
        config.resourcesDir + '/' + config.sassDir,
        config.bowerDirectory + '/foundation-icon-fonts/foundation-icons.css'
    ], 'css/main.css')
});

gulp.task('scripts', function () {
    app.addScript([
        config.bowerDirectory + '/jquery/dist/jquery.js',
        config.resourcesDir + '/' + config.scriptDir
    ], 'js/main.js')
});

gulp.task('watch', function () {
    gulp.watch([config.resourcesDir + '/' + config.sassDir], ['styles']);
    gulp.watch([config.resourcesDir + '/' + config.scriptDir],['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'fonts', 'watch'], function () {

});
