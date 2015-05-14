var fs       = require('fs');
var path     = require('path');
var inquirer = require('inquirer');

var prompts  = [
    {
        'type'   : 'input',
        'name'   : 'subject',
        'message': 'subject: ',
        'default': 'zun cooder'
    },
    {
        'type'    : 'input',
        'name'    : 'owner',
        'message' : 'owner: ',
        'default' : '',
        'validate': function(owner) {
            if (!owner) {
                return "please input the owner";
            }
            return true;
        }
    },
    {
        'type'    : 'input',
        'message' : 'reviewers: ',
        'name'    : "reviewers",
        'default' : '',
        'validate': function(reviewers) {
            if (!reviewers) {
                return "please input the reviewers";
            }
            return true;
        }
    },
    {
        'type'   : 'input',
        'name'   : 'description',
        'message': 'description: ',
        'default': '',
    },
    {
        'type'   : 'confirm',
        'name'   : 'send_mail',
        'message': 'send email: ',
        'default': false
    }
];

function trim(str) {
    return str.replace(/^\s+/, '').replace(/\r\n$/, '');
}

function stringify(obj, exists) {
    var str = ['    "cooder": {'];
    for (var item in obj) {
        if (!obj.hasOwnProperty(item)) {
            continue;
        }
        str.push('        "'+ item +'": "'+ obj[item] +'",');
    }
    var l = str.length - 1;
    str[l] = str[l].slice(0, -1);

    str.push("    }");
    //如果已经存在了
    if (!exists) {
        str.unshift('{');
        str.push('}');
    }
    return str.join('\n');
}

function addTokenInput() {
    prompts.push({
        'type'   : 'input',
        'name'   : 'token',
        'message': 'token: ',
        'default': ''
    });
}

var token;

exports.run = function() {
    //引导用户生成zun-conf.json
    //首先收集用户输入
    var i = 0;
    var p = './zun-conf.json';

    var exists = fs.existsSync(p);
    if (exists) {
        console.log('zun-conf is already exist');
        return;
    }
    var file   = path.join(__dirname, '../lib/', 'global.json');
    var exists = fs.existsSync(file);
    if (exists) {
        var content = JSON.parse(fs.readFileSync(file).toString());

        if (content.token && content.token !== '') {
            token = content.token;
        } else {
            addTokenInput();
        }
    } else {
        addTokenInput();
    }

    inquirer.prompt(prompts, function(answers) {
        if (!answers.token && !!token) {
            //用户没有填token，查询global用没有token
            answers.token = token;
        } else {
            console.log('there is no token found. \nplease use zun config --global token "token" to add token');
        }
        fs.writeFile(p, stringify(answers, false), function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
}