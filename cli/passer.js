/*
 * 通过执行svn命令拿到新增的和修改的文件
 */
var fs       = require('fs');
var exec     = require('child_process').exec;
//正常化路径
function normalization(str) {
    return str.replace(/\\/g, '/').replace(/\r$/, '');
}
function trim(str) {
    return './' +  str.slice(1).replace(/^\s+/, '');
}

//是一个目录
function isDirectorySync(file) {
    return fs.statSync(file).isDirectory();
}
//是一个文件
function isFileSync(file) {
    return fs.statSync(file).isFile();
}
//是否是合法的类型
function isLegal(file) {
    var list = [
        'js',
        'css',
        'html',
        'less'
    ];
    var type = file.match(/\.\w+$/);
    if (!type) {
        return false;
    }
    type = type[0].slice(1);
    if (~list.indexOf(type)) {
        return true;
    }
    return false;
}

//广度优先遍历
function walk(path, fileList) {
    var dirList = fs.readdirSync(path);

    dirList.forEach(function(item) {
        var now = path + '/' + item;
        if (fs.statSync(now).isFile()) {
            fileList.push(now);
        }
    });

    dirList.forEach(function(item) {
        var now = path + '/' + item;
        if (fs.statSync(now).isDirectory()) {
            walk(now, fileList);
        }
    });
    //return fileList;
}


//找到所有新添加的或者修改过的文件

/**
 * 修改的文件一定是已经在svn的管理下的
 * 新添加的文件不一定在svn的管理下，需要对树进行遍历
 */
exports.getFiles = function(callback) {
    
    exec('svn status', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        if (stderr) {
            console.error(stderr);
            return;
        }
        var files   = stdout.split('\n');
        var newFile = [];
        var modFile = [];

        var i = 0,
            l = files.length;

        for (; i < l; i ++) {
            //对window下的表现进行修复
            var file = normalization(files[i]);
            //有问题的svn提交
            if (!file.indexOf('!')) {
                continue;
            }
            //如果是js/css/html
            if (isFileSync(trim(file)) && isLegal(file)) {
                //如果是新增文件
                //获取文件名
                //模糊匹配的话会误伤同名文件
                if (/^\?/.test(file) || /^A/i.test(file)) {                    
                    newFile.push(trim(file));
                }
                if (/^M/i.test(file)) {
                    modFile.push(trim(file));
                }
                continue;
            }
            //是一个目录
            if (isDirectorySync(trim(file)) && !file.indexOf('?')) {
                walk(trim(file), newFile);
                //newFile.push(trim(file) + '/**');
            }
        }

        callback({
            newFiles: newFile,
            modFiles: modFile
        });
    });

}