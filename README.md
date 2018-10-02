# gulp-modify-file

A gulp plugin for modifying files in your gulp `.pipe`.

## Install
```shell
$ npm install gulp-modify-file --save-dev
```

## How to use
Your callback function will receive three arguments: the contents of the file, the path to the file,
and gulp's internal `file` object, for context. Return a string or buffer containing the new desired
contents of the file.

```javascript
const gulp = require('gulp')
const modifyFile = require('gulp-modify-file')

gulp.task('js', () => {
    return gulp
    .src('app/**/*.js')
    .pipe(modifyFile((content, path, file) => {
        const start = '(function (){\n'
        const end = '\n})()'

        return `${start}${content}${end}`
    }))
    .pipe(gulp.dest('build'))
})
```

## Specifying source mappings
If you're using `gulp-sourcemaps` for your pipeline, modifying file contents (especially when
adding and removing lines) will cause your source maps to become inaccurate. You can fix this
by providing source mappings using the optional _fourth parameter_.

Note that if you make use of this feature, you should provide at least one mapping for every
line in the output content. Any line without a mapping will not resolve to a source line
(which may be exactly what you want, in the case of shims or inserted code).

```javascript
const gulp = require('gulp')
const modifyFile = require('gulp-modify-file')

gulp.task('js', () => {
    return gulp
    .src('app/**/*.js')
    .pipe(modifyFile((content, path, file, sourcemap) => {
        const lines = content.split('\n')

        // In the generated (aka output) file, line 2 maps to line 1 of the original,
        // line 3 maps to line 2, etc. The first and last lines will have no mapping,
        // which makes sense.
        for (let i = 0; i < lines.length; i++) {
            sourcemap.map({ generated: { line: i + 1, column: 0 }, original: { line: i, column: 0 } })
        }

        lines.unshift('(function (){\n')
        lines.push('\n})()')

        // The mappings provided above will automatically be applied to the current source map
        // being maintained by gulp-sourcemaps.
        return lines.join('\n')
    }))
    .pipe(gulp.dest('build'))
})
```

