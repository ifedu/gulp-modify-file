'use strict'

const through = require('through2')
const sourceMap = require('source-map');
const applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function (fn) {
    return through.obj(function (file, enc, cb) {
        const sourceMappings = [];
        const sourceMapInterface = {
            map: function (entry) {
                sourceMappings.push(entry);
            }
        };

        const contents = fn(String(file.contents), file.path, file, sourceMapInterface) || file.contents;

        if (file.isBuffer() === true) {
            file.contents = new Buffer(contents);
        }

        // If the user doesn't make use of the source mapping interface, we won't bother
        // examining or appending to the existing source map(s).
        if (sourceMappings.length > 0) {
            if (!file.sourceMap) {
                throw new Error('Add gulp-sourcemaps to your pipeline before specifying source mappings');
            }

            let generator = new sourceMap.SourceMapGenerator({
                file: file.sourceMap.file
            });

            sourceMappings.forEach(function (mapping) {
                generator.addMapping(Object.assign({ source: file.sourceMap.file }, mapping));
            });

            applySourceMap(file, generator.toString()); 
        }

        cb(null, file);
    });
}
