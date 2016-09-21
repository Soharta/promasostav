var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var path = {
	src : {
		html : 'app/*.html',
		css : 'app/main.css',
		img : 'app/*.png'
	},
	build : {
		html : 'build/',
		css : 'build/',
		img : 'build/'
	},
	watch : {
		html : 'app/*.html',
		css : 'app/*.css',
		img : 'app/*.png'
	},
	clean : 'build/'
};

gulp.task('server', function() {
	browserSync({
	    server: {
	        baseDir: "./build"
	    },
	    tunnel: true,
	    host: 'localhost',
	    port: 9000,
	    logPrefix: "Frontend_Devil"
	});
});

gulp.task('build:html', function() {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('build:css', function() {
	gulp.src(path.src.css)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('build:img', function() {
	gulp.src(path.src.img)
		.pipe(imagemin({
			// progressive: true,
   //          svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('watch', function() {
	watch([path.watch.html], function(event, cb) {
		gulp.start('build:html');
	});
	watch([path.watch.css], function(event, cb) {
		gulp.start('build:css');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('build:img');
	});
});
gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});

gulp.task('build', [
	'build:css',
	'build:html',
	'build:img'
]);

gulp.task('default', ['build', 'server', 'watch'])