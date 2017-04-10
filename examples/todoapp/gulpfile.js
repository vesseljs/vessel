const 
	gulp = require('gulp'),
	rollup = require('rollup'),
	rollupTypeScript = require('rollup-plugin-typescript'),
	typescript = require('typescript');


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

gulp.task('watch', function() {
	gulp.watch('./**/*.ts', ['bundle']);
});