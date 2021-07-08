const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const image = require ('gulp-image');
const babel = require ('gulp-babel');
const uglify = require ('gulp-uglify-es').default;
const notify = require ('gulp-notify');
const sourcemaps = require ('gulp-sourcemaps');
const del = require ('del');
const browserSync = require('browser-sync').create();


const clean = () => {
    return del(['dist'])
}

const styles = () => {
    return src('src/styles/**/*.css')
    .pipe(sourcemaps.init( ))
    .pipe(concat('base.css'))
    .pipe(autoprefixer({
        cascade:false
    }))
    .pipe(cleanCss({
        level:2
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlMinify = ()=> {
    return src('src/**/*.html')
    .pipe(htmlMin({
        collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const scss = () => {
    return src('src/styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        cascade:false
    }))
    .pipe(concat('main.css'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}


const scripts = () => {
    return src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify({
        toplevel: true
    }).on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = ()=> {
    browserSync.init({
        server: {
            baseDir:'dist'
        }
    })
}

const images = () => {
    return src([
        'src/images/**/*.png'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

watch('src/**/*.html', htmlMinify)
watch('src/styles/*.scss', scss)
watch('src/styles/*.scss', styles)


exports.clean = clean
exports.htmlMinify = htmlMinify
exports.default = series(clean, images, styles, scss, scripts, htmlMinify, watchFiles)