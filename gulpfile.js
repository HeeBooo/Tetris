const gulp = require('gulp');
const sass = require('gulp-sass'); // 编译sass
const cleanCSS = require('gulp-clean-css'); // 压缩css
const rename = require('gulp-rename'); // 更改名字
const imagemin = require('gulp-imagemin'); // 压缩图片
const imageminGifsicle = require('imagemin-gifsicle'); // 压缩gif
const imageminPngquant = require('imagemin-pngquant'); // 压缩png
const imageminJpegtran = require('imagemin-jpegtran'); // 压缩jpeg
const imageminOptipng = require('imagemin-optipng');
const cache = require('gulp-cache'); // 缓存图片，减少重复压缩
const autoprefixer = require('gulp-autoprefixer'); // 自动不全浏览器前缀
const uglify = require('gulp-uglify'); // 压缩js
const babel = require("gulp-babel"); // ES6转为ES5
const core = require("babel-core");
const htmlminify = require('gulp-html-minify'); // 压缩html
const del = require('del'); // 删除文件


gulp.task('html', () => {
    return gulp.src('public/html/*.html')
        .pipe(htmlminify())
        .pipe(gulp.dest('./dist/html'))
})

gulp.task('css', () => {
    return gulp.src('public/css/*.css')
        .pipe(cleanCSS())
        .pipe(rename({
            //    更改后缀
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'))
})

gulp.task('sass', () => {
    return gulp.src('public/sass/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./public/css'));
})

gulp.task('js', () => {
    return gulp.src('public/js/*.js')
        .pipe(babel({
            presets: ["env"]
        }))
        // .pipe(uglify())
        .pipe(rename({
            //    更改后缀
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('images', () => {
    return gulp.src('public/images/*')
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [imageminPngquant()]

        })))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('watch', () => {
    // 监听文件
    gulp.watch('public/html/*.html', ['html'])

    gulp.watch('public/sass/*.scss', ['sass'])

    gulp.watch('public/css/*.css', ['css'])

    gulp.watch('public/js/*.js', ['js'])

    gulp.watch('public/images/*', ['images'])
})

gulp.task('default', ['html', 'css', 'sass', 'js', 'images', 'watch'])