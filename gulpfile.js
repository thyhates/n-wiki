/**
 * Created by zhipu.liao on 2016/3/4.
 */
"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');//文件合并
var uglify = require('gulp-uglify');//js文件压缩
var livereload = require("gulp-livereload");//刷新

gulp.task("default", function () {
    return gulp.src(["src/js/**.**", "demo.js", "demo.html", "demo.css"])
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(livereload());
});
gulp.task("demo", function () {
    return gulp.src(["demo.js", "demo.html", "demo.css"])
        .pipe(livereload());
});
gulp.task("watch", function () {
    livereload.listen();
    gulp.watch("src/js/**.**", ["default"]);
});
gulp.task("watchDemo", function () {
    livereload.listen();
    gulp.watch(["demo.js", "demo.css", "demo.html"], ["demo"]);
});