var fs  = require('fs');
var map = require('map-stream');
var vfs = require('vinyl-fs');

function mapToList(map) {
    if (typeof map === 'string') {
        map = JSON.parse(map);
    }
    var list = [];
    for (var i in map) {
        if (!map.hasOwnProperty(i)) {
            continue;
        }
        list.push('!' + map[i]);
    }
    return list;
}

function format(filter, handle, options) {
    console.log(filter);
    var dir = './';
    if (!!options.directory && options.directory !== true) {
        dir = options.directory;
    }
    vfs
    .src(filter)
    .pipe(handle.exec(options))
    .pipe(vfs.dest(dir));

}

exports.run = function(options) {
    var ignore = './.zunignore';
    fs.exists(ignore, function(exists) {
        //文件存在
        var list = mapToList(require('./ignore'));
        if (exists) {
            fs.readFile(ignore, function(err, data) {
                if (err) {
                    throw err;
                }
                list = list.concat(mapToList(data.toString()));
                list.unshift('./**/*.js');

                format(list, require('./js/formator'), options);
            });
        } else {
            list.unshift('./**/*.js');
            format(list, require('./js/formator'), options);
        }
        //console.log(list);
        
    });
    //对js进行格式化
}