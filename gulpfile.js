const 
	gulp = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('copy:package', function() {
	gulp.src(['./packages/**/*'])
		.pipe(gulp.dest('./dist/@vessel'));
})

gulp.task('copy:toexample', function() {
	gulp.src(['./dist/@vessel/**/*'])
		.pipe(gulp.dest('./examples/todoapp/node_modules/@vessel'));
})

gulp.task('default', function(cb){
	 runSequence('copy:package','copy:toexample');
});