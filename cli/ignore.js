var fs = require('fs');
// 将不需要加入检查的文件过滤掉
var ignoreList = [
    '!./**/jquery.js',
    '!./**/zepto.js',
    '!./**/vue.js',
    '!./**/require.js'
];

exports.ignoreFiles = function(callback) {
    //查找当前目录下是否有zun-conf.json文件
    var path = './zun-conf.json';
    fs.exists(path, function(exists) {
        if (exists) {
            fs.readFile(path, function(err, data) {
                if (err) {
                    console.error('read zun conf error');
                    return;
                }
                data = JSON.parse(data.toString());
                if (data.ignore) {
                    //给每一项前添加!
                    var i = 0,
                        l = data.ignore.length;

                    var ifls = [];
                    for (; i < l; i ++) {
                        ifls.push('!' + data.ignore[i]);
                    }
                    callback(ignoreList.concat(ifls));
                } else {
                    callback(ignoreList);
                }
            });
        } else {
            callback(ignoreList);
        }
    });
}