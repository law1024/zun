var fs         = require('fs');
var codeReview = require('code-review');


exports.run = function() {
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
                    codeReview(data.cooder);
                } else {
                    console.log('please add cooder information');
                }

            });
        }
    });
}