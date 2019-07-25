var gulp = require('gulp'); // 使用套件都需要 require
const $ = require('gulp-load-plugins')(); // 屬於 gulp 套件都需要加 $
// var plumber = require('gulp-plumber'); // 程式出錯不會停止
var autoprefixer = require('autoprefixer'); // 不屬於 gulp 套件，屬於 postCSS 的延伸套件

// *******************************
// gulp.task() 定義任務
// function 是任務內容要做什麼事情
// *******************************
gulp.task('copyHTML', () => {
    // gulp.src('資料來源')
    return gulp.src('./source/**/*.html')    // src 抓出所有 HTML
        .pipe(gulp.dest('./public/')); // dest 能把內容輸出到 public 資料夾 (沒有則會自動建立資料夾)
});

// *******************************
// jade
// *******************************
gulp.task('jade', function () {
    // var YOUR_LOCALS = {};

    gulp.src('./source/**/*.jade')
        .pipe($.plumber()) // 出錯時不會停止，會繼續執行 Gulp
        .pipe($.jade({
            // locals: YOUR_LOCALS
            pretty: true, // 編譯完的 HTML 將會展開 (沒有壓縮的版本)
        }))
        .pipe(gulp.dest('./public/'))
});

// *******************************
// Sass + postCSS
// *******************************
gulp.task('sass', function () {
    // 宣告套件 (postcss 延伸套件)
    var plugins = [
        // 針對瀏覽器修正 -> 更新最新版瀏覽器的前幾版
        autoprefixer({ browserslist: ['last 1 version', '> 5%'] }),
    ];
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sass().on('error', $.sass.logError)) // logError 是 Sass 的延伸套件
        // 在這個階段已經編譯完成
        .pipe($.postcss(plugins)) // 搭配 postcss 載入 autoprefixer
        .pipe(gulp.dest('./public/css'));
});

// *******************************
// gulp.watch 編譯出錯後，會停止監控
// *******************************
// gulp 內建的功能
gulp.task('watch', function () {
    // return $.watch(['./source/**/*.jade', './source/scss/**/*.scss'], function () {
    //     gulp.start('jade');
    //     gulp.start('sass');
    // });

    // gulp.watch('./source/scss/**/*.scss', ['sass']);
    // gulp.watch('./source/**/*.jade', ['jade']);

    // gulp.watch() 也可以這樣寫
    gulp.watch(['./source/**/*.jade', './source/scss/**/*.scss'], ['sass', 'jade', ]);
});

// watch() 也可以這樣寫
// $.watch(['./source/**/*.jade', './source/scss/**/*.scss'], function () {
//     // start 直接呼叫 task
//     gulp.start('jade');
//     gulp.start('sass');
// });

// *******************************
// 合併 task
// *******************************
// gulp 內建的功能
gulp.task('default', ['jade', 'sass', 'watch']); // 輸入 gulp 後，會依序編譯 ['task1', 'task2', 'task3'] 裡的任務