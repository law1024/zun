var fs       = require('fs');
var colors   = require('colors');
var minimist = require('minimist');
//package.json
var pkg      = require('../package');

//获取命令行参数
exports.getOptions = function(argv) {
    return minimist(argv, {
        'alias': {
            h: 'help',
            v: 'version',
            d: 'directory',
            f: 'format'
        }
    });
};

//帮助
var help = (function() {
    var content = [
        '',
        '  Usage: '+ pkg.name.red +' <command>'.yellow,
        '',
        '  Commands:',
        '',
        '    '+ 'format(f)'.green +'    format your code',
        '',
        '  Options:',
        '',
        '    -h,  --help'.green +'        output usage information',
        '    -v,  --version'.green +'     output the version number',
        '    -d,  --directory'.green +'   specifies the output directory'
    ];
    return content.join('\n');
})();


function empty() {
    fs.open('./.zunlog', 'w', function(err, fd) {
        fs.write(fd, new Buffer(''), 0, 0, 0, function() {});
    });

}
exports.parse = function() {
    var argv    = process.argv.slice(2);
    var options = exports.getOptions(argv);
    //命令
    var cmd     = options._[0];
    //如果没有输入任何命令
    if (argv.length === 0) {
        options.help = true;
    }
    if (options.version) {
        console.log('\n   v%s'.green, pkg.version);
        return;
    }
    //显示帮助文档
    if (options.help) {
        console.log(help);
        return;
    }
    if (cmd === 'format' || cmd === 'f') {
        //删除zunlog
        empty();
        //执行format
        require('../cli/format').run(options);
    } else {
        console.log('\n    command error, please use zun -h to get more information'.grey);
    }
};

