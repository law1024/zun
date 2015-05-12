var fs         = require('fs');
var codereview = require('../lib/code-review');

function setCooderOptions(options) {
    var data = {};
    //--subject "subject" --owner "owner" --reviewers "reviewers" --description "description" --token "token" --sendmail "default false"
    if (options.subject) {
        data.subject = options.subject;
    }
    if (options.owner) {
        data.owner = options.owner;
    }
    if (options.reviewers) {
        data.reviewers = options.reviewers;
    }
    if (options.token) {
        data.token = options.token;
    }
    if (options.sendmail) {
        data.send_mail = options.sendmail;
    }
    return data;
}

exports.run = function(options) {
    var path = './zun-conf.json';
    fs.exists(path, function(exists) {
        if (exists) {
            fs.readFile(path, function(err, data) {
                if (err) {
                    console.log('read zun conf error');
                    return;
                }
                data = JSON.parse(data.toString());
                if (data.cooder) {
                    //有配置代码提交code review信息
                    codereview(data.cooder);
                } else {
                    codereview(setCooderOptions(options));
                }

            });
        } else {
            codereview(setCooderOptions(options));
        }
    });
}