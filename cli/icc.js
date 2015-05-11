var through = require('through2');

exports.exec = function(options) {
    return through({
        objectMode: true
    },
    function(file, enc, cb) {
        var content = file.contents.toString(enc);
        var key = '/*eslint-disable fecs-camelcase*/';
        if (~~content.indexOf(key)) {
            content = key + '\n' + content;
        }
        file.base = process.cwd();
        file.contents = new Buffer(content);
        cb(null, file);
    });
};