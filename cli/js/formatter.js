var through     = require('through2');
var beautify    = require('js-beautify').js_beautify;
var fixmyjs     = require('fixmyjs');
var esformatter = require('esformatter');
var colors      = require('colors');

var conf        = require('./conf');

exports.format = function(content) {
    //beautify
    content = beautify(content, conf.by);
    //jshint(content, conf.fs);
    //content = fixmyjs(jshint.data(), content, conf.fs).run();
    content = fixmyjs.fix(content, conf.fs);
    content = esformatter.format(content, conf.er);
    //在行注释后添加一个空格
    content = content.replace(/\/\//g, '// ');
    //在结尾添加空行
    content = content.replace(/[\r\n]*$/, '\n');
    return content;
}
exports.exec = function(options) {
    return through({
        objectMode: true
    },
    function(file, enc, cb) {
        // 如何让这段代码写的更优雅
        var content = file.contents.toString(enc);
        try {
            content = exports.format(content);
            console.log('success'.green, file.path);
        } catch (e) {
            console.log('error'.red, file.path);
        } finally {
            file.base = process.cwd();
            file.contents = new Buffer(content);
            cb(null, file);
        }
    });
};