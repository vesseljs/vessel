const 
	gulp = require('gulp'),
	pkg = require('./package.json'),
	rollup = require('rollup'),
	rollupTypeScript = require('@alexlur/rollup-plugin-typescript'),
	typescript = require('typescript'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename'),
	runSeq = require('run-sequence'),
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
    return gulp.src('./dist/bundle.js'),
            rename('bundle.min.js'),
            uglify(),
            gulp.dest('./dist');
});

gulp.task('browser', function()  {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        logPrefix: "VESSEL v" + pkg.version + ": BrowserSync"

    });
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.ts',
        './src/**/*.js',
        './src/**/*.html',
        './src/**/*.jsx'], ['bundle']);
});

gulp.task('serve', ['browser', 'watch'], function() {
	console.log('\x1b[32m','[','\x1b[0m', 'READY', '\x1b[32m', ']','\x1b[0m','Watching files for changes...');
});
