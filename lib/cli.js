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
            f: 'format',
            a: 'all',
            n: 'nomodify',
            c: 'cooder',
            I: 'icc',
            s: 'subject',
            o: 'owner',
            r: 'reviewers',
            t: 'token',
            S: 'sendmail',
            i: 'init'
        }
    });
};
//帮助
var help = (function() {
    var format = [
        '',
        '  Command:',
        '',
        '    '+ 'format(f)'.green +'    format your code',
        '',
        '  Options:',
        '',
        '    -a,  --all'.green +'         format all files',
        '    -d,  --directory'.green +'   specifies the output directory',
        '    -n   --nomodify'.green +'    modified files are not included',
        '    -I   --icc'.green +'         ignore camelcase'
    ].join('\n');

    var cooder = [
        '',
        '  Command:',
        '',
        '    '+ 'cooder(c)'.green +'    push code review',
        '',
        '  Options:',
        '',
        '    -s,  --subject'.green +'     cooder subject',
        '    -o,  --owner'.green +'       cooder owner',
        '    -r   --reviewers'.green +'   cooder reviewers',
        '    -t   --token'.green +'       cooder token',
        '    -S   --sendmail'.green +'    cooder send mail'
    ].join('\n');

    var all = [
        '',
        '  Usage: '+ pkg.name.red +' <command>',
        '  Info & Help:',
        '',
        '    -v,  --version'.green +'     output the version number',
        '    -h,  --help'.green +'        output usage information',
        format,
        cooder
    ].join('\n');

    return {
        all   : all,
        format: format,
        cooder: cooder
    };
})();

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
    if (options.help && !cmd) {
        console.log(help.all);
        return;
    }
    if (cmd === 'init' || cmd === 'i') {
        //自动生成zun-conf
        if (options.help) {
            console.log(help.init);
            return;
        }
        require('../cli/init').run();
    }else if (cmd === 'format' || cmd === 'f') {
        //执行format
        if (options.help) {
            console.log(help.format);
            return;
        }
        require('../cli/format').run(options);
    } else if (cmd === 'cooder' || cmd === 'c') {
        //提交cooder
        if (options.help) {
            console.log(help.cooder);
            return;
        }
        require('../cli/cooder').run(options);
    } else {
        console.log('\n    command error, please use zun -h to get more information'.grey);
    }
};
