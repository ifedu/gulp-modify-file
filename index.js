'use strict'

const through = require('through2')

module.exports = function (fn) {
    return through.obj(function (file, enc, cb) {
        const contents = fn(String(file.contents), file.path, file) || file.contents
        const modifiedFile = file.clone()

        if (file.isBuffer() === true) {
            modifiedFile.contents = new Buffer(contents)
        }

        cb(null, modifiedFile)
    })
}
