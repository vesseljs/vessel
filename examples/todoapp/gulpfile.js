const 
	gulp = require('gulp'),
	rollup = require('rollup'),
	rollupTypeScript = require('rollup-plugin-typescript'),
	typescript = require('typescript'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    rename = require('gulp-rename');


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
})

gulp.task('watch', function() {
	gulp.watch(['./**/*.ts',
				'./**/*.js',
                './**/*.html',
                './**/*.jsx'], ['bundle']);
});