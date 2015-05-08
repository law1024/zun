var vfs    = require('vinyl-fs');
var passer = require('./passer');
var ignore = require('./ignore');

function format(filter, handle, options) {
    var dir = './';
    if (options.directory === true) {
        dir = './output';
    } else if (!!options.directory) {
        dir = options.directory;
    }

    vfs
    .src(filter)
    .pipe(handle.exec(options))
    .pipe(vfs.dest(dir));
}

function getFileList(options, callback) {
    passer.getFiles(function(files) {
        var res = [];
        if (options.nomodify) {
            //只处理新增文件
            //如果没有新增文件
            if (files.newFiles.length === 0) {
                console.wran('no new files');
            }
            res = res.concat(files.newFiles);
        } else if (options.all) {
            //需要处理所有文件
            res.push('*/**/*.js');
            res.push('*/**/*.css');
            res.push('*/**/*.html');
        } else {
            if (files.newFiles.length === 0 && files.modFiles.length === 0) {
                console.warn('no new files or modify files. please use zun format --all');
                return;
            } else {
                res = res.concat(files.newFiles, files.modFiles);
            }
        }
        //添加ignore文件...
        ignore.ignoreFiles(function(fls) {
            callback(res.concat(fls));
        });
    });
}

exports.run = function(options) {
    getFileList(options, function(filter) {
        //还需要对得到的文件进行分类
        var i = 0,
            l = filter.length;

        if (l === 0) {
            return;
        }
        //策略模式。。。好处是可以消除if else 坏处是看不明白了
        var strategies = {
            js  : null,
            css : null,
            html: null,
            push: function(type, file) {
                if (!this[type]) {
                    this[type] = [];
                }
                this[type].push(file);
            },

            jsFilter: function(file) {
                this.push('js', file);
            },

            cssFilter: function(file) {
                this.push('css', file);
            },

            htmlFilter: function(file) {
                this.push('html', file);
            }
        };
        for (; i < l; i ++) {
            var file = filter[i];
            var type = file.match(/\.\w+$/)[0].slice(1);
            strategies[type + 'Filter'](file);
        }
        //处理js
        if (strategies.js) {
            format(strategies.js, require('./js/formatter'), options);
        }
        //处理css
        if (strategies.css) {
            format(strategies.css, require('./css/formatter'), options);
        }
        //处理html
        if (strategies.html) {
            format(strategies.html, require('./html/formatter'), options);
        }
    });
}