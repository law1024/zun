var fs          = require('fs');
var through     = require('through2');
var beautify    = require('js-beautify').js_beautify;
var fixmyjs     = require('fixmyjs');
var esformatter = require('esformatter');
var eslint      = require('eslint').linter;
var errors      = require('./error');
// js代码规范的配置文件
var conf        = require('./conf');

//ignoreCamelcase
function ignoreCamelcase(content) {
    var dis = '/*eslint-disable fecs-camelcase*/';
    if (!~content.indexOf(dis)) {
        return [dis, content].join('\n');
    }
    return content;
}

//输出log
function print(log) {
    //console.log(log);
    fs.open('./.zunlog', 'a+', function(err, fd) {
        var bu = new Buffer(log);
        fs.write(fd, bu, 0, bu.length, 0, function() {

        });
    });
}

exports.exec = function(options) {
    return through({
        objectMode: true
    },
    function(file, enc, cb) {
        console.log(file.path);
        // 如何让这段代码写的更优雅
        var content = file.contents.toString(enc);
        //忽视camecase问题
        content = ignoreCamelcase(content);
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
        //添加文件信息
        errors.addFile(file.path);
        //添加错误输出
        eslint.verify(content, conf.et).some(function(err) {
            errors.push(err);
        });
        print(errors.print());
        errors.empty();
        //检查是否有头注释
        file.contents = new Buffer(content);
        cb(null, file);
    });
};