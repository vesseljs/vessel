const 
	gulp = require('gulp'),
	pkg = require('./package.json'),
	rollup = require('rollup'),
	rollupTypeScript = require('@alexlur/rollup-plugin-typescript'),
	typescript = require('typescript'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
	browserSync = require('browser-sync').create();


gulp.task('bundle', function() {
	return rollup.rollup({
		entry: './src/main.ts',
		plugins: [
			rollupTypeScript({
    			typescript: typescript
    		})
		],
		treeshake: true,
	}).then(function(bundle) {
		bundle.write({
			format: 'es',
			dest: './dist/bundle.js',
			sourceMap: true,
            useStrict: true,
		})
	})

});

gulp.task('minify', function() {
    return gulp.src('./dist/bundle.js')
		.pipe(rename('bundle.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('browser', ['bundle', 'copy:html'], function()  {
    browserSync.init({
        server: {
            baseDir: './dist',
            port: 3000
        },
        logPrefix: "VESSEL v" + pkg.version + ": BrowserSync"

    });
});

gulp.task('copy:html', ['copy:assets'], function() {
	gulp.src(['./src/*.html'])
        .pipe(rename({
        	dirname: ''
        }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy:assets', function() {
    gulp.src(['./src/assets/**/*'])
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.ts',
        './src/**/*.js',
        './src/*.html',
        './src/**/*.jsx'], ['bundle', 'copy:html']);
});

gulp.task('build', function() {
   runSequence('bundle', 'copy:html');
});

gulp.task('serve', ['browser', 'watch'], function() {
	console.log('\x1b[32m','[','\x1b[0m', 'READY', '\x1b[32m', ']','\x1b[0m','Watching files for changes...');
});
