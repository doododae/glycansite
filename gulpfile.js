var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();

gulp.task('browser-sync', ['sass'], function() {
    bs.init({
        proxy: "mytest.dev"
    });
});

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
                .pipe(sass())
                .pipe(gulp.dest('css'))
                .pipe(bs.reload({stream: true}));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch("scss/*.scss", ['sass']).on('change', bs.reload);
    gulp.watch("*.html").on('change', bs.reload);
    gulp.watch("**/*.html").on('change', bs.reload);
    gulp.watch("css/*.css").on('change', bs.reload);
    gulp.watch("*js/*.js").on('change', bs.reload);
});